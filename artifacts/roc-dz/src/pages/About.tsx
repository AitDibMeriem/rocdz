import { Shield, Zap, Laptop, Cpu, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] -top-1/2 left-1/4 w-[800px] h-[800px] mix-blend-screen pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            About <span className="text-gradient-roc">ROC DZ</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Republic of Computer. Algeria's premier destination for high-end laptops, gaming rigs, and professional workstations.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At ROC DZ, we believe that access to top-tier technology shouldn't be a struggle. We source the finest new and certified refurbished laptops globally and make them accessible to creators, gamers, and professionals across all 58 wilayas of Algeria.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every pixel of our store and every component in our laptops is chosen with uncompromising standards. We don't just sell computers; we provide the tools to build your future.
              </p>
            </div>
            <div className="relative aspect-square rounded-full border border-primary/20 p-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-2xl" />
              <Cpu className="w-32 h-32 text-primary opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-black/40 border-y border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-16">The ROC Standard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card/30 p-8 rounded-2xl border border-white/5">
              <Award className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">Uncompromising Quality</h3>
              <p className="text-muted-foreground">Whether brand new or refurbished, every machine undergoes a rigorous multi-point inspection before it reaches your hands.</p>
            </div>
            <div className="bg-card/30 p-8 rounded-2xl border border-white/5">
              <Shield className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-xl font-bold mb-4">Ironclad Warranty</h3>
              <p className="text-muted-foreground">We stand by our hardware. Our comprehensive store warranty ensures you're protected long after your purchase.</p>
            </div>
            <div className="bg-card/30 p-8 rounded-2xl border border-white/5">
              <Zap className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-4">Expert Support</h3>
              <p className="text-muted-foreground">Our team consists of hardware enthusiasts who understand exactly what you need for gaming, rendering, or coding.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
