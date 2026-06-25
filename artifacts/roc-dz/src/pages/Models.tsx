import { useState, useEffect } from "react";
import { useListLaptops, ListLaptopsCondition } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function getURLParam(key: string): string {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || "";
}

const BRANDS = ["HP", "Dell", "Lenovo", "ASUS", "MSI", "Apple", "Acer", "Samsung", "Huawei"];

export default function Models() {
  const [search, setSearch] = useState(() => getURLParam("search"));
  const [condition, setCondition] = useState<ListLaptopsCondition | "all">(() => {
    const c = getURLParam("condition");
    return (c === "new" || c === "refurbished") ? c : "all";
  });
  const [inStock, setInStock] = useState(false);
  const [brand, setBrand] = useState(() => getURLParam("brand") || "all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

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

  return (
    <div className="relative z-10 container mx-auto px-3 sm:px-4 py-8 sm:py-12">
      {/* Page header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-3xl font-black">
          {brand !== "all" ? <><span className="text-gradient-roc">{brand}</span> <span className="text-foreground text-base sm:text-xl font-bold">— {laptops?.length ?? 0} modèle{laptops?.length !== 1 ? "s" : ""}</span></> : "Tous les modèles"}
        </h1>
      </div>

      <div className="flex flex-row gap-2 sm:gap-4 lg:gap-8 items-start">

        {/* Sidebar — ALWAYS visible on LEFT, compact on mobile */}
        <aside className="flex-shrink-0 w-[110px] sm:w-44 lg:w-64">
          <div className="sticky top-20 bg-card/40 backdrop-blur-xl border border-white/8 rounded-2xl overflow-hidden">

            {/* Search */}
            <div className="p-2 sm:p-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <input
                  placeholder="Rechercher..."
                  className="w-full pl-7 pr-2 py-1.5 text-xs bg-black/40 border border-white/8 rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Brands */}
            <div className="p-2 sm:p-3 border-b border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Marque</p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setBrand("all")}
                  className={`w-full text-left px-2 py-1 rounded-lg text-xs font-semibold transition-all ${brand === "all" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-white"}`}
                >
                  Toutes
                </button>
                {BRANDS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBrand(brand === b ? "all" : b)}
                    className={`w-full text-left px-2 py-1 rounded-lg text-xs font-medium transition-all ${brand === b ? "bg-primary/20 text-primary font-bold" : "text-muted-foreground hover:text-white"}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="p-2 sm:p-3 border-b border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">État</p>
              <div className="flex flex-col gap-1">
                {[["all", "Tous", "text-foreground"], ["new", "Neuf", "text-green-400"], ["refurbished", "Occasion", "text-orange-400"]].map(([val, label, color]) => (
                  <button
                    key={val}
                    onClick={() => setCondition(val as any)}
                    className={`w-full text-left px-2 py-1 rounded-lg text-xs transition-all flex items-center gap-1.5 ${condition === val ? "bg-white/8 font-bold " + color : "text-muted-foreground hover:text-white"}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${val === "new" ? "bg-green-400" : val === "refurbished" ? "bg-orange-400" : "bg-white/30"}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div className="p-2 sm:p-3 border-b border-white/5">
              <button
                onClick={() => setInStock(v => !v)}
                className={`w-full text-left px-2 py-1 rounded-lg text-xs flex items-center gap-2 transition-all ${inStock ? "text-primary" : "text-muted-foreground hover:text-white"}`}
              >
                <span className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center ${inStock ? "bg-primary border-primary" : "border-white/30"}`}>
                  {inStock && <span className="text-white text-[8px] font-bold">✓</span>}
                </span>
                En stock
              </button>
            </div>

            {/* Price */}
            <div className="p-2 sm:p-3 border-b border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Prix (DA)</p>
              <Slider
                min={0} max={1000000} step={10000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-2"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{(priceRange[0] / 1000).toFixed(0)}k</span>
                <span>{(priceRange[1] / 1000).toFixed(0)}k</span>
              </div>
            </div>

            {/* Reset */}
            <div className="p-2 sm:p-3">
              <button
                onClick={resetFilters}
                className="w-full text-center text-[10px] text-muted-foreground hover:text-primary transition-colors py-1 font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid — always on the RIGHT */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card/30 rounded-xl p-3 border border-white/5">
                  <Skeleton className="w-full aspect-[4/3] rounded-lg mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-3" />
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ))}
            </div>
          ) : laptops && laptops.length > 0 ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
              {laptops.map((laptop) => (
                <ProductCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-card/20 rounded-2xl border border-white/5 border-dashed">
              <Search className="w-8 h-8 text-primary mb-4 opacity-60" />
              <h3 className="text-lg font-bold mb-1">Aucun modèle trouvé</h3>
              <p className="text-muted-foreground text-xs max-w-xs">
                Essayez de modifier vos critères ou réinitialisez les filtres.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-primary/50 text-primary hover:bg-primary/20"
                onClick={resetFilters}
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
