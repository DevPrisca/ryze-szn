import "dotenv/config";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { products } from "../src/data/products.js";
import { BRAND, formatPrice } from "../src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIRECTORY = path.resolve(process.env.DATA_DIR || __dirname);
fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
const ORDERS_FILE = path.join(DATA_DIRECTORY, "orders.json");
const NOTIFICATION_QUEUE_FILE = path.join(DATA_DIRECTORY, "mail-queue.json");
const ORDER_EMAIL_TO = BRAND.email;
const DIST_FOLDER = path.join(__dirname, "..", "dist");
const PORT = Number(process.env.API_PORT || process.env.PORT || 5000);

const app = express();
app.use(cors());
app.use(express.json({ limit: "500kb" }));

// ------------------------------------------------------------------
//  Gmail setup (works only when GMAIL_USER and GMAIL_APP_PASSWORD are set)
// ------------------------------------------------------------------
let transporter = null;

if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ""),
    },
  });
  console.log("Gmail order notifications: ON (" + process.env.GMAIL_USER + ")");
  console.log("Gmail contact notifications: ON (" + process.env.GMAIL_USER + ")");
} else {
  console.log("Gmail order notifications: OFF (add GMAIL_USER and GMAIL_APP_PASSWORD to .env)");
  console.log("Gmail contact notifications: OFF (add GMAIL_USER and GMAIL_APP_PASSWORD to .env)");
}

let notificationQueue = [];
if (fs.existsSync(NOTIFICATION_QUEUE_FILE)) {
  const savedQueue = JSON.parse(fs.readFileSync(NOTIFICATION_QUEUE_FILE, "utf8"));
  if (!Array.isArray(savedQueue)) {
    throw new Error("The order notification queue file must contain an array.");
  }
  notificationQueue = savedQueue;
}

async function sendEmail(options) {
  if (transporter === null) {
    return false;
  }

  try {
    await transporter.sendMail({
      from: '"' + BRAND.name + '" <' + process.env.GMAIL_USER + ">",
      ...options,
    });
    return true;
  } catch (error) {
    console.error("Email failed:", error.message);
    return false;
  }
}

function persistNotificationQueue() {
  const temporaryFile = NOTIFICATION_QUEUE_FILE + "." + process.pid + ".tmp";
  fs.writeFileSync(temporaryFile, JSON.stringify(notificationQueue, null, 2), "utf8");
  fs.renameSync(temporaryFile, NOTIFICATION_QUEUE_FILE);
}

let notificationTimer = null;
let processingNotifications = false;

function scheduleNotificationProcessing(delay) {
  if (notificationTimer !== null) {
    return;
  }
  notificationTimer = setTimeout(function () {
    notificationTimer = null;
    processNotificationQueue().catch(function (error) {
      console.error("Order notification queue failed:", error.message);
      scheduleNotificationProcessing(60000);
    });
  }, delay);
  notificationTimer.unref();
}

function enqueueEmails(emails) {
  if (emails.length === 0) {
    return;
  }

  const jobs = emails.map(function (email) {
    return {
      id: randomUUID(),
      to: email.to,
      subject: email.subject,
      html: email.html,
      replyTo: email.replyTo || null,
      attempts: 0,
      nextAttemptAt: Date.now(),
    };
  });

  notificationQueue.push(...jobs);
  try {
    persistNotificationQueue();
  } catch (error) {
    notificationQueue.splice(notificationQueue.length - jobs.length, jobs.length);
    throw error;
  }
  scheduleNotificationProcessing(0);
}

