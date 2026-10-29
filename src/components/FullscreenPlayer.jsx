import React from "react";
import {
  Minimize2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAudio } from "../context/AudioContext";

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function FullscreenPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleShuffle,
    cycleRepeat,
    isLiked,
    toggleLike,
    isFullscreenOpen,
    setIsFullscreenOpen,
    setVolumeLevel,
    toggleMute,
  } = useAudio();

  if (!isFullscreenOpen || !currentTrack) return null;

  const activeDuration = duration || currentTrack.duration || 30;
  const progressPercent = activeDuration > 0 ? (currentTime / activeDuration) * 100 : 0;
  const liked = isLiked(currentTrack.id);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-8 md:p-14 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl scale-125 pointer-events-none"
        style={{
          backgroundImage: `url(${currentTrack.cover})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-spotify-green animate-pulse" />
          <span>Now Playing on SpotiFree v2</span>
        </div>

        <button
          onClick={() => setIsFullscreenOpen(false)}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          title="Exit Full Screen"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Center: Large Artwork & Track Title */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 max-w-5xl mx-auto w-full my-auto">
        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl shrink-0 group">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? "scale-100" : "scale-95 opacity-90"
            }`}
          />
        </div>

        <div className="space-y-4 text-center md:text-left flex-1 min-w-0">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight line-clamp-2">
              {currentTrack.title}
            </h1>
            <button
              onClick={() => toggleLike(currentTrack)}
              className={`p-2 transition-transform active:scale-125 ${
                liked ? "text-spotify-green" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Heart className={`w-7 h-7 ${liked ? "fill-spotify-green" : ""}`} />
            </button>
          </div>

          <p className="text-xl md:text-2xl font-semibold text-neutral-300">
            {currentTrack.artist}
          </p>
          <p className="text-sm text-neutral-400">
            {currentTrack.album || "SpotiFree Single"}
          </p>

          {/* Animated Waveform Bars */}
          {isPlaying && (
            <div className="flex items-end gap-1.5 h-8 pt-4 justify-center md:justify-start">
              {[...Array(12)].map((_, i) => (
                <span
                  key={i}
                  className="w-1.5 bg-spotify-green rounded-full"
                  style={{
                    animation: `barJump ${0.6 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
                    height: `${8 + (i % 4) * 6}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 max-w-3xl mx-auto w-full space-y-4">
        {/* Progress Timeline */}
        <div className="space-y-1">
          <div className="relative w-full group flex items-center">
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-spotify-green"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={activeDuration}
              step={0.5}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(activeDuration)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={toggleShuffle}
            className={`p-2 transition-colors ${
              isShuffle ? "text-spotify-green" : "text-neutral-400 hover:text-white"
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={prevTrack}
            className="text-neutral-300 hover:text-white p-2 transition-transform hover:scale-110"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-spotify-green text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-2xl"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-black" />
            ) : (
              <Play className="w-8 h-8 fill-black ml-1" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="text-neutral-300 hover:text-white p-2 transition-transform hover:scale-110"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={cycleRepeat}
            className={`p-2 transition-colors ${
              repeatMode !== "off" ? "text-spotify-green" : "text-neutral-400 hover:text-white"
            }`}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
