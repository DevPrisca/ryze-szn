import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import ProductArt from "../components/ProductArt.jsx";
import Reveal from "../components/Reveal.jsx";
import "./Lookbook.css";

function Lookbook() {
  return (
    <div>
      <PageHero
        eyebrow="Drop 01"
        title="Lookbook"
        text="The Flight collection, styled three ways. Same kite, different energy."
        big="FLIGHT"
      />

      <section className="section">
        <div className="container look-list">
          {/* ---------- Look 1 ---------- */}
          <Reveal>
            <div className="look">
              <div className="look-art art-hover">
                <ProductArt type="hoodie" color="#161616" accent="#e10b17" alt="Midnight look" />
                <span className="look-number">01</span>
              </div>
              <div className="look-text">
                <span className="eyebrow">Look 01</span>
                <h2>Midnight Run</h2>
                <p>
                  All black everything. The Flight Hoodie over the Stealth Joggers, finished with the
                  Kite Cap pulled low. Made for late nights and early starts.
                </p>
                <Link to="/product/flight-hoodie" className="btn btn-outline">
                  Shop the hoodie
                </Link>
              </div>
            </div>
          </Reveal>

          {/* ---------- Look 2 ---------- */}
          <Reveal>
            <div className="look look-reverse">
              <div className="look-art art-hover">
                <ProductArt type="hoodie" color="#b8090f" accent="#0b0b0b" alt="Crimson look" />
                <span className="look-number">02</span>
              </div>
              <div className="look-text">
                <span className="eyebrow">Look 02</span>
                <h2>Crimson Tide</h2>
                <p>
                  Head-to-toe red for people who walk into a room and own it. The limited Crimson
                  Hoodie with the Ember Joggers is our loudest set yet.
                </p>
                <Link to="/product/crimson-hoodie" className="btn btn-outline">
                  Shop the hoodie
                </Link>
              </div>
            </div>
          </Reveal>

          {/* ---------- Look 3 ---------- */}
          <Reveal>
            <div className="look">
              <div className="look-art art-hover">
                <ProductArt type="tee" color="#3a3a3a" accent="#e10b17" alt="Ash look" />
                <span className="look-number">03</span>
              </div>
              <div className="look-text">
                <span className="eyebrow">Look 03</span>
                <h2>Daylight Easy</h2>
                <p>
                  Keep it simple. The Ash Kite Tee with the Stealth Joggers is the everyday fit that
                  still turns heads. Clean lines, one red kite.
                </p>
                <Link to="/product/ash-tee" className="btn btn-outline">
                  Shop the tee
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="look-cta">
        <div className="container">
          <Reveal>
            <h2>
              Build your <span className="red">own</span> look
            </h2>
            <Link to="/shop" className="btn btn-red">
              Shop everything
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default Lookbook;
