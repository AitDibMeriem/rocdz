import { useState } from "react";
import { ShoppingCart, ChevronDown, Copy, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const STATUS_LABELS: Record<string, string> = {
  reserved: "Réservé",
  confirmed: "Confirmé",
  advance_paid: "Versement reçu",
  verse: "Versé",
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
  verse: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  prepared: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  returned: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const ALL_STATUSES = ["reserved", "confirmed", "verse", "prepared", "shipped", "delivered", "cancelled", "returned"];

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
  const [verseOpen, setVerseOpen] = useState(false);
  const [verseAmount, setVerseAmount] = useState("");
  const [copiedMsg, setCopiedMsg] = useState(false);

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

  const verseMutation = useMutation({
    mutationFn: async ({ id, versedAmount }: { id: number; versedAmount: number }) => {
      const r = await fetch(`${BASE}/api/orders/${id}/verse`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versedAmount }),
      });
      return r.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelected(data);
      setVerseOpen(false);
      setVerseAmount("");
      toast({ title: "Versement enregistré", description: `Reste à payer: ${(data.remainingAmount || 0).toLocaleString("fr-DZ")} DA` });
    },
  });

  const handleVerse = () => {
    const amount = Number(verseAmount.replace(/\s/g, ""));
    if (!amount || !selected) return;
    verseMutation.mutate({ id: selected.id, versedAmount: amount });
  };

  const buildVerseMessage = (order: any) => {
    const versed = order.advancePaid || 0;
    const remaining = order.remainingAmount || 0;
    return `Bonjour ${order.firstName || order.customerName},\n\nVotre commande ROC DZ #${String(order.id).padStart(4, "0")} a été prise en charge.\n\n✅ Versement reçu: ${versed.toLocaleString("fr-DZ")} DA\n🛍️ Total commande: ${(order.totalPrice || 0).toLocaleString("fr-DZ")} DA\n🚚 Livraison: ${(order.deliveryFee || 0).toLocaleString("fr-DZ")} DA\n⏳ Reste à payer: ${remaining.toLocaleString("fr-DZ")} DA\n\nMerci pour votre confiance !`;
  };

  const copyMessage = (order: any) => {
    navigator.clipboard.writeText(buildVerseMessage(order));
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const openWhatsApp = (order: any) => {
    const raw = (order.phone || "").replace(/\s/g, "");
    const intl = raw.startsWith("0") ? "213" + raw.slice(1) : raw.startsWith("+") ? raw.slice(1) : raw;
    const text = encodeURIComponent(buildVerseMessage(order));
    window.open(`https://wa.me/${intl}?text=${text}`, "_blank");
  };

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

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
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

      {/* Order detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto">
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
                    <span className="font-semibold flex items-center gap-1">🏷️ Promo <span className="font-mono bg-green-500/10 px-1.5 rounded text-xs">{selected.promoCode}</span></span>
                    <span className="font-bold">-{(selected.promoDiscount || 0).toLocaleString("fr-DZ")} DA</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-1"><span className="font-bold">Total</span><span className="font-black text-primary">{(selected.totalPrice || 0).toLocaleString("fr-DZ")} DA</span></div>
                {selected.advancePaid > 0 && <>
                  <div className="flex justify-between text-emerald-400"><span className="font-semibold">✓ Versé</span><span className="font-bold">{(selected.advancePaid || 0).toLocaleString("fr-DZ")} DA</span></div>
                  <div className="flex justify-between text-yellow-400"><span className="font-semibold">⏳ Reste à payer</span><span className="font-bold">{(selected.remainingAmount || 0).toLocaleString("fr-DZ")} DA</span></div>
                </>}
              </div>

              {/* Versement notification panel */}
              {(selected.status === "verse" || selected.status === "advance_paid") && selected.advancePaid > 0 && (
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4">
                  <p className="text-teal-400 font-bold text-sm mb-2">Message client — Versement confirmé</p>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-black/20 rounded p-3 mb-3">{buildVerseMessage(selected)}</pre>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 border-teal-500/30 text-teal-400 hover:bg-teal-500/10"
                      onClick={() => copyMessage(selected)}
                    >
                      {copiedMsg ? <><CheckCircle2 className="w-4 h-4" /> Copié !</> : <><Copy className="w-4 h-4" /> Copier</>}
                    </Button>
                    <Button
                      size="sm"
                      className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => openWhatsApp(selected)}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Envoyer WhatsApp
                    </Button>
                  </div>
                </div>
              )}

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
                  {ALL_STATUSES.filter(s => s !== "verse").map(s => (
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
                  <Button
                    size="sm"
                    variant={selected.status === "verse" ? "default" : "outline"}
                    className={selected.status === "verse" ? "bg-teal-600 text-white" : "border-teal-500/40 text-teal-400"}
                    onClick={() => { setVerseAmount(String(selected.advancePaid || "")); setVerseOpen(true); }}
                    disabled={statusMutation.isPending}
                  >
                    💰 Versé
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Versement dialog */}
      <Dialog open={verseOpen} onOpenChange={setVerseOpen}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader><DialogTitle>Enregistrer un versement</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Montant versé (DA)</Label>
              <Input
                type="number"
                value={verseAmount}
                onChange={e => setVerseAmount(e.target.value)}
                placeholder="Ex: 10000"
                className="bg-background mt-1"
                autoFocus
              />
            </div>
            {selected && verseAmount && Number(verseAmount) > 0 && (
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Total commande</span><span className="font-bold">{(selected.totalPrice || 0).toLocaleString("fr-DZ")} DA</span></div>
                <div className="flex justify-between text-teal-400"><span>Versement</span><span className="font-bold">-{Number(verseAmount).toLocaleString("fr-DZ")} DA</span></div>
                <div className="flex justify-between border-t border-teal-500/20 pt-1 text-yellow-400">
                  <span className="font-bold">Reste à payer</span>
                  <span className="font-black">{Math.max(0, (selected.totalPrice || 0) - Number(verseAmount)).toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerseOpen(false)}>Annuler</Button>
            <Button
              className="bg-teal-600 text-white hover:bg-teal-700"
              disabled={!verseAmount || Number(verseAmount) <= 0 || verseMutation.isPending}
              onClick={handleVerse}
            >
              {verseMutation.isPending ? "Enregistrement..." : "Confirmer le versement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
