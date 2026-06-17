import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingCart, CheckCircle2, Plus, Minus, Home, Building2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { calcDelivery, LAPTOP_HOME_THRESHOLD } from "@/lib/deliveryFees";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const WILAYAS = [
  "01 - Adrar","02 - Chlef","03 - Laghouat","04 - Oum El Bouaghi","05 - Batna",
  "06 - Béjaïa","07 - Biskra","08 - Béchar","09 - Blida","10 - Bouira",
  "11 - Tamanrasset","12 - Tébessa","13 - Tlemcen","14 - Tiaret","15 - Tizi Ouzou",
  "16 - Alger","17 - Djelfa","18 - Jijel","19 - Sétif","20 - Saïda",
  "21 - Skikda","22 - Sidi Bel Abbès","23 - Annaba","24 - Guelma","25 - Constantine",
  "26 - Médéa","27 - Mostaganem","28 - M'Sila","29 - Mascara","30 - Ouargla",
  "31 - Oran","32 - El Bayadh","33 - Illizi","34 - Bordj Bou Arréridj","35 - Boumerdès",
  "36 - El Tarf","37 - Tindouf","38 - Tissemsilt","39 - El Oued","40 - Khenchela",
  "41 - Souk Ahras","42 - Tipaza","43 - Mila","44 - Aïn Defla","45 - Naâma",
  "46 - Aïn Témouchent","47 - Ghardaïa","48 - Relizane","49 - Timimoun",
  "50 - Bordj Badji Mokhtar","51 - Ouled Djellal","52 - Béni Abbès","53 - In Salah",
  "54 - In Guezzam","55 - Touggourt","56 - Djanet","57 - El M'Ghair","58 - El Meniaa",
];

