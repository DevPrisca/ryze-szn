import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductArt from "../components/ProductArt.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { getProductBySlug } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { BRAND, formatPrice, whatsappLink } from "../config.js";
import "./Product.css";

function Product() {
  const params = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const toast = useToast();
  const product = getProductBySlug(params.slug);

  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  if (product === null) {
    return (
      <div className="container product-missing">
        <h1>Product not found</h1>
        <p>This piece may have sold out or the link is wrong.</p>
        <Link to="/shop" className="btn btn-red">
          Back to shop
        </Link>
      </div>
    );
  }

  // One-size items (like the cap) are selected automatically
  let chosenSize = size;
  if (product.sizes.length === 1) {
    chosenSize = product.sizes[0];
  }

  function makeSizeButtonClass(name) {
    if (chosenSize === name) {
      return "size-btn size-active";
    }
    return "size-btn";
  }

  function addToCart() {
    if (chosenSize === "") {
      toast.showToast("Please choose a size first.", "error");
      return false;
    }
    cart.addItem(product.id, chosenSize, qty);
    toast.showToast(qty + " x " + product.name + " (" + chosenSize + ") added to cart", "success");
    return true;
  }

  function buyNow() {
    const added = addToCart();
    if (added === true) {
      navigate("/checkout");
    }
  }

  function decreaseQty() {
    if (qty > 1) {
      setQty(qty - 1);
    }
  }

  function increaseQty() {
    if (qty < 10) {
      setQty(qty + 1);
    }
  }

  // Size buttons: a loop is used because each product has a different list of sizes
  const sizeButtons = [];
  for (let i = 0; i < product.sizes.length; i++) {
    const name = product.sizes[i];
    sizeButtons.push(
      <button
        key={name}
        className={makeSizeButtonClass(name)}
        onClick={function () {
          setSize(name);
        }}
      >
        {name}
      </button>
    );
  }

  const detailItems = [];
  for (let i = 0; i < product.details.length; i++) {
    detailItems.push(<li key={i}>{product.details[i]}</li>);
  }

  let tagLabel = null;
  if (product.tag !== "") {
    tagLabel = <span className="product-tag">{product.tag}</span>;
  }

  let whatsappMessage = "Hello RYZE, I would like to order the " + product.name + " (" + product.colorName + ")";
  if (chosenSize !== "") {
    whatsappMessage = whatsappMessage + ", size " + chosenSize;
  }
  whatsappMessage = whatsappMessage + ", quantity " + qty + ".";

  return (
    <div>
      <div className="container breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
      </div>

      <section className="container product-layout">
        <div className="product-visual art-hover">
          {tagLabel}
          <ProductArt
            type={product.type}
            color={product.color}
            accent={product.accent}
            image={product.image}
            alt={product.name}
          />
        </div>

        <div className="product-details">
          <span className="eyebrow">{product.colorName}</span>
          <h1>{product.name}</h1>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="product-description">{product.description}</p>

          <div className="option-block">
            <span className="option-label">Size</span>
            <div className="size-row">{sizeButtons}</div>
          </div>

          <div className="option-block">
            <span className="option-label">Quantity</span>
            <div className="qty-box">
              <button onClick={decreaseQty} aria-label="Decrease quantity">
                −
              </button>
              <span>{qty}</span>
              <button onClick={increaseQty} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          <div className="buy-buttons">
            <button className="btn btn-red" onClick={addToCart}>
              Add to cart
            </button>
            <button className="btn btn-outline" onClick={buyNow}>
              Buy now
            </button>
          </div>

          <a
            href={whatsappLink(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-block"
          >
            Order on WhatsApp
          </a>

          <div className="detail-box">
            <h3>Details</h3>
            <ul>{detailItems}</ul>
          </div>

          <p className="delivery-note">
            Delivery {formatPrice(BRAND.deliveryFee)} - free above {formatPrice(BRAND.freeDeliveryOver)}. Pay on
            delivery or by bank transfer.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <span className="eyebrow">Complete the look</span>
                <h2>More from RYZE</h2>
              </div>
            </div>
          </Reveal>

          <div className="more-grid">
            <ProductCard slug="kite-tee" exclude={product.slug} />
            <ProductCard slug="flight-hoodie" exclude={product.slug} />
            <ProductCard slug="stealth-joggers" exclude={product.slug} />
            <ProductCard slug="kite-cap" exclude={product.slug} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Product;
