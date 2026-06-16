import { Link } from "wouter";
import { Laptop } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, MemoryStick as Memory, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  laptop: Laptop;
}

export function ProductCard({ laptop }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-white/5 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
      <CardHeader className="p-0 relative aspect-[4/3] bg-black/40 overflow-hidden">
        <img 
          src={laptop.imageUrl || "https://placehold.co/600x400/1a1a1a/e91e8c?text=ROC+DZ"} 
          alt={laptop.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {laptop.condition === "new" ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 backdrop-blur-md">New</Badge>
          ) : (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 backdrop-blur-md">Refurbished</Badge>
          )}
          {laptop.featured && (
            <Badge className="bg-primary/20 text-primary border-primary/50 backdrop-blur-md">Pick of the Day</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{laptop.brand}</p>
          <p className="text-xs font-medium text-foreground">
            {laptop.stockQuantity > 0 ? (
              <span className="text-green-400">In Stock</span>
            ) : (
              <span className="text-destructive">Out of Stock</span>
            )}
          </p>
        </div>
        <h3 className="font-bold text-lg mb-4 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {laptop.title}
        </h3>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 p-2 rounded-md">
            <Cpu className="w-3 h-3 text-primary" />
            <span className="truncate" title={laptop.processor || ""}>{laptop.processor || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 p-2 rounded-md">
            <Memory className="w-3 h-3 text-primary" />
            <span>{laptop.ram}GB {laptop.ramType}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 p-2 rounded-md col-span-2">
            <HardDrive className="w-3 h-3 text-primary" />
            <span>{laptop.storage}GB {laptop.storageType}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="font-black text-xl text-gradient-roc">
          {laptop.price.toLocaleString("fr-DZ")} DA
        </div>
        <Button asChild size="sm" className="bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/50 transition-all">
          <Link href={`/laptop/${laptop.id}`}>
            Details <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
