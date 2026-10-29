/**
 * Service to fetch live music, top charts, and artist details.
 * Uses public iTunes Search API - 100% free, no API key or login required.
 */

// Cache to prevent redundant network calls
const cache = new Map();

/**
 * Format raw iTunes track into standard SpotiFree Track model
 */
export function formatTrack(raw) {
  // Get 600x600 high resolution cover art
  const coverUrl = raw.artworkUrl100
    ? raw.artworkUrl100.replace('100x100bb', '600x600bb')
    : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

  const durationSec = raw.trackTimeMillis
    ? Math.round(raw.trackTimeMillis / 1000)
    : 30;

  return {
    id: String(raw.trackId || raw.collectionId || Math.random()),
    title: raw.trackName || raw.collectionName || 'Unknown Title',
    artist: raw.artistName || 'Unknown Artist',
    album: raw.collectionName || 'Single',
    cover: coverUrl,
    audioUrl: raw.previewUrl || '',
    duration: durationSec,
    genre: raw.primaryGenreName || 'Music',
    releaseYear: raw.releaseDate ? new Date(raw.releaseDate).getFullYear() : 2024,
    artistViewUrl: raw.artistViewUrl || '',
    trackViewUrl: raw.trackViewUrl || '',
  };
}

/**
 * Search tracks, artists, or albums
 */
export async function searchTracks(query, limit = 30) {
  if (!query || !query.trim()) return [];
  const cacheKey = `search_${query.trim().toLowerCase()}_${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query.trim())}&media=music&entity=song&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    const tracks = (data.results || [])
      .filter(t => t.previewUrl)
      .map(formatTrack);

    cache.set(cacheKey, tracks);
    return tracks;
  } catch (error) {
    console.error('Failed to search tracks:', error);
    return [];
  }
}

/**
 * Get popular tracks by term/genre
 */
export async function getPopularByGenre(genre, limit = 20) {
  const cacheKey = `genre_${genre}_${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(genre)}&media=music&entity=song&attribute=genreIndex&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    const tracks = (data.results || [])
      .filter(t => t.previewUrl)
      .map(formatTrack);

    cache.set(cacheKey, tracks);
    return tracks;
  } catch (error) {
    console.error(`Failed to load genre ${genre}:`, error);
    return [];
  }
}

/**
 * Fetch top trending tracks across various popular artists
 */
export async function getTopCharts(limit = 25) {
  const cacheKey = `top_charts_${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    // Search for top billboard/chart hits
    const terms = ['Hits 2025', 'Top 50 Global', 'Billboard', 'Viral Hits'];
    const randomTerm = terms[Math.floor(Math.random() * terms.length)];
    const tracks = await searchTracks(randomTerm, limit);
    if (tracks.length > 0) {
      cache.set(cacheKey, tracks);
      return tracks;
    }
    return [];
  } catch (err) {
    console.error('Failed to load top charts:', err);
    return [];
  }
}
