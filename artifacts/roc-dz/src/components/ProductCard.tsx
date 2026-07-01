import { Link } from "wouter";
import { Laptop } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Cpu, HardDrive, MemoryStick as Memory, Tag } from "lucide-react";

function clImg(url: string | undefined | null, w = 400): string {
  if (!url) return "";
  return url.replace(
    /\/upload\//,
    `/upload/f_auto,q_auto:good,w_${w},c_fill/`,
  );
}

interface ProductCardProps {
  laptop: Laptop;
}

export function ProductCard({ laptop }: ProductCardProps) {
  const hasPromo = laptop.salePrice != null && laptop.salePrice > 0 && laptop.salePrice < laptop.price;
  const displayPrice = hasPromo ? laptop.salePrice! : laptop.price;
  const discount = hasPromo ? Math.round((1 - laptop.salePrice! / laptop.price) * 100) : 0;

  return (
    <Link href={`/laptop/${laptop.id}`} className="block group overflow-hidden border border-white/5 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 rounded-xl cursor-pointer">
      <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
        <img
          src={clImg(laptop.imageUrl) || "https://placehold.co/600x400/1a1a1a/e91e8c?text=ROC+DZ"}
          alt={laptop.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {laptop.condition === "new" ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 backdrop-blur-md text-[10px] px-1.5 py-0.5">Neuf</Badge>
          ) : (
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50 backdrop-blur-md text-[10px] px-1.5 py-0.5">Occasion</Badge>
          )}
          {laptop.featured && (
            <Badge className="bg-primary/20 text-primary border-primary/50 backdrop-blur-md text-[10px] px-1.5 py-0.5">❤ Coup de cœur</Badge>
          )}
          {hasPromo && (
            <Badge className="bg-red-500/90 text-white border-red-500 backdrop-blur-md text-[10px] px-1.5 py-0.5 font-black">-{discount}%</Badge>
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
        <h3 className="font-bold text-sm sm:text-base mb-2 line-clamp-2 text-foreground group-hover:text-primary transition-colors">
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

        <div className="flex items-end gap-2 flex-wrap">
          <div className="font-black text-lg sm:text-xl text-gradient-roc">
            {displayPrice.toLocaleString("fr-DZ")} DA
          </div>
          {hasPromo && (
            <div className="text-sm text-muted-foreground line-through mb-0.5">
              {laptop.price.toLocaleString("fr-DZ")} DA
            </div>
          )}
        </div>
        {hasPromo && (
          <div className="flex items-center gap-1 mt-1">
            <Tag className="w-3 h-3 text-red-400" />
            <span className="text-[10px] text-red-400 font-bold">PROMO — Économisez {(laptop.price - displayPrice).toLocaleString("fr-DZ")} DA</span>
          </div>
        )}
      </div>
    </Link>
  );
}
