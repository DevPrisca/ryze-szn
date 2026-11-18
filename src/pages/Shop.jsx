import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import "./Shop.css";

function Shop() {
  const [filter, setFilter] = useState("all");

  // Gives each filter button the "active" look when it is selected
  function buttonClass(name) {
    if (filter === name) {
      return "filter-btn filter-active";
    }
    return "filter-btn";
  }

  return (
    <div>
      <PageHero
        eyebrow="The collection"
        title="Shop"
        text="Every piece is made in small batches. When it is gone, it is gone."
        big="RYZE"
      />

      <section className="section shop-section">
        <div className="container">
          <div className="filter-bar">
            <button
              className={buttonClass("all")}
              onClick={function () {
                setFilter("all");
              }}
            >
              All
            </button>
            <button
              className={buttonClass("polos")}
              onClick={function () {
                setFilter("polos");
              }}
            >
              Polos
            </button>
            <button
              className={buttonClass("tops")}
              onClick={function () {
                setFilter("tops");
              }}
            >
              Graphic Tops
            </button>
            <button
              className={buttonClass("sets")}
              onClick={function () {
                setFilter("sets");
              }}
            >
              Matching Sets
            </button>
            <button
              className={buttonClass("bottoms")}
              onClick={function () {
                setFilter("bottoms");
              }}
            >
              Bottoms
            </button>
          </div>

          {/* key={filter} makes the grid fade in again each time you change filter */}
          <div className="shop-grid" key={filter}>
            <ProductCard slug="kite-tee" filter={filter} />
            <ProductCard slug="flight-hoodie" filter={filter} />
            <ProductCard slug="crimson-tee" filter={filter} />
            <ProductCard slug="stealth-joggers" filter={filter} />
            <ProductCard slug="crimson-hoodie" filter={filter} />
            <ProductCard slug="kite-cap" filter={filter} />
            <ProductCard slug="ash-tee" filter={filter} />
            <ProductCard slug="ember-joggers" filter={filter} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Shop;
