import { useState } from "react";
import { useListAccessories, Accessory } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingCart, Check, X, Tag, Shield, Cpu, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useLocation } from "wouter";
import { useLang } from "@/context/LangContext";

const CATEGORIES_FR = ["Tous", "Keyboards", "Mice", "Headsets", "Monitors", "Controllers", "Bags", "Chargers", "Hubs & Adapters", "Other"];

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const FALLBACK_IMAGES: Record<string, string> = {
  "Keyboards": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
  "Mice": `${BASE_URL}/img-mouse.png`,
  "Headsets": `${BASE_URL}/img-headset.png`,
  "Monitors": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80",
  "Controllers": "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400&q=80",
  "Bags": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
  "Chargers": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80",
  "Hubs & Adapters": "https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?w=400&q=80",
};

function AccessoryModal({
  acc, onClose, onAddToCart, onBuyNow, added,
}: {
  acc: Accessory; onClose: () => void;
  onAddToCart: (a: Accessory) => void;
  onBuyNow: (a: Accessory) => void;
  added: boolean;
}) {
  const { t } = useLang();
  const hasPromo = acc.salePrice != null && acc.salePrice > 0 && acc.salePrice < acc.price;
  const displayPrice = hasPromo ? acc.salePrice! : acc.price;
  const discount = hasPromo ? Math.round((1 - acc.salePrice! / acc.price) * 100) : 0;
  const imgSrc = acc.imageUrl || FALLBACK_IMAGES[acc.category] || "https://placehold.co/400x400/1a1a1a/e91e8c?text=ROC+DZ";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-card border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-primary/10" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="relative aspect-video bg-black/40 overflow-hidden rounded-t-2xl">
          <img src={imgSrc} alt={acc.name} className="w-full h-full object-cover" />
          {hasPromo && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full">-{discount}%</div>
          )}
          <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${acc.stock > 0 ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
            {acc.stock > 0 ? `${acc.stock} ${t.acc.inStock}` : t.acc.outOfStock}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{acc.category}</div>
            <h2 className="text-xl font-black mb-1">{acc.name}</h2>
            {(acc as any).brand && <p className="text-sm text-muted-foreground">{t.acc.brand}: <span className="font-semibold text-foreground">{(acc as any).brand}</span></p>}
          </div>

          {acc.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{acc.description}</p>
          )}

          {(acc as any).specifications && (
            <div className="bg-white/5 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2"><Cpu className="w-3.5 h-3.5" /> {t.acc.specs}</div>
              <p className="text-xs text-muted-foreground whitespace-pre-line">{(acc as any).specifications}</p>
            </div>
          )}

          <div className="flex gap-3">
            {(acc as any).warranty && (
              <div className="flex-1 bg-white/5 rounded-xl p-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <div className="text-xs text-muted-foreground">{t.acc.warranty}</div>
                  <div className="text-xs font-bold">{(acc as any).warranty}</div>
                </div>
              </div>
            )}
            {(acc as any).compatibility && (
              <div className="flex-1 bg-white/5 rounded-xl p-3">
                <div className="text-xs text-muted-foreground mb-0.5">{t.acc.compat}</div>
                <div className="text-xs font-bold">{(acc as any).compatibility}</div>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-end gap-3 mb-1">
              <div className="text-2xl font-black text-gradient-roc">{displayPrice.toLocaleString("fr-DZ")} DA</div>
              {hasPromo && <div className="text-base text-muted-foreground line-through mb-0.5">{acc.price.toLocaleString("fr-DZ")} DA</div>}
            </div>
            {hasPromo && (
              <div className="flex items-center gap-1 mb-3">
                <Tag className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-400 font-bold">{t.acc.promo} — {(acc.price - displayPrice).toLocaleString("fr-DZ")} DA</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => onAddToCart(acc)}
                disabled={acc.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  added
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : acc.stock === 0
                    ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                    : "bg-white/10 hover:bg-white/20 text-foreground border border-white/10"
                }`}
              >
                {added ? <><Check className="w-4 h-4" /> {t.acc.added}</> : <><ShoppingCart className="w-4 h-4" /> {t.acc.addToCart}</>}
              </button>
              <button
                onClick={() => onBuyNow(acc)}
                disabled={acc.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-primary/90 hover:bg-primary text-white border border-primary/50 hover:shadow-[0_0_20px_rgba(233,30,140,0.3)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" /> {t.acc.buyNow}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Accessories() {
  const { t } = useLang();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Accessory | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (acc: Accessory) => {
    const hasPromo = acc.salePrice != null && acc.salePrice > 0 && acc.salePrice < acc.price;
    const displayPrice = hasPromo ? acc.salePrice! : acc.price;
    addItem({
      laptopId: acc.id + 100000,
      title: acc.name,
      price: displayPrice,
      advance: 0,
      qty: 1,
      maxStock: acc.stock,
      imageUrl: acc.imageUrl,
      brand: acc.category,
      isLaptop: false,
    });
    setAddedIds(prev => new Set(prev).add(acc.id));
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(acc.id); return n; }), 2000);
  };

  const handleBuyNow = (acc: Accessory) => {
    handleAddToCart(acc);
    navigate("/cart");
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
        <div className="section-label mb-2">{t.categories.subtitle}</div>
        <h1 className="text-4xl font-black mb-3">
          {t.acc.title} <span className="text-gradient-roc">{t.acc.subtitle}</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">{t.acc.desc}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.acc.search}
            className="pl-9 bg-black/50 border-white/10 focus-visible:ring-primary"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="acc-category-tabs">
        {CATEGORIES_FR.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`acc-cat-btn ${category === cat ? "acc-cat-active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map(acc => {
            const hasPromo = acc.salePrice != null && acc.salePrice > 0 && acc.salePrice < acc.price;
            const displayPrice = hasPromo ? acc.salePrice! : acc.price;
            const discount = hasPromo ? Math.round((1 - acc.salePrice! / acc.price) * 100) : 0;
            return (
              <div key={acc.id} className="bg-card/30 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-[0_0_30px_rgba(233,30,140,0.1)] group cursor-pointer" onClick={() => setSelected(acc)}>
                <div className="relative aspect-square overflow-hidden bg-black/30">
                  <img
                    src={acc.imageUrl || FALLBACK_IMAGES[acc.category] || "https://placehold.co/400x400/1a1a1a/e91e8c?text=ROC+DZ"}
                    alt={acc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {hasPromo && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">-{discount}%</div>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{acc.category}</div>
                  <h3 className="font-bold text-sm sm:text-base mb-1.5 line-clamp-2">{acc.name}</h3>
                  {acc.description && <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{acc.description}</p>}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-primary font-black text-base sm:text-lg">{displayPrice.toLocaleString("fr-DZ")} DA</span>
                      {hasPromo && <span className="text-xs text-muted-foreground line-through ml-1.5">{acc.price.toLocaleString("fr-DZ")}</span>}
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${acc.stock > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {acc.stock > 0 ? `×${acc.stock}` : t.acc.outOfStock}
                    </span>
                  </div>
                  {/* Buttons: hidden on mobile (use modal), visible on sm+ */}
                  <div className="hidden sm:flex gap-1.5">
                    <button
                      onClick={e => { e.stopPropagation(); handleAddToCart(acc); }}
                      disabled={acc.stock === 0}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
                        addedIds.has(acc.id)
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : acc.stock === 0
                          ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                          : "bg-white/10 hover:bg-white/20 text-foreground border border-white/10"
                      }`}
                    >
                      {addedIds.has(acc.id) ? <><Check className="w-3 h-3" /> OK</> : <><ShoppingCart className="w-3 h-3" /> {t.acc.addToCart}</>}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleBuyNow(acc); }}
                      disabled={acc.stock === 0}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl font-bold text-xs bg-primary/90 hover:bg-primary text-white border border-primary/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-3 h-3" /> {t.acc.buyNow}
                    </button>
                  </div>
                  {/* Mobile: "Voir" indicator */}
                  <div className="flex sm:hidden items-center justify-center gap-1 py-2 rounded-xl text-xs text-muted-foreground border border-white/10">
                    <ShoppingCart className="w-3 h-3" />
                    <span>{acc.stock > 0 ? t.acc.addToCart : t.acc.outOfStock}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <AccessoryModal
          acc={selected}
          onClose={() => setSelected(null)}
          onAddToCart={acc => handleAddToCart(acc)}
          onBuyNow={acc => { handleBuyNow(acc); setSelected(null); }}
          added={addedIds.has(selected.id)}
        />
      )}
    </div>
  );
}
