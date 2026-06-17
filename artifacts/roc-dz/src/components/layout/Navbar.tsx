import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Menu, X } from "lucide-react";

type Lang = "fr" | "ar";

const NAV_LABELS: Record<Lang, { home: string; shop: string; acc: string; about: string; cart: string }> = {
  fr: { home: "Accueil", shop: "Shop", acc: "Accessoires", about: "À propos", cart: "Panier" },
  ar: { home: "الرئيسية", shop: "المتجر", acc: "الملحقات", about: "من نحن", cart: "السلة" },
};

export function Navbar() {
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("rocdz_lang") as Lang) || "fr");
  const { count } = useCart();

  const t = NAV_LABELS[lang];

  const toggleLang = () => {
    const next: Lang = lang === "fr" ? "ar" : "fr";
    setLang(next);
    localStorage.setItem("rocdz_lang", next);
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = next;
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => { navigate("/"); setMenuOpen(false); }} style={{ cursor: "pointer" }}>
        R<span>⊙</span>C DZ
      </div>

      <ul className="nav-links">
        <li><Link href="/">{t.home}</Link></li>
        <li><Link href="/models">{t.shop}</Link></li>
        <li><Link href="/accessories">{t.acc}</Link></li>
        <li><Link href="/about">{t.about}</Link></li>
      </ul>

      <div className="nav-actions">
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => navigate("/models")} style={{ cursor: "pointer" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <button
          onClick={toggleLang}
          title={lang === "fr" ? "Switch to Arabic" : "Switch to French"}
          style={{
            background: "none", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "6px", cursor: "pointer", padding: "3px 7px",
            fontSize: "0.7rem", fontWeight: 700, color: "var(--text)",
            letterSpacing: "0.5px", lineHeight: 1.4,
            display: "flex", alignItems: "center", gap: "4px",
          }}
        >
          {lang === "fr" ? "🇫🇷 FR" : "🇩🇿 AR"}
        </button>

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
            <li><Link href="/" onClick={() => setMenuOpen(false)}>{t.home}</Link></li>
            <li><Link href="/models" onClick={() => setMenuOpen(false)}>{t.shop}</Link></li>
            <li><Link href="/accessories" onClick={() => setMenuOpen(false)}>{t.acc}</Link></li>
            <li><Link href="/cart" onClick={() => setMenuOpen(false)}>
              {t.cart} {count > 0 && <span className="cart-badge-inline">{count}</span>}
            </Link></li>
            <li><Link href="/about" onClick={() => setMenuOpen(false)}>{t.about}</Link></li>
            <li>
              <button
                onClick={() => { toggleLang(); setMenuOpen(false); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--text)", fontSize: "1rem", fontWeight: 700,
                  padding: "0.8rem 0", width: "100%", textAlign: "left",
                  display: "flex", alignItems: "center", gap: "8px",
                  borderBottom: "1px solid var(--border-raw)",
                }}
              >
                {lang === "fr" ? "🇫🇷 Français" : "🇩🇿 العربية"}
                <span style={{ fontSize: "0.7rem", color: "var(--pink)", marginLeft: "auto" }}>→ {lang === "fr" ? "عربي" : "FR"}</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
