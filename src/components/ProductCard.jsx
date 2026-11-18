import { Link } from "react-router-dom";
import { getProductBySlug } from "../data/products.js";
import { formatPrice } from "../config.js";
import ProductArt from "./ProductArt.jsx";
import "./ProductCard.css";

// Usage:  <ProductCard slug="kite-tee" />
// Optional: filter="tees"  -> hides the card unless the category matches ("all" shows everything)
// Optional: exclude="kite-tee" -> hides that product (used for "more from RYZE")
function ProductCard(props) {
  const product = getProductBySlug(props.slug);

  if (product === null) {
    return null;
  }

  if (props.exclude === product.slug) {
    return null;
  }

  if (props.filter && props.filter !== "all" && props.filter !== product.category) {
    return null;
  }

  let tagLabel = null;
  if (product.tag !== "") {
    tagLabel = <span className="card-tag">{product.tag}</span>;
  }

  return (
    <Link to={"/product/" + product.slug} className="product-card art-hover">
      <div className="card-image">
        {tagLabel}
        <ProductArt
          type={product.type}
          color={product.color}
          accent={product.accent}
          image={product.image}
          alt={product.name}
        />
        <span className="card-view">View product</span>
      </div>
      <div className="card-info">
        <h3>{product.name}</h3>
        <p className="card-color">{product.colorName}</p>
        <p className="card-price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
