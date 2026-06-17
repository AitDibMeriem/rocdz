import { useEffect, useRef } from "react";
import { useGetFeaturedLaptop } from "@workspace/api-client-react";
import { Link } from "wouter";

function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animId: number;

    let width = 0, height = 0;

    interface Particle {
      x: number; y: number;
      size: number;
      speedX: number; speedY: number;
      opacity: number;
    }
    interface Wave {
      y: number; amplitude: number;
      frequency: number; speed: number; phase: number;
    }

    let particles: Particle[] = [];
    let waves: Wave[] = [];

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = [];
      waves = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      for (let i = 0; i < 3; i++) {
        waves.push({
          y: height * 0.3 + i * 150,
          amplitude: 50 + i * 20,
          frequency: 0.002 + i * 0.001,
          speed: 0.01 + i * 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function drawWave(wave: Wave, time: number) {
      ctx.beginPath();
      ctx.moveTo(0, wave.y);
      for (let x = 0; x < width; x += 2) {
        const y = wave.y + Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(184,41,221,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    const mouse = { x: -9999, y: -9999 };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    function animate(time: number) {
      ctx.clearRect(0, 0, width, height);

      waves.forEach(w => drawWave(w, time * 0.001));

      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 120;
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        const nearMouse = dist < repelRadius;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nearMouse ? p.size * 1.8 : p.size, 0, Math.PI * 2);
        ctx.fillStyle = nearMouse ? `rgba(233,30,140,${Math.min(1, p.opacity * 2)})` : `rgba(233,30,140,${p.opacity})`;
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x, dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(184,41,221,${(1 - dist / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    }

    init();
    animId = requestAnimationFrame(animate);
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none",
      }}
    />
  );
}

const BRANDS = ["DELL", "HP", "LENOVO", "ASUS", "MSI", "APPLE", "ACER"];

const LAPTOP_CAROUSEL = [
  { img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80", tag: "tag-fiabilite", tagLabel: "Fiabilité", name: "Dell", href: "/models?brand=Dell" },
  { img: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400&q=80", tag: "tag-pro", tagLabel: "Pro", name: "HP", href: "/models?brand=HP" },
  { img: "https://images.unsplash.com/photo-1527434065213-849f5e9607ea?w=400&q=80", tag: "tag-performance", tagLabel: "Performance", name: "Lenovo", href: "/models?brand=Lenovo" },
  { img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80", tag: "tag-gaming", tagLabel: "Gaming", name: "ASUS", href: "/models?brand=ASUS" },
  { img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", tag: "tag-polyvalent", tagLabel: "Polyvalent", name: "Acer", href: "/models?brand=Acer" },
  { img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80", tag: "tag-gaming", tagLabel: "Gaming", name: "MSI", href: "/models?brand=MSI" },
  { img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80", tag: "tag-premium", tagLabel: "Premium", name: "Apple", href: "/models?brand=Apple" },
];

const ACC_CAROUSEL = [
  { img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", tag: "tag-saisie", tagLabel: "Saisie", name: "Keyboards" },
  { img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80", tag: "tag-precision", tagLabel: "Précision", name: "Mice" },
  { img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", tag: "tag-audio", tagLabel: "Audio", name: "Headsets" },
  { img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80", tag: "tag-display", tagLabel: "Display", name: "Monitors" },
  { img: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&q=80", tag: "tag-gaming", tagLabel: "Gaming", name: "Controllers" },
  { img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", tag: "tag-transport", tagLabel: "Transport", name: "Bags" },
  { img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80", tag: "tag-energie", tagLabel: "Énergie", name: "Chargers" },
  { img: "https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=400&q=80", tag: "tag-connectique", tagLabel: "Connectique", name: "Hubs & Adapters" },
];

export default function Home() {
  const { data: featured } = useGetFeaturedLaptop();
  const laptopCarouselRef = useRef<HTMLDivElement>(null);
  const accCarouselRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, delta: number) => {
    ref.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

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
      <BgCanvas />
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
              <span className="white">The Elite of</span><br />
              <span className="gradient">Laptops.</span>
            </h1>
            <p className="hero-desc">
              Discover our selection of laptops (new and pre-owned) tested and guaranteed, with premium accessories.
              Delivery available across all 58 wilayas.
            </p>
            <Link href="/models" className="btn-white">
              View models
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
          <span>Scroll to explore</span>
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
          <div className="section-label">Categories</div>
          <h2>Explore our<br /><span className="gradient">collections.</span></h2>
        </div>

        <div className="category-subtitle">Laptop</div>
        <div className="category-subtitle-desc">Available brands</div>

        <div className="carousel-container">
          <button className="carousel-nav-btn prev" onClick={() => scroll(laptopCarouselRef, -300)}>‹</button>
          <div className="carousel" ref={laptopCarouselRef}>
            {LAPTOP_CAROUSEL.map((item) => (
              <Link key={item.name} href={item.href} className="carousel-card">
                <img src={item.img} alt={item.name} />
                <div className="carousel-card-body">
                  <div className={`card-tag ${item.tag}`}><span className="dot" />{item.tagLabel}</div>
                  <h3>{item.name}</h3>
                  <div className="explore">Explore Collection →</div>
                </div>
              </Link>
            ))}
          </div>
          <button className="carousel-nav-btn next" onClick={() => scroll(laptopCarouselRef, 300)}>›</button>
        </div>

        <div style={{ marginTop: "4rem" }}>
          <div className="category-subtitle">Accessories</div>
          <div className="category-subtitle-desc">Equip your setup</div>
          <div className="carousel-container">
            <button className="carousel-nav-btn prev" onClick={() => scroll(accCarouselRef, -300)}>‹</button>
            <div className="carousel" ref={accCarouselRef}>
              {ACC_CAROUSEL.map((item) => (
                <Link key={item.name} href={`/accessories?category=${encodeURIComponent(item.name)}`} className="carousel-card">
                  <img src={item.img} alt={item.name} />
                  <div className="carousel-card-body">
                    <div className={`card-tag ${item.tag}`}><span className="dot" />{item.tagLabel}</div>
                    <h3>{item.name}</h3>
                    <div className="explore">Explore Collection →</div>
                  </div>
                </Link>
              ))}
            </div>
            <button className="carousel-nav-btn next" onClick={() => scroll(accCarouselRef, 300)}>›</button>
          </div>
        </div>
      </section>

      {/* LOOKING FOR */}
      <section className="looking-for">
        <div className="section-title fade-up">
          What are you looking for <span className="gradient">?</span>
        </div>
        <div className="looking-grid">
          <Link href="/models?condition=new" className="tilt-card fade-left">
            <div className="badge badge-new">New</div>
            <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80" alt="New Laptops" />
            <div className="tilt-card-body">
              <h3>New Laptops</h3>
              <div className="sub">Original sealed packaging</div>
              <p>Brand new laptops, latest generation, ideal for work, studies or gaming. Performance and reliability guaranteed.</p>
              <span className="link">
                View models →
                <span className="arrow-circle">→</span>
              </span>
            </div>
          </Link>
          <Link href="/models?condition=refurbished" className="tilt-card fade-right">
            <div className="badge badge-refurb">Refurbished</div>
            <img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80" alt="Pre-Owned" />
            <div className="tilt-card-body">
              <h3>Certified Pre-Owned</h3>
              <div className="sub">Certified &amp; guaranteed by ROC DZ</div>
              <p>Pre-owned laptops in excellent and good condition, tested and verified by our experts. Performance at the best price with ROC DZ guarantee.</p>
              <span className="link">
                View models →
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
