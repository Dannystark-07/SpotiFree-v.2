import React, { useState, useEffect } from "react";
import { Play, Pause, Sparkles, TrendingUp, Music, Globe2, Flame, BadgeCheck } from "lucide-react";
import { useAudio } from "../context/AudioContext";
import { DEFAULT_TRACKS, CURATED_PLAYLISTS } from "../data/mockTracks";
import { GLOBAL_ARTISTS, WORLD_REGIONS, WORLD_CHARTS } from "../data/globalMusic";
import { getTopCharts } from "../services/musicApi";
import TrackRow from "../components/TrackRow";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeView() {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    navigateTo,
  } = useAudio();

  const greeting = getGreeting();
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [trendingTracks, setTrendingTracks] = useState(DEFAULT_TRACKS);
  const [loadingTrending, setLoadingTrending] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTrending() {
      setLoadingTrending(true);
      try {
        const liveTracks = await getTopCharts(12);
        if (isMounted && liveTracks && liveTracks.length > 0) {
          setTrendingTracks(liveTracks);
        }
      } catch (err) {
        console.warn("Using default tracks for trending", err);
      } finally {
        if (isMounted) setLoadingTrending(false);
      }
    }
    loadTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter global artists by region
  const filteredArtists =
    selectedRegion === "All"
      ? GLOBAL_ARTISTS
      : GLOBAL_ARTISTS.filter((a) => a.region === selectedRegion);

  // Quick picks (first 6 items)
  const quickPicks = [
    ...WORLD_CHARTS.slice(0, 3).map((pl) => ({
      type: "playlist",
      id: pl.id,
      title: pl.title,
      cover: pl.cover,
      item: pl,
    })),
    ...CURATED_PLAYLISTS.slice(0, 3).map((pl) => ({
      type: "playlist",
      id: pl.id,
      title: pl.title,
      cover: pl.cover,
      item: pl,
    })),
  ];

  return (
    <div className="p-8 space-y-12 max-w-7xl mx-auto">
      {/* Time Greeting & Global Header */}
      <div>
        <div className="flex items-center gap-2 text-spotify-green text-xs font-bold uppercase tracking-wider mb-1">
          <Globe2 className="w-4 h-4" />
          <span>Global Music Streaming • All Continents</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {greeting}
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Explore artists and full-length music from every corner of the world. No login required.
        </p>
      </div>

      {/* Quick Picks 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickPicks.map((pick) => {
          return (
            <div
              key={pick.id}
              onClick={() => {
                navigateTo("playlist", pick.item);
              }}
              className="group flex items-center bg-white/5 hover:bg-white/10 rounded-md overflow-hidden cursor-pointer transition-all duration-200 border border-white/5 relative"
            >
              <img
                src={pick.cover}
                alt={pick.title}
                className="w-16 h-16 object-cover shrink-0"
              />
              <span className="px-4 font-bold text-sm text-white truncate flex-1">
                {pick.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (pick.item.tracks.length > 0) {
                    playTrack(pick.item.tracks[0], pick.item.tracks);
                  }
                }}
                className="mr-3 w-10 h-10 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* SECTION: Global World Charts & Continental Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-spotify-green" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Global World Charts & Regional Sounds
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Curated charts from the Americas, Europe, Asia, Africa, and Oceania
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {WORLD_CHARTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigateTo("playlist", pl)}
              className="group p-3.5 bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 flex flex-col"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 shadow-md">
                <img
                  src={pl.cover}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 text-base bg-black/60 backdrop-blur rounded-full px-2 py-0.5">
                  {pl.flag}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pl.tracks?.length > 0) {
                      playTrack(pl.tracks[0], pl.tracks);
                    }
                  }}
                  className="absolute right-2.5 bottom-2.5 w-10 h-10 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </button>
              </div>
              <h3 className="font-bold text-sm text-white truncate mb-1">
                {pl.title}
              </h3>
              <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                {pl.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: Artists All Over the World */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-spotify-green" />
              Artists Around the World
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click any artist to view their full profile, bio, and play their full songs
            </p>
          </div>

          {/* Region Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {WORLD_REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? "bg-spotify-green text-black shadow-md font-bold"
                    : "bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Artist Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filteredArtists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigateTo("artist", artist)}
              className="group p-4 bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 text-center flex flex-col items-center"
            >
              <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 shadow-lg">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (artist.topTracks?.length > 0) {
                      playTrack(artist.topTracks[0], artist.topTracks);
                    } else {
                      navigateTo("artist", artist);
                    }
                  }}
                  className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 max-w-full">
                <h3 className="font-bold text-sm text-white truncate group-hover:text-spotify-green transition-colors">
                  {artist.name}
                </h3>
                <BadgeCheck className="w-3.5 h-3.5 text-spotify-green shrink-0 fill-spotify-green" />
              </div>

              <p className="text-[11px] text-neutral-400 mt-1 flex items-center justify-center gap-1.5">
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

      {/* SECTION: Trending Full-Length Tracks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-spotify-green" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Trending Global Full-Length Songs
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-spotify-green bg-spotify-green/10 px-2.5 py-1 rounded-full border border-spotify-green/20">
            Full-Length • No 30s Cutoff
          </span>
        </div>

        <div className="bg-neutral-900/40 rounded-xl p-2 border border-white/5 space-y-1">
          {trendingTracks.map((track, idx) => (
            <TrackRow
              key={`${track.id}-${idx}`}
              track={track}
              index={idx}
              queueList={trendingTracks}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
