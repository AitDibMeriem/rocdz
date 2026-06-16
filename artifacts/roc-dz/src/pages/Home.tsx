import { useGetFeaturedLaptop, useListBrands } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Badge, CheckCircle2, Shield, Truck, Zap } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredLaptop, isLoading: isLoadingFeatured } = useGetFeaturedLaptop();
  const { data: brands, isLoading: isLoadingBrands } = useListBrands();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[120px] -top-1/2 -left-1/2 w-full h-full mix-blend-screen" />
        <div className="absolute inset-0 bg-accent/5 rounded-full blur-[120px] -bottom-1/2 -right-1/2 w-full h-full mix-blend-screen" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium w-fit">
                <Zap className="w-4 h-4" /> Algeria's Premium Laptop Store
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-foreground">
                Unleash Your <br/>
                <span className="text-gradient-roc">True Potential.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                High-performance laptops for gaming, creation, and professional work. Shipped to all 58 wilayas.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-lg h-14 px-8 shadow-[0_0_20px_rgba(233,30,140,0.4)]">
                  <Link href="/models">View Models <ArrowRight className="w-5 h-5 ml-2" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/10 hover:bg-white/5 text-foreground h-14 px-8">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-[laptopFloat_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl animate-[glowPulse_4s_ease-in-out_infinite]" />
              <img 
                src="/hero-laptop.png" 
                alt="High performance laptop" 
                className="relative z-10 w-full max-w-2xl mx-auto drop-shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/800x600/0d0218/e91e8c?text=ROC+DZ+LAPTOP";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <div className="w-full overflow-hidden bg-black/40 border-y border-white/5 py-6">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {/* Double the content for seamless loop */}
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-16 px-8 text-2xl font-black tracking-widest text-muted-foreground/40">
              <span>DELL</span> • <span>HP</span> • <span>LENOVO</span> • <span>ASUS</span> • <span>MSI</span> • <span>APPLE</span> • <span>ACER</span> •
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">What are you looking for?</h2>
            <p className="text-muted-foreground">Choose from our pristine collection.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/models?condition=new">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-8 hover:border-primary/50 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Brand New</h3>
                <p className="text-muted-foreground mb-6">Factory sealed, latest generation hardware with full manufacturer warranty.</p>
                <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
            <Link href="/models?condition=refurbished">
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-8 hover:border-accent/50 transition-all cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">Certified Refurbished</h3>
                <p className="text-muted-foreground mb-6">Rigorously tested, practically new condition with ROC DZ store warranty.</p>
                <ArrowRight className="w-6 h-6 text-accent group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Pick of the Day */}
      <section className="py-24 bg-black/40 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <div className="text-primary font-bold tracking-wider uppercase mb-2">Featured Product</div>
              <h2 className="text-3xl md:text-5xl font-black">Pick of the Day</h2>
            </div>
          </div>
          
          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card/30 rounded-3xl p-8 border border-white/5">
              <Skeleton className="w-full aspect-[4/3] rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-12 w-1/3 mt-8" />
              </div>
            </div>
          ) : featuredLaptop ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card/30 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 blur-2xl -z-10 rounded-full" />
                <img 
                  src={featuredLaptop.imageUrl || "/featured-laptop.png"} 
                  alt={featuredLaptop.title} 
                  className="w-full h-auto rounded-xl shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/800x600/0d0218/e91e8c?text=Featured";
                  }}
                />
              </div>
              <div>
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="border-primary/50 text-primary">{featuredLaptop.brand}</Badge>
                  {featuredLaptop.condition === "new" ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">New</Badge>
                  ) : (
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">Refurbished</Badge>
                  )}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">{featuredLaptop.title}</h3>
                <p className="text-muted-foreground mb-8 text-lg line-clamp-3">{featuredLaptop.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Processor</div>
                    <div className="font-semibold">{featuredLaptop.processor}</div>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Graphics</div>
                    <div className="font-semibold">{featuredLaptop.gpu || "Integrated"}</div>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Memory</div>
                    <div className="font-semibold">{featuredLaptop.ram}GB {featuredLaptop.ramType}</div>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="text-xs text-muted-foreground mb-1">Storage</div>
                    <div className="font-semibold">{featuredLaptop.storage}GB {featuredLaptop.storageType}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-4xl font-black text-gradient-roc">{featuredLaptop.price.toLocaleString("fr-DZ")} DA</div>
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white ml-auto">
                    <Link href={`/laptop/${featuredLaptop.id}`}>View Product <ArrowRight className="w-5 h-5 ml-2" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">No featured product currently available.</div>
          )}
        </div>
      </section>

      {/* Commitments */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground">The ROC DZ standard of excellence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card/30 border border-white/5 rounded-2xl">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Guaranteed Quality</h3>
              <p className="text-muted-foreground">Every laptop is rigorously tested and verified by our hardware experts before sale.</p>
            </div>
            <div className="text-center p-8 bg-card/30 border border-white/5 rounded-2xl">
              <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-6">
                <Truck className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">58 Wilayas Shipping</h3>
              <p className="text-muted-foreground">Fast, secure, and insured delivery to anywhere in Algeria. Your tech arrives safely.</p>
            </div>
            <div className="text-center p-8 bg-card/30 border border-white/5 rounded-2xl">
              <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Store Warranty</h3>
              <p className="text-muted-foreground">Buy with peace of mind. We provide comprehensive warranty coverage on all devices.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
