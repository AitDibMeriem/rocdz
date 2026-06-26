import { useLang } from "@/context/LangContext";
import { Instagram, MapPin, CheckCircle2, Facebook, Youtube } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/rocdz_/";
const FACEBOOK_URL = "https://web.facebook.com/republicofcomputerdz";
const YOUTUBE_URL = "https://www.youtube.com/@republicofcomputerdz";
const MAPS_URL = "https://maps.app.goo.gl/oSViRUVb9935mY6z9";

export default function About() {
  const { t, isRTL } = useLang();
  const a = t.about;

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(232,33,160,0.08) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase" style={{ background: "rgba(232,33,160,0.12)", color: "var(--pink)", border: "1px solid rgba(232,33,160,0.3)" }}>
            {a.subtitle}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            <span style={{ color: "var(--text)" }}>{a.title.split(" ")[0]}{" "}</span>
            <span className="text-gradient-roc">{a.title.split(" ").slice(1).join(" ")}</span>
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl pb-20 space-y-10">
        <div className="rounded-2xl p-8 border" style={{ background: "var(--card)", borderColor: "var(--border-raw)" }}>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {a.mission}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] flex-1 justify-center"
            style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", textDecoration: "none" }}
          >
            <Instagram size={20} />
            <span>@rocdz_</span>
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] flex-1 justify-center"
            style={{ background: "#1877f2", textDecoration: "none" }}
          >
            <Facebook size={20} />
            <span>Facebook</span>
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] flex-1 justify-center"
            style={{ background: "#ff0000", textDecoration: "none" }}
          >
            <Youtube size={20} />
            <span>YouTube</span>
          </a>
        </div>

        <div className="rounded-2xl p-8 border space-y-4" style={{ background: "var(--card)", borderColor: "var(--border-raw)" }}>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text)" }}>{a.catalogTitle}</h2>
          <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>{a.catalog}</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: "var(--card)", borderColor: "var(--border-raw)" }}>
          <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>{a.advice}</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: "var(--card)", borderColor: "var(--border-raw)" }}>
          <p className="leading-relaxed" style={{ color: "var(--text-muted)" }}>{a.community}</p>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: "var(--card)", borderColor: "var(--border-raw)" }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>{a.whyTitle}</h2>
          <ul className="space-y-3">
            {(a.reasons as readonly string[]).map((reason, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={20} style={{ color: "var(--pink)", flexShrink: 0, marginTop: "2px" }} />
                <span style={{ color: "var(--text-muted)" }}>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl p-8 border" style={{ background: "linear-gradient(135deg,rgba(232,33,160,0.08),rgba(139,59,221,0.08))", borderColor: "rgba(232,33,160,0.25)" }}>
          <p className="text-lg font-medium leading-relaxed" style={{ color: "var(--text)" }}>{a.closing}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] flex-1 justify-center"
            style={{ background: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", textDecoration: "none" }}
          >
            <Instagram size={20} />
            <span>Instagram</span>
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] flex-1 justify-center"
            style={{ background: "#1877f2", textDecoration: "none" }}
          >
            <Facebook size={20} />
            <span>Facebook</span>
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] flex-1 justify-center"
            style={{ background: "#ff0000", textDecoration: "none" }}
          >
            <Youtube size={20} />
            <span>YouTube</span>
          </a>
        </div>

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02]"
          style={{ background: "var(--card)", border: "1px solid rgba(232,33,160,0.3)", color: "var(--pink)", textDecoration: "none" }}
        >
          <MapPin size={20} />
          <span>{t.contact.location} — {t.contact.mapLink}</span>
        </a>
      </div>
    </div>
  );
}
