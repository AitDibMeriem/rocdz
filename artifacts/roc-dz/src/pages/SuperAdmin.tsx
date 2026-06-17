import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, Users, Laptop, Package, ShoppingCart, Tag,
  Settings, Shield, LogOut, TrendingUp, BarChart3, ArrowLeft,
  Plus, Trash2, Edit, UserCheck, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGetLaptopStats, useListLaptops } from "@workspace/api-client-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type SaSection = "dashboard" | "admins" | "laptops" | "orders" | "promo" | "analytics" | "settings" | "security";

const NAV: { id: SaSection; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "admins", label: "Gestion Admins", icon: UserCheck },
  { id: "laptops", label: "Produits", icon: Laptop },
  { id: "orders", label: "Commandes", icon: ShoppingCart },
  { id: "promo", label: "Codes Promo", icon: Tag },
  { id: "analytics", label: "Analytiques", icon: BarChart3 },
  { id: "settings", label: "Paramètres", icon: Settings },
  { id: "security", label: "Sécurité", icon: Shield },
];

const ROLES = ["ADMIN", "SALES_MANAGER", "INVENTORY_MANAGER", "CUSTOMER_SUPPORT"];

interface AdminAccount { id: string; username: string; displayName: string; role: string; createdAt: string; active: boolean; }

const INITIAL_ADMINS: AdminAccount[] = [
  { id: "1", username: "rocdz2026", displayName: "Admin Principal", role: "ADMIN", createdAt: new Date().toISOString(), active: true },
];

function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: async () => { const r = await fetch(`${BASE}/api/orders`); return r.json() as Promise<any[]>; } });
}
function usePromoCodes() {
  return useQuery({ queryKey: ["promo-codes"], queryFn: async () => { const r = await fetch(`${BASE}/api/promo-codes`); return r.json() as Promise<any[]>; } });
}

