import { useState } from "react";
import { useListLaptops, useGetLaptopStats, ListLaptopsCondition } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Laptop as LaptopIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Models() {
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState<ListLaptopsCondition | "all">("all");
  const [inStock, setInStock] = useState(false);
  const [brand, setBrand] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  // Construct query params
  const queryParams = {
    ...(search ? { search } : {}),
    ...(condition !== "all" ? { condition: condition as ListLaptopsCondition } : {}),
    ...(inStock ? { inStock: true } : {}),
    ...(brand !== "all" ? { brand } : {}),
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  };

  const { data: laptops, isLoading } = useListLaptops(queryParams);
  const { data: stats } = useGetLaptopStats();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Stats Bar */}
      {stats && (
        <div className="bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 flex flex-wrap gap-8 items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <LaptopIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-black">{stats.totalLaptops}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Models</div>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{stats.inStock}</div>
              <div className="text-xs text-muted-foreground uppercase">In Stock</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-xl font-bold">{stats.newCount}</div>
              <div className="text-xs text-muted-foreground uppercase">New</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-xl font-bold text-orange-400">{stats.refurbishedCount}</div>
              <div className="text-xs text-muted-foreground uppercase">Refurbished</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-8 bg-card/30 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" /> Filters
              </h3>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search models..." 
                  className="pl-9 bg-black/50 border-white/10 focus-visible:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Condition</Label>
              <RadioGroup value={condition} onValueChange={(val) => setCondition(val as any)} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="cond-all" />
                  <Label htmlFor="cond-all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="cond-new" />
                  <Label htmlFor="cond-new" className="text-green-400">Brand New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="refurbished" id="cond-refurb" />
                  <Label htmlFor="cond-refurb" className="text-orange-400">Refurbished</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Availability</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  checked={inStock} 
                  onCheckedChange={(checked) => setInStock(checked as boolean)}
                />
                <Label htmlFor="in-stock">In Stock Only</Label>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Price Range (DA)</Label>
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
              Reset Filters
            </Button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card/30 rounded-xl p-4 border border-white/5">
                  <Skeleton className="w-full aspect-[4/3] rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              ))}
            </div>
          ) : laptops && laptops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {laptops.map((laptop) => (
                <ProductCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card/30 rounded-3xl border border-white/5 border-dashed">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No models found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any laptops matching your current filters. Try adjusting your search criteria or resetting filters.
              </p>
              <Button 
                variant="outline" 
                className="mt-6 border-primary/50 text-primary hover:bg-primary/20"
                onClick={() => {
                  setSearch("");
                  setCondition("all");
                  setInStock(false);
                  setBrand("all");
                  setPriceRange([0, 1000000]);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
