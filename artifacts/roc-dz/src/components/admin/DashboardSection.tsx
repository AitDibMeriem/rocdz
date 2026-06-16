import { useState } from "react";
import { 
  useGetLaptopStats, 
  useGetFeaturedLaptop, 
  useListLaptops,
  useUpdateLaptop,
  getListLaptopsQueryKey,
  getGetFeaturedLaptopQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Laptop, Package, Activity, Star, RefreshCcw, LayoutGrid, CheckCircle2, ShoppingCart, DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-DZ').format(price) + ' DA';
};

export function DashboardSection() {
  const { data: stats, isLoading: statsLoading } = useGetLaptopStats();
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedLaptop();
  const { data: laptops, isLoading: laptopsLoading } = useListLaptops({ limit: 5 } as any);
  const { data: allLaptops } = useListLaptops();
  
  const queryClient = useQueryClient();
  const updateLaptop = useUpdateLaptop();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSetFeatured = (id: number) => {
    updateLaptop.mutate(
      { id, data: { featured: true } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetFeaturedLaptopQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListLaptopsQueryKey() });
          setModalOpen(false);
          toast({ title: "Featured laptop updated" });
        },
        onError: () => {
          toast({ title: "Failed to update featured laptop", variant: "destructive" });
        }
      }
    );
  };

  const kpis = [
    { title: "Total Products", value: stats?.totalLaptops || 0, icon: Package, loading: statsLoading },
    { title: "Laptops", value: stats?.totalLaptops || 0, icon: Laptop, loading: statsLoading },
    { title: "In Stock", value: stats?.inStock || 0, icon: CheckCircle2, loading: statsLoading },
    { title: "New Products", value: stats?.newCount || 0, icon: Star, loading: statsLoading },
    { title: "Refurbished", value: stats?.refurbishedCount || 0, icon: RefreshCcw, loading: statsLoading },
    { title: "Brands", value: stats?.brands || 0, icon: LayoutGrid, loading: statsLoading },
    { title: "Orders Today", value: "—", icon: ShoppingCart, loading: false },
    { title: "Revenue Today", value: "—", icon: DollarSign, loading: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-card border-border/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {kpi.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{kpi.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Featured Pick of the Day</CardTitle>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Change Featured</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Select Featured Laptop</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[400px] mt-4 rounded-md border border-border">
                  <div className="p-4 space-y-2">
                    {allLaptops?.map((laptop) => (
                      <div key={laptop.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                            {laptop.imageUrl ? (
                              <img src={laptop.imageUrl} alt={laptop.title} className="w-full h-full object-cover" />
                            ) : (
                              <Laptop className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{laptop.brand} {laptop.title}</p>
                            <p className="text-xs text-muted-foreground">{formatPrice(laptop.price)}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant={laptop.featured ? "secondary" : "default"}
                          disabled={laptop.featured || updateLaptop.isPending}
                          onClick={() => handleSetFeatured(laptop.id)}
                        >
                          {laptop.featured ? "Current" : "Set Featured"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {featuredLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : featured ? (
              <div className="relative rounded-xl overflow-hidden border border-primary/20 bg-background p-1 group">
                <div className="absolute inset-0 bg-gradient-roc opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative z-10 flex flex-col items-center p-6 text-center">
                  <div className="w-40 h-40 mb-6">
                    {featured.imageUrl ? (
                      <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-contain mix-blend-screen" />
                    ) : (
                      <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                        <Laptop className="w-16 h-16 text-muted-foreground opacity-50" />
                      </div>
                    )}
                  </div>
                  <Badge className="mb-3 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
                    <Star className="w-3 h-3 mr-1 fill-primary" />
                    Featured
                  </Badge>
                  <h3 className="text-xl font-bold mb-2">{featured.brand} {featured.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={featured.condition === 'new' ? 'text-green-400 border-green-400/30' : 'text-orange-400 border-orange-400/30'}>
                      {featured.condition === 'new' ? 'New' : `Refurbished ${featured.conditionScore}/10`}
                    </Badge>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{featured.stockQuantity} in stock</span>
                  </div>
                  <p className="text-2xl font-black text-gradient-roc">{formatPrice(featured.price)}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                No featured laptop selected
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border col-span-1">
          <CardHeader>
            <CardTitle>Latest Additions</CardTitle>
          </CardHeader>
          <CardContent>
            {laptopsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {laptops?.map((laptop) => (
                  <div key={laptop.id} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                        {laptop.imageUrl ? (
                          <img src={laptop.imageUrl} alt={laptop.title} className="w-full h-full object-cover" />
                        ) : (
                          <Laptop className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{laptop.brand} {laptop.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-[10px] h-4 px-1 ${laptop.condition === 'new' ? 'text-green-400 border-green-400/30' : 'text-orange-400 border-orange-400/30'}`}>
                            {laptop.condition}
                          </Badge>
                          <span className="text-xs font-semibold">{formatPrice(laptop.price)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium ${laptop.stockQuantity === 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {laptop.stockQuantity} stock
                      </div>
                    </div>
                  </div>
                ))}
                {!laptops?.length && (
                  <div className="py-8 text-center text-muted-foreground">
                    No laptops found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
