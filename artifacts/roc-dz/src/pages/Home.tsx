import { useEffect } from "react";
import { useGetFeaturedLaptop } from "@workspace/api-client-react";
import { Link } from "wouter";

const BRANDS = ["DELL", "HP", "LENOVO", "ASUS", "MSI", "APPLE", "ACER", "SAMSUNG", "HUAWEI"];

const LAPTOP_GRID = [
  { img: "/brand-hp.png", tag: "tag-gaming", tagLabel: "Gaming", name: "HP", href: "/models?brand=HP" },
  { img: "/brand-apple3.png", tag: "tag-premium", tagLabel: "Premium", name: "Apple", href: "/models?brand=Apple" },
  { img: "/brand-lenovo3.png", tag: "tag-pro", tagLabel: "Pro", name: "Lenovo", href: "/models?brand=Lenovo" },
  { img: "/brand-msi.png", tag: "tag-gaming", tagLabel: "Gaming", name: "MSI", href: "/models?brand=MSI" },
  { img: "/brand-asus.png", tag: "tag-performance", tagLabel: "Performance", name: "ASUS", href: "/models?brand=ASUS" },
  { img: "/brand-acer.png", tag: "tag-polyvalent", tagLabel: "Polyvalent", name: "Acer", href: "/models?brand=Acer" },
  { img: "/brand-dell3.png", tag: "tag-fiabilite", tagLabel: "Fiabilité", name: "Dell", href: "/models?brand=Dell" },
  { img: "/brand-surface.png", tag: "tag-premium", tagLabel: "Premium", name: "Microsoft Surface", href: "/models?brand=Microsoft" },
  { img: "/brand-samsung.png", tag: "tag-performance", tagLabel: "Performance", name: "Samsung", href: "/models?brand=Samsung" },
  { img: "/brand-huawei.png", tag: "tag-pro", tagLabel: "Pro", name: "Huawei", href: "/models?brand=Huawei" },
];

