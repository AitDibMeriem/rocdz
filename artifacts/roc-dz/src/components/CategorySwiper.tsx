import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategorySwiperProps {
  children: React.ReactNode;
  className?: string;
}

export function CategorySwiper({ children, className = "" }: CategorySwiperProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", sync); ro.disconnect(); };
  }, [sync]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".brand-card") as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={`category-swiper-wrap ${className}`} style={{ position: "relative" }}>
      <button
        type="button"
        className="swiper-arrow swiper-arrow-prev"
        onClick={() => scroll(-1)}
        style={{ opacity: canPrev ? 1 : 0, pointerEvents: canPrev ? "auto" : "none" }}
        aria-label="Précédent"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div ref={trackRef} className={`brand-grid brand-grid-swipe`}>
        {children}
      </div>

      <button
        type="button"
        className="swiper-arrow swiper-arrow-next"
        onClick={() => scroll(1)}
        style={{ opacity: canNext ? 1 : 0, pointerEvents: canNext ? "auto" : "none" }}
        aria-label="Suivant"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
