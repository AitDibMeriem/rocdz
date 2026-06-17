import { useState, useEffect } from "react";
import { useListLaptops, ListLaptopsCondition } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function getURLParam(key: string): string {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || "";
}

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

  const BRANDS = ["HP", "Dell", "Lenovo", "ASUS", "MSI", "Apple", "Acer"];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-8 bg-card/30 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> Filtres
              </h3>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un modèle..."
                  className="pl-9 bg-black/50 border-white/10 focus-visible:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Marque</Label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setBrand("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${brand === "all" ? "bg-primary/20 border-primary/50 text-primary" : "border-white/10 text-muted-foreground hover:border-primary/30"}`}
                >
                  Tous
                </button>
                {BRANDS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBrand(brand === b ? "all" : b)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${brand === b ? "bg-primary/20 border-primary/50 text-primary" : "border-white/10 text-muted-foreground hover:border-primary/30"}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">État</Label>
              <RadioGroup value={condition} onValueChange={(val) => setCondition(val as any)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="cond-all" />
                  <Label htmlFor="cond-all">Tous</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="cond-new" />
                  <Label htmlFor="cond-new" className="text-green-400">Neuf</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="refurbished" id="cond-refurb" />
                  <Label htmlFor="cond-refurb" className="text-orange-400">Occasion</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Disponibilité</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={inStock}
                  onCheckedChange={(checked) => setInStock(checked as boolean)}
                />
                <Label htmlFor="in-stock">En stock uniquement</Label>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Fourchette de prix (DA)</Label>
              <Slider
                min={0}
                max={1000000}
                step={10000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{priceRange[0].toLocaleString()} DA</span>
                <span>{priceRange[1].toLocaleString()} DA</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-white/10 hover:bg-white/5"
              onClick={() => {
                setSearch("");
                setCondition("all");
                setInStock(false);
                setBrand("all");
                setPriceRange([0, 1000000]);
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {brand !== "all" && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-2xl font-black">{brand}</span>
              <span className="text-muted-foreground">— {laptops?.length ?? 0} modèle{laptops?.length !== 1 ? "s" : ""}</span>
              <button onClick={() => setBrand("all")} className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors border border-white/10 rounded-full px-3 py-1">
                Clear ✕
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card/30 rounded-xl p-3 sm:p-4 border border-white/5">
                  <Skeleton className="w-full aspect-[4/3] rounded-lg mb-3" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-full" />
                  </div>
                  <Skeleton className="h-8 w-full mt-3" />
                </div>
              ))}
            </div>
          ) : laptops && laptops.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {laptops.map((laptop) => (
                <ProductCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card/30 rounded-3xl border border-white/5 border-dashed">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Aucun modèle trouvé</h3>
              <p className="text-muted-foreground max-w-md">
                Aucun laptop ne correspond à vos filtres. Essayez de modifier vos critères ou réinitialisez les filtres.
              </p>
              <Button
                variant="outline"
                className="mt-6 border-primary/50 text-primary hover:bg-primary/20"
                onClick={() => { setSearch(""); setCondition("all"); setInStock(false); setBrand("all"); setPriceRange([0, 1000000]); }}
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
