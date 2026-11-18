import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import ProductArt from "../components/ProductArt.jsx";
import { getProductById } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { BRAND, formatPrice } from "../config.js";
import "./Cart.css";

function Cart() {
  const cart = useCart();
  const toast = useToast();

  function handleRemove(id, size, name) {
    cart.removeItem(id, size);
    toast.showToast(name + " removed from cart", "info");
  }

  if (cart.items.length === 0) {
    return (
      <div>
        <PageHero eyebrow="Your bag" title="Cart" text="Nothing here yet." big="BAG" />
        <section className="section container cart-empty">
          <h2>Your cart is empty</h2>
          <p>Find something that makes you rise.</p>
          <Link to="/shop" className="btn btn-red">
            Start shopping
          </Link>
        </section>
      </div>
    );
  }

  // A loop is needed here because the cart can hold any number of items
  const rows = [];
  for (let i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];
    const product = getProductById(item.id);

    if (product === null) {
      continue;
    }

    rows.push(
      <div className="cart-row" key={item.id + "-" + item.size}>
        <Link to={"/product/" + product.slug} className="cart-thumb">
          <ProductArt
            type={product.type}
            color={product.color}
            accent={product.accent}
            image={product.image}
            alt={product.name}
          />
        </Link>

        <div className="cart-info">
          <h3>{product.name}</h3>
          <p>
            {product.colorName} / Size {item.size}
          </p>
          <p className="cart-unit">{formatPrice(product.price)}</p>

          <div className="cart-controls">
            <div className="qty-box small">
              <button
                onClick={function () {
                  cart.changeQty(item.id, item.size, item.qty - 1);
                }}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{item.qty}</span>
              <button
                onClick={function () {
                  cart.changeQty(item.id, item.size, item.qty + 1);
                }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="remove-btn"
              onClick={function () {
                handleRemove(item.id, item.size, product.name);
              }}
            >
              Remove
            </button>
          </div>
        </div>

        <div className="cart-line-total">{formatPrice(product.price * item.qty)}</div>
      </div>
    );
  }

  let deliveryText = formatPrice(cart.delivery);
  if (cart.delivery === 0) {
    deliveryText = "FREE";
  }

  let freeDeliveryMessage = null;
  if (cart.delivery > 0) {
    const remaining = BRAND.freeDeliveryOver - cart.subtotal;
    freeDeliveryMessage = (
      <p className="free-note">
        Add <b>{formatPrice(remaining)}</b> more for free delivery.
      </p>
    );
  }

  return (
    <div>
      <PageHero eyebrow="Your bag" title="Cart" text="Review your items before checkout." big="BAG" />

      <section className="section cart-section">
        <div className="container cart-layout">
          <div className="cart-list">{rows}</div>

          <aside className="cart-summary">
            <h3>Order summary</h3>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <span>{deliveryText}</span>
            </div>
            {freeDeliveryMessage}
            <div className="summary-line summary-total">
              <span>Total</span>
              <span>{formatPrice(cart.total)}</span>
            </div>

            <Link to="/checkout" className="btn btn-red btn-block">
              Checkout
            </Link>
            <Link to="/shop" className="continue-link">
              ← Continue shopping
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Cart;
