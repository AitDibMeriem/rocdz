import { useState, useEffect, useMemo } from "react";
import { useListLaptops, ListLaptopsCondition } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLang } from "@/context/LangContext";
import { Link } from "wouter";

function getURLParam(key: string) {
  return new URLSearchParams(window.location.search).get(key) || "";
}

const BRANDS = ["HP", "Dell", "Lenovo", "ASUS", "MSI", "Apple", "Acer", "Samsung", "Huawei"];
const BRAND_LOGOS: Record<string, string> = {
  HP: "/logo-hp.svg",
  Dell: "/logo-dell.svg",
  Lenovo: "/brand-lenovo-logo.png",
  ASUS: "/logo-asus.svg",
  MSI: "/logo-msi.svg",
  Apple: "/logo-apple.svg",
  Acer: "/logo-acer.svg",
  Samsung: "/logo-samsung.svg",
  Huawei: "/logo-huawei.svg",
};

function usePerPage() {
  const [perPage, setPerPage] = useState(() => {
    const w = window.innerWidth;
    return w < 640 ? 6 : w < 1024 ? 9 : 12;
  });
  useEffect(() => {
    const h = () => {
      const w = window.innerWidth;
      setPerPage(w < 640 ? 6 : w < 1024 ? 9 : 12);
    };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return perPage;
}

type Draft = { condition: ListLaptopsCondition | "all"; brand: string; priceRange: number[]; inStock: boolean };

export default function Models() {
  const { t, isRTL } = useLang();
  const perPage = usePerPage();

  const [search, setSearch] = useState(() => getURLParam("search"));
  const [condition, setCondition] = useState<ListLaptopsCondition | "all">(() => {
    const c = getURLParam("condition");
    return (c === "new" || c === "refurbished") ? c : "all";
  });
  const [inStock, setInStock] = useState(false);
  const [brand, setBrand] = useState(() => getURLParam("brand") || "all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [draft, setDraft] = useState<Draft>(() => ({
    condition: (getURLParam("condition") as ListLaptopsCondition | "all") || "all",
    brand: getURLParam("brand") || "all",
    priceRange: [0, 1000000],
    inStock: false,
  }));

  useEffect(() => {
    const b = getURLParam("brand");
    const c = getURLParam("condition");
    if (b) { setBrand(b); setDraft(d => ({ ...d, brand: b })); }
    if (c === "new" || c === "refurbished") { setCondition(c); setDraft(d => ({ ...d, condition: c })); }
  }, []);

  const queryParams = {
    ...(search ? { search } : {}),
    ...(condition !== "all" ? { condition: condition as ListLaptopsCondition } : {}),
    ...(inStock ? { inStock: true } : {}),
    ...(brand !== "all" ? { brand } : {}),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  };

  const { data: laptops, isLoading } = useListLaptops(queryParams);

  const sortedLaptops = useMemo(() => {
    if (!laptops) return [];
    if (sortBy === "price-asc") return [...laptops].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return [...laptops].sort((a, b) => b.price - a.price);
    return laptops;
  }, [laptops, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedLaptops.length / perPage));
  const paged = sortedLaptops.slice((page - 1) * perPage, page * perPage);

  const resetFilters = () => {
    setSearch(""); setCondition("all"); setInStock(false); setBrand("all"); setPriceRange([0, 1000000]);
    setDraft({ condition: "all", brand: "all", priceRange: [0, 1000000], inStock: false });
    setPage(1);
  };

  const applyDraft = () => {
    setCondition(draft.condition); setBrand(draft.brand);
    setPriceRange(draft.priceRange); setInStock(draft.inStock);
    setFiltersOpen(false); setPage(1);
  };

  const activeCount = [condition !== "all", inStock, brand !== "all",
    priceRange[0] !== 0 || priceRange[1] !== 1000000].filter(Boolean).length;

  const FilterContent = () => (
    <div>
      {/* Brand with logos */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: "0.75rem" }}>{t.shop.brand}</p>
        <button
          onClick={() => setDraft(d => ({ ...d, brand: "all" }))}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", borderRadius: "8px", width: "100%", border: "none", cursor: "pointer", marginBottom: "2px", transition: "all 0.15s", ...(draft.brand === "all" ? { background: "rgba(232,33,160,0.15)", color: "var(--pink)" } : { background: "transparent", color: "rgba(255,255,255,0.4)" }) }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: draft.brand === "all" ? 700 : 400 }}>{t.shop.all}</span>
        </button>
        {BRANDS.map(b => (
          <button
            key={b}
            onClick={() => setDraft(d => ({ ...d, brand: d.brand === b ? "all" : b }))}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 10px", borderRadius: "8px", width: "100%", border: "none", cursor: "pointer", marginBottom: "2px", transition: "all 0.15s", ...(draft.brand === b ? { background: "rgba(232,33,160,0.12)", borderLeft: "2px solid var(--pink)" } : { background: "transparent" }) }}
          >
            <img
              src={BRAND_LOGOS[b]}
              alt={b}
              className="brand-logo"
              style={{ height: "16px", width: "36px", objectFit: "contain", opacity: draft.brand === b ? 1 : 0.5, transition: "opacity 0.15s" }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <span style={{ fontSize: "0.78rem", fontWeight: draft.brand === b ? 700 : 400, color: draft.brand === b ? "var(--pink)" : "rgba(255,255,255,0.55)" }}>{b}</span>
          </button>
        ))}
      </div>

      {/* Condition */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: "0.75rem" }}>{t.shop.condition}</p>
        {(["all", "new", "refurbished"] as const).map(val => {
          const label = val === "all" ? t.shop.all : val === "new" ? t.shop.newCond : t.shop.refurbished;
          const dot = val === "new" ? "#4ade80" : val === "refurbished" ? "#fb923c" : "rgba(255,255,255,0.25)";
          return (
            <button
              key={val}
              onClick={() => setDraft(d => ({ ...d, condition: val }))}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "8px", width: "100%", border: "none", cursor: "pointer", marginBottom: "2px", transition: "all 0.15s", ...(draft.condition === val ? { background: "rgba(255,255,255,0.07)" } : { background: "transparent" }) }}
            >
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: dot, flexShrink: 0 }} />
              <span style={{ fontSize: "0.8rem", fontWeight: draft.condition === val ? 700 : 400, color: draft.condition === val ? "#fff" : "rgba(255,255,255,0.45)" }}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Price range */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: "0.75rem" }}>{t.shop.price}</p>
        <Slider min={0} max={1000000} step={10000} value={draft.priceRange} onValueChange={v => setDraft(d => ({ ...d, priceRange: v }))} className="mb-2" />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
          <span>{(draft.priceRange[0] / 1000).toFixed(0)}k DA</span>
          <span>{(draft.priceRange[1] / 1000).toFixed(0)}k DA</span>
        </div>
      </div>

      {/* Stock */}
      <div>
        <p style={{ fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: "0.75rem" }}>Stock</p>
        <button
          onClick={() => setDraft(d => ({ ...d, inStock: !d.inStock }))}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", borderRadius: "8px", border: "none", cursor: "pointer", transition: "all 0.15s", ...(draft.inStock ? { background: "rgba(232,33,160,0.1)", color: "var(--pink)" } : { background: "transparent", color: "rgba(255,255,255,0.45)" }) }}
        >
          <span style={{ width: "16px", height: "16px", borderRadius: "4px", border: `1.5px solid ${draft.inStock ? "var(--pink)" : "rgba(255,255,255,0.25)"}`, background: draft.inStock ? "var(--pink)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
            {draft.inStock && <span style={{ color: "white", fontSize: "0.58rem", fontWeight: 900 }}>✓</span>}
          </span>
          <span style={{ fontSize: "0.8rem", fontWeight: draft.inStock ? 700 : 400 }}>{t.shop.inStock}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "2rem 1rem 3rem" }}>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>

          {/* Desktop sidebar — hidden on mobile via class */}
          <aside className="shop-sidebar">
            <div style={{ position: "sticky", top: "5.5rem", width: "210px", flexShrink: 0, background: "rgba(255,255,255,0.025)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <SlidersHorizontal size={14} style={{ color: "var(--pink)" }} />
                  Filtres
                </span>
                {activeCount > 0 && (
                  <button onClick={resetFilters} style={{ fontSize: "0.68rem", color: "var(--pink)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Reset</button>
                )}
              </div>
              <FilterContent />
              <button onClick={applyDraft} style={{ width: "100%", background: "linear-gradient(135deg,#e821a0,#a855f7)", color: "white", border: "none", borderRadius: "10px", padding: "0.65rem", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", marginTop: "1rem", letterSpacing: "0.3px" }}>
                {t.shop.apply}
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "clamp(1.1rem,3vw,1.75rem)", fontWeight: 900 }}>
                {brand !== "all" ? (
                  <><span style={{ background: "linear-gradient(135deg,#e821a0,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{brand}</span>{" "}
                    <span style={{ fontSize: "0.55em", fontWeight: 600, color: "var(--text-muted)" }}>— {laptops?.length ?? 0} modèle{(laptops?.length ?? 0) !== 1 ? "s" : ""}</span></>
                ) : t.shop.title}
              </h1>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", color: "var(--text-muted)", textDecoration: "none", padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.15s" }} className="shop-back-btn">
                <Home size={13} /> Accueil
              </Link>
            </div>

            {/* Search + sort + mobile filter toggle */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
              {/* Row 1: search input (full width) */}
              <div style={{ position: "relative" }}>
                <Search style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", width: "15px", height: "15px", color: "rgba(255,255,255,0.35)" }} />
                <input
                  placeholder={t.shop.search}
                  style={{ width: "100%", paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px", fontSize: "0.83rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "11px", color: "var(--text)", outline: "none", transition: "border 0.2s", boxSizing: "border-box" }}
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>

              {/* Row 2: sort (left) + filter button (right, mobile only) */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select
                  value={sortBy}
                  onChange={e => { setSortBy(e.target.value as "default" | "price-asc" | "price-desc"); setPage(1); }}
                  style={{ flex: 1, padding: "0 12px", height: "38px", borderRadius: "11px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--text)", fontSize: "0.8rem", cursor: "pointer", outline: "none" }}
                >
                  <option value="default">Trier par</option>
                  <option value="price-asc">Prix ↑ croissant</option>
                  <option value="price-desc">Prix ↓ décroissant</option>
                </select>

                <button
                  className="shop-filter-toggle"
                  onClick={() => setFiltersOpen(o => !o)}
                  style={{ display: "none", alignItems: "center", gap: "6px", padding: "0 14px", height: "38px", borderRadius: "11px", border: "1px solid", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.15s", flexShrink: 0, ...(filtersOpen || activeCount > 0 ? { background: "rgba(232,33,160,0.12)", borderColor: "rgba(232,33,160,0.35)", color: "var(--pink)" } : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.5)" }) }}
                >
                  <SlidersHorizontal size={14} />
                  {t.shop.filters}
                  {activeCount > 0 && <span style={{ background: "var(--pink)", color: "white", borderRadius: "50%", fontSize: "0.58rem", fontWeight: 900, width: "15px", height: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>{activeCount}</span>}
                </button>
              </div>
            </div>

            {/* Active filter chips */}
            {activeCount > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                {condition !== "all" && <Chip label={condition === "new" ? t.shop.newCond : t.shop.refurbished} onRemove={() => { setCondition("all"); setDraft(d => ({ ...d, condition: "all" })); }} />}
                {brand !== "all" && <Chip label={brand} onRemove={() => { setBrand("all"); setDraft(d => ({ ...d, brand: "all" })); }} />}
                {(priceRange[0] !== 0 || priceRange[1] !== 1000000) && <Chip label={`${(priceRange[0]/1000).toFixed(0)}k–${(priceRange[1]/1000).toFixed(0)}k DA`} onRemove={() => { setPriceRange([0,1000000]); setDraft(d => ({ ...d, priceRange: [0,1000000] })); }} />}
                {inStock && <Chip label={t.shop.inStock} onRemove={() => { setInStock(false); setDraft(d => ({ ...d, inStock: false })); }} />}
              </div>
            )}

            {/* Mobile filter — left side panel */}
            {filtersOpen && (
              <>
                <div className="shop-mobile-overlay" onClick={() => setFiltersOpen(false)} />
                <div className="shop-mobile-panel">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text)" }}>{isRTL ? "الفلاتر" : "Filtres"}</span>
                    <button onClick={() => setFiltersOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px", display: "flex" }}>
                      ✕
                    </button>
                  </div>
                  <FilterContent />
                  <div style={{ display: "flex", gap: "0.6rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "0.5rem" }}>
                    <button onClick={applyDraft} style={{ flex: 1, background: "linear-gradient(135deg,#e821a0,#a855f7)", color: "white", border: "none", borderRadius: "10px", padding: "0.7rem", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                      {t.shop.apply}
                    </button>
                    <button onClick={() => { resetFilters(); setFiltersOpen(false); }} style={{ padding: "0 1rem", background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "0.82rem" }}>
                      {t.shop.reset}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Grid */}
            {isLoading ? (
              <div className="shop-grid">
                {Array.from({ length: perPage }).map((_, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "14px", padding: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <Skeleton style={{ width: "100%", aspectRatio: "4/3", borderRadius: "10px", marginBottom: "10px" }} />
                    <Skeleton style={{ height: "13px", width: "75%", marginBottom: "7px", borderRadius: "4px" }} />
                    <Skeleton style={{ height: "11px", width: "50%", borderRadius: "4px" }} />
                  </div>
                ))}
              </div>
            ) : paged.length > 0 ? (
              <>
                <div className="shop-grid">
                  {paged.map(laptop => <ProductCard key={laptop.id} laptop={laptop} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.4rem", marginTop: "2rem", flexWrap: "wrap" }}>
                    <PageBtn onClick={() => { setPage(p => Math.max(1,p-1)); window.scrollTo({top:0,behavior:"smooth"}); }} disabled={page===1}><ChevronLeft size={14}/></PageBtn>
                    {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
                      <PageBtn key={p} active={p===page} onClick={() => { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); }}>{p}</PageBtn>
                    ))}
                    <PageBtn onClick={() => { setPage(p => Math.min(totalPages,p+1)); window.scrollTo({top:0,behavior:"smooth"}); }} disabled={page===totalPages}><ChevronRight size={14}/></PageBtn>
                  </div>
                )}
                <p style={{ textAlign:"center", fontSize:"0.72rem", color:"rgba(255,255,255,0.3)", marginTop:"0.6rem" }}>
                  {(page-1)*perPage+1}–{Math.min(page*perPage,sortedLaptops.length)} / {sortedLaptops.length} produit{sortedLaptops.length!==1?"s":""}
                </p>
              </>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"4rem 1rem", textAlign:"center", background:"rgba(255,255,255,0.02)", borderRadius:"16px", border:"1px dashed rgba(255,255,255,0.07)" }}>
                <Search style={{ width:"30px",height:"30px",color:"var(--pink)",marginBottom:"0.75rem",opacity:0.6 }} />
                <h3 style={{ fontSize:"1rem",fontWeight:700,marginBottom:"0.4rem" }}>{t.shop.noResults}</h3>
                <p style={{ color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",maxWidth:"260px",marginBottom:"1rem" }}>{t.shop.noResultsDesc}</p>
                <button onClick={resetFilters} style={{ padding:"0.5rem 1.25rem",borderRadius:"10px",background:"none",border:"1px solid rgba(232,33,160,0.4)",color:"var(--pink)",cursor:"pointer",fontSize:"0.82rem",fontWeight:600 }}>
                  {t.shop.reset}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:"4px",padding:"3px 10px",borderRadius:"999px",background:"rgba(232,33,160,0.1)",border:"1px solid rgba(232,33,160,0.28)",color:"var(--pink)",fontSize:"0.72rem",fontWeight:600 }}>
      {label}
      <button onClick={onRemove} style={{ background:"none",border:"none",cursor:"pointer",color:"inherit",display:"flex",padding:0,lineHeight:1 }}><X size={11}/></button>
    </span>
  );
}

function PageBtn({ onClick, disabled, active, children }: { onClick:()=>void; disabled?:boolean; active?:boolean; children:React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ minWidth:"32px",height:"32px",padding:"0 6px",borderRadius:"8px",border:"1px solid",fontWeight:active?800:500,fontSize:"0.8rem",cursor:disabled?"default":"pointer",transition:"all 0.15s",opacity:disabled?0.35:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"2px",...(active?{background:"var(--pink)",borderColor:"var(--pink)",color:"white"}:{background:"transparent",borderColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)"})}}>
      {children}
    </button>
  );
}
