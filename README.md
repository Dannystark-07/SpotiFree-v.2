# SpotiFree v2 🎧

> **Complete music streaming application — React, Vite, no login required.**
> Stream unlimited music, search millions of songs, build custom playlists, and enjoy ad-free playback directly in your browser.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- **No Sign-In / No Login Required**: Start listening immediately with zero account creation or authentication friction.
- **Continuous Audio Streaming Engine**: High-fidelity HTML5 Audio player with smooth playback, seeking, volume control, repeat (off / all / one), and shuffle.
- **Live Global Music Search**: Powered by the public iTunes Search API to stream high-quality audio previews, official album art, and metadata for millions of tracks, artists, and albums.
- **Curated Playlists & Moods**: Pre-packaged high-energy workout playlists, Lo-Fi study beats, Synthwave night drive, and ambient focus sounds with direct streaming.
- **Your Personal Library (Persisted)**:
  - **Liked Songs**: Heart any track to save it to your collection.
  - **Custom Playlists**: Create, rename, customize, and add songs to custom playlists.
  - **Listening History**: Automatically track recently played songs.
  - All library data is automatically saved to browser `localStorage` without needing a database.
- **Slide-out Queue Drawer**: View upcoming tracks, reorder or remove queued songs, and manage playback on the fly.
- **Synchronized Lyrics Experience**: Interactive karaoke-style lyrics view with smooth auto-scrolling and line highlighting.
- **Immersive Full-Screen Player**: Ambient blurred background visualizer with animated waveforms and giant album art.
- **Responsive Spotify-Inspired UI**: Custom dark mode with Spotify Green accents, clean typography, responsive sidebar, and intuitive controls.
- **System Media Controls (MediaSession API)**: Control playback using keyboard media keys, lock screen widgets, or Bluetooth earphones.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dannystark-07/SpotiFree-v.2.git
   cd SpotiFree-v.2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Architecture

```
SpotiFree-v.2/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── FullscreenPlayer.jsx # Immersive full-screen visualizer
│   │   ├── LyricsView.jsx       # Synchronized lyrics overlay
│   │   ├── Navbar.jsx           # Top search bar and navigation
│   │   ├── Player.jsx           # Fixed bottom playback controller
│   │   ├── PlaylistModal.jsx    # Create playlist modal
│   │   ├── QueueDrawer.jsx      # Slide-out queue drawer
│   │   ├── Sidebar.jsx          # Spotify-style left navigation
│   │   └── TrackRow.jsx         # Track row with play, like & menus
│   ├── context/
│   │   └── AudioContext.jsx     # Central audio state, queue & storage
│   ├── data/
│   │   └── mockTracks.js        # Curated catalog, genres, and playlists
│   ├── pages/
│   │   ├── HomeView.jsx         # Home discovery, greeting & quick picks
│   │   ├── LibraryView.jsx      # User playlists and history
│   │   ├── PlaylistView.jsx     # Detailed playlist & liked songs view
│   │   └── SearchView.jsx       # Instant search & genre categories
│   ├── services/
│   │   └── musicApi.js          # Live iTunes search API integration
│   ├── App.jsx                  # Main application container
│   ├── index.css                # Tailwind directives & custom animations
│   └── main.jsx                 # Entry point
├── index.html               # HTML5 document template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration with Spotify theme
└── vite.config.js           # Vite build configuration
```

---

## ⌨️ Controls & Shortcuts

| Action | Control |
|---|---|
| **Play / Pause** | Spacebar / Media Play Key / Center Button |
| **Next Track** | Media Next Key / Skip Forward Button |
| **Previous Track** | Media Prev Key / Skip Back Button |
| **Seek Audio** | Scrub on the progress slider |
| **Adjust Volume** | Volume slider or Mute toggle button |
| **Toggle Lyrics** | Microphone icon in bottom bar |
| **Toggle Queue** | Queue icon in bottom bar |
| **Full Screen** | Maximize icon in bottom bar |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
