import { type User, type InsertUser, type Anime, type Episode } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAnimeById(id: string): Promise<Anime | undefined>;
  getAnimeWithMalId(id: string): Promise<{ anime: Anime; malId: number } | undefined>;
  getMalIdByAnimeId(id: string): Promise<number | undefined>;
  getAllAnime(): Promise<Anime[]>;
  getEpisodesByAnimeId(animeId: string): Promise<Episode[]>;
  getEpisodeById(id: string): Promise<Episode | undefined>;
  getRelatedAnime(animeId: string): Promise<Anime[]>;
  searchAnime(query: string): Promise<Anime[]>;
  getAllGenres(): Promise<string[]>;
  getFeaturedAnime(): Promise<Anime[]>;
  getTrendingAnime(): Promise<Anime[]>;
}

interface AnimeWithMalId extends Anime {
  malId: number;
}

const sampleAnime: AnimeWithMalId[] = [
  {
    id: "1",
    malId: 16498,
    title: "Attack on Titan",
    titleOriginal: "Shingeki no Kyojin",
    description: "In a world where humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason, a young boy named Eren Yeager vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
    poster: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    backdrop: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&h=600&fit=crop",
    rating: 9.0,
    year: 2013,
    status: "completed",
    episodeCount: 25,
    genres: ["Action", "Drama", "Fantasy", "Mystery"],
    studio: "Wit Studio / MAPPA",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "2",
    malId: 40748,
    title: "Jujutsu Kaisen",
    titleOriginal: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
    poster: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    backdrop: "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=1920&h=600&fit=crop",
    rating: 8.7,
    year: 2020,
    status: "ongoing",
    episodeCount: 24,
    genres: ["Action", "Fantasy", "School", "Supernatural"],
    studio: "MAPPA",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "3",
    malId: 38000,
    title: "Demon Slayer",
    titleOriginal: "Kimetsu no Yaiba",
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    poster: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    backdrop: "https://images.unsplash.com/photo-1607604276583-1e9ba33c92d9?w=1920&h=600&fit=crop",
    rating: 8.5,
    year: 2019,
    status: "ongoing",
    episodeCount: 26,
    genres: ["Action", "Fantasy", "Historical", "Supernatural"],
    studio: "ufotable",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "4",
    malId: 31964,
    title: "My Hero Academia",
    titleOriginal: "Boku no Hero Academia",
    description: "In a world where people with superpowers known as 'Quirks' are the norm, Izuku Midoriya has dreams of one day becoming a Hero despite being bullied for not having a Quirk.",
    poster: "https://cdn.myanimelist.net/images/anime/10/78745l.jpg",
    backdrop: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&h=600&fit=crop",
    rating: 8.0,
    year: 2016,
    status: "ongoing",
    episodeCount: 13,
    genres: ["Action", "Comedy", "School", "Superhero"],
    studio: "Bones",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "5",
    malId: 30276,
    title: "One Punch Man",
    titleOriginal: "One Punch Man",
    description: "The story of Saitama, a hero that does it just for fun and can defeat his enemies with a single punch.",
    poster: "https://cdn.myanimelist.net/images/anime/12/76049l.jpg",
    backdrop: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1920&h=600&fit=crop",
    rating: 8.5,
    year: 2015,
    status: "ongoing",
    episodeCount: 12,
    genres: ["Action", "Comedy", "Parody", "Superhero"],
    studio: "Madhouse",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "6",
    malId: 50265,
    title: "Spy x Family",
    titleOriginal: "Spy x Family",
    description: "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own.",
    poster: "https://cdn.myanimelist.net/images/anime/1441/122795l.jpg",
    backdrop: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=1920&h=600&fit=crop",
    rating: 8.6,
    year: 2022,
    status: "ongoing",
    episodeCount: 12,
    genres: ["Action", "Comedy", "Slice of Life", "Family"],
    studio: "Wit Studio / CloverWorks",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "7",
    malId: 21,
    title: "One Piece",
    titleOriginal: "One Piece",
    description: "Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever, known as the One Piece.",
    poster: "https://cdn.myanimelist.net/images/anime/6/73245l.jpg",
    backdrop: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=600&fit=crop",
    rating: 8.7,
    year: 1999,
    status: "ongoing",
    episodeCount: 1100,
    genres: ["Action", "Adventure", "Comedy", "Fantasy"],
    studio: "Toei Animation",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "8",
    malId: 1535,
    title: "Death Note",
    titleOriginal: "Death Note",
    description: "An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.",
    poster: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
    backdrop: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=600&fit=crop",
    rating: 8.6,
    year: 2006,
    status: "completed",
    episodeCount: 37,
    genres: ["Mystery", "Psychological", "Supernatural", "Thriller"],
    studio: "Madhouse",
    duration: "23 min",
    type: "TV",
  },
  {
    id: "9",
    malId: 11061,
    title: "Hunter x Hunter",
    titleOriginal: "Hunter x Hunter (2011)",
    description: "Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. With his friends and potential, he seeks for his father who left him when he was younger.",
    poster: "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=600&fit=crop",
    rating: 9.1,
    year: 2011,
    status: "completed",
    episodeCount: 148,
    genres: ["Action", "Adventure", "Fantasy"],
    studio: "Madhouse",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "10",
    malId: 5114,
    title: "Fullmetal Alchemist: Brotherhood",
    titleOriginal: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes awry and leaves them in damaged physical forms.",
    poster: "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg",
    backdrop: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1920&h=600&fit=crop",
    rating: 9.2,
    year: 2009,
    status: "completed",
    episodeCount: 64,
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    studio: "Bones",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "11",
    malId: 20,
    title: "Naruto",
    titleOriginal: "Naruto",
    description: "Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village's leader and strongest ninja.",
    poster: "https://cdn.myanimelist.net/images/anime/13/17405l.jpg",
    backdrop: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&h=600&fit=crop",
    rating: 8.0,
    year: 2002,
    status: "completed",
    episodeCount: 220,
    genres: ["Action", "Adventure", "Martial Arts"],
    studio: "Pierrot",
    duration: "23 min",
    type: "TV",
  },
  {
    id: "12",
    malId: 1735,
    title: "Naruto: Shippuuden",
    titleOriginal: "Naruto: Shippuuden",
    description: "Naruto Uzumaki, is a loud, hyperactive, adolescent ninja who constantly searches for approval and recognition, as well as to become Hokage, who is acknowledged as the leader and strongest of all ninja in the village.",
    poster: "https://cdn.myanimelist.net/images/anime/1565/111305l.jpg",
    backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&h=600&fit=crop",
    rating: 8.3,
    year: 2007,
    status: "completed",
    episodeCount: 500,
    genres: ["Action", "Adventure", "Martial Arts"],
    studio: "Pierrot",
    duration: "23 min",
    type: "TV",
  },
  {
    id: "13",
    malId: 44511,
    title: "Chainsaw Man",
    titleOriginal: "Chainsaw Man",
    description: "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses with Pochita.",
    poster: "https://cdn.myanimelist.net/images/anime/1806/126216l.jpg",
    backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=600&fit=crop",
    rating: 8.5,
    year: 2022,
    status: "ongoing",
    episodeCount: 12,
    genres: ["Action", "Fantasy", "Horror"],
    studio: "MAPPA",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "14",
    malId: 52991,
    title: "Solo Leveling",
    titleOriginal: "Ore dake Level Up na Ken",
    description: "In a world where hunters must battle deadly monsters to protect humanity, Sung Jinwoo, known as the weakest hunter of all mankind, finds himself in a mysterious dungeon and unlocks a secret power.",
    poster: "https://cdn.myanimelist.net/images/anime/1956/142080l.jpg",
    backdrop: "https://images.unsplash.com/photo-1557264337-e8a93017fe92?w=1920&h=600&fit=crop",
    rating: 8.7,
    year: 2024,
    status: "ongoing",
    episodeCount: 12,
    genres: ["Action", "Adventure", "Fantasy"],
    studio: "A-1 Pictures",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "15",
    malId: 9253,
    title: "Steins;Gate",
    titleOriginal: "Steins;Gate",
    description: "The self-proclaimed mad scientist Rintarou Okabe rents out a room in a rickety old building in Akihabara, where he indulges himself in his hobby of inventing prospective 'future gadgets'.",
    poster: "https://cdn.myanimelist.net/images/anime/5/73199l.jpg",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=600&fit=crop",
    rating: 9.1,
    year: 2011,
    status: "completed",
    episodeCount: 24,
    genres: ["Drama", "Sci-Fi", "Psychological", "Thriller"],
    studio: "White Fox",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "16",
    malId: 32281,
    title: "Your Name",
    titleOriginal: "Kimi no Na wa.",
    description: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
    poster: "https://cdn.myanimelist.net/images/anime/5/87048l.jpg",
    backdrop: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1920&h=600&fit=crop",
    rating: 9.0,
    year: 2016,
    status: "completed",
    episodeCount: 1,
    genres: ["Drama", "Romance", "Supernatural"],
    studio: "CoMix Wave Films",
    duration: "1 hr 46 min",
    type: "Movie",
  },
  {
    id: "17",
    malId: 28851,
    title: "A Silent Voice",
    titleOriginal: "Koe no Katachi",
    description: "A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off on a path for redemption.",
    poster: "https://cdn.myanimelist.net/images/anime/1122/96435l.jpg",
    backdrop: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1920&h=600&fit=crop",
    rating: 8.9,
    year: 2016,
    status: "completed",
    episodeCount: 1,
    genres: ["Drama", "Romance", "School"],
    studio: "Kyoto Animation",
    duration: "2 hr 10 min",
    type: "Movie",
  },
  {
    id: "18",
    malId: 48583,
    title: "Frieren: Beyond Journey's End",
    titleOriginal: "Sousou no Frieren",
    description: "The adventure is over but life goes on for an elf mage just beginning to learn what living is all about.",
    poster: "https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=600&fit=crop",
    rating: 9.3,
    year: 2023,
    status: "ongoing",
    episodeCount: 28,
    genres: ["Adventure", "Drama", "Fantasy"],
    studio: "Madhouse",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "19",
    malId: 22319,
    title: "Tokyo Ghoul",
    titleOriginal: "Tokyo Ghoul",
    description: "A Tokyo college student is attacked by a ghoul, a superpowered human who feeds on human flesh. He survives, but has become part ghoul and becomes a fugitive on the run.",
    poster: "https://cdn.myanimelist.net/images/anime/5/64449l.jpg",
    backdrop: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&h=600&fit=crop",
    rating: 7.8,
    year: 2014,
    status: "completed",
    episodeCount: 12,
    genres: ["Action", "Horror", "Mystery", "Supernatural"],
    studio: "Pierrot",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "20",
    malId: 37779,
    title: "The Promised Neverland",
    titleOriginal: "Yakusoku no Neverland",
    description: "When three gifted kids at an isolated idyllic orphanage discover the dark truth of the outside world, they must devise a plan to escape.",
    poster: "https://cdn.myanimelist.net/images/anime/1830/118780l.jpg",
    backdrop: "https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?w=1920&h=600&fit=crop",
    rating: 8.5,
    year: 2019,
    status: "completed",
    episodeCount: 12,
    genres: ["Fantasy", "Horror", "Mystery", "Thriller"],
    studio: "CloverWorks",
    duration: "23 min",
    type: "TV",
  },
  {
    id: "21",
    malId: 1,
    title: "Cowboy Bebop",
    titleOriginal: "Cowboy Bebop",
    description: "In 2071, the remnants of Earth's criminal element roam the solar system as bounty hunters, known as 'Cowboys', pursue them.",
    poster: "https://cdn.myanimelist.net/images/anime/4/19644l.jpg",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&h=600&fit=crop",
    rating: 8.8,
    year: 1998,
    status: "completed",
    episodeCount: 26,
    genres: ["Action", "Drama", "Sci-Fi"],
    studio: "Sunrise",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "22",
    malId: 49387,
    title: "Oshi no Ko",
    titleOriginal: "Oshi no Ko",
    description: "A story about a doctor who is reborn as the child of his favorite idol, and must navigate the dark side of the entertainment industry.",
    poster: "https://cdn.myanimelist.net/images/anime/1812/134736l.jpg",
    backdrop: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&h=600&fit=crop",
    rating: 8.6,
    year: 2023,
    status: "ongoing",
    episodeCount: 11,
    genres: ["Drama", "Music", "Psychological", "Supernatural"],
    studio: "Doga Kobo",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "23",
    malId: 35760,
    title: "Mob Psycho 100",
    titleOriginal: "Mob Psycho 100",
    description: "A psychic middle school boy tries to live a normal life and keep his growing powers under control, even though he constantly gets into trouble.",
    poster: "https://cdn.myanimelist.net/images/anime/8/80356l.jpg",
    backdrop: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=600&fit=crop",
    rating: 8.5,
    year: 2016,
    status: "completed",
    episodeCount: 12,
    genres: ["Action", "Comedy", "Supernatural"],
    studio: "Bones",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "24",
    malId: 51478,
    title: "Bleach: Thousand-Year Blood War",
    titleOriginal: "Bleach: Sennen Kessen-hen",
    description: "The peace in the Soul Society is suddenly disrupted when warning alarms blare through the Soul Society. Ichigo Kurosaki learns that his two friends have been attacked.",
    poster: "https://cdn.myanimelist.net/images/anime/1764/126627l.jpg",
    backdrop: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=600&fit=crop",
    rating: 9.1,
    year: 2022,
    status: "ongoing",
    episodeCount: 13,
    genres: ["Action", "Adventure", "Supernatural"],
    studio: "Pierrot",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "25",
    malId: 269,
    title: "Bleach",
    titleOriginal: "Bleach",
    description: "High school student Ichigo Kurosaki, who has the ability to see ghosts, gains soul reaper powers from Rukia Kuchiki and sets out to save the world from 'Hollows'.",
    poster: "https://cdn.myanimelist.net/images/anime/3/40451l.jpg",
    backdrop: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&h=600&fit=crop",
    rating: 7.9,
    year: 2004,
    status: "completed",
    episodeCount: 366,
    genres: ["Action", "Adventure", "Supernatural"],
    studio: "Pierrot",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "26",
    malId: 41467,
    title: "Bocchi the Rock!",
    titleOriginal: "Bocchi the Rock!",
    description: "Hitori Gotoh, a lonely high school girl who learns to play bass guitar in hopes of making friends, joins a struggling rock band.",
    poster: "https://cdn.myanimelist.net/images/anime/1448/127956l.jpg",
    backdrop: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=600&fit=crop",
    rating: 8.8,
    year: 2022,
    status: "completed",
    episodeCount: 12,
    genres: ["Comedy", "Music", "Slice of Life"],
    studio: "CloverWorks",
    duration: "24 min",
    type: "TV",
  },
  {
    id: "27",
    malId: 43608,
    title: "86 -Eighty Six-",
    titleOriginal: "86 -Eighty Six-",
    description: "A war rages on between the Republic of San Magnolia and the Giadian Empire. The country appears to have no casualties, as unmanned combat drones called the Juggernauts take up all the fighting.",
    poster: "https://cdn.myanimelist.net/images/anime/1987/117507l.jpg",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=600&fit=crop",
    rating: 8.2,
    year: 2021,
    status: "completed",
    episodeCount: 11,
    genres: ["Action", "Drama", "Mecha", "Sci-Fi"],
    studio: "A-1 Pictures",
    duration: "23 min",
    type: "TV",
  },
  {
    id: "28",
    malId: 431,
    title: "Howl's Moving Castle",
    titleOriginal: "Howl no Ugoku Shiro",
    description: "When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet insecure young wizard and his companions in his legged, walking castle.",
    poster: "https://cdn.myanimelist.net/images/anime/5/75810l.jpg",
    backdrop: "https://images.unsplash.com/photo-1464823063530-08f10ed1a2dd?w=1920&h=600&fit=crop",
    rating: 8.7,
    year: 2004,
    status: "completed",
    episodeCount: 1,
    genres: ["Adventure", "Drama", "Fantasy", "Romance"],
    studio: "Studio Ghibli",
    duration: "1 hr 59 min",
    type: "Movie",
  },
  {
    id: "29",
    malId: 199,
    title: "Spirited Away",
    titleOriginal: "Sen to Chihiro no Kamikakushi",
    description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts.",
    poster: "https://cdn.myanimelist.net/images/anime/6/79597l.jpg",
    backdrop: "https://images.unsplash.com/photo-1524673450801-b5aa9b621b76?w=1920&h=600&fit=crop",
    rating: 8.8,
    year: 2001,
    status: "completed",
    episodeCount: 1,
    genres: ["Adventure", "Drama", "Fantasy", "Supernatural"],
    studio: "Studio Ghibli",
    duration: "2 hr 5 min",
    type: "Movie",
  },
  {
    id: "30",
    malId: 47778,
    title: "Kaguya-sama: Ultra Romantic",
    titleOriginal: "Kaguya-sama wa Kokurasetai: Ultra Romantic",
    description: "The elite members of Shuchiin Academy's student council continue their adorable romantic antics.",
    poster: "https://cdn.myanimelist.net/images/anime/1160/122627l.jpg",
    backdrop: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=600&fit=crop",
    rating: 9.0,
    year: 2022,
    status: "completed",
    episodeCount: 13,
    genres: ["Comedy", "Romance", "School", "Psychological"],
    studio: "A-1 Pictures",
    duration: "24 min",
    type: "TV",
  },
];

const sampleVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const generateEpisodes = (animeId: string, count: number): Episode[] => {
  const episodes: Episode[] = [];
  const maxEps = Math.min(count, 24);
  for (let i = 1; i <= maxEps; i++) {
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

const animeIdToMalId = new Map<string, number>(
  sampleAnime.map(a => [a.id, a.malId])
);

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private animeMap: Map<string, AnimeWithMalId>;
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

  async getAnimeWithMalId(id: string): Promise<{ anime: Anime; malId: number } | undefined> {
    const animeData = this.animeMap.get(id);
    if (!animeData) return undefined;
    return { anime: animeData, malId: animeData.malId };
  }

  async getMalIdByAnimeId(id: string): Promise<number | undefined> {
    const animeData = this.animeMap.get(id);
    return animeData?.malId;
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

  async getFeaturedAnime(): Promise<Anime[]> {
    return Array.from(this.animeMap.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }

  async getTrendingAnime(): Promise<Anime[]> {
    return Array.from(this.animeMap.values())
      .filter(a => a.status === "ongoing" || a.year >= 2022)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }
}

export const storage = new MemStorage();
