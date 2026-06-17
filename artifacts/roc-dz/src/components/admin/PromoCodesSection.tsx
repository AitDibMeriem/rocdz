import { useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function usePromoCodes() {
  return useQuery({
    queryKey: ["promo-codes"],
    queryFn: async () => {
      const r = await fetch(`${BASE}/api/promo-codes`);
      return r.json() as Promise<any[]>;
    },
  });
}

export function PromoCodesSection() {
  const { data: codes = [], isLoading } = usePromoCodes();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discountType: "percent", discountValue: "10", expiryDate: "", usageLimit: "" });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const r = await fetch(`${BASE}/api/promo-codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          discountValue: Number(data.discountValue),
          usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
          expiryDate: data.expiryDate || null,
        }),
      });
      if (!r.ok) throw new Error((await r.json()).error || "Error");
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      setOpen(false);
      setForm({ code: "", discountType: "percent", discountValue: "10", expiryDate: "", usageLimit: "" });
      toast({ title: "Code promo créé" });
    },
    onError: (e: any) => toast({ title: e.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const r = await fetch(`${BASE}/api/promo-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      return r.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["promo-codes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${BASE}/api/promo-codes/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      toast({ title: "Code supprimé" });
    },
  });

  const examples = ["ROC10", "ROC20", "WELCOME15", "PROMO30", "FLASH50"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Codes Promo</h2>
          <p className="text-muted-foreground text-sm mt-1">Créer et gérer les codes de réduction</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2 bg-primary text-white hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Nouveau Code
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Exemples rapides</p>
        <div className="flex flex-wrap gap-2">
          {examples.map(ex => (
            <button
              key={ex}
              onClick={() => setForm(f => ({ ...f, code: ex }))}
              className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-mono hover:bg-primary/20 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Chargement...</div>
      ) : codes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed border-border rounded-xl">
          <Tag className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucun code promo. Créez-en un!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {codes.map((code: any) => (
            <div key={code.id} className="bg-card border border-border rounded-xl p-5 space-y-4 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl font-mono text-primary">{code.code}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(code.code); toast({ title: "Copié!" }); }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={code.active ? "default" : "secondary"} className={code.active ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}>
                      {code.active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleMutation.mutate({ id: code.id, active: !code.active })}
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                  >
                    {code.active ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(code.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Réduction</span>
                  <span className="font-semibold text-primary">
                    {code.discountType === "percent" ? `${code.discountValue}%` : `${code.discountValue} DA`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Utilisations</span>
                  <span>{code.usedCount}{code.usageLimit ? ` / ${code.usageLimit}` : " / ∞"}</span>
                </div>
                {code.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expiration</span>
                    <span>{new Date(code.expiryDate).toLocaleDateString("fr-DZ")}</span>
                  </div>
                )}
              </div>

              {code.usageLimit && (
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (code.usedCount / code.usageLimit) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau Code Promo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Code *</Label>
              <Input
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="ex: ROC20"
                className="font-mono uppercase bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type de réduction</Label>
                <Select value={form.discountType} onValueChange={v => setForm(f => ({ ...f, discountType: v }))}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (DA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valeur *</Label>
                <Input
                  type="number"
                  value={form.discountValue}
                  onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                  className="bg-background"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Limite d'utilisation</Label>
                <Input
                  type="number"
                  value={form.usageLimit}
                  onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                  placeholder="Illimité"
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Date d'expiration</Label>
                <Input
                  type="date"
                  value={form.expiryDate}
                  onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
                  className="bg-background"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button
              onClick={() => createMutation.mutate(form)}
              disabled={!form.code || !form.discountValue || createMutation.isPending}
              className="bg-primary text-white"
            >
              {createMutation.isPending ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