const DZ_PHONE = /^(05|06|07)[0-9]{8}$/;
function validatePhone(phone: string) { return DZ_PHONE.test(phone.replace(/\s/g, "")); }

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"domicile" | "bureau">("bureau");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    phone2: "",
    address: "",
    wilaya: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fee: deliveryFee, homeBlocked } = useMemo(
    () => calcDelivery(items, form.wilaya, deliveryType),
    [items, form.wilaya, deliveryType]
  );

  const totalAdvance = useMemo(
    () => items.reduce((s, i) => s + (i.advance || 0) * i.qty, 0),
    [items]
  );

  const grandTotal = total + deliveryFee;
  const remaining = grandTotal - totalAdvance;

  const hasLaptop = items.some(i => i.isLaptop !== false);

  const effectiveDeliveryType = homeBlocked ? "bureau" : deliveryType;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Prénom requis";
    if (!form.lastName.trim()) e.lastName = "Nom requis";
    if (!form.phone.trim()) {
      e.phone = "Numéro requis";
    } else if (!validatePhone(form.phone)) {
      e.phone = "Format invalide (ex: 0712345678)";
    }
    if (form.phone2.trim() && !validatePhone(form.phone2)) {
      e.phone2 = "Format invalide (ex: 0612345678)";
    }
    if (!form.address.trim()) e.address = "Adresse requise";
    if (!form.wilaya) e.wilaya = "Wilaya requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: "Panier vide", description: "Ajoutez des produits avant de commander." });
      return;
    }
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          phone2: form.phone2.trim() || null,
          address: form.address.trim(),
          wilaya: form.wilaya,
          items: items.map(i => ({
            laptopId: i.laptopId,
            title: i.title,
            price: i.price,
            advance: i.advance || 0,
            qty: i.qty,
            isLaptop: i.isLaptop ?? true,
          })),
          totalPrice: grandTotal,
          deliveryFee,
          advancePaid: totalAdvance,
          remainingAmount: remaining,
          deliveryType: effectiveDeliveryType,
          paymentMethod: "cash",
          notes: form.notes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      clearCart();
      setSuccess(true);
    } catch {
      toast({ title: "Erreur", description: "Impossible de passer la commande. Réessayez.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-3xl font-black mb-3">Commande confirmée !</h2>
        <p className="text-muted-foreground max-w-md mb-4">
          Votre commande a été enregistrée. Notre équipe vous contactera sous peu pour confirmer la livraison.
        </p>
        {totalAdvance > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-6 py-4 mb-6 max-w-sm">
            <p className="text-yellow-400 font-bold text-lg">{totalAdvance.toLocaleString("fr-DZ")} DA</p>
            <p className="text-sm text-muted-foreground">Versement à effectuer pour confirmer</p>
          </div>
        )}
        <Link href="/models" className="btn-white text-sm">
          Continuer les achats <span className="arrow">→</span>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-black mb-3">Votre panier est vide</h2>
        <p className="text-muted-foreground mb-8">Parcourez notre catalogue et ajoutez des produits.</p>
        <Link href="/models" className="btn-white text-sm">Voir les modèles <span className="arrow">→</span></Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", paddingBottom: "60px" }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-black mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Items list */}
          <div className="lg:col-span-3 space-y-4">
            {items.map(item => (
              <div key={item.laptopId} className="bg-card/40 border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.title} className="w-20 h-16 object-contain rounded-lg bg-black/30 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{item.title}</div>
                  <div className="text-primary font-black text-lg">{(item.price * item.qty).toLocaleString("fr-DZ")} DA</div>
                  {item.advance > 0 && (
                    <div className="text-xs text-yellow-400 font-semibold mt-0.5">
                      Versement : {(item.advance * item.qty).toLocaleString("fr-DZ")} DA
                    </div>
                  )}
                  {item.qty > 1 && <div className="text-xs text-muted-foreground">{item.price.toLocaleString("fr-DZ")} DA / unité</div>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => updateQty(item.laptopId, item.qty - 1)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold">{item.qty}</span>
                  <button onClick={() => updateQty(item.laptopId, item.qty + 1)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeItem(item.laptopId)} className="w-7 h-7 rounded-full flex items-center justify-center hover:text-red-400 transition-colors ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-red-400 transition-colors">
                Vider le panier
              </button>
            </div>
          </div>

          {/* Order form - scrollable, not sticky */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card/40 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-black mb-2">Informations de livraison</h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Prénom *</Label>
                  <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Prénom" className="bg-background/50 border-white/10" />
                  {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Nom *</Label>
                  <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Nom" className="bg-background/50 border-white/10" />
                  {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Téléphone principal * (05/06/07)</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0712345678" className="bg-background/50 border-white/10" />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Téléphone secondaire (05/06/07)</Label>
                <Input value={form.phone2} onChange={e => setForm(f => ({ ...f, phone2: e.target.value }))} placeholder="0612345678 (optionnel)" className="bg-background/50 border-white/10" />
                {errors.phone2 && <p className="text-xs text-red-400 mt-1">{errors.phone2}</p>}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Wilaya *</Label>
                <Select value={form.wilaya} onValueChange={v => setForm(f => ({ ...f, wilaya: v }))}>
                  <SelectTrigger className="bg-background/50 border-white/10">
                    <SelectValue placeholder="Choisir une wilaya" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.wilaya && <p className="text-xs text-red-400 mt-1">{errors.wilaya}</p>}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Adresse *</Label>
                <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Rue, quartier..." className="bg-background/50 border-white/10" />
                {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
              </div>

              {/* Delivery type selection */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Type de livraison *</Label>
                {homeBlocked && hasLaptop && (
                  <div className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 mb-2">
                    ⚠️ Livraison à domicile non disponible pour ce montant — bureau uniquement
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => !homeBlocked && setDeliveryType("domicile")}
                    disabled={homeBlocked}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      effectiveDeliveryType === "domicile"
                        ? "border-primary bg-primary/10 text-primary"
                        : homeBlocked
                        ? "border-white/5 text-white/20 cursor-not-allowed bg-white/5"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-xs font-bold">À Domicile</span>
                    {form.wilaya && (
                      <span className="text-xs text-muted-foreground">
                        {homeBlocked ? "—" : `${calcDelivery(items, form.wilaya, "domicile").fee.toLocaleString("fr-DZ")} DA`}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("bureau")}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                      effectiveDeliveryType === "bureau"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs font-bold">Bureau / Stop Desk</span>
                    {form.wilaya && (
                      <span className="text-xs text-muted-foreground">
                        {calcDelivery(items, form.wilaya, "bureau").fee.toLocaleString("fr-DZ")} DA
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Notes (optionnel)</Label>
                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Instructions de livraison..." className="bg-background/50 border-white/10" />
              </div>

              {/* Price breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Produits</span>
                  <span className="font-semibold">{total.toLocaleString("fr-DZ")} DA</span>
                </div>
                {form.wilaya && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frais de livraison</span>
                    <span className="font-semibold">{deliveryFee.toLocaleString("fr-DZ")} DA</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-white/10">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black text-primary">{grandTotal.toLocaleString("fr-DZ")} DA</span>
                </div>
                {totalAdvance > 0 && (
                  <>
                    <div className="flex justify-between text-sm pt-1">
                      <span className="text-yellow-400 font-semibold">Versement requis</span>
                      <span className="text-yellow-400 font-bold">{totalAdvance.toLocaleString("fr-DZ")} DA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reste à payer à la livraison</span>
                      <span className="font-semibold">{remaining.toLocaleString("fr-DZ")} DA</span>
                    </div>
                  </>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-base">
                {loading ? "En cours..." : "Confirmer la commande"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