async function processNotificationQueue() {
  if (processingNotifications || notificationQueue.length === 0) {
    return;
  }
  if (transporter === null) {
    scheduleNotificationProcessing(3600000);
    return;
  }

  const job = notificationQueue[0];
  const delay = job.nextAttemptAt - Date.now();
  if (delay > 0) {
    scheduleNotificationProcessing(delay);
    return;
  }

  processingNotifications = true;
  try {
    const sent = await sendEmail({
      to: job.to,
      subject: job.subject,
      html: job.html,
      replyTo: job.replyTo || undefined,
    });

    if (sent) {
      notificationQueue.shift();
      try {
        persistNotificationQueue();
      } catch (error) {
        notificationQueue.unshift(job);
        throw error;
      }
      console.log("Gmail order notification sent: " + job.subject);
    } else {
      job.attempts += 1;
      job.nextAttemptAt = Date.now() + Math.min(60000 * (2 ** Math.min(job.attempts - 1, 6)), 3600000);
      persistNotificationQueue();
      console.error("Gmail order notification queued for retry: " + job.subject);
    }
  } finally {
    processingNotifications = false;
  }

  scheduleNotificationProcessing(0);
}

// ------------------------------------------------------------------
//  Small helpers
// ------------------------------------------------------------------
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

function findProduct(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === Number(id)) {
      return products[i];
    }
  }
  return null;
}

function isValidPhone(phone) {
  const digits = phone.replace(/[\s-]/g, "");
  return /^(\+?234|0)[789][01]\d{8}$/.test(digits);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Very simple spam protection: max 10 requests per minute per visitor
const requestLog = new Map();

function tooManyRequests(ip) {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter(function (time) {
    return now - time < 60000;
  });
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > 10;
}

function saveOrder(order) {
  let orders = [];
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    }
  } catch (error) {
    throw new Error("Could not read the saved orders file: " + error.message);
  }
  if (!Array.isArray(orders)) {
    throw new Error("The saved orders file must contain an array.");
  }
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// ------------------------------------------------------------------
//  Email templates
// ------------------------------------------------------------------
function emailShell(title, bodyHtml) {
  return (
    '<div style="background:#080808;padding:24px;font-family:Arial,sans-serif;color:#f4f1ee">' +
    '<div style="max-width:560px;margin:0 auto;background:#141414;border-top:4px solid #e10b17;padding:28px">' +
    '<h1 style="margin:0 0 4px;letter-spacing:4px;color:#e10b17">' + BRAND.name + "</h1>" +
    '<h2 style="margin:0 0 18px;font-size:18px">' + title + "</h2>" +
    bodyHtml +
    '<p style="margin-top:26px;font-size:12px;color:#8a8a8a">' + BRAND.tagline + "</p>" +
    "</div></div>"
  );
}

function itemsTable(order) {
  let rows = "";
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    rows +=
      "<tr>" +
      '<td style="padding:8px 0;border-bottom:1px solid #2a2a2a">' + escapeHtml(item.name) +
      " <span style='color:#8a8a8a'>(" + escapeHtml(item.size) + ")</span> x " + item.qty + "</td>" +
      '<td style="padding:8px 0;border-bottom:1px solid #2a2a2a;text-align:right">' +
      formatPrice(item.lineTotal) + "</td></tr>";
  }

  return (
    '<table style="width:100%;border-collapse:collapse;font-size:14px">' + rows +
    '<tr><td style="padding-top:12px;color:#8a8a8a">Subtotal</td><td style="padding-top:12px;text-align:right">' + formatPrice(order.subtotal) + "</td></tr>" +
    '<tr><td style="color:#8a8a8a">Delivery</td><td style="text-align:right">' + (order.delivery === 0 ? "FREE" : formatPrice(order.delivery)) + "</td></tr>" +
    '<tr><td style="padding-top:8px;font-weight:bold">Total</td><td style="padding-top:8px;text-align:right;font-weight:bold;color:#e10b17;font-size:18px">' + formatPrice(order.total) + "</td></tr>" +
    "</table>"
  );
}

