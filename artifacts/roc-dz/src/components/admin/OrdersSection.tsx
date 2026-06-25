import { useState } from "react";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const STATUS_LABELS: Record<string, string> = {
  reserved: "Réservé",
  confirmed: "Confirmé",
  advance_paid: "Versement reçu",
  prepared: "Préparé",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
  returned: "Retourné",
};

const STATUS_COLORS: Record<string, string> = {
  reserved: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  advance_paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  prepared: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  returned: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const ALL_STATUSES = ["reserved", "confirmed", "advance_paid", "prepared", "shipped", "delivered", "cancelled", "returned"];

function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const r = await fetch(`${BASE}/api/orders`);
      return r.json() as Promise<any[]>;
    },
  });
}

export function OrdersSection() {
  const { data: orders = [], isLoading } = useOrders();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const r = await fetch(`${BASE}/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return r.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      if (selected?.id === data.id) setSelected(data);
      toast({ title: `Commande ${STATUS_LABELS[data.status]}` });
    },
  });

  const filtered = filterStatus === "all" ? orders : orders.filter((o: any) => o.status === filterStatus);

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o: any) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold">Commandes</h2>
          <p className="text-muted-foreground text-sm mt-1">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous ({orders.length})</SelectItem>
            {ALL_STATUSES.map(s => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]} ({counts[s]})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
            className={`rounded-xl p-3 border text-center transition-all ${filterStatus === s ? "border-primary/50 bg-primary/10" : "border-border bg-card hover:border-primary/20"}`}
          >
            <div className="text-2xl font-black">{counts[s]}</div>
            <div className="text-xs text-muted-foreground">{STATUS_LABELS[s]}</div>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-24 bg-card border border-dashed border-border rounded-xl">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune commande</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order: any) => (
            <div
              key={order.id}
              onClick={() => setSelected(order)}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="font-mono text-muted-foreground">#{String(order.id).padStart(4, "0")}</span>
                    <span className="font-bold ml-3">{order.customerName}</span>
                    <span className="text-muted-foreground ml-2">— {order.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">{(order.totalPrice || 0).toLocaleString("fr-DZ")} DA</span>
                  <Badge className={STATUS_COLORS[order.status]}>
                    {STATUS_LABELS[order.status]}
                  </Badge>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>{order.wilaya || order.address}</span>
                <span>•</span>
                <span>{new Date(order.createdAt).toLocaleDateString("fr-DZ")}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Commande #{String(selected.id).padStart(4, "0")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Client</span><p className="font-semibold">{selected.firstName} {selected.lastName}</p></div>
                <div><span className="text-muted-foreground">Téléphone</span><p className="font-semibold font-mono">{selected.phone}</p></div>
                {selected.phone2 && <div><span className="text-muted-foreground">Tél. 2</span><p className="font-semibold font-mono">{selected.phone2}</p></div>}
                <div><span className="text-muted-foreground">Wilaya</span><p className="font-semibold">{selected.wilaya || "—"}</p></div>
                <div><span className="text-muted-foreground">Adresse</span><p className="font-semibold">{selected.address}</p></div>
                <div><span className="text-muted-foreground">Livraison</span><p className="font-semibold capitalize">{selected.deliveryType === "bureau" ? "Bureau / Stop Desk" : "À domicile"}</p></div>
              </div>
              <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Produits</span><span className="font-semibold">{((selected.totalPrice || 0) - (selected.deliveryFee || 0) + (selected.promoDiscount || 0)).toLocaleString("fr-DZ")} DA</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span className="font-semibold">{(selected.deliveryFee || 0).toLocaleString("fr-DZ")} DA</span></div>
                {selected.promoCode && (
                  <div className="flex justify-between text-green-400">
                    <span className="font-semibold flex items-center gap-1">
                      🏷️ Code promo <span className="font-mono bg-green-500/10 px-1.5 rounded text-xs">{selected.promoCode}</span>
                    </span>
                    <span className="font-bold">-{(selected.promoDiscount || 0).toLocaleString("fr-DZ")} DA</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-1"><span className="font-bold">Total</span><span className="font-black text-primary">{(selected.totalPrice || 0).toLocaleString("fr-DZ")} DA</span></div>
                {selected.advancePaid > 0 && <>
                  <div className="flex justify-between text-emerald-400"><span className="font-semibold">✓ Versement reçu</span><span className="font-bold">{(selected.advancePaid || 0).toLocaleString("fr-DZ")} DA</span></div>
                  <div className="flex justify-between text-yellow-400"><span className="font-semibold">⏳ Reste à payer</span><span className="font-bold">{(selected.remainingAmount || 0).toLocaleString("fr-DZ")} DA</span></div>
                </>}
              </div>

              {selected.items && selected.items.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Produits</p>
                  {selected.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                      <span>{item.title} x{item.qty}</span>
                      <span className="font-semibold">{(item.price * item.qty).toLocaleString("fr-DZ")} DA</span>
                    </div>
                  ))}
                </div>
              )}

              {selected.notes && (
                <div><p className="text-muted-foreground text-sm">Notes</p><p className="text-sm mt-1">{selected.notes}</p></div>
              )}

              <div>
                <p className="text-muted-foreground text-sm mb-2">Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map(s => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selected.status === s ? "default" : "outline"}
                      className={selected.status === s ? "bg-primary text-white" : ""}
                      disabled={statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: selected.id, status: s })}
                    >
                      {STATUS_LABELS[s]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
