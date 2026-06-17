import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Models from "@/pages/Models";
import LaptopDetail from "@/pages/LaptopDetail";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import SuperAdmin from "@/pages/SuperAdmin";
import Cart from "@/pages/Cart";
import Accessories from "@/pages/Accessories";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const queryClient = new QueryClient();

function ProtectedAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Chargement...</div></div>;
  if (!user) return <Redirect to="/admin/login" />;
  return <>{children}</>;
}

function ProtectedSuperAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Chargement...</div></div>;
  if (!user || user.role !== "super_admin") return <Redirect to="/admin/login" />;
  return <>{children}</>;
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin") || location.startsWith("/super-admin");

  if (isAdmin) {
    return (
      <Switch>
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin">
          {() => <ProtectedAdmin><Admin /></ProtectedAdmin>}
        </Route>
        <Route path="/admin/:rest*">
          {() => <ProtectedAdmin><Admin /></ProtectedAdmin>}
        </Route>
        <Route path="/super-admin">
          {() => <ProtectedSuperAdmin><SuperAdmin /></ProtectedSuperAdmin>}
        </Route>
      </Switch>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-1 w-full">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/models" component={Models} />
          <Route path="/accessories" component={Accessories} />
          <Route path="/laptop/:id" component={LaptopDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
