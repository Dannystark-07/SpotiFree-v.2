import React from "react";
import {
  Home,
  Search,
  Library,
  PlusSquare,
  Heart,
  Music,
  Radio,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Github,
  Award,
} from "lucide-react";
import { useAudio } from "../context/AudioContext";

export default function Sidebar({ onCreatePlaylistOpen, onOpenCredits }) {
  const {
    currentView,
    navigateTo,
    likedSongs,
    userPlaylists,
    selectedPlaylist,
  } = useAudio();

  return (
    <aside className="w-64 bg-black flex flex-col h-full border-r border-white/5 select-none shrink-0">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <div
          onClick={() => navigateTo("home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-spotify-green flex items-center justify-center shadow-lg shadow-spotify-green/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-white group-hover:text-spotify-green transition-colors">
                SpotiFree
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-spotify-green text-black px-1.5 py-0.5 rounded font-mono">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">
              Free Music • No Login
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-2 space-y-1">
        <button
          onClick={() => navigateTo("home")}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            currentView === "home"
              ? "bg-white/10 text-white"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Home className={`w-5 h-5 ${currentView === "home" ? "text-spotify-green" : ""}`} />
          Home
        </button>

        <button
          onClick={() => navigateTo("search")}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            currentView === "search"
              ? "bg-white/10 text-white"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Search className={`w-5 h-5 ${currentView === "search" ? "text-spotify-green" : ""}`} />
          Search
        </button>

        <button
          onClick={() => navigateTo("library")}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            currentView === "library"
              ? "bg-white/10 text-white"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Library className={`w-5 h-5 ${currentView === "library" ? "text-spotify-green" : ""}`} />
          Your Library
        </button>
      </div>

      {/* Actions */}
      <div className="px-3 pt-4 pb-2 space-y-1">
        <button
          onClick={onCreatePlaylistOpen}
          className="w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm font-semibold text-neutral-400 hover:text-white hover:bg-white/5 transition-all group"
        >
          <div className="w-6 h-6 rounded bg-neutral-300 group-hover:bg-white flex items-center justify-center transition-colors">
            <PlusSquare className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          Create Playlist
        </button>

        <button
          onClick={() => navigateTo("liked")}
          className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            currentView === "liked"
              ? "bg-white/10 text-white"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-500 flex items-center justify-center shadow-sm">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="flex-1 text-left">Liked Songs</span>
          {likedSongs.length > 0 && (
            <span className="text-xs text-neutral-500 font-mono">
              {likedSongs.length}
            </span>
          )}
        </button>
      </div>

      <div className="mx-6 my-2 border-t border-white/10" />

      {/* Playlists Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 px-3 mb-2">
          Playlists
        </p>
        {userPlaylists.map((pl) => {
          const isActive =
            currentView === "playlist" && selectedPlaylist?.id === pl.id;
          return (
            <button
              key={pl.id}
              onClick={() => navigateTo("playlist", pl)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm truncate block transition-all ${
                isActive
                  ? "text-spotify-green font-semibold bg-white/5"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {pl.title}
            </button>
          );
        })}
      </div>

      {/* Developer & Credits Card */}
      <div className="p-3 m-3 rounded-xl bg-neutral-900/80 border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-spotify-green to-emerald-400 text-black font-black text-xs flex items-center justify-center shadow">
              DS
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1">
                DannyStark
                <Award className="w-3 h-3 text-spotify-green fill-spotify-green" />
              </p>
              <p className="text-[10px] text-neutral-400">@Dannystark-07</p>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white/10 text-neutral-300 px-1.5 py-0.5 rounded">
            v2.0.0
          </span>
        </div>

        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
          <button
            onClick={onOpenCredits}
            className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-spotify-green" />
            <span>Credits</span>
          </button>
          <a
            href="https://github.com/Dannystark-07"
            target="_blank"
            rel="noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-spotify-green hover:text-black text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
            title="DannyStark on GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
