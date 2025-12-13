import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Play, Info, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { AnimeCarousel } from "@/components/anime-carousel";
import type { Anime } from "@shared/schema";

function HeroSkeleton() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden bg-muted">
      <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center">
        <div className="max-w-2xl pt-16 space-y-4">
          <Skeleton className="h-16 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </section>
  );
}

function CarouselSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-48 space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  const { data: animeList = [], isLoading, isError, error, refetch } = useQuery<Anime[]>({
    queryKey: ["/api/anime/all"],
  });

  const featuredAnime = animeList[0];
  const popularAnime = [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const newReleases = [...animeList].sort((a, b) => b.year - a.year).slice(0, 8);
  const ongoingAnime = animeList.filter((a) => a.status === "ongoing").slice(0, 8);

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
  };

  const handleWatchClick = () => {
    if (featuredAnime) {
      navigate(`/anime/${featuredAnime.id}`);
    }
  };

  const handleMoreInfoClick = () => {
    if (featuredAnime) {
      navigate(`/anime/${featuredAnime.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSkeleton />
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
          <CarouselSkeleton title="Популярное" />
          <CarouselSkeleton title="Новинки" />
          <CarouselSkeleton title="Онгоинги" />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4" data-testid="error-state">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Ошибка загрузки</h2>
          <p className="text-muted-foreground mb-4 max-w-md">
            {error instanceof Error ? error.message : "Не удалось загрузить данные. Попробуйте позже."}
          </p>
          <Button onClick={() => refetch()} data-testid="button-retry">
            <RefreshCw className="w-4 h-4 mr-2" />
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  if (!featuredAnime) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground">No anime available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section
        className="relative h-[80vh] w-full overflow-hidden"
        data-testid="hero-section"
      >
        <div className="absolute inset-0">
          <img
            src={featuredAnime.backdrop || featuredAnime.poster}
            alt={featuredAnime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 flex items-center">
          <div className="max-w-2xl pt-16">
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-4"
              data-testid="text-hero-title"
            >
              {featuredAnime.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-black/70 text-white border-none">
                <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                {featuredAnime.rating.toFixed(1)}
              </Badge>
              <span className="text-white/80 text-sm">{featuredAnime.year}</span>
              {featuredAnime.genres.slice(0, 3).map((genre) => (
                <Badge
                  key={genre}
                  variant="secondary"
                  className="bg-white/20 text-white border-none backdrop-blur-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>

            <p
              className="text-white/90 text-base md:text-lg mb-6 line-clamp-4 max-w-xl"
              data-testid="text-hero-description"
            >
              {featuredAnime.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg" onClick={handleWatchClick} data-testid="button-watch">
                <Play className="w-5 h-5 mr-2 fill-current" />
                Смотреть
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white backdrop-blur-sm"
                onClick={handleMoreInfoClick}
                data-testid="button-more-info"
              >
                <Info className="w-5 h-5 mr-2" />
                Подробнее
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {popularAnime.length > 0 && (
          <AnimeCarousel
            title="Популярное"
            animeList={popularAnime}
            seeAllLink="/catalog?sort=rating"
            onAnimeClick={handleAnimeClick}
          />
        )}

        {newReleases.length > 0 && (
          <AnimeCarousel
            title="Новинки"
            animeList={newReleases}
            seeAllLink="/catalog?sort=newest"
            onAnimeClick={handleAnimeClick}
          />
        )}

        {ongoingAnime.length > 0 && (
          <AnimeCarousel
            title="Онгоинги"
            animeList={ongoingAnime}
            seeAllLink="/catalog?status=ongoing"
            onAnimeClick={handleAnimeClick}
          />
        )}
      </main>

      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Навигация</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    data-testid="link-footer-home"
                  >
                    Главная
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    data-testid="link-footer-catalog"
                  >
                    Каталог
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Жанры</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/catalog?genre=action"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Экшен
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog?genre=comedy"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Комедия
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog?genre=drama"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Драма
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Информация</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    О нас
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Правовая информация</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Условия использования
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    Политика конфиденциальности
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              AnimeHub 2024. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
