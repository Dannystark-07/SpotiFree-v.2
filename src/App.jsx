import React, { useState } from "react";
import { AudioProvider, useAudio } from "./context/AudioContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Player from "./components/Player";
import QueueDrawer from "./components/QueueDrawer";
import LyricsView from "./components/LyricsView";
import FullscreenPlayer from "./components/FullscreenPlayer";
import PlaylistModal from "./components/PlaylistModal";
import CreditsModal from "./components/CreditsModal";

import HomeView from "./pages/HomeView";
import SearchView from "./pages/SearchView";
import LibraryView from "./pages/LibraryView";
import PlaylistView from "./pages/PlaylistView";
import ArtistView from "./pages/ArtistView";

function MainContent({ onCreatePlaylistOpen, onOpenCredits }) {
  const { currentView, selectedPlaylist, selectedArtist } = useAudio();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-black">
      {/* Top Navbar */}
      <Navbar onOpenCredits={onOpenCredits} />

      {/* Scrollable Page View */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-900/80 via-[#121212] to-[#121212] pb-10">
        {currentView === "home" && <HomeView />}
        {currentView === "search" && <SearchView />}
        {currentView === "library" && (
          <LibraryView onCreatePlaylistOpen={onCreatePlaylistOpen} />
        )}
        {currentView === "playlist" && (
          <PlaylistView playlist={selectedPlaylist} />
        )}
        {currentView === "liked" && <PlaylistView isLikedView={true} />}
        {currentView === "artist" && <ArtistView artist={selectedArtist} />}
      </main>
    </div>
  );
}

export default function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);

  return (
    <AudioProvider>
      <div className="h-screen w-screen flex flex-col bg-black text-white font-sans overflow-hidden">
        {/* Main Workspace: Sidebar + Center Content + Queue Drawer */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            onCreatePlaylistOpen={() => setIsCreateModalOpen(true)}
            onOpenCredits={() => setIsCreditsOpen(true)}
          />
          <MainContent
            onCreatePlaylistOpen={() => setIsCreateModalOpen(true)}
            onOpenCredits={() => setIsCreditsOpen(true)}
          />
          <QueueDrawer />
        </div>

        {/* Fixed Audio Player */}
        <Player />

        {/* Modals & Overlays */}
        <LyricsView />
        <FullscreenPlayer />
        <PlaylistModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        <CreditsModal
          isOpen={isCreditsOpen}
          onClose={() => setIsCreditsOpen(false)}
        />
      </div>
    </AudioProvider>
  );
}
