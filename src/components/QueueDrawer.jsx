import React from "react";
import { X, Trash2, ListMusic, Volume2 } from "lucide-react";
import { useAudio } from "../context/AudioContext";
import TrackRow from "./TrackRow";

export default function QueueDrawer() {
  const {
    queue,
    queueIndex,
    currentTrack,
    isQueueOpen,
    setIsQueueOpen,
    removeFromQueue,
    clearQueue,
    playTrack,
  } = useAudio();

  if (!isQueueOpen) return null;

  const upcomingTracks = queue.slice(queueIndex + 1);

  return (
    <aside className="w-80 bg-neutral-950 border-l border-white/10 flex flex-col h-full z-20 shrink-0 select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-spotify-green" />
          <h3 className="font-bold text-sm text-white">Queue</h3>
        </div>
        <div className="flex items-center gap-2">
          {upcomingTracks.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition-colors"
              title="Clear queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Now Playing */}
        {currentTrack && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Now Playing
            </p>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover shadow"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-spotify-green truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {currentTrack.artist}
                </p>
              </div>
              <Volume2 className="w-4 h-4 text-spotify-green animate-pulse shrink-0" />
            </div>
          </div>
        )}

        {/* Next Up */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Next Up ({upcomingTracks.length})
            </p>
          </div>

          {upcomingTracks.length === 0 ? (
            <div className="text-center py-10 px-4 text-neutral-500 text-xs">
              <p>No tracks queued up next.</p>
              <p className="mt-1 text-neutral-600">
                Play a playlist or right click any track to add it here.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {upcomingTracks.map((track, i) => {
                const actualIndex = queueIndex + 1 + i;
                return (
                  <div
                    key={`${track.id}-${actualIndex}`}
                    className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div
                      onClick={() => playTrack(track, queue, actualIndex)}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xs text-neutral-500 font-mono w-4">
                        {i + 1}
                      </span>
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-9 h-9 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate group-hover:text-spotify-green">
                          {track.title}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromQueue(actualIndex)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-white transition-opacity"
                      title="Remove from queue"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
