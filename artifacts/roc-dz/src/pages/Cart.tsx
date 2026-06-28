import { useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingCart, CheckCircle2, Plus, Minus, Home, Building2, Tag, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { calcDelivery } from "@/lib/deliveryFees";
import { useLang } from "@/context/LangContext";
import { addNotification } from "@/lib/notifications";

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
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"domicile" | "bureau">("bureau");

  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", phone2: "", address: "", wilaya: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoData, setPromoData] = useState<{ code: string; discountType: "percent" | "fixed"; discountValue: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const { fee: deliveryFee, homeBlocked } = useMemo(() => calcDelivery(items, form.wilaya, deliveryType), [items, form.wilaya, deliveryType]);
  const totalAdvance = useMemo(() => items.reduce((s, i) => s + (i.advance || 0) * i.qty, 0), [items]);

  const promoDiscount = useMemo(() => {
    if (!promoData) return 0;
    if (promoData.discountType === "percent") return Math.round(total * promoData.discountValue / 100);
    return Math.min(promoData.discountValue, total);
  }, [promoData, total]);

  const grandTotal = total + deliveryFee - promoDiscount;
  const remaining = grandTotal - totalAdvance;
  const hasLaptop = items.some(i => i.isLaptop !== false);
  const effectiveDeliveryType = homeBlocked ? "bureau" : deliveryType;

  const applyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch(`${BASE}/api/promo-codes/validate?code=${encodeURIComponent(promoCodeInput.trim())}`);
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setPromoError(d.error || t.cart.promoInvalid);
        setPromoData(null);
        return;
      }
      const data = await res.json();
      setPromoData(data);
      setPromoError("");
    } catch {
      setPromoError(t.cart.promoError);
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromoData(null);
    setPromoCodeInput("");
    setPromoError("");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = t.cart.errors.firstName;
    if (!form.lastName.trim()) e.lastName = t.cart.errors.lastName;
    if (!form.phone.trim()) {
      e.phone = t.cart.errors.phone;
    } else if (!validatePhone(form.phone)) {
      e.phone = t.cart.errors.phoneInvalid;
    }
    if (!form.phone2.trim()) {
      e.phone2 = t.cart.errors.phone2;
    } else if (!validatePhone(form.phone2)) {
      e.phone2 = t.cart.errors.phone2Invalid;
    }
    if (!e.phone && !e.phone2 && form.phone.replace(/\s/g,"") === form.phone2.replace(/\s/g,"")) {
      e.phone2 = lang === "ar" ? "يجب أن يكون الرقمان مختلفَين" : "Les deux numéros doivent être différents";
    }
    if (!form.address.trim()) e.address = t.cart.errors.address;
    if (!form.wilaya) e.wilaya = t.cart.errors.wilaya;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: t.cart.empty, description: t.cart.emptyDesc });
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
          phone2: form.phone2.trim(),
          address: form.address.trim(),
          wilaya: form.wilaya,
          items: items.map(i => ({ laptopId: i.laptopId, title: i.title, price: i.price, advance: i.advance || 0, qty: i.qty, isLaptop: i.isLaptop ?? true })),
          totalPrice: grandTotal,
          deliveryFee,
          advancePaid: totalAdvance,
          remainingAmount: remaining,
          deliveryType: effectiveDeliveryType,
          paymentMethod: "cash",
          notes: form.notes.trim() || null,
          promoCode: promoData?.code || null,
          promoDiscount: promoDiscount || null,
        }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      clearCart();
      addNotification(t.notifications.orderTitle, t.notifications.orderMsg);
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
        <h2 className="text-3xl font-black mb-3">{t.cart.success}</h2>
        <p className="text-muted-foreground max-w-md mb-4">{t.cart.successDesc}</p>
        {totalAdvance > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-6 py-4 mb-6 max-w-sm">
            <p className="text-yellow-400 font-bold text-lg">{totalAdvance.toLocaleString("fr-DZ")} DA</p>
            <p className="text-sm text-muted-foreground">{t.cart.advance}</p>
          </div>
        )}
        <Link href="/models" className="btn-white text-sm">
          {t.cart.continue} <span className="arrow">→</span>
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
        <h2 className="text-2xl font-black mb-3">{t.cart.empty}</h2>
        <p className="text-muted-foreground mb-8">{t.cart.emptyDesc}</p>
        <Link href="/models" className="btn-white text-sm">{t.cart.viewModels} <span className="arrow">→</span></Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", paddingBottom: "60px" }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-black mb-8">{t.cart.title}</h1>

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
                      {t.cart.advance}: {(item.advance * item.qty).toLocaleString("fr-DZ")} DA
                    </div>
                  )}
                  {item.qty > 1 && <div className="text-xs text-muted-foreground">{item.price.toLocaleString("fr-DZ")} DA / unité</div>}
                  {item.maxStock != null && (
                    <div className="text-xs text-muted-foreground/60">Stock: {item.maxStock}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => updateQty(item.laptopId, item.qty - 1)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.laptopId, item.qty + 1)}
                    disabled={item.maxStock != null && item.qty >= item.maxStock}
                    className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
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
                {t.cart.clear}
              </button>
            </div>
          </div>

          {/* Order form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card/40 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-black mb-2">{t.cart.orderInfo}</h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.cart.firstName}</Label>
                  <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Prénom" className="bg-background/50 border-white/10" />
                  {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">{t.cart.lastName}</Label>
                  <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Nom" className="bg-background/50 border-white/10" />
                  {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t.cart.phone}</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0712345678" className="bg-background/50 border-white/10" />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t.cart.phone2}</Label>
                <Input value={form.phone2} onChange={e => setForm(f => ({ ...f, phone2: e.target.value }))} placeholder="0612345678" className="bg-background/50 border-white/10" />
                {errors.phone2 && <p className="text-xs text-red-400 mt-1">{errors.phone2}</p>}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t.cart.wilaya}</Label>
                <Select value={form.wilaya} onValueChange={v => setForm(f => ({ ...f, wilaya: v }))}>
                  <SelectTrigger className="bg-background/50 border-white/10">
                    <SelectValue placeholder={t.cart.pickWilaya} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.wilaya && <p className="text-xs text-red-400 mt-1">{errors.wilaya}</p>}
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t.cart.address}</Label>
                <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Rue, quartier..." className="bg-background/50 border-white/10" />
                {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
              </div>

              {/* Delivery type */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">{t.cart.deliveryType}</Label>
                {homeBlocked && hasLaptop && (
                  <div className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 mb-2">
                    {t.cart.homeBlocked}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => !homeBlocked && setDeliveryType("domicile")}
                    disabled={homeBlocked}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${effectiveDeliveryType === "domicile" ? "border-primary bg-primary/10 text-primary" : homeBlocked ? "border-white/5 text-white/20 cursor-not-allowed bg-white/5" : "border-white/10 hover:border-white/30"}`}
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-xs font-bold">{t.cart.homeDelivery}</span>
                    {form.wilaya && (
                      <span className="text-xs text-muted-foreground">
                        {homeBlocked ? "—" : `${calcDelivery(items, form.wilaya, "domicile").fee.toLocaleString("fr-DZ")} DA`}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("bureau")}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${effectiveDeliveryType === "bureau" ? "border-primary bg-primary/10 text-primary" : "border-white/10 hover:border-white/30"}`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs font-bold">{t.cart.officeDelivery}</span>
                    {form.wilaya && (
                      <span className="text-xs text-muted-foreground">{calcDelivery(items, form.wilaya, "bureau").fee.toLocaleString("fr-DZ")} DA</span>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">{t.cart.notes}</Label>
                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Instructions..." className="bg-background/50 border-white/10" />
              </div>

              {/* Promo code - optional */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  {t.cart.promoCode} <span className="text-muted-foreground/50 font-normal">(Optionnel)</span>
                </Label>
                {promoData ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-bold text-sm">{promoData.code}</span>
                      <span className="text-green-400 text-xs">
                        -{promoData.discountType === "percent" ? `${promoData.discountValue}%` : `${promoData.discountValue.toLocaleString("fr-DZ")} DA`}
                      </span>
                    </div>
                    <button type="button" onClick={removePromo} className="text-muted-foreground hover:text-red-400 text-xs transition-colors">✕</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={promoCodeInput}
                      onChange={e => { setPromoCodeInput(e.target.value.toUpperCase()); setPromoError(""); }}
                      placeholder={t.cart.promoPlaceholder}
                      className="bg-background/50 border-white/10 uppercase tracking-widest"
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), applyPromo())}
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      disabled={promoLoading || !promoCodeInput.trim()}
                      className="px-4 bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-sm font-bold rounded-xl transition-all disabled:opacity-40 whitespace-nowrap"
                    >
                      {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.cart.promoApply}
                    </button>
                  </div>
                )}
                {promoError && <p className="text-xs text-red-400 mt-1">{promoError}</p>}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.cart.products}</span>
                  <span className="font-semibold">{total.toLocaleString("fr-DZ")} DA</span>
                </div>
                {form.wilaya && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.cart.deliveryFee}</span>
                    <span className="font-semibold">{deliveryFee.toLocaleString("fr-DZ")} DA</span>
                  </div>
                )}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400 font-semibold">{t.cart.promoDiscount}</span>
                    <span className="text-green-400 font-bold">-{promoDiscount.toLocaleString("fr-DZ")} DA</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-white/10">
                  <span className="font-bold">{t.cart.total}</span>
                  <span className="text-2xl font-black text-primary">{grandTotal.toLocaleString("fr-DZ")} DA</span>
                </div>
                {totalAdvance > 0 && (
                  <>
                    <div className="flex justify-between text-sm pt-1">
                      <span className="text-yellow-400 font-semibold">{t.cart.advance}</span>
                      <span className="text-yellow-400 font-bold">{totalAdvance.toLocaleString("fr-DZ")} DA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.cart.remaining}</span>
                      <span className="font-semibold">{remaining.toLocaleString("fr-DZ")} DA</span>
                    </div>
                  </>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-base">
                {loading ? t.cart.submitting : t.cart.submit}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
