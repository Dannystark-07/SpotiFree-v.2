import React from "react";
import { Play, Pause, Sparkles, TrendingUp, Music } from "lucide-react";
import { useAudio } from "../context/AudioContext";
import { DEFAULT_TRACKS, CURATED_PLAYLISTS, POPULAR_ARTISTS } from "../data/mockTracks";
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

  // Quick picks (first 6 items)
  const quickPicks = [
    ...CURATED_PLAYLISTS.slice(0, 4).map((pl) => ({
      type: "playlist",
      id: pl.id,
      title: pl.title,
      cover: pl.cover,
      item: pl,
    })),
    ...DEFAULT_TRACKS.slice(0, 2).map((t) => ({
      type: "track",
      id: t.id,
      title: t.title,
      cover: t.cover,
      item: t,
    })),
  ];

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      {/* Time Greeting */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {greeting}
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Welcome to SpotiFree v2 • Enjoy unlimited ad-free streaming.
        </p>
      </div>

      {/* Quick Picks 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickPicks.map((pick) => {
          const isCurrent =
            pick.type === "track" && currentTrack?.id === pick.item.id;
          return (
            <div
              key={pick.id}
              onClick={() => {
                if (pick.type === "playlist") {
                  navigateTo("playlist", pick.item);
                } else {
                  playTrack(pick.item, DEFAULT_TRACKS);
                }
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
                  if (pick.type === "playlist") {
                    if (pick.item.tracks.length > 0) {
                      playTrack(pick.item.tracks[0], pick.item.tracks);
                    }
                  } else {
                    if (isCurrent) togglePlay();
                    else playTrack(pick.item, DEFAULT_TRACKS);
                  }
                }}
                className="mr-3 w-10 h-10 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all duration-200 hover:scale-105"
              >
                {isCurrent && isPlaying ? (
                  <Pause className="w-5 h-5 fill-black" />
                ) : (
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Featured Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Featured Playlists
            </h2>
            <p className="text-xs text-neutral-400">
              Curated soundtracks for every mood and moment
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {CURATED_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              onClick={() => navigateTo("playlist", pl)}
              className="group p-4 bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 hover:border-white/10 flex flex-col"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3.5 shadow-md">
                <img
                  src={pl.cover}
                  alt={pl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pl.tracks?.length > 0) {
                      playTrack(pl.tracks[0], pl.tracks);
                    }
                  }}
                  className="absolute right-2.5 bottom-2.5 w-11 h-11 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </button>
              </div>
              <h3 className="font-bold text-sm text-white truncate mb-1">
                {pl.title}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {pl.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Tracks */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-spotify-green" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Trending Global Tracks
          </h2>
        </div>

        <div className="bg-neutral-900/40 rounded-xl p-2 border border-white/5">
          {DEFAULT_TRACKS.map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              queueList={DEFAULT_TRACKS}
            />
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Popular Artists
          </h2>
          <p className="text-xs text-neutral-400">
            Artists dominating charts worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {POPULAR_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigateTo("search")}
              className="group p-4 bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 text-center"
            >
              <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3 shadow-lg">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-sm text-white truncate">
                {artist.name}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {artist.monthlyListeners} monthly
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
