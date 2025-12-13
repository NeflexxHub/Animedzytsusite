import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Play, Bookmark, ChevronRight, Calendar, Film, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { EpisodeCard } from "@/components/episode-card";
import { AnimeCarousel } from "@/components/anime-carousel";
import type { Anime, Episode } from "@shared/schema";

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const { data: anime, isLoading: animeLoading } = useQuery<Anime>({
    queryKey: ["/api/anime", id],
  });

  const { data: episodes = [], isLoading: episodesLoading } = useQuery<Episode[]>({
    queryKey: ["/api/anime", id, "episodes"],
  });

  const { data: relatedAnime = [] } = useQuery<Anime[]>({
    queryKey: ["/api/anime", id, "related"],
  });

  const handleWatchClick = () => {
    if (episodes.length > 0) {
      navigate(`/watch/${id}/${episodes[0].id}`);
    }
  };

  const handleEpisodeClick = (episode: Episode) => {
    navigate(`/watch/${id}/${episode.id}`);
  };

  const handleRelatedAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
  };

  if (animeLoading) {
    return (
      <>
        <Header />
        <div className="pt-16">
          <Skeleton className="w-full h-[50vh]" />
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <Skeleton className="w-64 h-96 flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!anime) {
    return (
      <>
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Anime not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16" data-testid="anime-detail-page">
        <div
          className="relative h-[50vh] w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${anime.backdrop || anime.poster})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <nav className="flex items-center gap-2 text-sm text-white/70 mb-4" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-white transition-colors" data-testid="breadcrumb-home">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/catalog" className="hover:text-white transition-colors" data-testid="breadcrumb-catalog">
                  Catalog
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{anime.title}</span>
              </nav>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6 -mt-32 relative z-10">
            <div className="flex-shrink-0">
              <img
                src={anime.poster}
                alt={anime.title}
                className="w-48 md:w-64 aspect-[2/3] object-cover rounded-lg shadow-2xl"
                data-testid="img-anime-poster"
              />
            </div>

            <div className="flex-1 pt-4 lg:pt-24">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2" data-testid="text-anime-title">
                {anime.title}
              </h1>
              {anime.titleOriginal && (
                <p className="text-lg text-muted-foreground mb-4">{anime.titleOriginal}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold" data-testid="text-rating">{anime.rating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">{anime.year}</span>
                <span className="text-muted-foreground">{anime.episodeCount} episodes</span>
                <Badge variant="secondary" className="capitalize" data-testid="badge-status">
                  {anime.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres.map((genre) => (
                  <Badge key={genre} variant="outline" data-testid={`badge-genre-${genre}`}>
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={handleWatchClick}
                  disabled={episodes.length === 0}
                  data-testid="button-watch"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Смотреть
                </Button>
                <Button size="lg" variant="secondary" data-testid="button-bookmark">
                  <Bookmark className="w-5 h-5 mr-2" />
                  В закладки
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                  {anime.description}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Trailer</h2>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">Trailer placeholder</p>
                </div>
              </section>
            </div>

            <aside>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Information</h3>
                <dl className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <dt className="text-sm text-muted-foreground">Studio</dt>
                      <dd className="font-medium" data-testid="text-studio">{anime.studio || "Unknown"}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Film className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <dt className="text-sm text-muted-foreground">Type</dt>
                      <dd className="font-medium" data-testid="text-type">{anime.type}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <dt className="text-sm text-muted-foreground">Status</dt>
                      <dd className="font-medium capitalize" data-testid="text-status">{anime.status}</dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <dt className="text-sm text-muted-foreground">Duration</dt>
                      <dd className="font-medium" data-testid="text-duration">{anime.duration || "24 min"}</dd>
                    </div>
                  </div>
                </dl>
              </Card>
            </aside>
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Episodes</h2>
            {episodesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-lg" />
                ))}
              </div>
            ) : episodes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {episodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    onClick={handleEpisodeClick}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No episodes available</p>
            )}
          </section>

          {relatedAnime.length > 0 && (
            <section className="mt-12 mb-12">
              <AnimeCarousel
                title="Related Anime"
                animeList={relatedAnime}
                onAnimeClick={handleRelatedAnimeClick}
              />
            </section>
          )}
        </div>
      </main>
    </>
  );
}
