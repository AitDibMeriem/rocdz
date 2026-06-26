import { Link } from "wouter";
import { useLang } from "@/context/LangContext";
import { Phone, MapPin, Clock, Instagram } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/oSViRUVb9935mY6z9";
const INSTAGRAM_URL = "https://www.instagram.com/rocdz";
const DEV_WHATSAPP = "https://wa.me/213796238304";

export function Footer() {
  const { t, isRTL } = useLang();
  const c = t.contact;
  const f = t.footer;

  return (
    <footer className="border-t border-white/5 bg-background/50 mt-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div style={{ background: "linear-gradient(135deg,rgba(232,33,160,0.06),rgba(139,59,221,0.06))", borderBottom: "1px solid rgba(232,33,160,0.15)", padding: "2.5rem 1rem" }}>
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 justify-between">
            <div className="space-y-2">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <Clock size={16} style={{ color: "var(--pink)" }} />
                <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1px" }}>{c.hoursTitle}</span>
              </div>
              <p style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.95rem" }}>{c.hours}</p>
            </div>

            <div className="space-y-3">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <Phone size={16} style={{ color: "var(--pink)" }} />
                <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1px" }}>{c.title}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <a href="tel:0562854820" style={{ color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  📞 {c.phone1}
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>{c.phone1Hours}</span>
                </a>
                <a href="tel:0553207730" style={{ color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  📞 {c.phone2}
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>{c.phone2Hours}</span>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <MapPin size={16} style={{ color: "var(--pink)" }} />
                <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1px" }}>{c.location}</span>
              </div>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
                style={{ color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                📍 {c.mapLink}
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                style={{ color: "#e1306c", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <Instagram size={16} /> {c.instagram}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1">
          <Link href="/" className="inline-block mb-4">
            <img src="/logo.png" alt="ROC DZ" style={{ height: "48px", width: "auto", objectFit: "contain" }} />
          </Link>
          <p className="text-muted-foreground text-sm max-w-xs">{f.desc}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">{f.nav}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">{t.nav.home}</Link></li>
            <li><Link href="/models" className="hover:text-primary transition-colors">{t.nav.shop}</Link></li>
            <li><Link href="/accessories" className="hover:text-primary transition-colors">{t.nav.acc}</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">{t.nav.about}</Link></li>
            <li><Link href="/suivi" className="hover:text-primary transition-colors">Suivi commande</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">{f.legal}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Garantie</a></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} ROC DZ. {f.rights}</span>
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
    </footer>
  );
}
