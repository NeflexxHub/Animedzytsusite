import { Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Anime } from "@shared/schema";

interface AnimeCardProps {
  anime: Anime;
  onClick?: (anime: Anime) => void;
  className?: string;
}

export function AnimeCard({ anime, onClick, className }: AnimeCardProps) {
  const handleClick = () => {
    onClick?.(anime);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(anime);
    }
  };

  return (
    <div
      className={cn(
        "group relative cursor-pointer rounded-lg overflow-visible",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      data-testid={`card-anime-${anime.id}`}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground fill-current" />
          </div>
        </div>

        <div className="absolute top-2 right-2">
          <Badge className="bg-black/70 text-white border-none">
            <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
            {anime.rating.toFixed(1)}
          </Badge>
        </div>

        {anime.status === "ongoing" && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary text-primary-foreground border-none text-xs">
              Ongoing
            </Badge>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {anime.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
