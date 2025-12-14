const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

interface JikanAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images: {
      image_url: string | null;
      small_image_url: string | null;
      medium_image_url: string | null;
      large_image_url: string | null;
      maximum_image_url: string | null;
    };
  };
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
  };
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  year: number | null;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  themes: Array<{ mal_id: number; type: string; name: string; url: string }>;
}

interface JikanSearchResponse {
  data: JikanAnime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
}

interface JikanAnimeResponse {
  data: JikanAnime;
}

interface JikanEpisode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese: string | null;
  title_romanji: string | null;
  aired: string | null;
  score: number | null;
  filler: boolean;
  recap: boolean;
}

interface JikanEpisodesResponse {
  data: JikanEpisode[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 400;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
  return fetch(url);
}

export async function searchAnime(query: string, page = 1, limit = 25): Promise<JikanSearchResponse | null> {
  try {
    const response = await rateLimitedFetch(
      `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Jikan API error: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching anime:', error);
    return null;
  }
}

export async function getAnimeById(malId: number): Promise<JikanAnime | null> {
  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/anime/${malId}`);
    
    if (!response.ok) {
      console.error(`Jikan API error: ${response.status}`);
      return null;
    }
    
    const data: JikanAnimeResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting anime by ID:', error);
    return null;
  }
}

export async function getAnimeEpisodes(malId: number, page = 1): Promise<JikanEpisodesResponse | null> {
  try {
    const response = await rateLimitedFetch(`${JIKAN_BASE_URL}/anime/${malId}/episodes?page=${page}`);
    
    if (!response.ok) {
      console.error(`Jikan API error: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting anime episodes:', error);
    return null;
  }
}

export async function getTopAnime(filter = 'bypopularity', page = 1, limit = 25): Promise<JikanSearchResponse | null> {
  try {
    const response = await rateLimitedFetch(
      `${JIKAN_BASE_URL}/top/anime?filter=${filter}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Jikan API error: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting top anime:', error);
    return null;
  }
}

export async function getSeasonNow(page = 1, limit = 25): Promise<JikanSearchResponse | null> {
  try {
    const response = await rateLimitedFetch(
      `${JIKAN_BASE_URL}/seasons/now?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      console.error(`Jikan API error: ${response.status}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting current season:', error);
    return null;
  }
}

export function mapJikanToAnime(jikan: JikanAnime) {
  return {
    id: jikan.mal_id.toString(),
    malId: jikan.mal_id,
    title: jikan.title_english || jikan.title,
    titleOriginal: jikan.title_japanese || jikan.title,
    description: jikan.synopsis || 'No description available.',
    poster: jikan.images.jpg.large_image_url || jikan.images.jpg.image_url,
    backdrop: jikan.trailer?.images?.maximum_image_url || jikan.images.webp.large_image_url,
    rating: jikan.score || 0,
    year: jikan.year || new Date(jikan.aired?.from || '').getFullYear() || 2024,
    status: jikan.airing ? 'ongoing' : (jikan.status === 'Finished Airing' ? 'completed' : 'announced'),
    episodeCount: jikan.episodes || 0,
    genres: jikan.genres.map(g => g.name),
    studio: jikan.studios.map(s => s.name).join(' / ') || 'Unknown',
    duration: jikan.duration || '24 min',
    type: jikan.type || 'TV',
  };
}

export function mapJikanEpisode(episode: JikanEpisode, animeId: string) {
  return {
    id: `${animeId}-ep-${episode.mal_id}`,
    animeId,
    number: episode.mal_id,
    title: episode.title || `Episode ${episode.mal_id}`,
    thumbnail: null,
    duration: '24:00',
    videoUrl: '',
    filler: episode.filler,
  };
}

export type { JikanAnime, JikanSearchResponse, JikanEpisode, JikanEpisodesResponse };