function DashboardSA() {
  const { data: stats } = useGetLaptopStats();
  const { data: orders = [] } = useOrders();
  const { data: promos = [] } = usePromoCodes();
  const { data: laptops = [] } = useListLaptops();

  const totalRevenue = (orders as any[]).filter(o => o.status === "delivered").reduce((acc: number, o: any) => acc + (o.totalPrice || 0), 0);
  const today = new Date().toDateString();
  const revenueToday = (orders as any[]).filter(o => o.status === "delivered" && new Date(o.createdAt).toDateString() === today).reduce((acc: number, o: any) => acc + (o.totalPrice || 0), 0);

  const kpis = [
    { label: "Chiffre d'affaires total", value: `${totalRevenue.toLocaleString("fr-DZ")} DA`, color: "#e91e8c", icon: TrendingUp },
    { label: "Revenus aujourd'hui", value: `${revenueToday.toLocaleString("fr-DZ")} DA`, color: "#b829dd", icon: TrendingUp },
    { label: "Total Commandes", value: (orders as any[]).length, color: "#4f46e5", icon: ShoppingCart },
    { label: "Total Produits", value: stats?.totalLaptops ?? "—", color: "#0ea5e9", icon: Laptop },
    { label: "En Stock", value: stats?.inStock ?? "—", color: "#10b981", icon: Package },
    { label: "Codes Promo Actifs", value: (promos as any[]).filter((p: any) => p.active).length, color: "#f59e0b", icon: Tag },
    { label: "Admins", value: 2, color: "#8b5cf6", icon: Users },
    { label: "Marques", value: stats?.brands ?? "—", color: "#06b6d4", icon: BarChart3 },
  ];

  const recentOrders = (orders as any[]).slice(0, 5);
  const STATUS_COLORS: Record<string, string> = {
    reserved: "text-yellow-400", confirmed: "text-blue-400", prepared: "text-purple-400",
    shipped: "text-cyan-400", delivered: "text-green-400", cancelled: "text-red-400", returned: "text-orange-400",
  };
  const STATUS_LABELS: Record<string, string> = {
    reserved: "Réservé", confirmed: "Confirmé", prepared: "Préparé",
    shipped: "Expédié", delivered: "Livré", cancelled: "Annulé", returned: "Retourné",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Tableau de Bord Super Admin</h2>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble complète du système ROC DZ</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider truncate">{k.label}</span>
            </div>
            <div className="text-2xl font-black" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-primary" />Commandes Récentes</h3>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune commande</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o: any) => (
                <div key={o.id} className="flex justify-between items-center text-sm border-b border-border pb-2 last:border-0">
                  <div><span className="font-mono text-muted-foreground">#{String(o.id).padStart(4, "0")}</span><span className="font-medium ml-2">{o.customerName}</span></div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{(o.totalPrice || 0).toLocaleString("fr-DZ")} DA</span>
                    <span className={`font-medium text-xs ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Laptop className="w-5 h-5 text-primary" />Derniers Produits</h3>
          <div className="space-y-3">
            {(laptops as any[]).slice(0, 5).map((l: any) => (
              <div key={l.id} className="flex justify-between items-center text-sm border-b border-border pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  {l.imageUrl && <img src={l.imageUrl} className="w-8 h-8 object-contain rounded" alt="" />}
                  <span className="font-medium truncate max-w-[200px]">{l.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={l.condition === "new" ? "text-green-400 border-green-400/30" : "text-orange-400 border-orange-400/30"}>
                    {l.condition === "new" ? "Neuf" : "Reconditionné"}
                  </Badge>
                  <span className="font-bold text-primary text-xs">{l.price.toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminsSA() {
  const [admins, setAdmins] = useState<AdminAccount[]>(INITIAL_ADMINS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: "", displayName: "", role: "ADMIN", password: "" });
  const { toast } = useToast();

  const createAdmin = () => {
    if (!form.username || !form.password) return;
    setAdmins(prev => [...prev, {
      id: String(Date.now()), username: form.username, displayName: form.displayName || form.username,
      role: form.role, createdAt: new Date().toISOString(), active: true,
    }]);
    setOpen(false);
    setForm({ username: "", displayName: "", role: "ADMIN", password: "" });
    toast({ title: "Admin créé avec succès" });
  };

  const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Administrateur", SALES_MANAGER: "Responsable Ventes",
    INVENTORY_MANAGER: "Responsable Stock", CUSTOMER_SUPPORT: "Support Client",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestion des Admins</h2>
          <p className="text-muted-foreground text-sm mt-1">Gérer les comptes administrateurs</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2 bg-primary text-white">
          <Plus className="w-4 h-4" />Créer Admin
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/20 to-purple-900/20 border border-primary/30 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">SA</div>
            <div>
              <p className="font-bold">Super Admin</p>
              <p className="text-xs text-muted-foreground">superroc</p>
            </div>
          </div>
          <Badge className="bg-primary/20 text-primary border-primary/30">SUPER_ADMIN</Badge>
        </div>
        {admins.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-black text-sm text-primary">
                  {a.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{a.displayName}</p>
                  <p className="text-xs text-muted-foreground">{a.username}</p>
                </div>
              </div>
              <button onClick={() => setAdmins(prev => prev.filter(x => x.id !== a.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{ROLE_LABELS[a.role] || a.role}</Badge>
              <Badge className={a.active ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                {a.active ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader><DialogTitle>Créer un Admin</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Nom d'affichage</Label><Input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} className="bg-background" /></div>
            <div><Label>Nom d'utilisateur *</Label><Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="bg-background" /></div>
            <div><Label>Mot de passe *</Label><Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="bg-background" /></div>
            <div>
              <Label>Rôle</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => <SelectItem key={r} value={r}>{r.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={createAdmin} className="bg-primary text-white">Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AnalyticsSA() {
  const { data: orders = [] } = useOrders();
  const { data: laptops = [] } = useListLaptops();

  const brandCount: Record<string, number> = {};
  (laptops as any[]).forEach((l: any) => { brandCount[l.brand] = (brandCount[l.brand] || 0) + 1; });
  const brandEntries = Object.entries(brandCount).sort((a, b) => b[1] - a[1]);
  const maxBrand = brandEntries[0]?.[1] || 1;

  const conditionSplit = {
    new: (laptops as any[]).filter((l: any) => l.condition === "new").length,
    refurbished: (laptops as any[]).filter((l: any) => l.condition === "refurbished").length,
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-bold">Analytiques</h2><p className="text-muted-foreground text-sm mt-1">Performance et statistiques de la boutique</p></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold mb-4">Répartition par Marque</h3>
          <div className="space-y-3">
            {brandEntries.map(([brand, count]) => (
              <div key={brand} className="flex items-center gap-3">
                <span className="w-20 text-sm text-muted-foreground truncate">{brand}</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(count / maxBrand) * 100}%` }} />
                </div>
                <span className="text-sm font-bold w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold mb-4">État des Produits</h3>
          <div className="flex items-center justify-center gap-8 py-6">
            <div className="text-center">
              <div className="text-4xl font-black text-green-400">{conditionSplit.new}</div>
              <div className="text-sm text-muted-foreground mt-1">Neufs</div>
            </div>
            <div className="w-px h-16 bg-border" />
            <div className="text-center">
              <div className="text-4xl font-black text-orange-400">{conditionSplit.refurbished}</div>
              <div className="text-sm text-muted-foreground mt-1">Reconditionnés</div>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mt-4">
            <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full" style={{ width: `${(conditionSplit.new / ((laptops as any[]).length || 1)) * 100}%` }} />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold mb-4">Statut des Commandes</h3>
          {(orders as any[]).length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune commande</p>
          ) : (
            <div className="space-y-2">
              {["reserved","confirmed","delivered","cancelled"].map(s => {
                const count = (orders as any[]).filter((o: any) => o.status === s).length;
                return (
                  <div key={s} className="flex justify-between text-sm py-1">
                    <span className="text-muted-foreground capitalize">{s}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold mb-4">Résumé Financier</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Valeur catalogue</span><span className="font-bold">{(laptops as any[]).reduce((s: number, l: any) => s + l.price, 0).toLocaleString("fr-DZ")} DA</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Commandes livrées</span><span className="font-bold text-green-400">{(orders as any[]).filter((o: any) => o.status === "delivered").length}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Commandes annulées</span><span className="font-bold text-red-400">{(orders as any[]).filter((o: any) => o.status === "cancelled").length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSA() {
  const [settings, setSettings] = useState({ storeName: "ROC DZ", email: "contact@rocdz.com", phone: "+213 XXX XXX XXX", whatsapp: "+213 XXX XXX XXX", address: "Alger, Algérie", facebook: "", instagram: "", tiktok: "" });
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-bold">Paramètres Système</h2><p className="text-muted-foreground text-sm mt-1">Configuration générale de la boutique</p></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-lg text-primary border-b border-border pb-2">Informations Boutique</h3>
          {[["Nom de la boutique", "storeName"], ["Email", "email"], ["Téléphone", "phone"], ["WhatsApp", "whatsapp"], ["Adresse", "address"]].map(([label, key]) => (
            <div key={key}><Label>{label}</Label><Input value={(settings as any)[key]} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} className="bg-background" /></div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-lg text-primary border-b border-border pb-2">Réseaux Sociaux</h3>
          {[["Facebook", "facebook"], ["Instagram", "instagram"], ["TikTok", "tiktok"]].map(([label, key]) => (
            <div key={key}><Label>{label}</Label><Input value={(settings as any)[key]} onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))} placeholder={`URL ${label}`} className="bg-background" /></div>
          ))}
          <Button className="w-full bg-primary text-white" onClick={() => toast({ title: "Paramètres sauvegardés" })}>Sauvegarder</Button>
        </div>
      </div>
    </div>
  );
}

function SecuritySA() {
  const logs = [
    { user: "superroc", action: "Connexion", ip: "192.168.1.1", time: new Date().toLocaleString("fr-DZ") },
    { user: "rocdz2026", action: "Connexion", ip: "192.168.1.2", time: new Date(Date.now() - 3600000).toLocaleString("fr-DZ") },
  ];
  return (
    <div className="space-y-6">
      <div><h2 className="text-3xl font-bold">Centre de Sécurité</h2><p className="text-muted-foreground text-sm mt-1">Journaux d'accès et permissions</p></div>
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" />Journal d'activité</h3>
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
              <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-green-400" /><span className="font-medium">{log.user}</span><span className="text-muted-foreground">— {log.action}</span></div>
              <div className="flex items-center gap-4 text-muted-foreground"><span>{log.ip}</span><span>{log.time}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Sauvegarder la DB", "Exporter SQL", "Vider le cache"].map(action => (
          <div key={action} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"><Shield className="w-5 h-5 text-primary" /></div>
            <p className="font-medium text-sm">{action}</p>
            <Button size="sm" variant="outline" className="mt-3 w-full text-xs">Exécuter</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SuperAdmin() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [active, setActive] = useState<SaSection>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user || user.role !== "super_admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center"><p className="text-muted-foreground mb-4">Accès refusé — Super Admin uniquement</p><Button onClick={() => navigate("/admin/login")}>Se connecter</Button></div>
      </div>
    );
  }

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <DashboardSA />;
      case "admins": return <AdminsSA />;
      case "analytics": return <AnalyticsSA />;
      case "settings": return <SettingsSA />;
      case "security": return <SecuritySA />;
      default: return (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-xl font-bold mb-2">{NAV.find(n => n.id === active)?.label}</h3>
          <p className="text-muted-foreground">Section en cours de développement</p>
        </div>
      );
    }
  };

  const NavContent = () => (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-black text-gradient-roc">R⊙C DZ</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Super Admin</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black">SA</div>
          <span className="text-sm font-medium">{user.displayName}</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => { setActive(item.id); setMobileOpen(false); }}
              className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-primary/20 text-primary border-l-2 border-primary rounded-l-none" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
              <Icon className="h-5 w-5 flex-shrink-0" />{item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border space-y-1">
        <button onClick={() => navigate("/admin")} className="flex items-center w-full gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md">
          <ArrowLeft className="h-4 w-4" />Admin Standard
        </button>
        <button onClick={handleLogout} className="flex items-center w-full gap-2 text-sm text-red-400 hover:text-red-300 transition-colors py-2 px-3 rounded-md">
          <LogOut className="h-4 w-4" />Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <aside className="hidden md:block w-[260px] h-screen fixed left-0 top-0 z-40"><NavContent /></aside>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-[260px] h-full"><NavContent /></div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-40 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(true)} className="text-foreground"><Menu className="h-6 w-6" /></button>
          <h2 className="text-lg font-black text-gradient-roc">R⊙C DZ</h2>
        </div>
        <button onClick={handleLogout} className="text-red-400"><LogOut className="h-5 w-5" /></button>
      </div>
      <main className="flex-1 w-full md:pl-[260px] pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">{renderSection()}</div>
      </main>
    </div>
  );
}
