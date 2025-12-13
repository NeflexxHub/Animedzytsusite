import { Play, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Episode } from "@shared/schema";

interface EpisodeCardProps {
  episode: Episode;
  onClick?: (episode: Episode) => void;
  className?: string;
}

export function EpisodeCard({ episode, onClick, className }: EpisodeCardProps) {
  const handleClick = () => {
    onClick?.(episode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.(episode);
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
      data-testid={`card-episode-${episode.id}`}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden">
        {episode.thumbnail ? (
          <img
            src={episode.thumbnail}
            alt={`Episode ${episode.number}: ${episode.title}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary-foreground fill-current" />
          </div>
        </div>

        {episode.duration && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-black/70 text-white border-none text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {episode.duration}
            </Badge>
          </div>
        )}

        {episode.filler && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="text-xs">
              Filler
            </Badge>
          </div>
        )}
      </div>

      <div className="mt-2 space-y-1">
        <p className="text-xs text-muted-foreground">Episode {episode.number}</p>
        <h4 className="text-sm font-medium text-foreground line-clamp-1">
          {episode.title}
        </h4>
      </div>
    </div>
  );
}
