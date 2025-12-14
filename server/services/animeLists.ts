const ANIME_LISTS_URL = 'https://raw.githubusercontent.com/Fribb/anime-lists/master/anime-list-full.json';

interface AnimeMapping {
  mal_id?: number;
  anilist_id?: number;
  kitsu_id?: number;
  anidb_id?: number;
  thetvdb_id?: number;
  themoviedb_id?: number;
  imdb_id?: string;
  livechart_id?: number;
  anisearch_id?: number;
  'notify.moe_id'?: string;
  'anime-planet_id'?: string;
  type?: string;
}

let animeListsCache: AnimeMapping[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export async function fetchAnimeLists(): Promise<AnimeMapping[]> {
  const now = Date.now();
  
  if (animeListsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return animeListsCache;
  }
  
  try {
    console.log('Fetching anime-lists from GitHub...');
    const response = await fetch(ANIME_LISTS_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch anime-lists: ${response.status}`);
    }
    
    animeListsCache = await response.json();
    lastFetchTime = now;
    console.log(`Loaded ${animeListsCache?.length || 0} anime mappings`);
    
    return animeListsCache || [];
  } catch (error) {
    console.error('Error fetching anime-lists:', error);
    return animeListsCache || [];
  }
}

export async function findMappingByMalId(malId: number): Promise<AnimeMapping | null> {
  const lists = await fetchAnimeLists();
  return lists.find(m => m.mal_id === malId) || null;
}

export async function findMappingByAnilistId(anilistId: number): Promise<AnimeMapping | null> {
  const lists = await fetchAnimeLists();
  return lists.find(m => m.anilist_id === anilistId) || null;
}

export async function findMappingByKitsuId(kitsuId: number): Promise<AnimeMapping | null> {
  const lists = await fetchAnimeLists();
  return lists.find(m => m.kitsu_id === kitsuId) || null;
}

export async function convertMalToAnilist(malId: number): Promise<number | null> {
  const mapping = await findMappingByMalId(malId);
  return mapping?.anilist_id || null;
}

export async function convertAnilistToMal(anilistId: number): Promise<number | null> {
  const mapping = await findMappingByAnilistId(anilistId);
  return mapping?.mal_id || null;
}

export async function getAllMappingsForMalId(malId: number): Promise<AnimeMapping | null> {
  return findMappingByMalId(malId);
}

export type { AnimeMapping };
