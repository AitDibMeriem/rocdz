import { useRoute } from "wouter";
import { useGetLaptop } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldAlert, Cpu, HardDrive, MemoryStick as Memory, Monitor, Battery, Weight, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LaptopDetail() {
  const [, params] = useRoute("/laptop/:id");
  const id = params?.id ? parseInt(params.id, 10) : 0;

  const { data: laptop, isLoading, error } = useGetLaptop(id, {
    query: {
      enabled: !!id,
      queryKey: ["/api/laptops", id] // Simplified query key for standard usage
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !laptop) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4 text-destructive">Laptop Not Found</h2>
        <p className="text-muted-foreground">The laptop you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 blur-3xl -z-10 rounded-full" />
          <div className="bg-black/60 rounded-3xl overflow-hidden border border-white/10 aspect-[4/3] flex items-center justify-center relative">
            <img 
              src={laptop.imageUrl || "https://placehold.co/800x600/1a1a1a/e91e8c?text=ROC+DZ"} 
              alt={laptop.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {laptop.condition === "new" ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-3 py-1 text-sm backdrop-blur-md">Brand New</Badge>
              ) : (
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 px-3 py-1 text-sm backdrop-blur-md">Refurbished</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-bold tracking-widest text-primary uppercase">{laptop.brand}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{laptop.model}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black mb-6 text-foreground">{laptop.title}</h1>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="text-4xl font-black text-gradient-roc">
              {laptop.price.toLocaleString("fr-DZ")} DA
            </div>
            
            <div className="flex items-center gap-2">
              {laptop.stockQuantity > 0 ? (
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/50">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> {laptop.stockQuantity} in stock
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/50">
                  <AlertCircle className="w-4 h-4 mr-1" /> Out of stock
                </Badge>
              )}
            </div>
          </div>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {laptop.description || "No description provided for this model."}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
              <Cpu className="w-6 h-6 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Processor</div>
                <div className="font-semibold text-sm">{laptop.processor}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
              <Memory className="w-6 h-6 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">RAM</div>
                <div className="font-semibold text-sm">{laptop.ram}GB {laptop.ramType}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
              <HardDrive className="w-6 h-6 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Storage</div>
                <div className="font-semibold text-sm">{laptop.storage}GB {laptop.storageType}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
              <Monitor className="w-6 h-6 text-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Display</div>
                <div className="font-semibold text-sm">{laptop.screenSize}" {laptop.screenResolution}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-14" disabled={laptop.stockQuantity <= 0}>
              Buy Now
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 border-white/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed Specs Table */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-primary" /> Detailed Specifications
        </h2>
        
        <div className="bg-card/30 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <tbody>
              {/* Performance */}
              <tr className="bg-primary/5">
                <th colSpan={2} className="p-4 font-bold text-primary">Performance</th>
              </tr>
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Processor</th>
                <td className="p-4 font-medium">{laptop.processor}</td>
              </tr>
              {laptop.cores && (
                <tr className="border-b border-white/5">
                  <th className="p-4 w-1/3 text-muted-foreground font-normal">Cores / Threads</th>
                  <td className="p-4 font-medium">{laptop.cores} Cores / {laptop.threads} Threads</td>
                </tr>
              )}
              {(laptop.processorSpeedMin || laptop.processorSpeedMax) && (
                <tr className="border-b border-white/5">
                  <th className="p-4 w-1/3 text-muted-foreground font-normal">Clock Speed</th>
                  <td className="p-4 font-medium">{laptop.processorSpeedMin} - {laptop.processorSpeedMax}</td>
                </tr>
              )}
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Memory (RAM)</th>
                <td className="p-4 font-medium">{laptop.ram}GB {laptop.ramType}</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Graphics (GPU)</th>
                <td className="p-4 font-medium">{laptop.gpu || "Integrated Graphics"}</td>
              </tr>

              {/* Storage & Display */}
              <tr className="bg-primary/5 border-y border-white/5">
                <th colSpan={2} className="p-4 font-bold text-primary">Storage & Display</th>
              </tr>
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Storage Capacity</th>
                <td className="p-4 font-medium">{laptop.storage}GB {laptop.storageType}</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Screen Size</th>
                <td className="p-4 font-medium">{laptop.screenSize}"</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Resolution</th>
                <td className="p-4 font-medium">{laptop.screenResolution}</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Touchscreen</th>
                <td className="p-4 font-medium">{laptop.touchscreen ? "Yes" : "No"}</td>
              </tr>

              {/* Physical & Extras */}
              <tr className="bg-primary/5 border-y border-white/5">
                <th colSpan={2} className="p-4 font-bold text-primary">Physical & Warranty</th>
              </tr>
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Operating System</th>
                <td className="p-4 font-medium">{laptop.operatingSystem || "Not specified"}</td>
              </tr>
              {laptop.weight && (
                <tr className="border-b border-white/5">
                  <th className="p-4 w-1/3 text-muted-foreground font-normal">Weight</th>
                  <td className="p-4 font-medium">{laptop.weight}</td>
                </tr>
              )}
              {laptop.batteryEstimation && (
                <tr className="border-b border-white/5">
                  <th className="p-4 w-1/3 text-muted-foreground font-normal">Battery Life</th>
                  <td className="p-4 font-medium">{laptop.batteryEstimation}</td>
                </tr>
              )}
              <tr className="border-b border-white/5">
                <th className="p-4 w-1/3 text-muted-foreground font-normal">Warranty</th>
                <td className="p-4 font-medium">{laptop.warrantyMonths} Months</td>
              </tr>
              {laptop.condition === "refurbished" && laptop.conditionScore && (
                <tr>
                  <th className="p-4 w-1/3 text-muted-foreground font-normal">Condition Score</th>
                  <td className="p-4 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-orange-400">{laptop.conditionScore}/10</div>
                      <div className="text-xs text-muted-foreground">({laptop.conditionDescription})</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
