import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { KiteMark } from "../components/Logo.jsx";
import "./About.css";

function About() {
  return (
    <div>
      <PageHero
        eyebrow="Our story"
        title="About RYZE"
        text="A clothing brand built on one simple idea: pressure lifts you higher."
        big="RISE"
      />

      <section className="section">
        <div className="container about-intro">
          <Reveal>
            <div className="about-kite">
              <KiteMark size={160} />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span className="eyebrow">Why a kite?</span>
            <h2>
              It only flies <span className="red">against</span> the wind.
            </h2>
            <p>
              Three brothers. One sewing machine. And a stubborn belief that Nigerian streetwear
              could stand next to any brand in the world.
            </p>
            <p>
              RYZE started with a few sketches in a small room, three brothers pulling in the same
              direction — one drawing, one sewing, one pushing it to the world. No money, no
              connections, just tension, pressure, and each other.
            </p>
            <p>
              That is the story of every person building something from nothing. You don't rise
              because life is easy. You rise because of the resistance, the hard days, the people who
              doubted you — and the brothers beside you who refuse to let you fall. Every tee, hoodie
              and cap we make carries that story as a quiet reminder: keep climbing.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <span className="eyebrow">What we stand for</span>
                <h2>Our values</h2>
              </div>
            </div>
          </Reveal>

          <div className="values-grid">
            <Reveal delay={0}>
              <div className="value-card">
                <span>01</span>
                <h3>Quality first</h3>
                <p>Heavyweight fabrics and clean stitching. If we would not wear it, we do not sell it.</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="value-card">
                <span>02</span>
                <h3>Small batches</h3>
                <p>We make fewer pieces, on purpose. Less waste, more care, and a fit that feels personal.</p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="value-card">
                <span>03</span>
                <h3>Made at home</h3>
                <p>Designed and produced in Nigeria, supporting local tailors and fabric makers.</p>
              </div>
            </Reveal>
            <Reveal delay={360}>
              <div className="value-card">
                <span>04</span>
                <h3>Rise together</h3>
                <p>We grow with our customers. Every order and every message shapes the next drop.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <span className="eyebrow">The journey</span>
                <h2>How we got here</h2>
              </div>
            </div>
          </Reveal>

          <div className="timeline">
            <Reveal>
              <div className="time-item">
                <strong>The sketch</strong>
                <p>The first kite drawn on a notebook page. The idea for RYZE is born.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="time-item">
                <strong>THE FIRST HOODIE DROP</strong>
                <p>We reinvested everything. One hoodie, made by three brothers, gone before the weekend ended.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="time-item">
                <strong>Hoodies and joggers</strong>
                <p>The collection grows with heavier fabrics and our signature red and black.</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="time-item">
                <strong>Flight collection</strong>
                <p>Our biggest drop yet, now delivering to customers across the country.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container">
          <Reveal>
            <h2>
              Join the <span className="red">flight</span>
            </h2>
            <Link to="/shop" className="btn btn-red">
              Shop the collection
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

export default About;
