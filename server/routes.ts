import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as jikan from "./services/jikan";

const VIDEO_PARSER_URL = process.env.VIDEO_PARSER_URL || 'http://localhost:3001';

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
    const malId = await storage.getMalIdByAnimeId(req.params.id);
    
    if (malId) {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const result = await jikan.getAnimeEpisodes(malId, page);
        
        if (result && result.data && result.data.length > 0) {
          const mappedEpisodes = result.data.map(ep => jikan.mapJikanEpisode(ep, req.params.id));
          return res.json(mappedEpisodes);
        }
      } catch (error) {
        console.error('Error fetching episodes from Jikan:', error);
      }
    }
    
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

  app.get("/api/jikan/search", async (req, res) => {
    const { q, page = "1", limit = "25" } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Query parameter q is required" });
    }
    
    const result = await jikan.searchAnime(q, parseInt(page as string), parseInt(limit as string));
    if (!result) {
      return res.status(500).json({ error: "Failed to fetch from Jikan API" });
    }
    
    const mappedData = result.data.map(jikan.mapJikanToAnime);
    res.json({
      data: mappedData,
      pagination: result.pagination
    });
  });

  app.get("/api/jikan/anime/:malId", async (req, res) => {
    const malId = parseInt(req.params.malId);
    if (isNaN(malId)) {
      return res.status(400).json({ error: "Invalid MAL ID" });
    }
    
    const anime = await jikan.getAnimeById(malId);
    if (!anime) {
      return res.status(404).json({ error: "Anime not found" });
    }
    
    res.json(jikan.mapJikanToAnime(anime));
  });

  app.get("/api/jikan/anime/:malId/episodes", async (req, res) => {
    const malId = parseInt(req.params.malId);
    const page = parseInt(req.query.page as string) || 1;
    
    if (isNaN(malId)) {
      return res.status(400).json({ error: "Invalid MAL ID" });
    }
    
    const result = await jikan.getAnimeEpisodes(malId, page);
    if (!result) {
      return res.status(500).json({ error: "Failed to fetch episodes" });
    }
    
    const mappedEpisodes = result.data.map(ep => jikan.mapJikanEpisode(ep, malId.toString()));
    res.json({
      data: mappedEpisodes,
      pagination: result.pagination
    });
  });

  app.get("/api/jikan/top", async (req, res) => {
    const { filter = "bypopularity", page = "1", limit = "25" } = req.query;
    
    const result = await jikan.getTopAnime(
      filter as string, 
      parseInt(page as string), 
      parseInt(limit as string)
    );
    
    if (!result) {
      return res.status(500).json({ error: "Failed to fetch top anime" });
    }
    
    const mappedData = result.data.map(jikan.mapJikanToAnime);
    res.json({
      data: mappedData,
      pagination: result.pagination
    });
  });

  app.get("/api/jikan/season/now", async (req, res) => {
    const { page = "1", limit = "25" } = req.query;
    
    const result = await jikan.getSeasonNow(
      parseInt(page as string), 
      parseInt(limit as string)
    );
    
    if (!result) {
      return res.status(500).json({ error: "Failed to fetch current season" });
    }
    
    const mappedData = result.data.map(jikan.mapJikanToAnime);
    res.json({
      data: mappedData,
      pagination: result.pagination
    });
  });

  app.get("/api/video/sources", async (_req, res) => {
    try {
      const response = await fetch(`${VIDEO_PARSER_URL}/sources`);
      if (!response.ok) {
        return res.json({ sources: [] });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.json({ sources: [] });
    }
  });

  app.get("/api/video/search", async (req, res) => {
    const { q, source = "animego" } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Query parameter q is required" });
    }
    
    try {
      const response = await fetch(`${VIDEO_PARSER_URL}/search?q=${encodeURIComponent(q)}&source=${source}`);
      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json(error);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Video parser service unavailable" });
    }
  });

  app.post("/api/video/episodes", async (req, res) => {
    try {
      const response = await fetch(`${VIDEO_PARSER_URL}/episodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json(error);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Video parser service unavailable" });
    }
  });

  app.post("/api/video/get", async (req, res) => {
    try {
      const response = await fetch(`${VIDEO_PARSER_URL}/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        const error = await response.json();
        return res.status(response.status).json(error);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Video parser service unavailable" });
    }
  });

  return httpServer;
}
