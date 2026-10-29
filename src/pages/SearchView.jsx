import React, { useState, useEffect } from "react";
import { Search, Loader2, Play, Music, Sparkles, BadgeCheck, Globe2 } from "lucide-react";
import { useAudio } from "../context/AudioContext";
import { searchTracks } from "../services/musicApi";
import { GENRES_LIST } from "../data/mockTracks";
import { GLOBAL_ARTISTS } from "../data/globalMusic";
import TrackRow from "../components/TrackRow";

export default function SearchView() {
  const { searchQuery, setSearchQuery, playTrack, navigateTo } = useAudio();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Matching artists from global directory
  const matchingArtists = searchQuery.trim()
    ? GLOBAL_ARTISTS.filter(
        (a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Debounced search when searchQuery changes
  useEffect(() => {
    if (!searchQuery || !searchQuery.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const tracks = await searchTracks(searchQuery, 25);
        setResults(tracks);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const topResult = results[0];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Title & Quick Info */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Search
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Stream any song, artist, album, or genre with no login required
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center gap-3 py-6 text-spotify-green">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Searching global music catalog...</span>
        </div>
      )}

      {/* Matching Artists Section */}
      {searchQuery && matchingArtists.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-spotify-green fill-spotify-green" />
            Artists
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {matchingArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => navigateTo("artist", artist)}
                className="group p-4 bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl cursor-pointer transition-all border border-white/5 text-center flex flex-col items-center"
              >
                <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 shadow-lg">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-sm text-white truncate max-w-full group-hover:text-spotify-green transition-colors">
                  {artist.name}
                </h4>
                <p className="text-xs text-neutral-400 flex items-center justify-center gap-1 mt-0.5">
                  <span>{artist.flag}</span>
                  <span>{artist.country}</span>
                </p>
                <span className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {artist.monthlyListeners} monthly
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Results View */}
      {searchQuery && !isLoading && results.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Result Card */}
            {topResult && (
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-lg font-bold text-white">Top Result</h3>
                <div
                  onClick={() => playTrack(topResult, results, 0)}
                  className="group relative p-6 bg-neutral-900/80 hover:bg-neutral-800/90 rounded-2xl cursor-pointer transition-all border border-white/5 shadow-xl flex flex-col justify-between"
                >
                  <img
                    src={topResult.cover}
                    alt={topResult.title}
                    className="w-24 h-24 rounded-xl object-cover shadow-lg mb-4"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-white group-hover:text-spotify-green transition-colors line-clamp-1">
                      {topResult.title}
                    </h4>
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo("artist", topResult.artist);
                      }}
                      className="text-sm text-neutral-400 mt-1 line-clamp-1 hover:text-white hover:underline cursor-pointer"
                    >
                      {topResult.artist}
                    </p>
                    <span className="inline-block mt-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/40 text-neutral-300">
                      {topResult.genre || "Song"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(topResult, results, 0);
                    }}
                    className="absolute right-5 bottom-5 w-12 h-12 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <Play className="w-6 h-6 fill-black ml-0.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Songs List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-lg font-bold text-white">Full-Length Songs</h3>
              <div className="bg-neutral-900/40 rounded-xl p-2 border border-white/5 space-y-1">
                {results.slice(0, 6).map((track, i) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={i}
                    queueList={results}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* More matching results */}
          {results.length > 6 && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">More Results</h3>
              <div className="bg-neutral-900/40 rounded-xl p-2 border border-white/5 space-y-1">
                {results.slice(6).map((track, i) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={i + 6}
                    queueList={results}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {searchQuery && !isLoading && results.length === 0 && matchingArtists.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-lg font-bold text-white">
            No results found for "{searchQuery}"
          </p>
          <p className="text-sm text-neutral-400">
            Please make sure words are spelled correctly or try browsing genres below.
          </p>
        </div>
      )}

      {/* Featured Global Artists (When not actively searching) */}
      {!searchQuery && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-spotify-green" />
            Featured Artists Across the Globe
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {GLOBAL_ARTISTS.slice(0, 12).map((artist) => (
              <div
                key={artist.id}
                onClick={() => navigateTo("artist", artist)}
                className="group p-4 bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl cursor-pointer transition-all border border-white/5 text-center flex flex-col items-center"
              >
                <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 shadow-lg">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-sm text-white truncate max-w-full group-hover:text-spotify-green transition-colors">
                  {artist.name}
                </h4>
                <p className="text-xs text-neutral-400 flex items-center justify-center gap-1 mt-0.5">
                  <span>{artist.flag}</span>
                  <span>{artist.country}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Browse All Genres */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Browse All Genres
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {GENRES_LIST.map((genre) => (
            <div
              key={genre.id}
              onClick={() => setSearchQuery(genre.query)}
              className={`group relative aspect-[4/3] rounded-xl p-4 bg-gradient-to-br ${genre.color} cursor-pointer overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105`}
            >
              <h3 className="font-extrabold text-base md:text-lg text-white leading-tight">
                {genre.title}
              </h3>
              <div className="absolute -right-2 -bottom-2 w-16 h-16 rounded-lg rotate-12 opacity-80 group-hover:rotate-6 transition-transform shadow-md overflow-hidden bg-black/20">
                <Music className="w-full h-full p-3 text-white/50" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
