import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  BadgeCheck,
  Heart,
  UserCheck,
  UserPlus,
  Music,
  Globe2,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useAudio } from "../context/AudioContext";
import { GLOBAL_ARTISTS } from "../data/globalMusic";
import { searchTracks } from "../services/musicApi";
import TrackRow from "../components/TrackRow";

export default function ArtistView({ artist }) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    navigateTo,
  } = useAudio();

  const [isFollowing, setIsFollowing] = useState(false);
  const [liveTracks, setLiveTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);

  // If artist was passed as a string or incomplete object, find full record in GLOBAL_ARTISTS
  const artistProfile =
    typeof artist === "string"
      ? GLOBAL_ARTISTS.find(
          (a) => a.name.toLowerCase() === artist.toLowerCase()
        ) || {
          name: artist,
          country: "Global",
          flag: "🌍",
          monthlyListeners: "45,000,000",
          followers: "20M",
          genre: "Pop / Global",
          bio: `${artist} is a world-renowned music artist streamed by millions worldwide.`,
          image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
          banner: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
          topTracks: [],
        }
      : artist || GLOBAL_ARTISTS[0];

  // Fetch live full-length tracks for this artist from Audius
  useEffect(() => {
    let isMounted = true;
    async function loadArtistSongs() {
      setLoadingTracks(true);
      try {
        const found = await searchTracks(artistProfile.name, 15);
        if (isMounted) {
          if (found && found.length > 0) {
            setLiveTracks(found);
          } else {
            setLiveTracks(artistProfile.topTracks || []);
          }
        }
      } catch (e) {
        console.warn("Failed to load live artist tracks", e);
        if (isMounted) setLiveTracks(artistProfile.topTracks || []);
      } finally {
        if (isMounted) setLoadingTracks(false);
      }
    }

    loadArtistSongs();
    return () => {
      isMounted = false;
    };
  }, [artistProfile.name]);

  // Combine curated top tracks and live tracks
  const combinedTracks = [
    ...(artistProfile.topTracks || []),
    ...liveTracks.filter(
      (lt) => !(artistProfile.topTracks || []).some((ct) => ct.id === lt.id)
    ),
  ];

  const isCurrentArtistPlaying =
    isPlaying && combinedTracks.some((t) => t.id === currentTrack?.id);

  const handleMainPlay = () => {
    if (combinedTracks.length === 0) return;
    if (isCurrentArtistPlaying) {
      togglePlay();
    } else {
      playTrack(combinedTracks[0], combinedTracks, 0);
    }
  };

  // Similar artists from same region
  const similarArtists = GLOBAL_ARTISTS.filter(
    (a) => a.id !== artistProfile.id && a.region === artistProfile.region
  ).slice(0, 5);

  return (
    <div className="space-y-8 select-none pb-16">
      {/* Massive Artist Banner Header */}
      <div
        className="relative h-80 md:h-96 px-8 pb-8 flex flex-col justify-end overflow-hidden border-b border-white/5"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(18,18,18,0.95)), url(${artistProfile.banner || artistProfile.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
        }}
      >
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <BadgeCheck className="w-5 h-5 text-spotify-green fill-spotify-green" />
            <span className="text-white font-extrabold">Verified Global Artist</span>
            <span className="text-neutral-400">•</span>
            <span className="flex items-center gap-1 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full border border-white/10">
              <span>{artistProfile.flag}</span>
              <span>{artistProfile.country}</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-md">
            {artistProfile.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300 font-medium">
            <span className="text-white font-bold">
              {artistProfile.monthlyListeners} monthly listeners
            </span>
            <span>•</span>
            <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-xs text-neutral-200">
              {artistProfile.genre}
            </span>
            <span>•</span>
            <span className="text-xs text-neutral-400">
              {artistProfile.region}
            </span>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="px-8 flex items-center gap-6">
        <button
          onClick={handleMainPlay}
          disabled={combinedTracks.length === 0}
          className="w-14 h-14 rounded-full bg-spotify-green hover:bg-spotify-green-hover text-black flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          title={`Play ${artistProfile.name}`}
        >
          {isCurrentArtistPlaying ? (
            <Pause className="w-6 h-6 fill-black" />
          ) : (
            <Play className="w-6 h-6 fill-black ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setIsFollowing((prev) => !prev)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
            isFollowing
              ? "bg-transparent text-spotify-green border-spotify-green hover:border-red-400 hover:text-red-400"
              : "bg-transparent text-white border-white/30 hover:border-white hover:scale-105"
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Follow</span>
            </>
          )}
        </button>
      </div>

      {/* Popular Tracks Section */}
      <section className="px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Popular Songs
          </h2>
          <span className="text-xs text-neutral-400">
            Full-Length Audio Streams
          </span>
        </div>

        <div className="bg-neutral-900/40 rounded-xl p-2 border border-white/5 space-y-1">
          {combinedTracks.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              Loading songs for {artistProfile.name}...
            </div>
          ) : (
            combinedTracks.map((track, i) => (
              <TrackRow
                key={`${track.id}-${i}`}
                track={track}
                index={i}
                queueList={combinedTracks}
              />
            ))
          )}
        </div>
      </section>

      {/* About the Artist Card */}
      <section className="px-8 space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          About
        </h2>

        <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 p-8 max-w-4xl shadow-xl flex flex-col md:flex-row gap-6">
          <img
            src={artistProfile.image}
            alt={artistProfile.name}
            className="w-32 h-32 md:w-44 md:h-44 rounded-xl object-cover shrink-0 shadow-lg"
          />
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{artistProfile.flag}</span>
              <h3 className="text-2xl font-bold text-white">
                {artistProfile.name}
              </h3>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {artistProfile.bio}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-neutral-400 font-mono">
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">
                Followers: <strong className="text-white">{artistProfile.followers}</strong>
              </span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">
                Region: <strong className="text-white">{artistProfile.region}</strong>
              </span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg">
                Country: <strong className="text-white">{artistProfile.country}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Fans Also Like / Similar Global Artists */}
      {similarArtists.length > 0 && (
        <section className="px-8 space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Fans Also Like ({artistProfile.region})
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {similarArtists.map((sim) => (
              <div
                key={sim.id}
                onClick={() => navigateTo("artist", sim)}
                className="group p-4 bg-neutral-900/60 hover:bg-neutral-800/80 rounded-xl cursor-pointer transition-all border border-white/5 text-center flex flex-col items-center"
              >
                <div className="relative w-28 h-28 rounded-full overflow-hidden mb-3 shadow-md">
                  <img
                    src={sim.image}
                    alt={sim.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-bold text-sm text-white truncate max-w-full group-hover:text-spotify-green transition-colors">
                  {sim.name}
                </h4>
                <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                  <span>{sim.flag}</span>
                  <span>{sim.country}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
