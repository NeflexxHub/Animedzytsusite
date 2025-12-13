import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimeCard } from "@/components/anime-card";
import { cn } from "@/lib/utils";
import type { Anime } from "@shared/schema";

interface AnimeCarouselProps {
  title: string;
  animeList: Anime[];
  seeAllLink?: string;
  onAnimeClick?: (anime: Anime) => void;
  className?: string;
}

export function AnimeCarousel({
  title,
  animeList,
  seeAllLink,
  onAnimeClick,
  className,
}: AnimeCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [animeList]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.75;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  if (animeList.length === 0) {
    return null;
  }

  return (
    <section className={cn("relative", className)} data-testid="anime-carousel">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {title}
        </h2>
        {seeAllLink && (
          <Link
            href={seeAllLink}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-see-all"
          >
            See all
          </Link>
        )}
      </div>

      <div className="relative group">
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
            !canScrollLeft && "invisible"
          )}
          style={{ visibility: canScrollLeft ? "visible" : "hidden" }}
          onClick={() => scroll("left")}
          data-testid="button-scroll-left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {animeList.map((anime) => (
            <div
              key={anime.id}
              className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
            >
              <AnimeCard anime={anime} onClick={onAnimeClick} />
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
            !canScrollRight && "invisible"
          )}
          style={{ visibility: canScrollRight ? "visible" : "hidden" }}
          onClick={() => scroll("right")}
          data-testid="button-scroll-right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
