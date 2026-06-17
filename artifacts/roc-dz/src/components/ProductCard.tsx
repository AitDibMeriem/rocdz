import { Link } from "wouter";
import { Laptop } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, MemoryStick as Memory } from "lucide-react";

interface ProductCardProps {
  laptop: Laptop;
}

export function ProductCard({ laptop }: ProductCardProps) {
  return (
    <Link href={`/laptop/${laptop.id}`} className="block group overflow-hidden border border-white/5 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 rounded-xl cursor-pointer">
      <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
        <img
          src={laptop.imageUrl || "https://placehold.co/600x400/1a1a1a/e91e8c?text=ROC+DZ"}
          alt={laptop.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {laptop.condition === "new" ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 backdrop-blur-md">Neuf</Badge>
          ) : (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 backdrop-blur-md">Occasion</Badge>
          )}
          {laptop.featured && (
            <Badge className="bg-primary/20 text-primary border-primary/50 backdrop-blur-md">Coup de cœur</Badge>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{laptop.brand}</p>
          <p className="text-xs font-medium">
            {laptop.stockQuantity > 0 ? (
              <span className="text-green-400">En stock</span>
            ) : (
              <span className="text-destructive">Rupture</span>
            )}
          </p>
        </div>
        <h3 className="font-bold text-sm sm:text-base mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
          {laptop.title}
        </h3>

        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 p-1.5 rounded-md">
            <Cpu className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="truncate">{laptop.processor || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 p-1.5 rounded-md">
            <Memory className="w-3 h-3 text-primary flex-shrink-0" />
            <span>{laptop.ram}GB {laptop.ramType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 p-1.5 rounded-md col-span-2">
            <HardDrive className="w-3 h-3 text-primary flex-shrink-0" />
            <span>{laptop.storage}GB {laptop.storageType}</span>
          </div>
        </div>

        <div className="font-black text-lg sm:text-xl text-gradient-roc">
          {laptop.price.toLocaleString("fr-DZ")} DA
        </div>
      </div>
    </Link>
  );
}
