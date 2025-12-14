import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Settings,
  Menu,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Anime, Episode } from "@shared/schema";

interface VideoSource {
  type: string;
  quality: string;
  url: string;
  headers?: Record<string, string>;
}

interface SearchResult {
  id: string;
  title: string;
  source: string;
  _raw_index: number;
}

interface VideoEpisode {
  id: string;
  number: number;
  title: string;
  _raw_index: number;
}

export default function Watch() {
  const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
  const [, navigate] = useLocation();

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number>();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const [selectedSource, setSelectedSource] = useState<string>("anilibria");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedAnimeIndex, setSelectedAnimeIndex] = useState<number>(0);

  const { data: anime, isLoading: animeLoading } = useQuery<Anime>({
    queryKey: ["/api/anime", animeId],
  });

  const { data: episodes = [], isLoading: episodesLoading } = useQuery<Episode[]>({
    queryKey: ["/api/anime", animeId, "episodes"],
  });
  
  const { data: sourcesData } = useQuery<{ sources: string[] }>({
    queryKey: ["/api/video/sources"],
  });
  
  const availableSources = sourcesData?.sources || [];

  const currentEpisode = episodes.find((ep) => ep.id === episodeId);
  const currentIndex = episodes.findIndex((ep) => ep.id === episodeId);
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  const fetchVideoUrl = useCallback(async () => {
    if (!anime || currentEpisode === undefined) return;
    
    setVideoLoading(true);
    setVideoError("");
    setVideoUrl("");
    
    try {
      const searchResponse = await fetch(`/api/video/search?q=${encodeURIComponent(anime.title)}&source=${selectedSource}`);
      if (!searchResponse.ok) {
        throw new Error("Failed to search anime");
      }
      const searchData = await searchResponse.json();
      
      if (!searchData.results || searchData.results.length === 0) {
        throw new Error(`Anime not found in ${selectedSource}`);
      }
      
      setSearchResults(searchData.results);
      const animeIndex = selectedAnimeIndex < searchData.results.length ? selectedAnimeIndex : 0;
      
      const videoResponse = await fetch("/api/video/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: selectedSource,
          query: anime.title,
          anime_index: animeIndex,
          episode_index: currentEpisode.number - 1,
        }),
      });
      
      if (!videoResponse.ok) {
        throw new Error("Failed to get video");
      }
      
      const videoData = await videoResponse.json();
      
      if (videoData.videos && videoData.videos.length > 0) {
        const bestVideo = videoData.videos.find((v: VideoSource) => v.url) || videoData.videos[0];
        if (bestVideo?.url) {
          setVideoUrl(bestVideo.url);
        } else {
          throw new Error("No video URL found");
        }
      } else {
        throw new Error("No video sources available for this episode");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      setVideoError(error instanceof Error ? error.message : "Failed to load video");
      setVideoUrl(currentEpisode?.videoUrl || "");
    } finally {
      setVideoLoading(false);
    }
  }, [anime, currentEpisode, selectedSource, selectedAnimeIndex]);

  useEffect(() => {
    if (anime && currentEpisode && availableSources.length > 0) {
      fetchVideoUrl();
    }
  }, [anime, currentEpisode, selectedSource, selectedAnimeIndex, availableSources.length]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (video) {
      video.volume = value[0];
      setVolume(value[0]);
      setIsMuted(value[0] === 0);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      if (isMuted) {
        video.muted = false;
        video.volume = volume || 1;
        setIsMuted(false);
      } else {
        video.muted = true;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = async () => {
    const player = playerRef.current;
    if (!player) return;

    if (!isFullscreen) {
      if (player.requestFullscreen) {
        await player.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  const navigateToEpisode = (episode: Episode) => {
    navigate(`/watch/${animeId}/${episode.id}`);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key === "f") {
        toggleFullscreen();
      } else if (e.key === "m") {
        toggleMute();
      } else if (e.key === "ArrowLeft") {
        const video = videoRef.current;
        if (video) {
          video.currentTime = Math.max(0, video.currentTime - 10);
        }
      } else if (e.key === "ArrowRight") {
        const video = videoRef.current;
        if (video) {
          video.currentTime = Math.min(duration, video.currentTime + 10);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, duration]);

  if (animeLoading || episodesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
          <div className="w-full lg:w-80">
            <Skeleton className="h-screen" />
          </div>
        </div>
      </div>
    );
  }

  if (!anime || !currentEpisode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Episode not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" data-testid="watch-page">
      <div className="flex flex-col lg:flex-row h-screen">
        <div className={cn("flex-1 flex flex-col", showSidebar ? "lg:pr-0" : "")}>
          <div
            ref={playerRef}
            className="relative bg-black aspect-video w-full max-h-[70vh] lg:max-h-none lg:flex-1"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {videoLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-white">Loading video from {selectedSource}...</p>
                </div>
              </div>
            ) : videoError && !videoUrl ? (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <div className="text-center max-w-md p-4">
                  <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <p className="text-white mb-2">Failed to load video</p>
                  <p className="text-muted-foreground text-sm mb-4">{videoError}</p>
                  <Button onClick={fetchVideoUrl} variant="secondary">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={videoUrl || currentEpisode.videoUrl}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={handlePlayPause}
                data-testid="video-player"
              />
            )}

            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <button
                onClick={handlePlayPause}
                className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                data-testid="button-play-center"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </button>
            </div>

            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300",
                showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <div className="mb-2">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                  data-testid="slider-timeline"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                    data-testid="button-play-controls"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>

                  <div className="flex items-center gap-2 group">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                      data-testid="button-volume"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <div className="w-24 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        data-testid="slider-volume"
                      />
                    </div>
                  </div>

                  <span className="text-white text-sm" data-testid="text-time">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {availableSources.length > 0 && (
                    <Select value={selectedSource} onValueChange={setSelectedSource}>
                      <SelectTrigger className="w-[120px] h-8 bg-white/10 border-none text-white text-xs">
                        <SelectValue placeholder="Source" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    data-testid="button-quality"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                    data-testid="button-fullscreen"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Link
                  href={`/anime/${animeId}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-anime-title"
                >
                  {anime.title}
                </Link>
                <h1 className="text-xl md:text-2xl font-bold text-foreground" data-testid="text-episode-title">
                  Episode {currentEpisode.number}: {currentEpisode.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => prevEpisode && navigateToEpisode(prevEpisode)}
                  disabled={!prevEpisode}
                  data-testid="button-prev-episode"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => nextEpisode && navigateToEpisode(nextEpisode)}
                  disabled={!nextEpisode}
                  data-testid="button-next-episode"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="fixed right-4 top-4 z-50 lg:hidden text-white bg-black/50"
          onClick={() => setShowSidebar(!showSidebar)}
          data-testid="button-toggle-sidebar"
        >
          {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        <aside
          className={cn(
            "fixed lg:relative inset-y-0 right-0 w-80 bg-background border-l border-border transition-transform duration-300 z-40",
            showSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0 lg:hidden"
          )}
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Episodes</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-57px)]">
            <div className="p-2 space-y-1">
              {episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => navigateToEpisode(episode)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover-elevate active-elevate-2",
                    episode.id === episodeId
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground"
                  )}
                  data-testid={`button-episode-${episode.id}`}
                >
                  <div className="relative w-24 aspect-video flex-shrink-0 rounded overflow-hidden bg-muted">
                    {episode.thumbnail ? (
                      <img
                        src={episode.thumbnail}
                        alt={`Episode ${episode.number}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    {episode.id === episodeId && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {episode.number}. {episode.title}
                    </p>
                    {episode.duration && (
                      <p className="text-xs text-muted-foreground">{episode.duration}</p>
                    )}
                    {episode.filler && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Filler
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
