/**
 * Music API Service - SpotiFree v2
 * Powered by Audius Open Music Protocol API.
 * 100% Free, Full-Length Songs, No 30-second preview limits, No login/API key required.
 */

const AUDIUS_API_HOST = "https://api.audius.co";
const APP_NAME = "SpotiFree";

// Memory cache to prevent duplicate network requests
const cache = new Map();

/**
 * Formats an Audius track into the SpotiFree track structure
 */
export function formatAudiusTrack(raw) {
  const artwork = raw.artwork || {};
  const coverUrl =
    artwork["480x480"] ||
    artwork["1000x1000"] ||
    artwork["150x150"] ||
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80";

  const trackId = raw.id;
  const audioUrl = `${AUDIUS_API_HOST}/v1/tracks/${trackId}/stream?app_name=${APP_NAME}`;

  return {
    id: String(trackId),
    title: raw.title || "Untitled Track",
    artist: raw.user?.name || raw.user?.handle || "Unknown Artist",
    album: raw.genre || "Single",
    cover: coverUrl,
    audioUrl: audioUrl,
    duration: raw.duration || 180, // Full-length song duration in seconds!
    genre: raw.genre || "Music",
    releaseYear: raw.release_date
      ? new Date(raw.release_date).getFullYear()
      : 2024,
    playCount: raw.play_count || 0,
    isFullLength: true,
  };
}

/**
 * Search full-length songs by keyword, title, or artist
 */
export async function searchTracks(query, limit = 30) {
  if (!query || !query.trim()) return [];

  const cacheKey = `search_${query.trim().toLowerCase()}_${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const url = `${AUDIUS_API_HOST}/v1/tracks/search?query=${encodeURIComponent(
      query.trim()
    )}&app_name=${APP_NAME}&limit=${limit}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    const tracks = (data.data || [])
      .filter((t) => t.id && t.duration > 0 && !t.is_unlisted)
      .map(formatAudiusTrack);

    cache.set(cacheKey, tracks);
    return tracks;
  } catch (error) {
    console.error("Failed to search tracks on Audius:", error);
    return [];
  }
}

/**
 * Get top trending global full-length tracks
 */
export async function getTopCharts(limit = 25) {
  const cacheKey = `trending_${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const url = `${AUDIUS_API_HOST}/v1/tracks/trending?app_name=${APP_NAME}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    const tracks = (data.data || [])
      .filter((t) => t.id && t.duration > 0)
      .map(formatAudiusTrack);

    cache.set(cacheKey, tracks);
    return tracks;
  } catch (err) {
    console.error("Failed to load trending tracks:", err);
    return [];
  }
}

/**
 * Get trending full-length songs for a specific genre
 */
export async function getPopularByGenre(genre, limit = 20) {
  const cacheKey = `genre_${genre.toLowerCase()}_${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const url = `${AUDIUS_API_HOST}/v1/tracks/trending?genre=${encodeURIComponent(
      genre
    )}&app_name=${APP_NAME}&limit=${limit}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    const tracks = (data.data || [])
      .filter((t) => t.id && t.duration > 0)
      .map(formatAudiusTrack);

    cache.set(cacheKey, tracks);
    return tracks;
  } catch (err) {
    console.error(`Failed to load genre ${genre}:`, err);
    return [];
  }
}
