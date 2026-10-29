import React, { useState } from "react";
import { Play, Pause, Heart, MoreHorizontal, Plus, ListPlus } from "lucide-react";
import { useAudio } from "../context/AudioContext";

function formatDuration(sec) {
  if (!sec || isNaN(sec)) return "3:30";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function TrackRow({
  track,
  index,
  queueList,
  showAlbum = true,
  onRemove = null,
}) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    isLiked,
    toggleLike,
    addToQueue,
    userPlaylists,
    addToPlaylist,
    navigateTo,
  } = useAudio();

  const [menuOpen, setMenuOpen] = useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueList, index);
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors hover:bg-white/10 ${
        isCurrent ? "bg-white/5" : ""
      }`}
    >
      {/* Index / Play / Equalizer */}
      <div className="flex items-center gap-4 min-w-[40px]">
        <div className="w-5 text-center flex items-center justify-center">
          {isCurrent && isPlaying ? (
            <div className="flex items-end gap-[2px] h-3.5 group-hover:hidden">
              <span className="w-[3px] bg-spotify-green equalizer-bar-1 rounded-full" />
              <span className="w-[3px] bg-spotify-green equalizer-bar-2 rounded-full" />
              <span className="w-[3px] bg-spotify-green equalizer-bar-3 rounded-full" />
            </div>
          ) : (
            <span
              className={`text-sm font-mono ${
                isCurrent ? "text-spotify-green font-bold" : "text-neutral-400"
              } group-hover:hidden`}
            >
              {index + 1}
            </span>
          )}

          {/* Hover Play Button */}
          <button
            onClick={handlePlayClick}
            className="hidden group-hover:flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>
        </div>

        {/* Thumbnail & Track Meta */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={track.cover}
            alt={track.title}
            className="w-10 h-10 rounded object-cover shrink-0 shadow"
            loading="lazy"
          />
          <div className="min-w-0">
            <p
              onClick={handlePlayClick}
              className={`text-sm font-medium truncate cursor-pointer hover:underline ${
                isCurrent ? "text-spotify-green font-semibold" : "text-white"
              }`}
            >
              {track.title}
            </p>
            <p
              onClick={(e) => {
                e.stopPropagation();
                navigateTo("artist", track.artist);
              }}
              className="text-xs text-neutral-400 truncate hover:text-white hover:underline cursor-pointer"
            >
              {track.artist}
            </p>
          </div>
        </div>
      </div>

      {/* Album name */}
      {showAlbum && (
        <div className="hidden md:block flex-1 px-4 text-xs text-neutral-400 truncate">
          {track.album || "Single"}
        </div>
      )}

      {/* Actions & Duration */}
      <div className="flex items-center gap-3 text-neutral-400">
        {/* Heart like button */}
        <button
          onClick={() => toggleLike(track)}
          className={`transition-colors ${
            liked
              ? "text-spotify-green opacity-100"
              : "opacity-0 group-hover:opacity-100 hover:text-white"
          }`}
          title={liked ? "Unlike" : "Like"}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-spotify-green" : ""}`} />
        </button>

        <span className="text-xs font-mono w-10 text-right">
          {formatDuration(track.duration)}
        </span>

        {/* Context Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 w-48 bg-neutral-900 border border-white/10 rounded-lg shadow-2xl p-1 z-50 text-xs">
                <button
                  onClick={() => {
                    addToQueue(track);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-white/10 flex items-center gap-2 text-neutral-200 hover:text-white"
                >
                  <ListPlus className="w-4 h-4" />
                  Add to Queue
                </button>

                {userPlaylists.length > 0 && (
                  <div className="border-t border-white/10 my-1 pt-1">
                    <p className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-500">
                      Add to Playlist
                    </p>
                    {userPlaylists.slice(0, 5).map((pl) => (
                      <button
                        key={pl.id}
                        onClick={() => {
                          addToPlaylist(pl.id, track);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded hover:bg-white/10 truncate text-neutral-300 hover:text-white"
                      >
                        {pl.title}
                      </button>
                    ))}
                  </div>
                )}

                {onRemove && (
                  <button
                    onClick={() => {
                      onRemove(track.id);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 border-t border-white/10 mt-1"
                  >
                    Remove from playlist
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
