import { Link } from "wouter";
import { useLang } from "@/context/LangContext";
import { Phone, MapPin, Clock, Instagram, Facebook, Youtube } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/oSViRUVb9935mY6z9";
const INSTAGRAM_URL = "https://www.instagram.com/rocdz_/";
const FACEBOOK_URL = "https://web.facebook.com/republicofcomputerdz";
const YOUTUBE_URL = "https://www.youtube.com/@republicofcomputerdz";
const DEV_WHATSAPP = "https://wa.me/213796238304";

export function Footer() {
  const { t, isRTL } = useLang();
  const f = t.footer;

  return (
    <footer className="border-t border-white/5 bg-background/50 mt-auto" dir={isRTL ? "rtl" : "ltr"}>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Col 1 — Logo + description */}
        <div className="col-span-1">
          <Link href="/" className="inline-block mb-4">
            <img src="/logo.png" alt="ROC DZ" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
          </Link>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "220px", lineHeight: 1.65 }}>{f.desc}</p>
        </div>

        {/* Col 2 — Navigation */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.88rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text)" }}>{f.nav}</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li><Link href="/"           style={{ textDecoration: "none", fontSize: "0.85rem", color: "var(--text-muted)", transition: "color 0.15s" }}>{t.nav.home}</Link></li>
            <li><Link href="/models"     style={{ textDecoration: "none", fontSize: "0.85rem", color: "var(--text-muted)", transition: "color 0.15s" }}>{t.nav.shop}</Link></li>
            <li><Link href="/accessories" style={{ textDecoration: "none", fontSize: "0.85rem", color: "var(--text-muted)", transition: "color 0.15s" }}>{t.nav.acc}</Link></li>
            <li><Link href="/about"      style={{ textDecoration: "none", fontSize: "0.85rem", color: "var(--text-muted)", transition: "color 0.15s" }}>{t.nav.about}</Link></li>
            <li><Link href="/suivi"      style={{ textDecoration: "none", fontSize: "0.85rem", color: "var(--text-muted)", transition: "color 0.15s" }}>Suivi commande</Link></li>
          </ul>
        </div>

        {/* Col 3 — Horaires + Contact + Localisation */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Horaires */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.4rem" }}>
              <Clock size={14} style={{ color: "var(--pink)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                Horaires d'ouverture
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 600, margin: 0 }}>6/7 jours — 9h à 20h</p>
          </div>

          {/* Téléphones */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.5rem" }}>
              <Phone size={14} style={{ color: "var(--pink)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                Contactez-nous
              </span>
            </div>
            <a href="tel:0562854820" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "var(--text)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.3rem" }}>
              📞 0562 854 820
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 400 }}>de 8h à 16h</span>
            </a>
            <a href="tel:0553207730" style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "var(--text)", fontSize: "0.88rem", fontWeight: 600 }}>
              📞 0553 207 730
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 400 }}>de 16h à minuit</span>
            </a>
          </div>

          {/* Localisation + réseaux */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.5rem" }}>
              <MapPin size={14} style={{ color: "var(--pink)", flexShrink: 0 }} />
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                Notre localisation
              </span>
            </div>
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "var(--text)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.6rem" }}>
              📍 Voir sur Google Maps
            </a>
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "5px", textDecoration: "none", color: "#e1306c", fontSize: "0.82rem", fontWeight: 600, transition: "opacity 0.2s" }}>
                <Instagram size={15} /> Instagram
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "5px", textDecoration: "none", color: "#1877f2", fontSize: "0.82rem", fontWeight: 600, transition: "opacity 0.2s" }}>
                <Facebook size={15} /> Facebook
              </a>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "5px", textDecoration: "none", color: "#ff0000", fontSize: "0.82rem", fontWeight: 600, transition: "opacity 0.2s" }}>
                <Youtube size={15} /> YouTube
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.25rem 1rem" }}>
        <div className="container mx-auto" style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} ROC DZ. {f.rights}</span>
          <a
            href={DEV_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-muted)", textDecoration: "none", fontSize: "0.72rem", opacity: 0.65, transition: "opacity 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.65"; }}
          >
            <span>{f.devCredit}</span>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "14px", height: "14px", color: "#25d366" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>+213 796 238 304</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
