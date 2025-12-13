import { useState } from "react";
import { Link } from "wouter";
import { Search, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link
            href="/"
            className={cn(
              "text-xl md:text-2xl font-bold text-foreground transition-opacity",
              isSearchExpanded && "hidden md:block"
            )}
            data-testid="link-home"
          >
            AnimeHub
          </Link>

          <form
            onSubmit={handleSearchSubmit}
            className={cn(
              "flex items-center gap-2 transition-all duration-200",
              isSearchExpanded
                ? "flex-1 md:flex-initial md:w-96"
                : "hidden md:flex md:w-96"
            )}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4"
                data-testid="input-search"
              />
            </div>
            {isSearchExpanded && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchExpanded(false)}
                className="md:hidden"
                data-testid="button-close-search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>

          <div className="flex items-center gap-2">
            {!isSearchExpanded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchExpanded(true)}
                className="md:hidden"
                data-testid="button-expand-search"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