function ownerOrderEmail(order) {
  const whatsappNumber = order.phone.replace(/[^\d]/g, "").replace(/^0/, "234");
  const body =
    '<p style="font-size:15px">New order <b>' + order.id + "</b> just came in.</p>" +
    itemsTable(order) +
    '<h3 style="margin:22px 0 6px;font-size:14px;color:#e10b17">CUSTOMER</h3>' +
    '<p style="margin:0;line-height:1.7;font-size:14px">' +
    "<b>" + escapeHtml(order.name) + "</b><br>" +
    "Phone: " + escapeHtml(order.phone) + "<br>" +
    (order.email ? "Email: " + escapeHtml(order.email) + "<br>" : "") +
    "Address: " + escapeHtml(order.address) + ", " + escapeHtml(order.city) + "<br>" +
    "Payment: " + escapeHtml(order.payment) +
    (order.notes ? "<br>Notes: " + escapeHtml(order.notes) : "") +
    "</p>" +
    '<p style="margin-top:20px"><a href="https://wa.me/' + whatsappNumber +
    '" style="background:#e10b17;color:#fff;padding:10px 18px;text-decoration:none;font-weight:bold">Message customer on WhatsApp</a></p>';

  return emailShell("New order received", body);
}

function customerOrderEmail(order) {
  const body =
    "<p>Hi " + escapeHtml(order.name) + ",</p>" +
    "<p>Thank you for shopping with RYZE.</p>" +
    "<p>We have received your order. We are preparing it now and we will update you when it ships.</p>" +
    "<h3>Order Details</h3>" +
    '<p style="line-height:1.7;font-size:14px">' +
    "<b>Order number:</b> #" + escapeHtml(order.id) + "<br>" +
    "<b>Phone number:</b> " + escapeHtml(order.phone) + "<br>" +
    "<b>Payment method:</b> " + escapeHtml(order.payment) + "</p>" +
    itemsTable(order) +
    '<p style="margin-top:14px"><b>Delivery address:</b> ' +
    escapeHtml(order.address) + ", " + escapeHtml(order.city) + "</p>" +
    "<p>Thank you for supporting 3 brothers building something real.<br>Team RYZE</p>";

  return emailShell("We received your RYZE order ✅", body);
}

// ------------------------------------------------------------------
//  Routes
// ------------------------------------------------------------------
app.get("/api/health", function (req, res) {
  res.json({
    ok: true,
    emailEnabled: transporter !== null,
    pendingEmailNotifications: notificationQueue.length,
  });
});

