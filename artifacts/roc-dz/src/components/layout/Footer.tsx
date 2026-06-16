import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-black tracking-tighter text-gradient-roc">R⊙C DZ</span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm">
            Algeria's premium laptop destination. New and certified pre-owned laptops shipped across all 58 wilayas.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Navigation</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/models" className="hover:text-primary transition-colors">Models</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Warranty Info</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} ROC DZ. All rights reserved.
      </div>
    </footer>
  );
}
