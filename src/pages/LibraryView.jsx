import React, { useState } from "react";
import { Plus, Heart, Music, Clock, Play } from "lucide-react";
import { useAudio } from "../context/AudioContext";
import TrackRow from "../components/TrackRow";

export default function LibraryView({ onCreatePlaylistOpen }) {
  const {
    likedSongs,
    userPlaylists,
    history,
    navigateTo,
    playTrack,
  } = useAudio();

  const [activeTab, setActiveTab] = useState("playlists"); // 'playlists' | 'history'

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Your Library
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Persisted securely on your device with no login required
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab("playlists")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
              activeTab === "playlists"
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Playlists & Liked
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${
              activeTab === "history"
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Recently Played
          </button>
        </div>
      </div>

      {activeTab === "playlists" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {/* Special Liked Songs Card */}
            <div
              onClick={() => navigateTo("liked")}
              className="group col-span-2 p-5 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 rounded-xl cursor-pointer shadow-xl relative flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-1">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-black text-white">Liked Songs</h3>
                <p className="text-sm text-white/80 font-medium mt-1">
                  {likedSongs.length} liked {likedSongs.length === 1 ? "song" : "songs"}
                </p>
              </div>

              {likedSongs.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playTrack(likedSongs[0], likedSongs);
                  }}
                  className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-2xl transition-all duration-200 hover:scale-105"
                >
                  <Play className="w-6 h-6 fill-black ml-0.5" />
                </button>
              )}
            </div>

            {/* Create Playlist Action Card */}
            <div
              onClick={onCreatePlaylistOpen}
              className="p-5 bg-neutral-900/60 hover:bg-neutral-800/80 border-2 border-dashed border-white/10 hover:border-spotify-green/50 rounded-xl cursor-pointer flex flex-col items-center justify-center text-center transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-spotify-green group-hover:text-black text-white flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-spotify-green transition-colors">
                New Playlist
              </h4>
              <p className="text-[11px] text-neutral-400 mt-1">
                Build your own mix
              </p>
            </div>

            {/* User & Curated Playlists */}
            {userPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => navigateTo("playlist", pl)}
                className="group p-4 bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 flex flex-col"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 shadow-md">
                  <img
                    src={pl.cover}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {pl.tracks?.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(pl.tracks[0], pl.tracks);
                      }}
                      className="absolute right-2.5 bottom-2.5 w-10 h-10 rounded-full bg-spotify-green text-black flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </button>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white truncate mb-0.5">
                  {pl.title}
                </h3>
                <p className="text-xs text-neutral-400">
                  {pl.tracks?.length || 0} songs
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Recently played songs on this device</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 text-sm">
              No listening history yet. Start playing your favorite tracks!
            </div>
          ) : (
            <div className="bg-neutral-900/40 rounded-xl p-2 border border-white/5 space-y-1">
              {history.map((track, i) => (
                <TrackRow
                  key={`${track.id}-${i}`}
                  track={track}
                  index={i}
                  queueList={history}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
