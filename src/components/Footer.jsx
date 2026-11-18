import { Fragment } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { BRAND, whatsappLink } from "../config.js";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            Bold streetwear for people who refuse to stay grounded. Designed with
            purpose, made to be worn loud.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          <ul>
            <li>
              <Link to="/shop">All products</Link>
            </li>
            <li>
              <Link to="/lookbook">Lookbook</Link>
            </li>
            <li>
              <Link to="/cart">Your cart</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Brand</h4>
          <ul>
            <li>
              <Link to="/about">Our story</Link>
            </li>
            <li>
              <Link to="/contact">Contact us</Link>
            </li>
            <li>
              <a href={BRAND.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={BRAND.snapchat} target="_blank" rel="noreferrer">
                Snapchat
              </a>
            </li>
            <li>
              <a href={BRAND.tiktok} target="_blank" rel="noreferrer">
                TikTok
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Talk to us</h4>
          <ul>
            <li>
              <a href={"tel:" + BRAND.phoneLink}>{BRAND.phone}</a>
            </li>
            {BRAND.additionalPhones.map(function (contact) {
              return (
                <Fragment key={contact.name}>
                  <li>
                    <a href={"tel:" + contact.link}>{contact.name}: {contact.display}</a>
                  </li>
                  <li>
                    <a
                      href={whatsappLink("Hello RYZE, I would like to place an order.", contact.whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp {contact.name}
                    </a>
                  </li>
                </Fragment>
              );
            })}
            <li>
              <a href={whatsappLink("Hello RYZE, I would like to place an order.")} target="_blank" rel="noreferrer">
                WhatsApp us
              </a>
            </li>
            <li>
              <a href={"mailto:" + BRAND.email}>{BRAND.email}</a>
            </li>
            <li>{BRAND.location}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 RYZE. All rights reserved.</span>
          <span className="footer-tagline">{BRAND.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
