import {
  LayoutDashboard, Laptop, Package, ShoppingCart,
  Tag, BarChart3, Settings, ArrowLeft, Menu, LogOut, Shield
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";

export type AdminSection = "dashboard" | "laptops" | "accessories" | "orders" | "promo" | "reports" | "settings";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onChangeSection: (section: AdminSection) => void;
}

const navItems: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "laptops", label: "Laptops", icon: Laptop },
  { id: "accessories", label: "Accessories", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "promo", label: "Promo Codes", icon: Tag },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ activeSection, onChangeSection }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const NavContent = () => (
    <div className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <h2 className="text-2xl font-black tracking-tighter text-gradient-roc">R⊙C DZ</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Admin Panel</p>
        {user && <p className="text-xs text-primary mt-2 font-medium">{user.displayName}</p>}
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeSection(item.id)}
              data-testid={`admin-nav-${item.id}`}
              className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/20 text-primary border-l-2 border-primary rounded-l-none"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        {user?.role === "super_admin" && (
          <Link href="/super-admin" className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors py-2 px-3 rounded-md hover:bg-primary/10">
            <Shield className="h-4 w-4" />Super Admin
          </Link>
        )}
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md">
          <ArrowLeft className="h-4 w-4" />Back to Store
        </Link>
        <button onClick={handleLogout} className="flex items-center w-full gap-2 text-sm text-red-400 hover:text-red-300 transition-colors py-2 px-3 rounded-md">
          <LogOut className="h-4 w-4" />Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block w-[260px] h-screen fixed left-0 top-0 z-40">
        <NavContent />
      </aside>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border z-40 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px] bg-sidebar border-sidebar-border">
              <NavContent />
            </SheetContent>
          </Sheet>
          <h2 className="text-xl font-black text-gradient-roc">R⊙C DZ</h2>
        </div>
        <button onClick={handleLogout} className="text-red-400"><LogOut className="h-5 w-5" /></button>
      </div>
    </>
  );
}
