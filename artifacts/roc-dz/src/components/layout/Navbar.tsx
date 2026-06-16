import { Link } from "wouter";
import { Laptop, Cpu, Home, Info } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Cpu className="w-8 h-8 text-primary" />
          <span className="text-2xl font-black tracking-tighter text-gradient-roc">R⊙C DZ</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/models" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Laptop className="w-4 h-4" /> Models
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Info className="w-4 h-4" /> About
          </Link>
        </div>
      </div>
    </nav>
  );
}
