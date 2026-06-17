import { useState } from "react";
import { useListAccessories } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";

const CATEGORIES = ["Tous", "Keyboards", "Mice", "Headsets", "Monitors", "Controllers", "Bags", "Chargers", "Hubs & Adapters", "Other"];

const FALLBACK_IMAGES: Record<string, string> = {
  "Keyboards": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
  "Mice": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
  "Headsets": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
  "Monitors": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80",
  "Controllers": "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&q=80",
  "Bags": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  "Chargers": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80",
  "Hubs & Adapters": "https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=400&q=80",
};

export default function Accessories() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addItem } = useCart();

  const handleAddToCart = (acc: { id: number; name: string; price: number; imageUrl?: string | null; category: string }) => {
    addItem({ laptopId: acc.id + 100000, title: acc.name, price: acc.price, advance: 0, qty: 1, imageUrl: acc.imageUrl, brand: acc.category, isLaptop: false });
    setAddedIds(prev => new Set(prev).add(acc.id));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(acc.id); return n; }), 2000);
  };

  const { data: accessories, isLoading } = useListAccessories(
    category !== "Tous" ? { category } : {}
  );

  const filtered = (accessories || []).filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <div className="section-label mb-2">Collections</div>
        <h1 className="text-4xl font-black mb-3">
          Accessoires <span className="text-gradient-roc">Premium</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Équipez votre setup avec nos accessoires sélectionnés pour la performance et le style.
        </p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un accessoire..."
            className="pl-9 bg-black/50 border-white/10 focus-visible:ring-primary"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
              category === cat
                ? "bg-primary/20 border-primary/50 text-primary"
                : "border-white/10 text-muted-foreground hover:border-primary/30 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-card/30 rounded-xl p-4 border border-white/5">
              <Skeleton className="w-full aspect-square rounded-lg mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card/20 rounded-3xl border border-white/5 border-dashed">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-5">
            <Search className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Aucun accessoire trouvé</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            {accessories?.length === 0
              ? "Aucun accessoire en stock pour le moment. Revenez bientôt !"
              : "Essayez une autre catégorie ou modifiez votre recherche."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(acc => (
            <div key={acc.id} className="bg-card/30 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-[0_0_30px_rgba(233,30,140,0.1)] group">
              <div className="aspect-square overflow-hidden bg-black/30">
                <img
                  src={acc.imageUrl || FALLBACK_IMAGES[acc.category] || "https://placehold.co/400x400/1a1a1a/e91e8c?text=ROC+DZ"}
                  alt={acc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{acc.category}</div>
                <h3 className="font-bold text-base mb-2 line-clamp-2">{acc.name}</h3>
                {acc.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{acc.description}</p>}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-primary font-black text-lg">{acc.price.toLocaleString("fr-DZ")} DA</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${acc.stock > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {acc.stock > 0 ? `${acc.stock} en stock` : "Rupture"}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(acc)}
                  disabled={acc.stock === 0}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    addedIds.has(acc.id)
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : acc.stock === 0
                      ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                      : "bg-primary/90 hover:bg-primary text-white border border-primary/50 hover:shadow-[0_0_20px_rgba(233,30,140,0.3)]"
                  }`}
                >
                  {addedIds.has(acc.id) ? <><Check className="w-4 h-4" /> Ajouté !</> : <><ShoppingCart className="w-4 h-4" /> Ajouter au panier</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
