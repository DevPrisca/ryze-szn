import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BankTransferDetails from "../components/BankTransferDetails.jsx";
import PageHero from "../components/PageHero.jsx";
import { getProductById } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { BRAND, formatPrice } from "../config.js";
import "./Cart.css";
import "./Checkout.css";

function isValidPhone(phone) {
  const digits = phone.replace(/[\s-]/g, "");
  return /^(\+?234|0)[789][01]\d{8}$/.test(digits);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function Checkout() {
  const cart = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    payment: "Bank transfer",
    notes: "",
    website: "",
  });
  const [sending, setSending] = useState(false);

  function handleChange(event) {
    const fieldName = event.target.name;
    const value = event.target.value;
    setForm({ ...form, [fieldName]: value });
  }

  function findProblem() {
    if (form.name.trim().length < 2) return "Please enter your full name.";
    if (isValidPhone(form.phone) === false) return "Please enter a valid Nigerian phone number, e.g. 0801 234 5678.";
    if (form.email.trim() === "") return "Please enter your email address for the order confirmation.";
    if (isValidEmail(form.email.trim()) === false) return "That email address does not look right.";
    if (form.address.trim().length < 5) return "Please enter your delivery address.";
    if (form.city.trim().length < 2) return "Please enter your city.";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const problem = findProblem();
    if (problem !== "") {
      toast.showToast(problem, "error");
      return;
    }
    setSending(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: cart.items }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "The server could not place your order.");
      }
      if (!result.order) {
        throw new Error("The server did not confirm your order.");
      }

      cart.clearCart();
      toast.showToast("Order placed.", "success");
      navigate("/order-success", {
        state: {
          order: result.order,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "The order service is unavailable.";
      toast.showToast("Could not place your order: " + errorMessage, "error");
    } finally {
      setSending(false);
    }
  }

  if (cart.items.length === 0) {
    return (
      <div>
        <PageHero eyebrow="Almost there" title="Checkout" text="Your cart is empty." big="PAY" />
        <section className="section container cart-empty">
          <h2>Nothing to check out</h2>
          <p>Add something to your cart first.</p>
          <Link to="/shop" className="btn btn-red">Go to shop</Link>
        </section>
      </div>
    );
  }

  const summaryLines = [];
  for (let i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];
    const product = getProductById(item.id);
    if (product === null) continue;
    summaryLines.push(
      <div className="summary-line" key={item.id + "-" + item.size}>
        <span>{product.name} ({item.size}) x {item.qty}</span>
        <span>{formatPrice(product.price * item.qty)}</span>
      </div>
    );
  }

  let deliveryText = formatPrice(cart.delivery);
  if (cart.delivery === 0) deliveryText = "FREE";
  let sendButtonText = sending ? "Placing order..." : "Place order";

  return (
    <div>
      <PageHero eyebrow="Almost there" title="Checkout" text="Tell us where to send your order. We will call to confirm." big="PAY" />
      <section className="section cart-section">
        <div className="container cart-layout">
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <h3>Delivery details</h3>
            <div className="form-grid">
              <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" type="text" value={form.name} onChange={handleChange} autoComplete="name" placeholder="Your full name" /></div>
              <div className="field"><label htmlFor="phone">Phone number</label><input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" placeholder="0801 234 5678" /></div>
              <div className="field full"><label htmlFor="email">Email (for your order confirmation)</label><input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" placeholder="you@gmail.com" required /></div>
              <div className="field full"><label htmlFor="address">Delivery address</label><input id="address" name="address" type="text" value={form.address} onChange={handleChange} autoComplete="street-address" placeholder="House number, street, area" /></div>
              <div className="field"><label htmlFor="city">City / State</label><input id="city" name="city" type="text" value={form.city} onChange={handleChange} placeholder="e.g. Lagos" /></div>
              <div className="field"><label htmlFor="payment">Payment method</label><input id="payment" name="payment" value={form.payment} readOnly /></div>
              <div className="field full"><label htmlFor="notes">Notes (optional)</label><textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Landmark, delivery time, anything we should know" /></div>
              <div className="hp-field" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" value={form.website} onChange={handleChange} tabIndex="-1" autoComplete="off" /></div>
            </div>
            <BankTransferDetails amount={cart.total} />
            <button type="submit" className="btn btn-red btn-block place-btn" disabled={sending}>{sendButtonText}</button>
            <p className="secure-note">Questions? Call <a href={"tel:" + BRAND.phoneLink}>{BRAND.phone}</a></p>
          </form>
          <aside className="cart-summary">
            <h3>Your order</h3>
            {summaryLines}
            <div className="summary-line"><span>Delivery</span><span>{deliveryText}</span></div>
            <div className="summary-line summary-total"><span>Total</span><span>{formatPrice(cart.total)}</span></div>
            <Link to="/cart" className="continue-link">← Edit cart</Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
export default Checkout;