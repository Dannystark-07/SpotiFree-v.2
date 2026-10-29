import React, { useEffect, useRef } from "react";
import { X, Mic2, Music2 } from "lucide-react";
import { useAudio } from "../context/AudioContext";

// Simulated lyric timestamps for demonstration
const SAMPLE_LYRICS = [
  { time: 0, text: "♪ (Music playing) ♪" },
  { time: 4, text: "Looking out across the glowing skyline" },
  { time: 9, text: "Neon lights reflecting in the rain" },
  { time: 14, text: "Chasing all the echoes through the midnight" },
  { time: 19, text: "Finding rhythm in the silent pain" },
  { time: 24, text: "We were flying high above the asphalt" },
  { time: 29, text: "Never looking down, never looking back" },
  { time: 35, text: "Lost inside the pulse of synthetic dreams" },
  { time: 41, text: "Everything is brighter than it seems" },
  { time: 48, text: "♪ (Instrumental Break) ♪" },
  { time: 60, text: "Caught between the shadow and the sunlight" },
  { time: 68, text: "Spinning through a kaleidoscope of sound" },
  { time: 75, text: "Hold the moment, don't let it fade away" },
  { time: 82, text: "Tonight we own the melody we play" },
  { time: 90, text: "♪ (Outro) ♪" },
];

export default function LyricsView() {
  const { currentTrack, currentTime, isLyricsOpen, setIsLyricsOpen, seek } = useAudio();
  const containerRef = useRef(null);
  const activeLineRef = useRef(null);

  if (!isLyricsOpen || !currentTrack) return null;

  // Find current line index based on playback time
  const currentLineIndex = SAMPLE_LYRICS.reduce((acc, line, idx) => {
    if (currentTime >= line.time) return idx;
    return acc;
  }, 0);

  // Auto scroll to active line
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLineIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col select-none overflow-hidden animate-in fade-in duration-200">
      {/* Background Ambient Glow */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl pointer-events-none scale-125"
        style={{
          backgroundImage: `url(${currentTrack.cover})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-spotify-green/20 text-spotify-green flex items-center justify-center">
            <Mic2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Lyrics
              <span className="text-xs font-normal text-neutral-400">
                • {currentTrack.title}
              </span>
            </h2>
            <p className="text-xs text-neutral-400">{currentTrack.artist}</p>
          </div>
        </div>

        <button
          onClick={() => setIsLyricsOpen(false)}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          title="Close lyrics"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lyrics Scrollable Area */}
      <div
        ref={containerRef}
        className="relative z-10 flex-1 overflow-y-auto px-8 md:px-24 py-16 space-y-8 text-center max-w-4xl mx-auto w-full"
      >
        {SAMPLE_LYRICS.map((line, index) => {
          const isActive = index === currentLineIndex;
          const isPassed = index < currentLineIndex;

          return (
            <p
              key={index}
              ref={isActive ? activeLineRef : null}
              onClick={() => seek(line.time)}
              className={`text-2xl md:text-4xl font-extrabold cursor-pointer transition-all duration-300 transform ${
                isActive
                  ? "text-white scale-105"
                  : isPassed
                  ? "text-white/40 hover:text-white/80"
                  : "text-white/20 hover:text-white/60"
              }`}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
