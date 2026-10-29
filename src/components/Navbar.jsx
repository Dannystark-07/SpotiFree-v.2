import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Github,
  Sparkles,
  Share2,
  Check,
  Info,
} from "lucide-react";
import { useAudio } from "../context/AudioContext";

export default function Navbar({ onOpenCredits }) {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    navigateTo,
  } = useAudio();

  const [copied, setCopied] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (currentView !== "search") {
      setCurrentView("search");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: "SpotiFree v2",
      text: "Stream unlimited music and global hits with no login on SpotiFree!",
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User closed the share sheet
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        console.warn("Clipboard write failed", e);
      }
    }
  };

  return (
    <header className="h-16 px-8 flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-xl z-20 border-b border-white/5 select-none">
      {/* Left: History Nav & Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            title="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.history.forward()}
            className="w-8 h-8 rounded-full bg-black/70 hover:bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            title="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search songs, artists, albums, or genres..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (currentView !== "search") setCurrentView("search");
            }}
            className="w-full bg-neutral-900/90 text-sm text-white placeholder-neutral-400 pl-10 pr-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:border-spotify-green focus:ring-1 focus:ring-spotify-green transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right: Credits, Share, GitHub Link & Guest Status */}
      <div className="flex items-center gap-3">
        {/* Developer & Credits Modal Trigger */}
        <button
          onClick={onOpenCredits}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10 group"
          title="Developer & Project Credits"
        >
          <span className="w-2 h-2 rounded-full bg-spotify-green group-hover:scale-125 transition-transform" />
          <span>v2.0.0</span>
          <span className="text-neutral-400 font-normal hidden md:inline">
            • DannyStark
          </span>
        </button>

        {/* Share with Friends Button */}
        <button
          onClick={handleShare}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all border ${
            copied
              ? "bg-spotify-green text-black border-spotify-green shadow-lg scale-105"
              : "bg-white/10 hover:bg-spotify-green hover:text-black hover:border-spotify-green text-white border-white/10"
          }`}
          title="Share link with friends"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share App</span>
            </>
          )}
        </button>

        <a
          href="https://github.com/Dannystark-07/SpotiFree-v.2"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-all border border-white/5"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </a>

        {/* Guest Profile pill */}
        <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-neutral-900 border border-white/10">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-spotify-green to-emerald-400 flex items-center justify-center text-black font-bold text-xs">
            G
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold leading-tight text-white flex items-center gap-1">
              Guest
              <span className="w-1.5 h-1.5 rounded-full bg-spotify-green animate-pulse" />
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
