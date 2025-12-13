import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/anime", async (req, res) => {
    const { search, genres, status, year, yearFrom, yearTo, sort, page = "1", limit = "20" } = req.query;
    let animeList = await storage.getAllAnime();
    
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      animeList = animeList.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        (a.titleOriginal && a.titleOriginal.toLowerCase().includes(searchLower))
      );
    }
    
    if (genres && typeof genres === "string") {
      const genreList = genres.split(",");
      animeList = animeList.filter(a => 
        genreList.some(g => a.genres.includes(g))
      );
    }
    
    if (status && typeof status === "string" && status !== "all") {
      animeList = animeList.filter(a => a.status === status);
    }
    
    if (year && typeof year === "string") {
      animeList = animeList.filter(a => a.year === parseInt(year));
    }
    
    if (yearFrom && typeof yearFrom === "string") {
      animeList = animeList.filter(a => a.year >= parseInt(yearFrom));
    }
    
    if (yearTo && typeof yearTo === "string") {
      animeList = animeList.filter(a => a.year <= parseInt(yearTo));
    }
    
    if (sort && typeof sort === "string") {
      switch (sort) {
        case "rating":
          animeList.sort((a, b) => b.rating - a.rating);
          break;
        case "year":
          animeList.sort((a, b) => b.year - a.year);
          break;
        case "title":
          animeList.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "newest":
          animeList.sort((a, b) => b.year - a.year);
          break;
      }
    }
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedList = animeList.slice(startIndex, startIndex + limitNum);
    
    res.json({
      data: paginatedList,
      total: animeList.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(animeList.length / limitNum)
    });
  });
  
  app.get("/api/anime/all", async (_req, res) => {
    const animeList = await storage.getAllAnime();
    res.json(animeList);
  });
  
  app.get("/api/genres", async (_req, res) => {
    const genres = await storage.getAllGenres();
    res.json(genres);
  });
  
  app.get("/api/search", async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.json([]);
    }
    const results = await storage.searchAnime(q);
    res.json(results.slice(0, 10));
  });

  app.get("/api/anime/:id", async (req, res) => {
    const anime = await storage.getAnimeById(req.params.id);
    if (!anime) {
      return res.status(404).json({ error: "Anime not found" });
    }
    res.json(anime);
  });

  app.get("/api/anime/:id/episodes", async (req, res) => {
    const episodes = await storage.getEpisodesByAnimeId(req.params.id);
    res.json(episodes);
  });

  app.get("/api/anime/:id/related", async (req, res) => {
    const related = await storage.getRelatedAnime(req.params.id);
    res.json(related);
  });

  app.get("/api/episodes/:id", async (req, res) => {
    const episode = await storage.getEpisodeById(req.params.id);
    if (!episode) {
      return res.status(404).json({ error: "Episode not found" });
    }
    res.json(episode);
  });

  return httpServer;
}
