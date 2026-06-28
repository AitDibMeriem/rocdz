import { useEffect, useRef, useState, useCallback } from "react";
import { useGetFeaturedLaptop } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useLang } from "@/context/LangContext";

function useCountUp(target: number, decimals = 0) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const animate = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const duration = 2000;
    const step = 16;
    const inc = target / (duration / step);
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      setVal(decimals > 0 ? Math.round(cur * 10) / 10 : Math.floor(cur));
      if (cur >= target) clearInterval(t);
    }, step);
  }, [target, decimals]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) animate(); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [animate]);
  return { val, ref };
}

const BRAND_LOGOS = [
  { name: "Dell", img: "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg" },
  { name: "HP", img: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg" },
  { name: "Lenovo", img: "/brand-lenovo-logo.png" },
  { name: "ASUS", img: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg" },
  { name: "MSI", img: "https://upload.wikimedia.org/wikipedia/commons/1/13/MSI_Logo.svg" },
  { name: "Apple", img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "Acer", img: "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg" },
  { name: "Samsung", img: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { name: "Huawei", img: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg" },
];

const LAPTOP_GRID = [
  { img: "/brand-hp.png", tag: "tag-gaming", tagKey: "tagGaming", name: "HP", href: "/models?brand=HP" },
  { img: "/brand-apple-hero.png", tag: "tag-premium", tagKey: "tagPremium", name: "Apple", href: "/models?brand=Apple" },
  { img: "/brand-lenovo3.png", tag: "tag-pro", tagKey: "tagPro", name: "Lenovo", href: "/models?brand=Lenovo" },
  { img: "/brand-msi.png", tag: "tag-gaming", tagKey: "tagGaming", name: "MSI", href: "/models?brand=MSI" },
  { img: "/brand-asus.png", tag: "tag-performance", tagKey: "tagPerformance", name: "ASUS", href: "/models?brand=ASUS" },
  { img: "/brand-acer.png", tag: "tag-polyvalent", tagKey: "tagPolyvalent", name: "Acer", href: "/models?brand=Acer" },
  { img: "/brand-dell3.png", tag: "tag-fiabilite", tagKey: "tagFiabilite", name: "Dell", href: "/models?brand=Dell" },
  { img: "/brand-surface.png", tag: "tag-premium", tagKey: "tagPremium", name: "Microsoft", href: "/models?brand=Microsoft" },
  { img: "/brand-samsung.png", tag: "tag-performance", tagKey: "tagPerformance", name: "Samsung", href: "/models?brand=Samsung" },
  { img: "/brand-huawei.png", tag: "tag-pro", tagKey: "tagPro", name: "Huawei", href: "/models?brand=Huawei" },
];

const ACC_GRID = [
  { img: "/acc-support.png", tag: "tag-setup", tagKey: "tagSetup", nameKey: "accSupports", href: "/accessories?category=Hubs & Adapters" },
  { img: "/acc-cables.png", tag: "tag-connect", tagKey: "tagConnect", nameKey: "accCables", href: "/accessories?category=Hubs & Adapters" },
  { img: "/acc-chargeur.png", tag: "tag-power", tagKey: "tagPower", nameKey: "accChargeurs", href: "/accessories?category=Chargers" },
  { img: "/acc-manette2.png", tag: "tag-gaming", tagKey: "tagGaming", nameKey: "accManettes", href: "/accessories?category=Controllers" },
  { img: "/acc-stockage.png", tag: "tag-storage", tagKey: "tagStorage", nameKey: "accStockage", href: "/accessories?category=Other" },
  { img: "/acc-webcam.png", tag: "tag-video", tagKey: "tagVideo", nameKey: "accWebcams", href: "/accessories?category=Other" },
  { img: "/acc-sacados.png", tag: "tag-transport", tagKey: "tagTransport", nameKey: "accSacados", href: "/accessories?category=Bags" },
  { img: "/acc-headset3.png", tag: "tag-audio", tagKey: "tagAudio", nameKey: "accCasques", href: "/accessories?category=Headsets" },
  { img: "/acc-mouse3.png", tag: "tag-precision", tagKey: "tagPrecision", nameKey: "accSouris", href: "/accessories?category=Mice" },
  { img: "/acc-clavier3.png", tag: "tag-saisie", tagKey: "tagSaisie", nameKey: "accClaviers", href: "/accessories?category=Keyboards" },
  { img: "/acc-monitor2.png", tag: "tag-display", tagKey: "tagDisplay", nameKey: "accMoniteurs", href: "/accessories?category=Monitors" },
];

const REVIEWS = [
  { name: "Mounia Sifi", rating: 5, text: "Professionnel, sérieux, le bon accueil, y'a tout dans ce magasin, à mon avis c'est le bon exemple pour les commerçants algériens. Continuez à briller monsieur. Lah ybarek." },
  { name: "Yacine B.", rating: 5, text: "Un bon magasin de tout les côtés soit l'accueil soit le service soit les produits vraiment ma cha allah. Je vous souhaite une bonne continuation." },
  { name: "Rania K.", rating: 5, text: "Super service, livraison rapide, le laptop est exactement comme décrit. Je recommande vivement ROC DZ pour tout achat informatique en Algérie." },
  { name: "Hamid L.", rating: 5, text: "Très sérieux, bon rapport qualité prix. Le personnel est compétent et honnête. Mon PC tourne parfaitement. Merci ROC DZ!" },
  { name: "Sara M.", rating: 5, text: "J'ai acheté un MacBook, il est arrivé en parfait état avec garantie. Service impeccable et suivi professionnel. Je reviendrai c'est sûr." },
  { name: "Djamel T.", rating: 5, text: "Meilleur magasin de PC à Alger. Des prix compétitifs, du matériel de qualité, et une équipe qui connaît son métier. 10/10." },
];

export default function Home() {
  const { data: featured } = useGetFeaturedLaptop();
  const { t, isRTL } = useLang();
  const h = t.home;

  const getTag = (key: string) => (h as Record<string, string>)[key] ?? key;
  const getName = (key: string) => (h as Record<string, string>)[key] ?? key;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".fade-up, .fade-left, .fade-right, .scale-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const btn = document.getElementById("backToTop");
      if (btn) btn.classList.toggle("visible", window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="circuit-overlay" />

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-text fade-up">
            <div className="hero-label">
              <div className="line" />
              <span>{h.heroLabel}</span>
            </div>
            <h1>
              <span className="white">{h.heroH1}</span><br />
              <span className="gradient">{h.heroH2}</span>
            </h1>
            <p className="hero-desc">{h.heroDesc}</p>
            <Link href="/models" className="btn-white">
              {h.heroCta}
              <span className="arrow">→</span>
            </Link>
          </div>
          <div className="hero-image fade-right">
            <div className="hero-glow" />
            <div className="hero-glow-2" />
            <img
              src="/laptop-nobg.png"
              alt="Laptop"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700&q=80";
              }}
            />
          </div>
        </div>

        <div className="scroll-indicator">
          <span>{h.heroScroll}</span>
          <div className="scroll-line" />
        </div>

        <div className="brand-marquee">
          <div className="marquee-track">
            {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((b, i) => (
              <span key={i} className="brand-item" style={{ display: "inline-flex", alignItems: "center", padding: "0 16px" }}>
                <img
                  src={b.img}
                  alt={b.name}
                  className="brand-logo"
                  style={{ height: "22px", width: "auto", maxWidth: "80px", objectFit: "contain", opacity: 0.75 }}
                  onError={e => { const el = e.currentTarget as HTMLImageElement; el.style.display = "none"; el.nextElementSibling && ((el.nextElementSibling as HTMLElement).style.display = "inline"); }}
                />
                <span style={{ display: "none", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "1px", opacity: 0.7 }}>{b.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS COUNTERS — ChiffresQuiParlent */}
      <StatsSection isRTL={isRTL} />

      {/* LOOKING FOR */}
      <section className="looking-for">
        <div className="section-title fade-up">
          <span style={{ display: "block", fontSize: "clamp(0.7rem,2vw,0.85rem)", letterSpacing: "3px", color: "var(--pink)", textTransform: "uppercase", marginBottom: "0.5rem" }}>{h.lookingSub}</span>
          {h.lookingTitle} <span className="gradient">?</span>
        </div>
        <div className="looking-grid">
          <Link href="/models?condition=new" className="tilt-card fade-left">
            <div className="badge badge-new">{h.newBadge}</div>
            <img src="/laptop-occasion.png" alt={h.newTitle} onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"; }} />
            <div className="tilt-card-body">
              <h3>{h.newTitle}</h3>
              <div className="sub">{h.newCardSub}</div>
              <p>{h.newDesc}</p>
              <span className="link">
                {h.newLink}
                <span className="arrow-circle">→</span>
              </span>
            </div>
          </Link>
          <Link href="/models?condition=refurbished" className="tilt-card fade-right">
            <div className="badge badge-refurb" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>{h.occasionBadge}</div>
            <img src="/laptop-neuf.png" alt={h.occasionTitle} onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"; }} />
            <div className="tilt-card-body">
              <h3>{h.occasionTitle}</h3>
              <div className="sub">{h.occasionCardSub}</div>
              <p>{h.occasionDesc}</p>
              <span className="link">
                {h.occasionLink}
                <span className="arrow-circle">→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* PICK OF THE DAY */}
      <section className="pick-day">
        <div className="pick-container">
          <div className="pick-title-stack fade-left">
            <div className="label">
              {featured ? `${h.pickRef}${featured.id}` : h.pickDefault}
            </div>
            <h2>
              <span className="white">{h.pickH1}</span>
              {h.pickH2 && <><br /><span className="gradient">{h.pickH2}</span></>}
              {h.pickH3 && <><br /><span className="white">{h.pickH3}</span></>}
              {h.pickH4 && <><br /><span className="gradient">{h.pickH4}</span></>}
            </h2>
            {featured && (
              <div className="pick-specs">
                {featured.processor && (
                  <div className="spec-row">
                    <span className="label">{h.pickProc}</span>
                    <span className="value">{featured.processor}</span>
                  </div>
                )}
                {featured.gpu && (
                  <div className="spec-row">
                    <span className="label">{h.pickGpu}</span>
                    <span className="value">{featured.gpu}</span>
                  </div>
                )}
                {featured.ram && (
                  <div className="spec-row">
                    <span className="label">{h.pickRam}</span>
                    <span className="value">{featured.ram}GB {featured.ramType}</span>
                  </div>
                )}
                {featured.storage && (
                  <div className="spec-row">
                    <span className="label">{h.pickStorage}</span>
                    <span className="value">{featured.storage}GB {featured.storageType}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pick-image scale-in">
            <img
              src={featured?.imageUrl || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"}
              alt={featured?.title || h.pickDefault}
            />
          </div>

          <div className="pick-info fade-right">
            <div className="status-badge">{h.pickStatus}</div>
            <div className="price-label">{h.pickPriceLabel}</div>
            {featured ? (
              <>
                <div className="price">{featured.price.toLocaleString("fr-DZ")} <span>DA</span></div>
                <div className="stock">{featured.stockQuantity > 0 ? `${featured.stockQuantity} ${h.pickInStock}` : h.pickOutOfStock}</div>
                <Link href={`/laptop/${featured.id}`} className="btn-product">
                  {h.pickBtn}
                </Link>
              </>
            ) : (
              <div className="price" style={{ fontSize: "1.5rem" }}>{h.pickLoading}</div>
            )}
            <div className="pick-trust">
              <p>{h.pickAuth}</p>
              <p>{h.pickGarantie}</p>
              <p>{h.pickLivraison}</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-us" id="why-us">
        <div className="glass-container fade-up">
          <div className="glass-header">
            <div className="left">
              <div className="label"><div className="line" />{h.whyCommitments}</div>
              <h2>{h.whyTitle}<br /><span className="gradient">{h.whyTitleGrad}</span></h2>
            </div>
            <div className="right">{h.whySub}</div>
          </div>
          <div className="glass-grid">
            <div className="glass-card">
              <div className="bg-num">01</div>
              <div className="icons">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3>{h.whyC1Title}</h3>
              <p>{h.whyC1Desc}</p>
            </div>
            <div className="glass-card">
              <div className="bg-num">02</div>
              <div className="icons">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3>{h.whyC2Title}</h3>
              <p>{h.whyC2Desc}</p>
            </div>
            <div className="glass-card">
              <div className="bg-num">03</div>
              <div className="icons">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3>{h.whyC3Title}</h3>
              <p>{h.whyC3Desc}</p>
            </div>
            <div className="glass-card">
              <div className="bg-num">04</div>
              <div className="icons">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3>{h.whyC4Title}</h3>
              <p>{h.whyC4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SUIVI COMMANDE CTA */}
      <div className="tracking-cta fade-up">
        <div className="tracking-cta-card">
          <div className="tracking-cta-left">
            <div className="tracking-cta-icon">📦</div>
            <div className="tracking-cta-text">
              <h3>{h.trackTitle}</h3>
              <p>{h.trackDesc}</p>
            </div>
          </div>
          <Link href="/suivi" className="tracking-cta-btn">
            {h.trackBtn}
          </Link>
        </div>
      </div>

      {/* MAGASIN PHYSIQUE — SplitReveal */}
      <StoreSection isRTL={isRTL} />

      {/* AVIS CLIENTS */}
      <section className="reviews-section">
        <div className="reviews-header fade-up">
          <div className="section-label">{h.reviewsLabel}</div>
          <h2>{h.reviewsTitle} <span className="gradient">{h.reviewsTitleGrad}</span></h2>
          <a
            href="https://maps.app.goo.gl/GaKYnMnz1H6QiXjHA"
            target="_blank"
            rel="noopener noreferrer"
            className="google-reviews-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            {h.reviewsGoogle}
          </a>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card fade-up">
              <div className="review-stars">{"★".repeat(r.rating)}</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.name[0]}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-source">{h.reviewsSource}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        className="back-to-top"
        id="backToTop"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </div>
  );
}

/* ── STATS SECTION ─────────────────────────────── */
function StatCard({ target, suffix, label, decimals = 0 }: { target: number; suffix: string; label: string; decimals?: number }) {
  const { val, ref } = useCountUp(target, decimals);
  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-number">
        {decimals > 0 ? val.toFixed(1) : val.toLocaleString("fr-DZ")}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function StatsSection({ isRTL }: { isRTL: boolean }) {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-label" dir={isRTL ? "rtl" : "ltr"}>
          {isRTL ? "أرقام تتحدث عن نفسها" : "Des chiffres qui parlent"}
        </div>
        <h2 className="stats-title" dir={isRTL ? "rtl" : "ltr"}>
          {isRTL ? "ثقة عشرات الآلاف من الزبائن" : "La confiance de milliers d'Algériens"}
        </h2>
        <div className="stats-grid">
          <StatCard target={2} suffix="M+" label={isRTL ? "متابع على وسائل التواصل" : "Abonnés réseaux sociaux"} />
          <StatCard target={68} suffix="" label={isRTL ? "ولاية نوصلها" : "Wilayas livrées"} />
          <StatCard target={5000} suffix="+" label={isRTL ? "طلب منجز" : "Commandes livrées"} />
          <StatCard target={4.9} suffix="/5" label={isRTL ? "تقييم جوجل" : "Note Google"} decimals={1} />
        </div>
      </div>
    </section>
  );
}

/* ── TRACKING FEATURE SECTION ──────────────────── */
const TRACKING_STEPS = [
  { icon: "📋", label_fr: "Réservé",   label_ar: "محجوز",   color: "#eab308", active: true },
  { icon: "✅", label_fr: "Confirmé",  label_ar: "مؤكد",    color: "#60a5fa", active: true },
  { icon: "💰", label_fr: "Versé",     label_ar: "مدفوع",   color: "#2dd4bf", active: true },
  { icon: "📦", label_fr: "Préparé",   label_ar: "محضر",    color: "#c084fc", active: false },
  { icon: "🚚", label_fr: "Expédié",   label_ar: "مشحون",   color: "#22d3ee", active: false },
  { icon: "🎉", label_fr: "Livré",     label_ar: "مسلم",    color: "#4ade80", active: false },
];

function TrackingFeatureSection({ h }: { h: Record<string, string> }) {
  const { isRTL } = useLang();
  return (
    <section className="tracking-feature">
      <div className="tracking-feature-inner">
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <div className="section-label">{isRTL ? "تتبع طلبك" : "Suivi en temps réel"}</div>
          <h2 style={{ fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 900, marginBottom: "0.5rem" }}>
            {isRTL ? "اعرف أين طلبك في أي لحظة" : <><span className="gradient">Votre commande</span> en temps réel</>}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", maxWidth: "500px", margin: "0 auto" }}>
            {isRTL
              ? "تابع حالة طلبك من الحجز حتى التسليم، بشفافية تامة"
              : "Suivez l'état de votre commande de la réservation jusqu'à la livraison, en toute transparence."}
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "1.5rem 1rem" }}>
          {/* Steps row */}
          <div className="tracking-steps-row">
            {TRACKING_STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div className="tracking-step-item">
                  <div className="tracking-step-dot" style={{ background: step.active ? `${step.color}22` : "transparent", borderColor: step.active ? step.color : "rgba(255,255,255,0.12)", color: step.color, opacity: step.active ? 1 : 0.45 }}>
                    {step.icon}
                  </div>
                  <span className="tracking-step-name" style={{ color: step.active ? step.color : "rgba(255,255,255,0.3)" }}>
                    {isRTL ? step.label_ar : step.label_fr}
                  </span>
                </div>
                {i < TRACKING_STEPS.length - 1 && <div className="tracking-step-line" style={{ opacity: step.active ? 1 : 0.3 }} />}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link href="/suivi" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "0.6rem 1.5rem", borderRadius: "10px", border: "1px solid rgba(232,33,160,0.35)", color: "var(--pink)", textDecoration: "none", fontSize: "0.84rem", fontWeight: 700, transition: "all 0.2s" }}>
              {isRTL ? "تتبع طلبي ←" : "Suivre ma commande →"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── STORE SECTION ─────────────────────────────── */
function StoreSection({ isRTL }: { isRTL: boolean }) {
  return (
    <section className="store-section">
      <div className="store-inner">
        {/* Store photo */}
        <div className={`store-visual ${isRTL ? "order-last" : ""}`} style={{ padding: 0, overflow: "hidden", borderRadius: "20px" }}>
          <img src="/store-photo.jpg" alt="Boutique ROC DZ" style={{ width: "100%", height: "100%", minHeight: "220px", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)", borderRadius: "20px", pointerEvents: "none" }} />
          <a
            href="https://maps.app.goo.gl/GaKYnMnz1H6QiXjHA"
            target="_blank"
            rel="noopener noreferrer"
            className="store-map-btn"
            style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}
          >
            📍 {isRTL ? "عرض على الخريطة" : "Voir sur la carte"}
          </a>
        </div>

        {/* Info */}
        <div>
          <div className="store-info-label">{isRTL ? "محل فيزيائي" : "Boutique physique"}</div>
          <h2 className="store-info-title">
            {isRTL
              ? <>تسوق <span className="gradient">بشكل مباشر</span> في متجرنا</>
              : <>Venez nous voir <span className="gradient">en boutique</span></>}
          </h2>

          <div className="store-info-row">
            <div className="store-info-icon">📍</div>
            <div>
              <div className="store-info-text-title">{isRTL ? "العنوان" : "Adresse"}</div>
              <div className="store-info-text-val">Algérie — 68 wilayas livrées</div>
            </div>
          </div>

          <div className="store-info-row">
            <div className="store-info-icon">📞</div>
            <div>
              <div className="store-info-text-title">{isRTL ? "اتصل بنا" : "Contact"}</div>
              <div className="store-info-text-val" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <a href="tel:0562854820" style={{ color: "inherit", textDecoration: "none" }}>
                  0562 854 820 <span style={{ fontSize: "0.72rem", opacity: 0.6 }}>8h–16h</span>
                </a>
                <a href="tel:0553207730" style={{ color: "inherit", textDecoration: "none" }}>
                  0553 207 730 <span style={{ fontSize: "0.72rem", opacity: 0.6 }}>16h–minuit</span>
                </a>
              </div>
            </div>
          </div>

          <div className="store-info-row">
            <div className="store-info-icon">🕐</div>
            <div>
              <div className="store-info-text-title">{isRTL ? "ساعات العمل" : "Horaires"}</div>
              <div className="store-info-text-val">{isRTL ? "6/7 أيام : 9h → 20h" : "6/7 jours — 9h à 20h"}</div>
            </div>
          </div>

          <a
            href="https://maps.app.goo.gl/GaKYnMnz1H6QiXjHA"
            target="_blank"
            rel="noopener noreferrer"
            className="store-map-btn"
          >
            🗺️ {isRTL ? "الوصول للمحل" : "Itinéraire vers la boutique"}
          </a>
        </div>
      </div>
    </section>
  );
}
