import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
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

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/admin/:rest*" component={Admin} />
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
          <Route path="/laptop/:id" component={LaptopDetail} />
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
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
