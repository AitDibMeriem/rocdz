import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LangContext";
import { Menu, X, Sun, Moon, Bell } from "lucide-react";
import { getNotifications, markAllRead, getUnreadCount, NOTIFICATIONS_EVENT, type Notification } from "@/lib/notifications";

export function Navbar() {
  const [, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => (localStorage.getItem("rocdz_theme") as "dark" | "light") || "dark");
  const { count } = useCart();
  const { lang, setLang, t } = useLang();

  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(getNotifications);
  const [unread, setUnread] = useState(getUnreadCount);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      setNotifications(getNotifications());
      setUnread(getUnreadCount());
    };
    window.addEventListener(NOTIFICATIONS_EVENT, handler);
    return () => window.removeEventListener(NOTIFICATIONS_EVENT, handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    } else {
      root.classList.remove("light-mode");
      root.classList.add("dark-mode");
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("rocdz_theme", next);
  };

  const toggleLang = () => {
    setLang(lang === "fr" ? "ar" : "fr");
  };

  const handleBellClick = () => {
    const next = !bellOpen;
    setBellOpen(next);
    if (next) {
      markAllRead();
      setUnread(0);
      setNotifications(getNotifications());
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString(lang === "ar" ? "ar-DZ" : "fr-DZ", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => { navigate("/"); setMenuOpen(false); }} style={{ cursor: "pointer" }}>
        <img src="/logo.png" alt="ROC DZ" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
      </div>

      <ul className="nav-links">
        <li><Link href="/">{t.nav.home}</Link></li>
        <li><Link href="/models">{t.nav.shop}</Link></li>
        <li><Link href="/accessories">{t.nav.acc}</Link></li>
        <li><Link href="/about">{t.nav.about}</Link></li>
      </ul>

      <div className="nav-actions">
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => navigate("/models")} style={{ cursor: "pointer" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <button onClick={toggleTheme} title={theme === "dark" ? "Mode clair" : "Mode sombre"} className="theme-toggle-btn" aria-label="Changer le thème">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button onClick={toggleLang} title={lang === "fr" ? "Switch to Arabic" : "Switch to French"} className="lang-btn">
          {lang === "fr" ? <><span className="lang-flag">🇫🇷</span><span className="lang-label">FR</span></> : <><span className="lang-flag">🇩🇿</span><span className="lang-label">AR</span></>}
        </button>

        <div ref={bellRef} style={{ position: "relative" }}>
          <button
            onClick={handleBellClick}
            className="theme-toggle-btn"
            aria-label={t.notifications.title}
            style={{ position: "relative" }}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span style={{ position: "absolute", top: "-5px", right: "-6px", background: "var(--pink)", color: "white", borderRadius: "50%", fontSize: "0.55rem", fontWeight: 800, width: "15px", height: "15px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {bellOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 12px)", right: 0, width: "320px", background: "var(--card)", border: "1px solid var(--border-raw)", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 1000, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-raw)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>{t.notifications.title}</span>
              </div>
              <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    <Bell size={28} style={{ margin: "0 auto 8px", opacity: 0.3, display: "block" }} />
                    {t.notifications.empty}
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-raw)", background: n.read ? "transparent" : "rgba(232,33,160,0.04)" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)", marginBottom: "2px" }}>{n.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "4px" }}>{n.message}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--pink)", opacity: 0.7 }}>{formatTime(n.timestamp)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="nav-cart-wrap" onClick={() => navigate("/cart")} style={{ position: "relative", cursor: "pointer" }}>
          <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {count > 0 && (
            <span style={{ position: "absolute", top: "-6px", right: "-8px", background: "var(--pink)", color: "white", borderRadius: "50%", fontSize: "0.6rem", fontWeight: 800, width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
              {count > 9 ? "9+" : count}
            </span>
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
            <li><Link href="/" onClick={() => setMenuOpen(false)}>{t.nav.home}</Link></li>
            <li><Link href="/models" onClick={() => setMenuOpen(false)}>{t.nav.shop}</Link></li>
            <li><Link href="/accessories" onClick={() => setMenuOpen(false)}>{t.nav.acc}</Link></li>
            <li><Link href="/cart" onClick={() => setMenuOpen(false)}>
              {t.nav.cart} {count > 0 && <span className="cart-badge-inline">{count}</span>}
            </Link></li>
            <li><Link href="/about" onClick={() => setMenuOpen(false)}>{t.nav.about}</Link></li>
            <li>
              <button onClick={() => { toggleLang(); setMenuOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "1rem", fontWeight: 700, padding: "0.8rem 0", width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-raw)" }}>
                {lang === "fr" ? "🇫🇷 Français" : "🇩🇿 العربية"}
                <span style={{ fontSize: "0.7rem", color: "var(--pink)", marginLeft: "auto" }}>→ {lang === "fr" ? "عربي" : "FR"}</span>
              </button>
            </li>
            <li>
              <button onClick={() => { toggleTheme(); setMenuOpen(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text)", fontSize: "1rem", fontWeight: 600, padding: "0.8rem 0", width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}>
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                {theme === "dark" ? "Mode clair" : "Mode sombre"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
