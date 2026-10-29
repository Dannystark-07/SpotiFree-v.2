# SpotiFree v2 🎧

> **Complete music streaming application — React, Vite, no login required.**
> Stream unlimited music, search millions of songs, build custom playlists, and enjoy ad-free playback directly in your browser.

[![Version](https://img.shields.io/badge/Version-v2.0.0-1ed760?style=flat-square&logo=spotify&logoColor=black)](https://github.com/Dannystark-07/SpotiFree-v.2)
[![Developer](https://img.shields.io/badge/Developer-DannyStark-white?style=flat-square&logo=github&logoColor=black)](https://github.com/Dannystark-07)
[![GitHub](https://img.shields.io/badge/GitHub-@Dannystark--07-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/Dannystark-07)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 👨‍💻 Developer & Credits

**SpotiFree v2** is created and maintained by **DannyStark**.

- **Lead Developer**: DannyStark
- **GitHub Profile**: [@Dannystark-07](https://github.com/Dannystark-07)
- **Official Repository**: [https://github.com/Dannystark-07/SpotiFree-v.2](https://github.com/Dannystark-07/SpotiFree-v.2)
- **Application Version**: `v2.0.0`
- **Release Status**: Stable Production Release

### Open Source & Protocol Attribution
- **Audius Open Music Protocol**: Decentralized audio network powering full-length streaming and real-time global charts without authentication or API key restrictions.
- **React 18 & Vite 6**: Reactive frontend framework and blazing fast bundler.
- **Tailwind CSS & Lucide Icons**: Precision dark-mode aesthetics and responsive iconography.

---

## ✨ Features

- **No Sign-In / No Login Required**: Start listening immediately with zero account creation or authentication friction.
- **100% Full-Length Songs**: Complete, unmetered audio playback with no 30-second preview limits via Audius decentralized streaming.
- **Artists & Music All Over the World**:
  - Global catalog spanning **North America, Latin America, Europe, Asia, Africa, and Oceania**.
  - Dedicated **Artist Profile View** for global stars (The Weeknd, Taylor Swift, Bad Bunny, BTS, Burna Boy, Coldplay, Arijit Singh, BLACKPINK, Rosalía, Fujii Kaze, Tyla, Tame Impala, and more) featuring bios, follower stats, and full-length discography.
  - **Regional Charts & Sounds**: Global Top 50, Viva Latino & Reggaeton, K-Pop & Asian Wave, Afrobeats & Amapiano Global, UK & European Anthems, and Americas Billboard Hits.
- **Continuous Audio Streaming Engine**: High-fidelity HTML5 Audio player with smooth playback, seeking, volume control, repeat (off / all / one), and shuffle.
- **Live Global Music Search**: Powered by open music streaming protocols to stream complete songs, official artwork, and metadata for millions of tracks.
- **Curated Playlists & Moods**: Pre-packaged high-energy workout playlists, Lo-Fi study beats, Synthwave night drive, and ambient focus sounds with direct streaming.
- **Your Personal Library (Persisted)**:
  - **Liked Songs**: Heart any track to save it to your collection.
  - **Custom Playlists**: Create, rename, customize, and add songs to custom playlists.
  - **Listening History**: Automatically track recently played songs.
  - All library data is automatically saved to browser `localStorage` without needing a database.
- **Developer & Credits Modal**: Built-in dialog acknowledging the creator DannyStark, project specifications, and open source foundations.
- **Progressive Web App (PWA) & Mobile Installable**: Install as a native standalone app on iOS, Android, macOS, or Windows with offline icon assets.
- **Web Share API**: One-click sharing to friends via native system sheet or clipboard link generation.
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
├── public/                 # Static assets, PWA manifest & icons
│   ├── icon.svg            # Spotify-style vector application icon
│   └── manifest.json       # PWA web manifest for mobile installation
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CreditsModal.jsx     # Developer & credits attribution dialog
│   │   ├── FullscreenPlayer.jsx # Immersive full-screen visualizer
│   │   ├── LyricsView.jsx       # Synchronized lyrics overlay
│   │   ├── Navbar.jsx           # Top search bar, share & credits trigger
│   │   ├── Player.jsx           # Fixed bottom playback controller
│   │   ├── PlaylistModal.jsx    # Create playlist modal
│   │   ├── QueueDrawer.jsx      # Slide-out queue drawer
│   │   ├── Sidebar.jsx          # Spotify-style left navigation & developer card
│   │   └── TrackRow.jsx         # Track row with play, like & menus
│   ├── context/
│   │   └── AudioContext.jsx     # Central audio state, queue, artists & storage
│   ├── data/
│   │   ├── globalMusic.js       # Worldwide artists, regional charts & discographies
│   │   └── mockTracks.js        # Curated catalog, genres, and playlists
│   ├── pages/
│   │   ├── ArtistView.jsx       # Dedicated artist profile view with discography
│   │   ├── HomeView.jsx         # Home discovery, greeting & quick picks
│   │   ├── LibraryView.jsx      # User playlists and history
│   │   ├── PlaylistView.jsx     # Detailed playlist & liked songs view
│   │   └── SearchView.jsx       # Instant search & genre categories
│   ├── services/
│   │   └── musicApi.js          # Audius open protocol full-length streaming API
│   ├── App.jsx                  # Main application container
│   ├── index.css                # Tailwind directives & custom animations
│   └── main.jsx                 # Entry point
├── vercel.json              # Zero-config SPA routing configuration for Vercel
├── index.html               # HTML5 document template & PWA meta tags
├── package.json             # Dependencies, author attribution, and scripts
├── tailwind.config.js       # Tailwind configuration with Spotify theme
└── vite.config.js           # Vite build configuration with relative assets
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
| **Credits & Info** | Credits button in sidebar or version badge in navbar |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — created with ❤️ by [DannyStark](https://github.com/Dannystark-07).
