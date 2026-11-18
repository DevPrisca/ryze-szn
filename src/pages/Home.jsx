import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { BRAND, whatsappLink } from "../config.js";
import "./Home.css";

function Home() {
  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <div className="hero-grid-lines"></div>
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="eyebrow hero-eyebrow">New drop - Flight Collection</span>
            <h1>
              <span className="hero-line">Rise</span>
              <span className="hero-line red">Above</span>
              <span className="hero-line">The Ordinary</span>
            </h1>
            <p className="hero-sub">
              Heavyweight streetwear with a kite in its heart. Cut for comfort,
              coloured for attention, made for people who refuse to stay grounded.
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-red">
                Shop the drop
              </Link>
              <Link to="/lookbook" className="btn btn-outline">
                View lookbook
              </Link>
            </div>
          </div>

          <div className="hero-kite-wrap" aria-hidden="true">
            <div className="hero-ring"></div>
            <img className="hero-kite" src="/ryze-emblem.png" alt="" />
          </div>
        </div>

        <div className="scroll-hint">
          <span></span>
          Scroll
        </div>
      </section>

      {/* ===================== MARQUEE ===================== */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-group">
            <span>Rise above</span>
            <span className="dot">◆</span>
            <span>Heavyweight cotton</span>
            <span className="dot">◆</span>
            <span>Made in Nigeria</span>
            <span className="dot">◆</span>
            <span>Limited drops</span>
            <span className="dot">◆</span>
            <span>Delivery nationwide</span>
            <span className="dot">◆</span>
          </div>
          <div className="marquee-group">
            <span>Rise above</span>
            <span className="dot">◆</span>
            <span>Heavyweight cotton</span>
            <span className="dot">◆</span>
            <span>Made in Nigeria</span>
            <span className="dot">◆</span>
            <span>Limited drops</span>
            <span className="dot">◆</span>
            <span>Delivery nationwide</span>
            <span className="dot">◆</span>
          </div>
        </div>
      </div>

      {/* ===================== FEATURED ===================== */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <span className="eyebrow">Featured</span>
                <h2>Fresh off the line</h2>
              </div>
              <Link to="/shop" className="btn btn-outline">
                See everything
              </Link>
            </div>
          </Reveal>

          <div className="product-grid">
            <Reveal delay={0}>
              <ProductCard slug="kite-tee" />
            </Reveal>
            <Reveal delay={120}>
              <ProductCard slug="flight-hoodie" />
            </Reveal>
            <Reveal delay={240}>
              <ProductCard slug="crimson-hoodie" />
            </Reveal>
            <Reveal delay={360}>
              <ProductCard slug="stealth-joggers" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <section className="section section-dark">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <span className="eyebrow">Shop by type</span>
                <h2>Find your fit</h2>
              </div>
            </div>
          </Reveal>

          <div className="category-grid">
            <Reveal delay={0}>
              <Link to="/shop" className="category-tile">
                <span className="category-number">01</span>
                <h3>Polos</h3>
                <p>Classic collars with bold RYZE graphics</p>
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <Link to="/shop" className="category-tile">
                <span className="category-number">02</span>
                <h3>Graphic Tops</h3>
                <p>Statement tees, jerseys and standout prints</p>
              </Link>
            </Reveal>
            <Reveal delay={200}>
              <Link to="/shop" className="category-tile">
                <span className="category-number">03</span>
                <h3>Matching Sets</h3>
                <p>Coordinated pieces made to stand out</p>
              </Link>
            </Reveal>
            <Reveal delay={300}>
              <Link to="/shop" className="category-tile">
                <span className="category-number">04</span>
                <h3>Bottoms</h3>
                <p>Streetwear trousers and camo cuts</p>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== STATEMENT ===================== */}
      <section className="section">
        <div className="container statement">
          <Reveal>
            <span className="eyebrow">The idea</span>
            <h2>
              A kite only <span className="red">rises</span> against the wind.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p>
              RYZE was born from a simple thought: the things that push against
              us are the things that lift us higher. Every piece we make carries
              that kite, a reminder to keep climbing.
            </p>
            <Link to="/about" className="btn btn-outline">
              Read our story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===================== PERKS ===================== */}
      <section className="section section-dark">
        <div className="container perks">
          <Reveal delay={0}>
            <div className="perk">
              <span className="perk-icon">01</span>
              <h3>Premium fabric</h3>
              <p>Heavyweight cotton and brushed fleece that keep their shape wash after wash.</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="perk">
              <span className="perk-icon">02</span>
              <h3>Fast delivery</h3>
              <p>We deliver across Nigeria. Free delivery on orders above ₦80,000.</p>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="perk">
              <span className="perk-icon">03</span>
              <h3>Easy ordering</h3>
              <p>Order on the website, or message us on WhatsApp. We confirm every order by phone.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== CALL TO ACTION ===================== */}
      <section className="home-cta">
        <div className="container">
          <Reveal>
            <h2>
              Ready to <span className="red">rise</span>?
            </h2>
            <p>Order online or chat with us directly. We reply fast.</p>
            <div className="hero-buttons center">
              <Link to="/shop" className="btn btn-red">
                Start shopping
              </Link>
              <a
                href={whatsappLink("Hello RYZE, I would like to place an order.")}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
              >
                Order on WhatsApp
              </a>
            </div>
            <p className="cta-phone">
              Or call <a href={"tel:" + BRAND.phoneLink}>{BRAND.phone}</a>
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default Home;
