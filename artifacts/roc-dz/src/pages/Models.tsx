import { useState, useEffect } from "react";
import { useListLaptops, ListLaptopsCondition } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLang } from "@/context/LangContext";

function getURLParam(key: string): string {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || "";
}

const BRANDS = ["HP", "Dell", "Lenovo", "ASUS", "MSI", "Apple", "Acer", "Samsung", "Huawei"];

export default function Models() {
  const { t } = useLang();
  const [search, setSearch] = useState(() => getURLParam("search"));
  const [condition, setCondition] = useState<ListLaptopsCondition | "all">(() => {
    const c = getURLParam("condition");
    return (c === "new" || c === "refurbished") ? c : "all";
  });
  const [inStock, setInStock] = useState(false);
  const [brand, setBrand] = useState(() => getURLParam("brand") || "all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const b = getURLParam("brand");
    const c = getURLParam("condition");
    if (b) setBrand(b);
    if (c === "new" || c === "refurbished") setCondition(c);
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

  const resetFilters = () => {
    setSearch(""); setCondition("all"); setInStock(false); setBrand("all"); setPriceRange([0, 1000000]);
  };

  const activeCount = [
    condition !== "all",
    inStock,
    brand !== "all",
    priceRange[0] !== 0 || priceRange[1] !== 1000000,
  ].filter(Boolean).length;

  return (
    <div className="relative z-10 container mx-auto px-3 sm:px-4 py-8 sm:py-12">

      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-3xl font-black">
          {brand !== "all"
            ? <><span className="text-gradient-roc">{brand}</span> <span className="text-foreground text-base sm:text-xl font-bold">— {laptops?.length ?? 0} modèle{laptops?.length !== 1 ? "s" : ""}</span></>
            : t.shop.title}
        </h1>
      </div>

      {/* Top search + filter bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder={t.shop.search}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-card/40 border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 backdrop-blur-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setFiltersOpen(o => !o)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
            filtersOpen
              ? "bg-primary/20 border-primary text-primary"
              : activeCount > 0
              ? "bg-primary/10 border-primary/50 text-primary"
              : "bg-card/40 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {filtersOpen ? (
            <span>{t.shop.close}</span>
          ) : activeCount > 0 ? (
            <span>● ● ●  <span className="bg-primary text-white text-[10px] rounded-full px-1.5 py-0.5 font-black ml-1">{activeCount}</span></span>
          ) : (
            <span>{t.shop.filters}</span>
          )}
        </button>

        {activeCount > 0 && !filtersOpen && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-all text-sm"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Collapsible filter panel */}
      {filtersOpen && (
        <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* Brand */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">{t.shop.brand}</p>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setBrand("all")}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${brand === "all" ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}
                >
                  {t.shop.all}
                </button>
                {BRANDS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBrand(brand === b ? "all" : b)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${brand === b ? "bg-primary/20 text-primary font-bold" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">{t.shop.condition}</p>
              <div className="flex flex-col gap-1">
                {([["all", t.shop.all], ["new", t.shop.newCond], ["refurbished", t.shop.refurbished]] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setCondition(val as any)}
                    className={`text-left px-2 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 ${condition === val ? "bg-white/10 font-bold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${val === "new" ? "bg-green-400" : val === "refurbished" ? "bg-orange-400" : "bg-white/30"}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">{t.shop.price}</p>
              <Slider min={0} max={1000000} step={10000} value={priceRange} onValueChange={setPriceRange} className="mb-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{(priceRange[0] / 1000).toFixed(0)}k DA</span>
                <span>{(priceRange[1] / 1000).toFixed(0)}k DA</span>
              </div>
            </div>

            {/* Stock */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Stock</p>
              <button
                onClick={() => setInStock(v => !v)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${inStock ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${inStock ? "bg-primary border-primary" : "border-white/30"}`}>
                  {inStock && <span className="text-white text-[8px] font-black">✓</span>}
                </span>
                {t.shop.inStock}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-white/10">
            <button
              onClick={() => setFiltersOpen(false)}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5 font-bold text-sm transition-all"
            >
              {t.shop.apply}
            </button>
            <button
              onClick={() => { resetFilters(); setFiltersOpen(false); }}
              className="px-5 border border-white/10 hover:border-white/30 rounded-xl text-muted-foreground hover:text-foreground text-sm transition-all"
            >
              {t.shop.reset}
            </button>
          </div>
        </div>
      )}

      {/* Active filter chips when collapsed */}
      {!filtersOpen && activeCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {condition !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
              {condition === "new" ? t.shop.newCond : t.shop.refurbished}
              <button onClick={() => setCondition("all")} className="hover:text-red-400 ml-0.5"><X className="w-3 h-3" /></button>
            </span>
          )}
          {brand !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
              {brand}
              <button onClick={() => setBrand("all")} className="hover:text-red-400 ml-0.5"><X className="w-3 h-3" /></button>
            </span>
          )}
          {inStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
              {t.shop.inStock}
              <button onClick={() => setInStock(false)} className="hover:text-red-400 ml-0.5"><X className="w-3 h-3" /></button>
            </span>
          )}
          {(priceRange[0] !== 0 || priceRange[1] !== 1000000) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
              {(priceRange[0] / 1000).toFixed(0)}k – {(priceRange[1] / 1000).toFixed(0)}k DA
              <button onClick={() => setPriceRange([0, 1000000])} className="hover:text-red-400 ml-0.5"><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Product grid — always full width */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card/30 rounded-xl p-3 border border-white/5">
              <Skeleton className="w-full aspect-[4/3] rounded-lg mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-3" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ))}
        </div>
      ) : laptops && laptops.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {laptops.map((laptop) => (
            <ProductCard key={laptop.id} laptop={laptop} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card/20 rounded-2xl border border-white/5 border-dashed">
          <Search className="w-8 h-8 text-primary mb-4 opacity-60" />
          <h3 className="text-lg font-bold mb-1">{t.shop.noResults}</h3>
          <p className="text-muted-foreground text-xs max-w-xs">{t.shop.noResultsDesc}</p>
          <Button variant="outline" size="sm" className="mt-4 border-primary/50 text-primary hover:bg-primary/20" onClick={resetFilters}>
            {t.shop.reset}
          </Button>
        </div>
      )}
    </div>
  );
}
