import { type User, type InsertUser, type Anime, type Episode } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAnimeById(id: string): Promise<Anime | undefined>;
  getAllAnime(): Promise<Anime[]>;
  getEpisodesByAnimeId(animeId: string): Promise<Episode[]>;
  getEpisodeById(id: string): Promise<Episode | undefined>;
  getRelatedAnime(animeId: string): Promise<Anime[]>;
  searchAnime(query: string): Promise<Anime[]>;
  getAllGenres(): Promise<string[]>;
}

const sampleAnime: Anime[] = [
  {
    id: "1",
    title: "Attack on Titan",
    titleOriginal: "Shingeki no Kyojin",
    description: "In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason, a young boy named Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
    poster: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&h=600&fit=crop",
    rating: 9.0,
    year: 2013,
    status: "completed",
    episodeCount: 87,
    genres: ["Action", "Drama", "Fantasy", "Mystery"],
    studio: "Wit Studio / MAPPA",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "2",
    title: "Jujutsu Kaisen",
    titleOriginal: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
    poster: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    backdrop: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=1920&h=600&fit=crop",
    rating: 8.7,
    year: 2020,
    status: "ongoing",
    episodeCount: 47,
    genres: ["Action", "Fantasy", "School", "Supernatural"],
    studio: "MAPPA",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "3",
    title: "Demon Slayer",
    titleOriginal: "Kimetsu no Yaiba",
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    poster: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    backdrop: "https://images.unsplash.com/photo-1607604276583-1e9ba33c92d9?w=1920&h=600&fit=crop",
    rating: 8.5,
    year: 2019,
    status: "ongoing",
    episodeCount: 55,
    genres: ["Action", "Fantasy", "Historical", "Supernatural"],
    studio: "ufotable",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "4",
    title: "My Hero Academia",
    titleOriginal: "Boku no Hero Academia",
    description: "In a world where people with superpowers known as 'Quirks' are the norm, Izuku Midoriya has dreams of one day becoming a Hero despite being bullied for not having a Quirk.",
    poster: "https://cdn.myanimelist.net/images/anime/10/78745l.jpg",
    backdrop: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&h=600&fit=crop",
    rating: 8.0,
    year: 2016,
    status: "ongoing",
    episodeCount: 138,
    genres: ["Action", "Comedy", "School", "Superhero"],
    studio: "Bones",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "5",
    title: "One Punch Man",
    titleOriginal: "One Punch Man",
    description: "The story of Saitama, a hero that does it just for fun and can defeat his enemies with a single punch.",
    poster: "https://cdn.myanimelist.net/images/anime/12/76049l.jpg",
    backdrop: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1920&h=600&fit=crop",
    rating: 8.5,
    year: 2015,
    status: "ongoing",
    episodeCount: 24,
    genres: ["Action", "Comedy", "Parody", "Superhero"],
    studio: "Madhouse",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "6",
    title: "Spy x Family",
    titleOriginal: "Spy x Family",
    description: "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own.",
    poster: "https://cdn.myanimelist.net/images/anime/1441/122795l.jpg",
    backdrop: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1920&h=600&fit=crop",
    rating: 8.6,
    year: 2022,
    status: "ongoing",
    episodeCount: 37,
    genres: ["Action", "Comedy", "Slice of Life", "Family"],
    studio: "Wit Studio / CloverWorks",
    duration: "24 min",
    type: "TV",
  },
];

const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const generateEpisodes = (animeId: string, count: number): Episode[] => {
  const episodes: Episode[] = [];
  for (let i = 1; i <= Math.min(count, 12); i++) {
    episodes.push({
      id: `${animeId}-ep-${i}`,
      animeId,
      number: i,
      title: `Episode ${i}`,
      thumbnail: `https://picsum.photos/seed/${animeId}${i}/640/360`,
      duration: `${Math.floor(20 + Math.random() * 5)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      videoUrl: sampleVideoUrl,
      filler: i % 7 === 0,
    });
  }
  return episodes;
};

const allEpisodes: Episode[] = sampleAnime.flatMap(anime => generateEpisodes(anime.id, anime.episodeCount));

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private animeMap: Map<string, Anime>;
  private episodesMap: Map<string, Episode>;

  constructor() {
    this.users = new Map();
    this.animeMap = new Map(sampleAnime.map(a => [a.id, a]));
    this.episodesMap = new Map(allEpisodes.map(e => [e.id, e]));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAnimeById(id: string): Promise<Anime | undefined> {
    return this.animeMap.get(id);
  }

  async getAllAnime(): Promise<Anime[]> {
    return Array.from(this.animeMap.values());
  }

  async getEpisodesByAnimeId(animeId: string): Promise<Episode[]> {
    return Array.from(this.episodesMap.values())
      .filter(ep => ep.animeId === animeId)
      .sort((a, b) => a.number - b.number);
  }

  async getEpisodeById(id: string): Promise<Episode | undefined> {
    return this.episodesMap.get(id);
  }

  async getRelatedAnime(animeId: string): Promise<Anime[]> {
    const anime = await this.getAnimeById(animeId);
    if (!anime) return [];
    return Array.from(this.animeMap.values())
      .filter(a => a.id !== animeId && a.genres.some(g => anime.genres.includes(g)))
      .slice(0, 6);
  }

  async searchAnime(query: string): Promise<Anime[]> {
    const queryLower = query.toLowerCase();
    return Array.from(this.animeMap.values())
      .filter(a => 
        a.title.toLowerCase().includes(queryLower) ||
        (a.titleOriginal && a.titleOriginal.toLowerCase().includes(queryLower)) ||
        a.genres.some(g => g.toLowerCase().includes(queryLower))
      );
  }

  async getAllGenres(): Promise<string[]> {
    const genreSet = new Set<string>();
    Array.from(this.animeMap.values()).forEach(anime => {
      anime.genres.forEach(genre => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }
}

export const storage = new MemStorage();