app.post("/api/orders", async function (req, res) {
  if (tooManyRequests(req.ip)) {
    return res.status(429).json({ ok: false, message: "Too many requests. Please wait a minute." });
  }

  const body = req.body || {};

  // Hidden "website" field: real people leave it empty, bots fill it in
  if (body.website) {
    return res.json({ ok: true, order: { id: "RYZ-OK" } });
  }

  const name = cleanText(body.name, 80);
  const phone = cleanText(body.phone, 20);
  const email = cleanText(body.email, 120);
  const address = cleanText(body.address, 200);
  const city = cleanText(body.city, 60);
  const notes = cleanText(body.notes, 300);
  if (email === "") {
    return res.status(400).json({ ok: false, message: "Please enter your email address for the order confirmation." });
  }
  if (body.payment !== "Bank transfer") {
    return res.status(400).json({ ok: false, message: "Bank transfer is the only available payment method." });
  }
  const payment = "Bank transfer";

  if (name.length < 2) {
    return res.status(400).json({ ok: false, message: "Please enter your full name." });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ ok: false, message: "Please enter a valid Nigerian phone number." });
  }
  if (email !== "" && !isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: "That email address does not look right." });
  }
  if (address.length < 5 || city.length < 2) {
    return res.status(400).json({ ok: false, message: "Please enter your delivery address and city." });
  }
  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 30) {
    return res.status(400).json({ ok: false, message: "Your cart is empty." });
  }

  // Prices always come from the server's product list, never from the browser
  const items = [];
  let subtotal = 0;

  for (let i = 0; i < body.items.length; i++) {
    const requested = body.items[i];
    const product = findProduct(requested.id);
    const qty = Number(requested.qty);

    if (product === null) {
      return res.status(400).json({ ok: false, message: "One of the products no longer exists." });
    }
    if (!product.sizes.includes(requested.size)) {
      return res.status(400).json({ ok: false, message: "Invalid size for " + product.name + "." });
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      return res.status(400).json({ ok: false, message: "Invalid quantity for " + product.name + "." });
    }

    const lineTotal = product.price * qty;
    subtotal += lineTotal;
    items.push({
      id: product.id,
      name: product.name,
      size: requested.size,
      qty: qty,
      price: product.price,
      lineTotal: lineTotal,
    });
  }

  let delivery = BRAND.deliveryFee;
  if (subtotal >= BRAND.freeDeliveryOver) {
    delivery = 0;
  }

  const order = {
    id: "RYZ-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    name, phone, email, address, city, notes, payment,
    items, subtotal, delivery,
    total: subtotal + delivery,
  };

  try {
    saveOrder(order);
  } catch (error) {
    console.error("Could not save order:", error.message);
    return res.status(500).json({ ok: false, message: "We could not save your order. Please try again." });
  }

  console.log("New order " + order.id + " - " + formatPrice(order.total) + " - " + order.name + " (" + order.phone + ")");

  const notificationEmails = [{
    to: ORDER_EMAIL_TO,
    subject: "New RYZE order " + order.id + " - " + formatPrice(order.total),
    html: ownerOrderEmail(order),
    replyTo: email || undefined,
  }];
  notificationEmails.push({
    to: email,
    subject: "We received your RYZE order ✅",
    html: customerOrderEmail(order),
    replyTo: BRAND.email,
  });

  let emailQueued = false;
  try {
    enqueueEmails(notificationEmails);
    emailQueued = notificationEmails.length > 0;
  } catch (error) {
    console.error("Could not queue order email:", error.message);
  }

  const emailDeliveryConfigured = transporter !== null;
  res.json({
    ok: true,
    emailQueued: emailQueued,
    emailDeliveryConfigured: emailDeliveryConfigured,
    order: order,
  });
});
app.post("/api/contact", async function (req, res) {
  if (tooManyRequests(req.ip)) {
    return res.status(429).json({ ok: false, message: "Too many requests. Please wait a minute." });
  }

  const body = req.body || {};

  if (body.website) {
    return res.json({ ok: true });
  }

  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 120);
  const phone = cleanText(body.phone, 20);
  const subject = cleanText(body.subject, 80) || "General question";
  const message = cleanText(body.message, 1500);

  if (name.length < 2) {
    return res.status(400).json({ ok: false, message: "Please enter your name." });
  }
  if (email === "" && phone === "") {
    return res.status(400).json({ ok: false, message: "Please give us an email or phone number to reply to." });
  }
  if (email !== "" && !isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: "That email address does not look right." });
  }
  if (message.length < 5) {
    return res.status(400).json({ ok: false, message: "Please write your message." });
  }

  const html = emailShell(
    "New message from the website",
    '<p style="line-height:1.7;font-size:14px">' +
      "<b>" + escapeHtml(name) + "</b><br>" +
      (email ? "Email: " + escapeHtml(email) + "<br>" : "") +
      (phone ? "Phone: " + escapeHtml(phone) + "<br>" : "") +
      "Subject: " + escapeHtml(subject) + "</p>" +
      '<p style="background:#0d0d0d;padding:14px;line-height:1.6;font-size:14px;white-space:pre-wrap">' +
      escapeHtml(message) + "</p>"
  );

  console.log("New message from " + name + " - " + subject);

  const notificationEmail =
    process.env.OWNER_EMAIL ||
    process.env.GMAIL_USER ||
    BRAND.email;

  const sent = await sendEmail({
    to: notificationEmail,
    subject: "RYZE website message: " + subject,
    html: html,
    replyTo: email || undefined,
  });

  res.json({ ok: true, emailSent: sent });
});

// ------------------------------------------------------------------
//  In production, the same server also serves the built website
// ------------------------------------------------------------------
if (fs.existsSync(DIST_FOLDER)) {
  app.use(express.static(DIST_FOLDER));
  app.get("*", function (req, res) {
    res.sendFile(path.join(DIST_FOLDER, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", function () {
  console.log("RYZE server running on http://localhost:" + PORT);
  scheduleNotificationProcessing(0);
});
