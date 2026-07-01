import { useState } from "react";
import {
  useGetLaptopStats,
  useGetFeaturedLaptop,
  useListLaptops,
  useUpdateLaptop,
  getListLaptopsQueryKey,
  getGetFeaturedLaptopQueryKey
} from "@workspace/api-client-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Laptop, Package, Star, RefreshCcw, LayoutGrid, CheckCircle2,
  ShoppingCart, TrendingUp, ArrowRight, Clock, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const fmt = (p: number) => new Intl.NumberFormat("fr-DZ").format(p) + " DA";

const STATUS_COLORS: Record<string, string> = {
  reserved: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  prepared: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  shipped: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
  delivered: "text-green-400 bg-green-400/10 border-green-400/30",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
  returned: "text-orange-400 bg-orange-400/10 border-orange-400/30",
};
const STATUS_LABELS: Record<string, string> = {
  reserved: "Réservé", confirmed: "Confirmé", prepared: "Préparé",
  shipped: "Expédié", delivered: "Livré", cancelled: "Annulé", returned: "Retourné",
};

function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<any[]> => {
      const r = await fetch(`${BASE}/api/orders`);
      if (!r.ok) return [];
      const data = await r.json();
      return Array.isArray(data) ? data : [];
    },
  });
}

export function DashboardSection() {
  const { data: stats, isLoading: statsLoading } = useGetLaptopStats();
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedLaptop();
  const { data: allLaptops } = useListLaptops();
  const { data: orders = [] } = useOrders();
  const queryClient = useQueryClient();
  const updateLaptop = useUpdateLaptop();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const today = new Date().toDateString();
  const todayOrders = (orders as any[]).filter(o => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayOrders.filter(o => o.status === "delivered").reduce((s: number, o: any) => s + (o.totalPrice || 0), 0);
  const totalRevenue = (orders as any[]).filter(o => o.status === "delivered").reduce((s: number, o: any) => s + (o.totalPrice || 0), 0);
  const pendingOrders = (orders as any[]).filter(o => ["reserved", "confirmed", "prepared"].includes(o.status)).length;
  const lowStock = (allLaptops as any[] || []).filter(l => l.stockQuantity > 0 && l.stockQuantity <= 2);

  const kpis = [
    { label: "Chiffre d'affaires", value: fmt(totalRevenue), icon: TrendingUp, color: "from-pink-500/20 to-purple-500/20 border-pink-500/30", text: "text-pink-400" },
    { label: "Revenus aujourd'hui", value: fmt(todayRevenue), icon: TrendingUp, color: "from-purple-500/20 to-blue-500/20 border-purple-500/30", text: "text-purple-400" },
    { label: "Commandes total", value: (orders as any[]).length, icon: ShoppingCart, color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30", text: "text-blue-400" },
    { label: "En attente", value: pendingOrders, icon: Clock, color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30", text: "text-yellow-400" },
    { label: "Total Produits", value: statsLoading ? "…" : (stats?.totalLaptops ?? 0), icon: Package, color: "from-green-500/20 to-teal-500/20 border-green-500/30", text: "text-green-400" },
    { label: "En Stock", value: statsLoading ? "…" : (stats?.inStock ?? 0), icon: CheckCircle2, color: "from-teal-500/20 to-cyan-500/20 border-teal-500/30", text: "text-teal-400" },
    { label: "Neuf", value: statsLoading ? "…" : (stats?.newCount ?? 0), icon: Star, color: "from-indigo-500/20 to-violet-500/20 border-indigo-500/30", text: "text-indigo-400" },
    { label: "Marques", value: statsLoading ? "…" : (stats?.brands ?? 0), icon: LayoutGrid, color: "from-rose-500/20 to-pink-500/20 border-rose-500/30", text: "text-rose-400" },
  ];

  const handleSetFeatured = (id: string) => {
    updateLaptop.mutate({ id, data: { featured: true } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetFeaturedLaptopQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListLaptopsQueryKey() });
        setModalOpen(false);
        toast({ title: "Produit vedette mis à jour" });
      },
      onError: () => toast({ title: "Erreur", variant: "destructive" }),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
          <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble ROC DZ</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className={`rounded-xl border bg-gradient-to-br p-5 ${k.color} transition-transform hover:scale-[1.02]`}>
            <div className="flex items-center gap-2 mb-3">
              <k.icon className={`w-4 h-4 ${k.text}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider truncate">{k.label}</span>
            </div>
            <div className={`text-2xl font-black ${k.text}`}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-400 text-sm">Stock faible</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lowStock.map(l => `${l.brand} ${l.title} (${l.stockQuantity} restant)`).join(" • ")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-primary" />Commandes récentes</h3>
            <span className="text-xs text-muted-foreground">{(orders as any[]).length} total</span>
          </div>
          <div className="divide-y divide-border">
            {(orders as any[]).length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Aucune commande</div>
            ) : (
              (orders as any[]).slice(0, 6).map((o: any) => (
                <div key={o.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-muted-foreground flex-shrink-0">#{String(o.id).slice(-6)}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate">{o.wilaya || o.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-bold text-sm text-primary">{(o.totalPrice || 0).toLocaleString("fr-DZ")} DA</span>
                    <Badge className={`text-xs border ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Featured + Latest */}
        <div className="space-y-6">
          {/* Featured Pick */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold flex items-center gap-2"><Star className="w-5 h-5 text-primary" />Produit vedette</h3>
              <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs h-7">Changer</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-card border-border">
                  <DialogHeader><DialogTitle>Choisir le produit vedette</DialogTitle></DialogHeader>
                  <ScrollArea className="h-[360px] mt-4">
                    <div className="space-y-2 pr-4">
                      {allLaptops?.map((laptop) => (
                        <div key={laptop.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-muted overflow-hidden flex-shrink-0">
                              {laptop.imageUrl ? <img src={laptop.imageUrl} alt={laptop.title} className="w-full h-full object-cover" /> : <Laptop className="w-5 h-5 m-auto text-muted-foreground" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{laptop.brand} {laptop.title}</p>
                              <p className="text-xs text-primary">{fmt(laptop.price)}</p>
                            </div>
                          </div>
                          <Button size="sm" variant={laptop.featured ? "secondary" : "default"} disabled={laptop.featured || updateLaptop.isPending} onClick={() => handleSetFeatured(laptop.id)} className={laptop.featured ? "" : "bg-primary text-white"}>
                            {laptop.featured ? "Actuel" : "Choisir"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            <div className="p-5">
              {featuredLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : featured ? (
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
                    {featured.imageUrl ? <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-contain p-1" /> : <Laptop className="w-8 h-8 m-auto text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{featured.brand} {featured.title}</p>
                    <p className="text-primary font-black text-lg">{fmt(featured.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={featured.condition === "new" ? "text-green-400 border-green-400/30 text-xs" : "text-orange-400 border-orange-400/30 text-xs"}>
                        {featured.condition === "new" ? "Neuf" : "Reconditionné"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{featured.stockQuantity} en stock</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">Aucun produit vedette</p>
              )}
            </div>
          </div>

          {/* Quick Stats by condition */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><RefreshCcw className="w-5 h-5 text-primary" />Répartition stock</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Neufs", count: stats?.newCount ?? 0, color: "text-green-400" },
                { label: "Recond.", count: stats?.refurbishedCount ?? 0, color: "text-orange-400" },
                { label: "En stock", count: stats?.inStock ?? 0, color: "text-blue-400" },
              ].map(s => (
                <div key={s.label} className="text-center p-3 rounded-lg bg-muted/40">
                  <div className={`text-2xl font-black ${s.color}`}>{statsLoading ? "…" : s.count}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            {!statsLoading && (allLaptops as any[] || []).length > 0 && (
              <div className="mt-3 w-full h-2 bg-muted rounded-full overflow-hidden flex">
                <div className="bg-green-400 h-full transition-all" style={{ width: `${((stats?.newCount ?? 0) / (stats?.totalLaptops || 1)) * 100}%` }} />
                <div className="bg-orange-400 h-full transition-all" style={{ width: `${((stats?.refurbishedCount ?? 0) / (stats?.totalLaptops || 1)) * 100}%` }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
