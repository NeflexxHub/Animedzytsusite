import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Filter, ChevronLeft, ChevronRight, Search, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { AnimeCard } from "@/components/anime-card";
import { cn } from "@/lib/utils";
import type { Anime } from "@shared/schema";

interface AnimeApiResponse {
  data: Anime[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const genres = [
  "Экшен",
  "Приключения",
  "Комедия",
  "Драма",
  "Фэнтези",
  "Романтика",
  "Сёнен",
  "Пародия",
];

const years = Array.from({ length: 30 }, (_, i) => 2024 - i);

const ITEMS_PER_PAGE = 10;

function FilterSidebar({
  selectedGenres,
  onGenreChange,
  yearFrom,
  yearTo,
  onYearFromChange,
  onYearToChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onReset,
  className,
}: {
  selectedGenres: string[];
  onGenreChange: (genre: string, checked: boolean) => void;
  yearFrom: string;
  yearTo: string;
  onYearFromChange: (value: string) => void;
  onYearToChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="font-semibold text-foreground mb-3">Жанры</h3>
        <div className="space-y-2">
          {genres.map((genre) => (
            <div key={genre} className="flex items-center space-x-2">
              <Checkbox
                id={`genre-${genre}`}
                checked={selectedGenres.includes(genre)}
                onCheckedChange={(checked) =>
                  onGenreChange(genre, checked as boolean)
                }
                data-testid={`checkbox-genre-${genre}`}
              />
              <Label
                htmlFor={`genre-${genre}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {genre}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Год выхода</h3>
        <div className="flex items-center gap-2">
          <Select value={yearFrom} onValueChange={onYearFromChange}>
            <SelectTrigger className="flex-1" data-testid="select-year-from">
              <SelectValue placeholder="От" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Любой</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">-</span>
          <Select value={yearTo} onValueChange={onYearToChange}>
            <SelectTrigger className="flex-1" data-testid="select-year-to">
              <SelectValue placeholder="До" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Любой</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Статус</h3>
        <RadioGroup value={status} onValueChange={onStatusChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="status-all" data-testid="radio-status-all" />
            <Label htmlFor="status-all" className="text-sm text-muted-foreground cursor-pointer">
              Все
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ongoing" id="status-ongoing" data-testid="radio-status-ongoing" />
            <Label htmlFor="status-ongoing" className="text-sm text-muted-foreground cursor-pointer">
              Онгоинг
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="completed" id="status-completed" data-testid="radio-status-completed" />
            <Label htmlFor="status-completed" className="text-sm text-muted-foreground cursor-pointer">
              Завершён
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-semibold text-foreground mb-3">Сортировка</h3>
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger data-testid="select-sort">
            <SelectValue placeholder="Выберите сортировку" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">По рейтингу</SelectItem>
            <SelectItem value="year">По году</SelectItem>
            <SelectItem value="title">По названию</SelectItem>
            <SelectItem value="newest">Новинки</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full" onClick={onReset} data-testid="button-reset-filters">
        Сбросить
      </Button>
    </div>
  );
}

function AnimeCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
      <Search className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">Ничего не найдено</h3>
      <p className="text-muted-foreground max-w-md">
        Попробуйте изменить параметры фильтрации или сбросить фильтры
      </p>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="error-state">
      <AlertCircle className="w-16 h-16 text-destructive mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">Ошибка загрузки</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        {error?.message || "Не удалось загрузить данные. Попробуйте позже."}
      </p>
      <Button onClick={onRetry} data-testid="button-retry">
        <RefreshCw className="w-4 h-4 mr-2" />
        Повторить
      </Button>
    </div>
  );
}

export default function Catalog() {
  const [, navigate] = useLocation();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearFrom, setYearFrom] = useState("any");
  const [yearTo, setYearTo] = useState("any");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.set("page", currentPage.toString());
    params.set("limit", ITEMS_PER_PAGE.toString());
    params.set("sort", sort);
    
    if (selectedGenres.length > 0) {
      params.set("genres", selectedGenres.join(","));
    }
    if (yearFrom !== "any") {
      params.set("yearFrom", yearFrom);
    }
    if (yearTo !== "any") {
      params.set("yearTo", yearTo);
    }
    if (status !== "all") {
      params.set("status", status);
    }
    
    return params.toString();
  };

  const queryParams = buildQueryParams();
  
  const { data, isLoading, isError, error, refetch } = useQuery<AnimeApiResponse>({
    queryKey: ["/api/anime", queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/anime?${queryParams}`, { credentials: "include" });
      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text() || res.statusText}`);
      }
      return res.json();
    },
  });

  const animeList = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleGenreChange = (genre: string, checked: boolean) => {
    setSelectedGenres((prev) =>
      checked ? [...prev, genre] : prev.filter((g) => g !== genre)
    );
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setYearFrom("any");
    setYearTo("any");
    setStatus("all");
    setSort("rating");
    setCurrentPage(1);
  };

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`);
  };

  const filterProps = {
    selectedGenres,
    onGenreChange: handleGenreChange,
    yearFrom,
    yearTo,
    onYearFromChange: (v: string) => { setYearFrom(v); setCurrentPage(1); },
    onYearToChange: (v: string) => { setYearTo(v); setCurrentPage(1); },
    status,
    onStatusChange: (v: string) => { setStatus(v); setCurrentPage(1); },
    sort,
    onSortChange: (v: string) => { setSort(v); setCurrentPage(1); },
    onReset: handleReset,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-catalog-title">
            Каталог аниме
          </h1>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden" data-testid="button-open-filters">
                <Filter className="w-4 h-4 mr-2" />
                Фильтры
                {selectedGenres.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {selectedGenres.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
              </SheetHeader>
              <FilterSidebar {...filterProps} className="mt-4" />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 p-4 bg-card rounded-lg border border-card-border">
              <FilterSidebar {...filterProps} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <ErrorState error={error instanceof Error ? error : null} onRetry={() => refetch()} />
            ) : animeList.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  data-testid="anime-grid"
                >
                  {animeList.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} onClick={handleAnimeClick} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8" data-testid="pagination">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      data-testid="button-prev-page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="icon"
                            onClick={() => setCurrentPage(pageNum)}
                            data-testid={`button-page-${pageNum}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      data-testid="button-next-page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