const ACC_GRID = [
  { img: "/acc-support.png", tag: "tag-setup", tagLabel: "Setup", name: "Supports", href: "/accessories?category=Hubs & Adapters" },
  { img: "/acc-cables.png", tag: "tag-connect", tagLabel: "Connectique", name: "Câbles", href: "/accessories?category=Hubs & Adapters" },
  { img: "/acc-chargeur.png", tag: "tag-power", tagLabel: "Alimentation", name: "Chargeurs", href: "/accessories?category=Chargers" },
  { img: "/acc-manette2.png", tag: "tag-gaming", tagLabel: "Gaming", name: "Manettes", href: "/accessories?category=Controllers" },
  { img: "/acc-stockage.png", tag: "tag-storage", tagLabel: "Stockage", name: "Stockage", href: "/accessories?category=Other" },
  { img: "/acc-webcam.png", tag: "tag-video", tagLabel: "Vidéo", name: "Webcams", href: "/accessories?category=Other" },
  { img: "/acc-sacados.png", tag: "tag-transport", tagLabel: "Transport", name: "Sac à dos", href: "/accessories?category=Bags" },
  { img: "/acc-headset3.png", tag: "tag-audio", tagLabel: "Audio", name: "Casques", href: "/accessories?category=Headsets" },
  { img: "/acc-mouse3.png", tag: "tag-precision", tagLabel: "Précision", name: "Souris", href: "/accessories?category=Mice" },
  { img: "/acc-clavier3.png", tag: "tag-saisie", tagLabel: "Saisie", name: "Claviers", href: "/accessories?category=Keyboards" },
  { img: "/acc-monitor2.png", tag: "tag-display", tagLabel: "Affichage", name: "Moniteurs", href: "/accessories?category=Monitors" },
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
    <>
      <div className="circuit-overlay" />

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-text fade-up">
            <div className="hero-label">
              <div className="line" />
              <span>Republic of Computer</span>
            </div>
            <h1>
              <span className="white">L'Élite du</span><br />
              <span className="gradient">PC Portable.</span>
            </h1>
            <p className="hero-desc">
              Découvrez notre sélection de PC portables (neufs et d'occasion) testés et garantis,
              accompagnés d'accessoires premium. Livraison disponible dans les 58 wilayas.
            </p>
            <Link href="/models" className="btn-white">
              Voir les modèles
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
          <span>Défiler pour explorer</span>
          <div className="scroll-line" />
        </div>

        <div className="brand-marquee">
          <div className="marquee-track">
            {[...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="brand-item">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories" id="categories">
        <div className="category-header">
          <div className="section-label">Catégories</div>
          <h2>Explorez nos<br /><span className="gradient">univers.</span></h2>
        </div>

        <div className="category-subtitle">LAPTOP</div>
        <div className="category-subtitle-desc">Marques disponibles</div>

        <div className="brand-grid">
          {LAPTOP_GRID.map((item) => (
            <Link key={item.name} href={item.href} className="brand-card">
              <div className="brand-card-img">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="brand-card-body">
                <div className={`card-tag ${item.tag}`}><span className="dot" />{item.tagLabel}</div>
                <h3>{item.name}</h3>
                <div className="explore">EXPLORER COLLECTION →</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <div className="category-subtitle">ACCESSOIRES</div>
          <div className="category-subtitle-desc">Équipez votre setup</div>
          <div className="brand-grid">
            {ACC_GRID.map((item) => (
              <Link key={item.name} href={item.href} className="brand-card">
                <div className="brand-card-img">
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="brand-card-body">
                  <div className={`card-tag ${item.tag}`}><span className="dot" />{item.tagLabel}</div>
                  <h3>{item.name}</h3>
                  <div className="explore">EXPLORER COLLECTION →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LOOKING FOR */}
      <section className="looking-for">
        <div className="section-title fade-up">
          <span style={{ display: "block", fontSize: "clamp(0.7rem,2vw,0.85rem)", letterSpacing: "3px", color: "var(--pink)", textTransform: "uppercase", marginBottom: "0.5rem" }}>TROUVEZ VOTRE MACHINE</span>
          Que recherchez-vous <span className="gradient">?</span>
        </div>
        <div className="looking-grid">
          <Link href="/models?condition=new" className="tilt-card fade-left">
            <div className="badge badge-new">Neuf</div>
            <img src="/laptop-neuf.png" alt="Laptops Neufs" onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"; }} />
            <div className="tilt-card-body">
              <h3>Laptops Neufs</h3>
              <div className="sub">Sous emballage d'origine</div>
              <p>PC portables neufs, dernière génération, idéaux pour le travail, les études ou le gaming. Performance et fiabilité garanties.</p>
              <span className="link">
                Voir les modèles →
                <span className="arrow-circle">→</span>
              </span>
            </div>
          </Link>
          <Link href="/models?condition=refurbished" className="tilt-card fade-right">
            <div className="badge badge-refurb" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>Occasion</div>
            <img src="/laptop-occasion.png" alt="Bonne Occasion" onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"; }} />
            <div className="tilt-card-body">
              <h3>Bonne Occasion</h3>
              <div className="sub">Certifié &amp; garanti ROC DZ</div>
              <p>PC portables d'occasion en excellent état, testés et vérifiés par nos experts. Performance au meilleur prix avec la garantie ROC DZ.</p>
              <span className="link">
                Voir les modèles →
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
              {featured ? `Product of the day — Ref: ROC-${featured.id}` : "Product of the day"}
            </div>
            <h2>
              <span className="white">THE</span><br />
              <span className="gradient">PICK</span><br />
              <span className="white">OF THE</span><br />
              <span className="gradient">DAY</span>
            </h2>
            {featured && (
              <div className="pick-specs">
                {featured.processor && (
                  <div className="spec-row">
                    <span className="label">Processor</span>
                    <span className="value">{featured.processor}</span>
                  </div>
                )}
                {featured.gpu && (
                  <div className="spec-row">
                    <span className="label">Graphics</span>
                    <span className="value">{featured.gpu}</span>
                  </div>
                )}
                {featured.ram && (
                  <div className="spec-row">
                    <span className="label">Memory</span>
                    <span className="value">{featured.ram}GB {featured.ramType}</span>
                  </div>
                )}
                {featured.storage && (
                  <div className="spec-row">
                    <span className="label">Storage</span>
                    <span className="value">{featured.storage}GB {featured.storageType}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pick-image scale-in">
            <img
              src={featured?.imageUrl || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"}
              alt={featured?.title || "Pick of the day"}
            />
          </div>

          <div className="pick-info fade-right">
            <div className="status-badge">SYSTEM_STATUS: OPTIMAL</div>
            <div className="price-label">Current Value</div>
            {featured ? (
              <>
                <div className="price">{featured.price.toLocaleString("fr-DZ")} <span>DA</span></div>
                <div className="stock">{featured.stockQuantity > 0 ? `${featured.stockQuantity} in stock` : "Out of Stock"}</div>
                <Link href={`/laptop/${featured.id}`} className="btn-product">
                  View Product →
                </Link>
              </>
            ) : (
              <div className="price" style={{ fontSize: "1.5rem" }}>Loading…</div>
            )}
            <div className="pick-trust">
              <p>// AUTHENTIFIÉ ROC DZ</p>
              <p>// GARANTIE 6 MOIS</p>
              <p>// LIVRAISON EXPRESS &amp; SÉCURISÉE</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-us" id="why-us">
        <div className="glass-container fade-up">
          <div className="glass-header">
            <div className="left">
              <div className="label"><div className="line" />Our Commitments</div>
              <h2>Why choose<br /><span className="gradient">us?</span></h2>
            </div>
            <div className="right">
              Our selection of the best products, chosen for their quality and exceptional value
            </div>
          </div>
          <div className="glass-grid">
            <div className="glass-card">
              <div className="bg-num">01</div>
              <div className="icons">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3>Tested &amp; Certified PCs</h3>
              <p>Every computer is checked and tested to guarantee performance and reliability.</p>
            </div>
            <div className="glass-card">
              <div className="bg-num">02</div>
              <div className="icons">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3>ROC DZ Guarantee</h3>
              <p>Buy with confidence with a warranty on our products.</p>
            </div>
            <div className="glass-card">
              <div className="bg-num">03</div>
              <div className="icons">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3>Best value for money</h3>
              <p>New and pre-owned PCs selected to offer the best performance at the best price.</p>
            </div>
            <div className="glass-card">
              <div className="bg-num">04</div>
              <div className="icons">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3>Delivery to all 58 wilayas</h3>
              <p>Receive your order anywhere in Algeria quickly and safely.</p>
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
              <h3>Suivre ma commande</h3>
              <p>Entrez votre numéro de téléphone pour voir l'état de votre commande en temps réel.</p>
            </div>
          </div>
          <Link href="/suivi" className="tracking-cta-btn">
            🔍 Suivre ma commande
          </Link>
        </div>
      </div>

      {/* AVIS CLIENTS */}
      <section className="reviews-section">
        <div className="reviews-header fade-up">
          <div className="section-label">Avis Clients</div>
          <h2>Ils nous font <span className="gradient">confiance.</span></h2>
          <a
            href="https://maps.app.goo.gl/GaKYnMnz1H6QiXjHA"
            target="_blank"
            rel="noopener noreferrer"
            className="google-reviews-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
            Voir sur Google Maps
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
                  <div className="review-source">VIA GOOGLE</div>
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
    </>
  );
}
