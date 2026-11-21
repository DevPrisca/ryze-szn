import { Link, useLocation } from "react-router-dom";
import BankTransferDetails from "../components/BankTransferDetails.jsx";
import { KiteMark } from "../components/Logo.jsx";
import { BRAND, formatPrice, whatsappLink } from "../config.js";
import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const emailResults = location.state && location.state.emailResults ? location.state.emailResults : {};

  let order = null;
  if (location.state && location.state.order) {
    order = location.state.order;
  }

  // Someone opened this page directly without placing an order
  if (order === null) {
    return (
      <section className="container success-wrap">
        <h1>Thank you</h1>
        <p>If you just placed an order, we have it and we will call you soon.</p>
        <Link to="/shop" className="btn btn-red">
          Keep shopping
        </Link>
      </section>
    );
  }

  const lines = [];
  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    lines.push(
      <div className="summary-line" key={i}>
        <span>
          {item.name} ({item.size}) x {item.qty}
        </span>
        <span>{formatPrice(item.lineTotal)}</span>
      </div>
    );
  }

  let emailLine = null;
  if (order.email) {
    const customerStatus = emailResults.customerSent
      ? "sent to " + order.email
      : location.state.emailQueued
        ? "failed; retry queued"
        : "failed";
    const ownerStatus = emailResults.ownerSent
      ? "sent"
      : location.state.emailQueued
        ? "failed; retry queued"
        : "failed";
    emailLine = (
      <p className="success-email">
        {"Customer confirmation: " + customerStatus + ". Owner notification: " + ownerStatus + "."}
      </p>
    );
  }

  let deliveryText = formatPrice(order.delivery);
  if (order.delivery === 0) {
    deliveryText = "FREE";
  }

  let paymentHelp = null;
  if (order.payment === "Bank transfer") {
    paymentHelp = <BankTransferDetails amount={order.total} orderId={order.id} />;
  }

  const whatsappMessage =
    "Hello RYZE, I have made a bank transfer for order " + order.id + ". I will send the receipt here.";

  return (
    <section className="container success-wrap">
      <div className="success-kite">
        <KiteMark size={90} />
      </div>
      <span className="eyebrow">Order received</span>
      <h1>
        You are about to <span className="red">rise</span>
      </h1>
      <p className="success-lead">
        Thank you, {order.name.split(" ")[0]}. We will call <b>{order.phone}</b> shortly to confirm your delivery.
      </p>
      {emailLine}
      {paymentHelp}

      <div className="success-card">
        <div className="success-id">
          <span>Order number</span>
          <strong>{order.id}</strong>
        </div>
        {lines}
        <div className="summary-line">
          <span>Delivery</span>
          <span>{deliveryText}</span>
        </div>
        <div className="summary-line summary-total">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <p className="success-address">
          Delivering to: {order.address}, {order.city}
        </p>
      </div>

      <div className="success-buttons">
        <Link to="/shop" className="btn btn-red">
          Keep shopping
        </Link>
        <a href={whatsappLink(whatsappMessage)} target="_blank" rel="noreferrer" className="btn btn-whatsapp">
          Send transfer proof on WhatsApp
        </a>
      </div>

      <p className="success-phone">
        Need help? Call <a href={"tel:" + BRAND.phoneLink}>{BRAND.phone}</a>
      </p>
    </section>
  );
}

export default OrderSuccess;
