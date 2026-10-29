import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { DEFAULT_TRACKS, CURATED_PLAYLISTS } from "../data/mockTracks";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  // --- Persistent Storage Helpers ---
  const getStorage = (key, fallback) => {
    try {
      const item = localStorage.getItem(`spotifree_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStorage = (key, value) => {
    try {
      localStorage.setItem(`spotifree_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  };

  // --- Audio State ---
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(() => getStorage("last_track", DEFAULT_TRACKS[0]));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => getStorage("volume", 0.75));
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(() => getStorage("shuffle", false));
  const [repeatMode, setRepeatMode] = useState(() => getStorage("repeat", "off")); // 'off' | 'all' | 'one'
  const [playbackError, setPlaybackError] = useState(null);

  // --- Queue & History ---
  const [queue, setQueue] = useState(() => [DEFAULT_TRACKS[0], ...DEFAULT_TRACKS.slice(1)]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [history, setHistory] = useState(() => getStorage("history", []));

  // --- User Library (No login required - stored locally) ---
  const [likedSongs, setLikedSongs] = useState(() => getStorage("liked_songs", [DEFAULT_TRACKS[0], DEFAULT_TRACKS[1]]));
  const [userPlaylists, setUserPlaylists] = useState(() => getStorage("playlists", CURATED_PLAYLISTS));

  // --- Active View / Page State ---
  const [currentView, setCurrentView] = useState("home"); // 'home' | 'search' | 'library' | 'playlist' | 'liked'
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Sync to local storage
  useEffect(() => setStorage("liked_songs", likedSongs), [likedSongs]);
  useEffect(() => setStorage("playlists", userPlaylists), [userPlaylists]);
  useEffect(() => setStorage("history", history.slice(0, 50)), [history]);
  useEffect(() => setStorage("volume", volume), [volume]);
  useEffect(() => setStorage("shuffle", isShuffle), [isShuffle]);
  useEffect(() => setStorage("repeat", repeatMode), [repeatMode]);
  useEffect(() => {
    if (currentTrack) setStorage("last_track", currentTrack);
  }, [currentTrack]);

  // Audio setup and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || currentTrack?.duration || 0);
      setPlaybackError(null);
    };
    const onEnded = () => handleTrackEnd();
    const onError = (e) => {
      console.warn("Audio playback error:", e);
      setPlaybackError("Audio stream temporarily unavailable");
      setIsPlaying(false);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [volume, isMuted, repeatMode, queue, queueIndex, isShuffle]);

  // Handle Track End
  const handleTrackEnd = () => {
    if (repeatMode === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.warn);
      return;
    }
    nextTrack();
  };

  // Sync MediaSession API for lock-screen/system media controls
  useEffect(() => {
    if (!currentTrack || !("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: currentTrack.album || "SpotiFree",
      artwork: [
        { src: currentTrack.cover, sizes: "512x512", type: "image/jpeg" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => togglePlay());
    navigator.mediaSession.setActionHandler("pause", () => togglePlay());
    navigator.mediaSession.setActionHandler("previoustrack", () => prevTrack());
    navigator.mediaSession.setActionHandler("nexttrack", () => nextTrack());
  }, [currentTrack]);

  // --- Playback Controls ---
  const playTrack = (track, newQueue = null, index = 0) => {
    if (!track || !track.audioUrl) return;

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      setQueueIndex(index >= 0 ? index : 0);
    } else if (!queue.some((t) => t.id === track.id)) {
      setQueue((prev) => [track, ...prev]);
      setQueueIndex(0);
    }

    setCurrentTrack(track);
    setPlaybackError(null);

    // Record into history
    setHistory((prev) => [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 50));

    const audio = audioRef.current;
    if (audio.src !== track.audioUrl) {
      audio.src = track.audioUrl;
      audio.load();
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Autoplay blocked or stream error:", err);
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!currentTrack?.audioUrl) return;

    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn("Play failed", err);
      });
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === "all") {
          nextIndex = 0;
        } else {
          return; // reached end of queue
        }
      }
    }

    setQueueIndex(nextIndex);
    const nextT = queue[nextIndex];
    if (nextT) playTrack(nextT, queue, nextIndex);
  };

  const prevTrack = () => {
    const audio = audioRef.current;
    // If more than 3 seconds in, restart track
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    setQueueIndex(prevIndex);
    const prevT = queue[prevIndex];
    if (prevT) playTrack(prevT, queue, prevIndex);
  };

  const seek = (time) => {
    const audio = audioRef.current;
    if (audio && !isNaN(time)) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolumeLevel = (newVol) => {
    const val = Math.max(0, Math.min(1, newVol));
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  const cycleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  // --- Favorites / Liked Songs ---
  const isLiked = (trackId) => likedSongs.some((t) => String(t.id) === String(trackId));

  const toggleLike = (track) => {
    if (!track) return;
    setLikedSongs((prev) => {
      const exists = prev.some((t) => String(t.id) === String(track.id));
      if (exists) {
        return prev.filter((t) => String(t.id) !== String(track.id));
      } else {
        return [track, ...prev];
      }
    });
  };

  // --- Playlist Actions ---
  const createPlaylist = (title, description = "") => {
    const newPlaylist = {
      id: `custom-pl-${Date.now()}`,
      title: title || `My Playlist #${userPlaylists.length + 1}`,
      description: description || "Created on SpotiFree v2",
      cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
      color: "#1ed760",
      tracks: [],
    };
    setUserPlaylists((prev) => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const deletePlaylist = (playlistId) => {
    setUserPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (selectedPlaylist?.id === playlistId) {
      setCurrentView("library");
      setSelectedPlaylist(null);
    }
  };

  const addToPlaylist = (playlistId, track) => {
    if (!track) return;
    setUserPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          const alreadyIn = pl.tracks.some((t) => String(t.id) === String(track.id));
          if (!alreadyIn) {
            return { ...pl, tracks: [...pl.tracks, track] };
          }
        }
        return pl;
      })
    );
  };

  const removeFromPlaylist = (playlistId, trackId) => {
    setUserPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          return {
            ...pl,
            tracks: pl.tracks.filter((t) => String(t.id) !== String(trackId)),
          };
        }
        return pl;
      })
    );
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist((prev) => ({
        ...prev,
        tracks: prev.tracks.filter((t) => String(t.id) !== String(trackId)),
      }));
    }
  };

  // --- Queue Actions ---
  const addToQueue = (track) => {
    if (!track) return;
    setQueue((prev) => [...prev, track]);
  };

  const removeFromQueue = (index) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  };

  // Navigation helpers
  const navigateTo = (view, playlist = null) => {
    setCurrentView(view);
    if (playlist) setSelectedPlaylist(playlist);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        playbackError,
        queue,
        queueIndex,
        history,
        likedSongs,
        userPlaylists,
        currentView,
        selectedPlaylist,
        searchQuery,
        isQueueOpen,
        isLyricsOpen,
        isFullscreenOpen,
        playTrack,
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
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setCurrentView,
        setSelectedPlaylist,
        setSearchQuery,
        setIsQueueOpen,
        setIsLyricsOpen,
        setIsFullscreenOpen,
        navigateTo,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
