import { useState } from "react";
import { Link } from "wouter";
import { useLang } from "@/context/LangContext";

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

const STATUS_LABELS_AR: Record<string, string> = {
  reserved: "محجوز",
  confirmed: "مؤكد",
  advance_paid: "دفعة مقدمة",
  verse: "مدفوع",
  prepared: "جاهز",
  shipped: "مشحون",
  delivered: "مُسلَّم",
  cancelled: "ملغى",
  returned: "مُرجَع",
};

const STATUS_LABELS_EN: Record<string, string> = {
  reserved: "Reserved",
  confirmed: "Confirmed",
  advance_paid: "Advance paid",
  verse: "Paid",
  prepared: "Prepared",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const STATUS_STEPS = ["reserved", "confirmed", "verse", "prepared", "shipped", "delivered"];

const STATUS_ICONS: Record<string, string> = {
  reserved: "📋",
  confirmed: "✅",
  advance_paid: "💵",
  verse: "💰",
  prepared: "📦",
  shipped: "🚚",
  delivered: "🎉",
  cancelled: "❌",
  returned: "↩️",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  reserved:     { bg: "rgba(234,179,8,0.12)",   text: "#eab308", border: "rgba(234,179,8,0.3)" },
  confirmed:    { bg: "rgba(59,130,246,0.12)",  text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  advance_paid: { bg: "rgba(16,185,129,0.12)",  text: "#34d399", border: "rgba(16,185,129,0.3)" },
  verse:        { bg: "rgba(20,184,166,0.12)",  text: "#2dd4bf", border: "rgba(20,184,166,0.3)" },
  prepared:     { bg: "rgba(168,85,247,0.12)",  text: "#c084fc", border: "rgba(168,85,247,0.3)" },
  shipped:      { bg: "rgba(6,182,212,0.12)",   text: "#22d3ee", border: "rgba(6,182,212,0.3)" },
  delivered:    { bg: "rgba(34,197,94,0.12)",   text: "#4ade80", border: "rgba(34,197,94,0.3)" },
  cancelled:    { bg: "rgba(239,68,68,0.12)",   text: "#f87171", border: "rgba(239,68,68,0.3)" },
  returned:     { bg: "rgba(249,115,22,0.12)",  text: "#fb923c", border: "rgba(249,115,22,0.3)" },
};

function buildVerseMessage(order: any) {
  const versed = order.advancePaid || 0;
  const remaining = order.remainingAmount || 0;
  return `Bonjour ${order.firstName || order.customerName},\n\nVotre commande ROC DZ #${String(order.id).padStart(4, "0")} a été prise en charge.\n\n✅ Versement reçu: ${versed.toLocaleString("fr-DZ")} DA\n🛍️ Total commande: ${(order.totalPrice || 0).toLocaleString("fr-DZ")} DA\n🚚 Livraison: ${(order.deliveryFee || 0).toLocaleString("fr-DZ")} DA\n⏳ Reste à payer: ${remaining.toLocaleString("fr-DZ")} DA\n\nMerci pour votre confiance !`;
}

function stepIndex(status: string) {
  const idx = STATUS_STEPS.indexOf(status);
  return idx === -1 ? -1 : idx;
}

function OrderCard({ order }: { order: any }) {
  const [copied, setCopied] = useState(false);
  const { lang } = useLang();
  const labels = lang === "ar" ? STATUS_LABELS_AR : lang === "en" ? STATUS_LABELS_EN : STATUS_LABELS;
  const txt = {
    delivery: lang === "ar" ? "التوصيل" : lang === "en" ? "Delivery" : "Livraison",
    total: lang === "ar" ? "المجموع" : lang === "en" ? "Total" : "Total",
    paid: lang === "ar" ? "✓ مدفوع" : lang === "en" ? "✓ Paid" : "✓ Versé",
    remaining: lang === "ar" ? "⏳ المتبقي" : lang === "en" ? "⏳ Remaining" : "⏳ Reste à payer",
    bureau: lang === "ar" ? "نقطة التسليم" : lang === "en" ? "Office / Stop Desk" : "Bureau / Stop Desk",
    home: lang === "ar" ? "توصيل إلى المنزل" : lang === "en" ? "Home delivery" : "À domicile",
    copy: lang === "ar" ? "📋 نسخ الرسالة" : lang === "en" ? "📋 Copy message" : "📋 Copier le message",
    copiedTxt: lang === "ar" ? "✓ تم النسخ" : lang === "en" ? "✓ Copied" : "✓ Copié !",
  };
  const colors = STATUS_COLORS[order.status] || STATUS_COLORS.reserved;
  const isVersed = (order.status === "verse" || order.status === "advance_paid") && (order.advancePaid || 0) > 0;
  const isCancelled = order.status === "cancelled" || order.status === "returned";
  const currentStep = stepIndex(order.status);

  const copyMsg = () => {
    navigator.clipboard.writeText(buildVerseMessage(order));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="suivi-order-card">
      <div className="suivi-order-header">
        <div className="suivi-order-ref">
          <span className="suivi-order-num">#{String(order.id).padStart(4, "0")}</span>
          <span className="suivi-order-date">{new Date(order.createdAt).toLocaleDateString(lang === "ar" ? "ar-DZ" : "fr-DZ", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
        <span
          className="suivi-status-badge"
          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
        >
          {STATUS_ICONS[order.status]} {labels[order.status] || order.status}
        </span>
      </div>

      {/* Progress bar (not for cancelled/returned) */}
      {!isCancelled && currentStep >= 0 && (
        <div className="suivi-progress">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className="suivi-progress-step">
              <div
                className="suivi-progress-dot"
                style={{
                  background: i <= currentStep ? colors.text : "rgba(255,255,255,0.15)",
                  borderColor: i <= currentStep ? colors.text : "rgba(255,255,255,0.1)",
                  boxShadow: i === currentStep ? `0 0 8px ${colors.text}` : "none",
                }}
              />
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className="suivi-progress-line"
                  style={{ background: i < currentStep ? colors.text : "rgba(255,255,255,0.1)" }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order items */}
      {order.items && order.items.length > 0 && (
        <div className="suivi-items">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="suivi-item">
              <span className="suivi-item-name">{item.title} <span className="suivi-item-qty">×{item.qty}</span></span>
              <span className="suivi-item-price">{(item.price * item.qty).toLocaleString("fr-DZ")} DA</span>
            </div>
          ))}
        </div>
      )}

      {/* Totals */}
      <div className="suivi-totals">
        <div className="suivi-total-row">
          <span>{txt.delivery}</span>
          <span>{(order.deliveryFee || 0).toLocaleString("fr-DZ")} DA</span>
        </div>
        {order.promoCode && (
          <div className="suivi-total-row suivi-promo">
            <span>🏷️ Promo <code>{order.promoCode}</code></span>
            <span>-{(order.promoDiscount || 0).toLocaleString("fr-DZ")} DA</span>
          </div>
        )}
        <div className="suivi-total-row suivi-grand-total">
          <span>{txt.total}</span>
          <span>{(order.totalPrice || 0).toLocaleString("fr-DZ")} DA</span>
        </div>
        {isVersed && (
          <>
            <div className="suivi-total-row suivi-versed">
              <span>{txt.paid}</span>
              <span>{(order.advancePaid || 0).toLocaleString("fr-DZ")} DA</span>
            </div>
            <div className="suivi-total-row suivi-remaining">
              <span>{txt.remaining}</span>
              <span>{(order.remainingAmount || 0).toLocaleString("fr-DZ")} DA</span>
            </div>
          </>
        )}
      </div>

      {/* Versement notification */}
      {isVersed && (
        <div className="suivi-verse-panel">
          <p className="suivi-verse-title">💬 Message de confirmation — ROC DZ</p>
          <pre className="suivi-verse-msg">{buildVerseMessage(order)}</pre>
          <button className="suivi-copy-btn" onClick={copyMsg}>
            {copied ? txt.copiedTxt : txt.copy}
          </button>
        </div>
      )}

      <div className="suivi-wilaya">
        📍 {order.wilaya || "—"} — {order.deliveryType === "bureau" ? txt.bureau : txt.home}
      </div>
    </div>
  );
}

export default function Suivi() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const { lang, isRTL } = useLang();

  const ui = {
    title: lang === "ar" ? "تتبع طلبي" : lang === "en" ? "Track my order" : "Suivre ma commande",
    desc: lang === "ar" ? "أدخل رقم هاتفك لعرض طلباتك من ROC DZ." : lang === "en" ? "Enter your phone number to view your ROC DZ orders." : "Entrez votre numéro de téléphone pour voir l'état de vos commandes ROC DZ.",
    placeholder: lang === "ar" ? "مثال: 0555 12 34 56" : "Ex: 0555 12 34 56",
    searching: lang === "ar" ? "جارٍ البحث..." : lang === "en" ? "Searching..." : "Recherche...",
    search: lang === "ar" ? "🔍 بحث" : lang === "en" ? "🔍 Search" : "🔍 Rechercher",
    connError: lang === "ar" ? "خطأ في الاتصال. تحقق من اتصالك بالإنترنت." : lang === "en" ? "Connection error. Check your internet connection." : "Erreur de connexion. Vérifiez votre connexion internet.",
    noOrders: lang === "ar" ? "لا توجد طلبات" : lang === "en" ? "No orders found" : "Aucune commande trouvée",
    noOrdersDesc: lang === "ar" ? "تحقق من أن الرقم المُدخل هو نفس المستخدم عند الطلب." : lang === "en" ? "Make sure the number entered matches the one used when ordering." : "Vérifiez que le numéro entré correspond à celui utilisé lors de la commande.",
    orderNow: lang === "ar" ? "اطلب الآن ←" : lang === "en" ? "Place an order →" : "Passer une commande →",
    back: lang === "ar" ? "→ العودة للرئيسية" : lang === "en" ? "← Back to home" : "← Retour à l'accueil",
    foundSingle: lang === "ar" ? "طلب واحد تم العثور عليه" : lang === "en" ? "order found" : "commande trouvée",
    foundPlural: lang === "ar" ? "طلبات تم العثور عليها" : lang === "en" ? "orders found" : "commandes trouvées",
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = phone.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setOrders(null);
    setSearched(true);
    try {
      const r = await fetch(`${BASE}/api/orders/track?phone=${encodeURIComponent(q)}`);
      if (!r.ok) {
        const d = await r.json();
        setError(d.error || (lang === "ar" ? "خطأ في البحث" : lang === "en" ? "Search error" : "Erreur lors de la recherche"));
      } else {
        const data = await r.json();
        setOrders(data);
      }
    } catch {
      setError(ui.connError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suivi-wrap" dir={isRTL ? "rtl" : "ltr"}>
      <div className="suivi-hero">
        <div className="suivi-icon">📦</div>
        <h1 className="suivi-title">{ui.title}</h1>
        <p className="suivi-desc">{ui.desc}</p>
      </div>

      <div className="suivi-container">
        <form className="suivi-form" onSubmit={handleSearch}>
          <input
            className="suivi-input"
            type="tel"
            placeholder={ui.placeholder}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <button className="suivi-btn" type="submit" disabled={loading}>
            {loading ? ui.searching : ui.search}
          </button>
        </form>

        {error && (
          <div className="suivi-error">{error}</div>
        )}

        {searched && !loading && !error && orders !== null && (
          orders.length === 0 ? (
            <div className="suivi-empty">
              <div className="suivi-empty-icon">🔍</div>
              <p className="suivi-empty-title">{ui.noOrders}</p>
              <p className="suivi-empty-desc">{ui.noOrdersDesc}</p>
              <Link href="/cart" className="suivi-empty-link">{ui.orderNow}</Link>
            </div>
          ) : (
            <div className="suivi-results">
              <p className="suivi-results-count">{orders.length} {orders.length > 1 ? ui.foundPlural : ui.foundSingle}</p>
              {orders.map((order: any) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )
        )}

        <div className="suivi-back">
          <Link href="/" className="suivi-back-link">{ui.back}</Link>
        </div>
      </div>
    </div>
  );
}
