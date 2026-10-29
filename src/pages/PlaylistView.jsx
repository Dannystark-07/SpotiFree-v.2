import React from "react";
import { Play, Pause, Shuffle, Trash2, Clock, Music } from "lucide-react";
import { useAudio } from "../context/AudioContext";
import TrackRow from "../components/TrackRow";

export default function PlaylistView({ playlist, isLikedView = false }) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedSongs,
    deletePlaylist,
    removeFromPlaylist,
    toggleShuffle,
    isShuffle,
    navigateTo,
  } = useAudio();

  const title = isLikedView ? "Liked Songs" : playlist?.title || "Playlist";
  const description = isLikedView
    ? "Your favorite songs saved on this browser."
    : playlist?.description || "";
  const cover = isLikedView
    ? "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80"
    : playlist?.cover ||
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80";

  const tracks = isLikedView ? likedSongs : playlist?.tracks || [];
  const isCustomPlaylist = playlist?.id?.startsWith("custom-pl-");

  const totalDurationSec = tracks.reduce((acc, t) => acc + (t.duration || 180), 0);
  const totalMinutes = Math.floor(totalDurationSec / 60);

  const isCurrentPlaylistPlaying =
    isPlaying && tracks.some((t) => t.id === currentTrack?.id);

  const handleMainPlay = () => {
    if (tracks.length === 0) return;
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks, 0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div className="px-8 pt-12 pb-6 bg-gradient-to-b from-indigo-900/60 via-neutral-900/40 to-transparent flex flex-col md:flex-row items-end gap-6 border-b border-white/5">
        <div className="w-52 h-52 shrink-0 rounded-xl overflow-hidden shadow-2xl bg-neutral-800">
          <img src={cover} alt={title} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-2 flex-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            {isLikedView ? "Collection" : "Playlist"}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-neutral-400 max-w-2xl">{description}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium pt-2">
            <span className="font-bold text-white">SpotiFree</span>
            <span>•</span>
            <span>{tracks.length} songs</span>
            {tracks.length > 0 && (
              <>
                <span>•</span>
                <span>about {totalMinutes} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={handleMainPlay}
            disabled={tracks.length === 0}
            className="w-14 h-14 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            title="Play playlist"
          >
            {isCurrentPlaylistPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={toggleShuffle}
            className={`p-2 transition-colors ${
              isShuffle ? "text-spotify-green" : "text-neutral-400 hover:text-white"
            }`}
            title="Shuffle"
          >
            <Shuffle className="w-6 h-6" />
          </button>

          {isCustomPlaylist && (
            <button
              onClick={() => deletePlaylist(playlist.id)}
              className="text-neutral-400 hover:text-red-400 p-2 transition-colors"
              title="Delete Playlist"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Tracks Table */}
      <div className="px-8 pb-12">
        {tracks.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Music className="w-12 h-12 text-neutral-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              This playlist is currently empty
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              Find songs via Search and click "Add to Playlist" or heart any song to build your mix.
            </p>
            <button
              onClick={() => navigateTo("search")}
              className="mt-3 px-5 py-2 text-xs font-bold bg-white text-black rounded-full hover:scale-105 transition-transform"
            >
              Find Songs
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Table Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              <div className="flex items-center gap-4">
                <span className="w-5 text-center">#</span>
                <span>Title</span>
              </div>
              <span className="hidden md:block flex-1 px-4">Album</span>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 mr-10" />
              </div>
            </div>

            {/* Rows */}
            {tracks.map((track, i) => (
              <TrackRow
                key={`${track.id}-${i}`}
                track={track}
                index={i}
                queueList={tracks}
                onRemove={
                  isCustomPlaylist
                    ? (trackId) => removeFromPlaylist(playlist.id, trackId)
                    : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
