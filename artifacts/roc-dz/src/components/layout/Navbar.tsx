import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => { navigate("/"); setMenuOpen(false); }} style={{ cursor: "pointer" }}>
        R<span>⊙</span>C DZ
      </div>

      <ul className="nav-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/models">Shop</Link></li>
        <li><Link href="/accessories">Accessories</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>

      <div className="nav-actions">
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => navigate("/models")} style={{ cursor: "pointer" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <div className="nav-cart-wrap" onClick={() => navigate("/cart")} style={{ position: "relative", cursor: "pointer" }}>
          <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {count > 0 && (
            <span style={{
              position: "absolute", top: "-6px", right: "-8px",
              background: "var(--pink)", color: "white",
              borderRadius: "50%", fontSize: "0.6rem", fontWeight: 800,
              width: "16px", height: "16px", display: "flex",
              alignItems: "center", justifyContent: "center",
              lineHeight: 1,
            }}>{count > 9 ? "9+" : count}</span>
          )}
        </div>
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          <ul>
            <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link href="/models" onClick={() => setMenuOpen(false)}>Shop</Link></li>
            <li><Link href="/accessories" onClick={() => setMenuOpen(false)}>Accessories</Link></li>
            <li><Link href="/cart" onClick={() => setMenuOpen(false)}>
              Panier {count > 0 && <span className="cart-badge-inline">{count}</span>}
            </Link></li>
            <li><Link href="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
