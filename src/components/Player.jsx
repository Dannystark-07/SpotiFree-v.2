import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Mic2,
  Maximize2,
  AlertCircle,
} from "lucide-react";
import { useAudio } from "../context/AudioContext";

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    playbackError,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    isLiked,
    toggleLike,
    isQueueOpen,
    setIsQueueOpen,
    isLyricsOpen,
    setIsLyricsOpen,
    setIsFullscreenOpen,
    navigateTo,
  } = useAudio();

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubValue, setScrubValue] = useState(0);

  if (!currentTrack) return null;

  const activeDuration = duration || currentTrack.duration || 30;
  const displayTime = isScrubbing ? scrubValue : currentTime;
  const progressPercent = activeDuration > 0 ? (displayTime / activeDuration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;
  const liked = isLiked(currentTrack.id);

  const handleSeekChange = (e) => {
    setScrubValue(parseFloat(e.target.value));
  };

  const handleSeekStart = () => {
    setIsScrubbing(true);
  };

  const handleSeekEnd = (e) => {
    setIsScrubbing(false);
    seek(parseFloat(e.target.value));
  };

  return (
    <footer className="h-24 bg-[#121212] border-t border-white/10 px-4 sm:px-6 flex items-center justify-between z-30 select-none shrink-0 relative">
      {/* Playback Error Toast if stream issues */}
      {playbackError && (
        <div className="absolute top-[-36px] left-1/2 -translate-x-1/2 bg-amber-600/95 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{playbackError}</span>
        </div>
      )}

      {/* LEFT: Track Info & Like */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[180px]">
        <div className="relative group w-14 h-14 rounded-md overflow-hidden bg-neutral-800 shrink-0 shadow-md">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
              <span className="w-1 bg-spotify-green equalizer-bar-1 rounded-full" />
              <span className="w-1 bg-spotify-green equalizer-bar-2 rounded-full" />
              <span className="w-1 bg-spotify-green equalizer-bar-3 rounded-full" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
            {currentTrack.title}
          </h4>
          <p
            onClick={() => navigateTo("artist", currentTrack.artist)}
            className="text-xs text-neutral-400 truncate hover:text-white hover:underline cursor-pointer"
          >
            {currentTrack.artist}
          </p>
        </div>

        <button
          onClick={() => toggleLike(currentTrack)}
          className={`p-2 rounded-full transition-transform active:scale-125 ${
            liked
              ? "text-spotify-green"
              : "text-neutral-400 hover:text-white"
          }`}
          title={liked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-spotify-green" : ""}`} />
        </button>
      </div>

      {/* CENTER: Main Controls & Progress Bar */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`transition-colors relative p-1 ${
              isShuffle ? "text-spotify-green" : "text-neutral-400 hover:text-white"
            }`}
            title={`Shuffle: ${isShuffle ? "On" : "Off"}`}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-green" />
            )}
          </button>

          {/* Previous */}
          <button
            onClick={prevTrack}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause Button */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black text-black" />
            ) : (
              <Play className="w-5 h-5 fill-black text-black ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            className="text-neutral-400 hover:text-white transition-colors p-1"
            title="Next track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={cycleRepeat}
            className={`transition-colors relative p-1 ${
              repeatMode !== "off"
                ? "text-spotify-green"
                : "text-neutral-400 hover:text-white"
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== "off" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-spotify-green" />
            )}
          </button>
        </div>

        {/* Progress Scrubber */}
        <div className="w-full flex items-center gap-2.5 text-xs text-neutral-400 font-mono">
          <span className="w-10 text-right">{formatTime(displayTime)}</span>
          <div className="relative flex-1 group flex items-center">
            {/* Background track */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-white group-hover:bg-spotify-green transition-colors"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Native range input overlay for interaction */}
            <input
              type="range"
              min={0}
              max={activeDuration}
              step={0.5}
              value={displayTime}
              onMouseDown={handleSeekStart}
              onTouchStart={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchEnd={handleSeekEnd}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>
          <span className="w-10 text-left">{formatTime(activeDuration)}</span>
        </div>
      </div>

      {/* RIGHT: Secondary Controls (Lyrics, Queue, Volume, Fullscreen) */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px]">
        {/* Lyrics */}
        <button
          onClick={() => setIsLyricsOpen((prev) => !prev)}
          className={`p-1.5 transition-colors ${
            isLyricsOpen ? "text-spotify-green" : "text-neutral-400 hover:text-white"
          }`}
          title="Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Queue */}
        <button
          onClick={() => setIsQueueOpen((prev) => !prev)}
          className={`p-1.5 transition-colors ${
            isQueueOpen ? "text-spotify-green" : "text-neutral-400 hover:text-white"
          }`}
          title="Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <div className="relative w-20 flex items-center">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
              <div
                className="h-full bg-white group-hover:bg-spotify-green transition-colors"
                style={{ width: `${volumePercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolumeLevel(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            />
          </div>
        </div>

        {/* Fullscreen */}
        <button
          onClick={() => setIsFullscreenOpen((prev) => !prev)}
          className="p-1.5 text-neutral-400 hover:text-white transition-colors"
          title="Full Screen Player"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
