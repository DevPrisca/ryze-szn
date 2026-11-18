import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useCart } from "../context/CartContext.jsx";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cart = useCart();
  const location = useLocation();

  // Make the bar smaller and darker once the page is scrolled
  useEffect(function () {
    function handleScroll() {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return function () {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close the mobile menu when the page changes
  useEffect(
    function () {
      setMenuOpen(false);
    },
    [location.pathname]
  );

  // Stop the page behind the menu from scrolling while it is open
  useEffect(
    function () {
      if (menuOpen === true) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
    [menuOpen]
  );

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  let navClass = "navbar";
  if (scrolled === true) {
    navClass = "navbar navbar-scrolled";
  }

  let linksClass = "nav-links";
  if (menuOpen === true) {
    linksClass = "nav-links nav-open";
  }

  let burgerClass = "burger";
  if (menuOpen === true) {
    burgerClass = "burger burger-active";
  }

  let cartBadge = null;
  if (cart.count > 0) {
    // The key changes with the count, so the badge "pops" each time you add something
    cartBadge = (
      <span key={cart.count} className="cart-badge">
        {cart.count}
      </span>
    );
  }

  return (
    <header className={navClass}>
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" aria-label="RYZE home">
          <Logo />
        </Link>

        <nav className={linksClass}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/lookbook">Lookbook</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-link" aria-label="Open cart">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 8h14l-1.2 12H6.2L5 8Z" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
            </svg>
            {cartBadge}
          </Link>

          <button className={burgerClass} onClick={toggleMenu} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
