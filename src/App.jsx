// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import AuroraCanvas from "./components/AuroraCanvas";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectDetail from "./components/ProjectDetail";
import { Play, Pause, SkipForward, SkipBack, Plus } from "lucide-react";
import { YOUTUBE_API_KEY } from "./config";

export default function App() {

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [activeSongIndex, setActiveSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isApiReady, setIsApiReady] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const playerRef = useRef(null);
  const tickRef = useRef(null);
  const hasEndedRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);
  const activePlaylistRef = useRef(null);
  const activeSongIndexRef = useRef(null);
  const playlistsRef = useRef(playlists);
  const playerContainerId = "yt-player-container";

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    playlistsRef.current = playlists;
  }, [playlists]);

  useEffect(() => {
    activePlaylistRef.current = activePlaylist;
  }, [activePlaylist]);

  useEffect(() => {
    activeSongIndexRef.current = activeSongIndex;
  }, [activeSongIndex]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("playlists");
      if (saved) setPlaylists(JSON.parse(saved));
    } catch {}
  }, []);

  // Simpan ke localStorage setiap update
  useEffect(() => {
    try {
      localStorage.setItem("playlists", JSON.stringify(playlists));
    } catch {}
  }, [playlists]);

  // Pastikan slider thumb tetap di depan & basic thumb size + improved visibility
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* slider track */
      input[type="range"] { -webkit-appearance: none; appearance: none; background: transparent; }
      input[type="range"]::-webkit-slider-runnable-track { height: 8px; border-radius: 8px; }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        position: relative;
        z-index: 4;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.95);
        background: rgba(255,255,255,0.95);
        box-shadow: 0 2px 6px rgba(0,0,0,0.45);
        margin-top: -4px;
      }
      input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.95);
        background: rgba(255,255,255,0.95);
        box-shadow: 0 2px 6px rgba(0,0,0,0.45);
      }
      /* make sure the thumb is clickable and visible above other elements */
      input[type="range"] { z-index: 2; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }
    const tag = document.createElement("script");
    tag.id = "youtube-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => setIsApiReady(true);
    return () => {
      try {
        delete window.onYouTubeIframeAPIReady;
      } catch {}
    };
  }, []);

  // Cari lagu
  const searchSongs = async () => {
    if (!searchQuery.trim()) return;
    // When searching, close expanded playlist (mutually exclusive)
    setExpandedPlaylist(null);
    setShowPlaylistMenu(null);

    try {
      const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          maxResults: 6,
          q: searchQuery,
          key: YOUTUBE_API_KEY,
          type: "video",
          videoCategoryId: "10",
        },
      });
      const songs = res.data.items.map((item) => ({
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        videoId: item.id.videoId,
        artwork: item.snippet.thumbnails.default.url,
      }));
      setSearchResults(songs);
    } catch (err) {
      console.error("Failed to find the song:", err);
      setSearchResults([]);
    }
  };

  // Load video YouTube
  const loadVideo = (video, index = null) => {
    if (!isApiReady) {
      setTimeout(() => loadVideo(video, index), 700);
      return;
    }
    if (!video) return;

    setCurrentVideo(video);
    if (index !== null) {
      setCurrentIndex(index);
      currentIndexRef.current = index;
    }
    hasEndedRef.current = false;

    const createPlayer = () => {
      playerRef.current = new window.YT.Player(playerContainerId, {
        height: "0",
        width: "0",
        videoId: video.videoId,
        playerVars: { autoplay: 1, controls: 0, modestbranding: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: (e) => {
            try { e.target.playVideo(); } catch {}
            setIsPlaying(true);
            const d = e.target.getDuration();
            if (d && !isNaN(d)) setDuration(Math.floor(d));
            startTick();
          },
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (playerRef.current && playerRef.current.loadVideoById) {
      try {
        playerRef.current.loadVideoById(video.videoId);
      } catch (err) {
        try { playerRef.current.destroy(); } catch {}
        createPlayer();
      }
    } else {
      let container = document.getElementById(playerContainerId);
      if (!container) {
        container = document.createElement("div");
        container.id = playerContainerId;
        container.style.width = "0";
        container.style.height = "0";
        container.style.overflow = "hidden";
        container.style.position = "absolute";
        container.style.left = "-9999px";
        document.body.appendChild(container);
      }
      createPlayer();
    }
  };

  // Event perubahan status player
  const onPlayerStateChange = (e) => {
    const st = e.data;
    if (st === window.YT.PlayerState.PLAYING) {
      hasEndedRef.current = false;
      setIsPlaying(true);
      const d = playerRef.current.getDuration();
      if (d && !isNaN(d)) setDuration(Math.floor(d));
      startTick();
    } else if (st === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      stopTick();
    } else if (st === window.YT.PlayerState.ENDED) {
        if (hasEndedRef.current) return;
        hasEndedRef.current = true;
        stopTick();
        setIsPlaying(false);
        setCurrentTime(0);
        if (playerRef.current && playerRef.current.stopVideo) playerRef.current.stopVideo();

        setTimeout(() => {
          const activePl = activePlaylistRef.current;
          const songIdx = activeSongIndexRef.current;
          const allPlaylists = playlistsRef.current;

          // 🔹 Jika sedang memutar dari playlist
          if (activePl) {
            const pl = allPlaylists.find((p) => p.name === activePl);
            if (pl && pl.songs.length > songIdx + 1) {
              const nextIdx = songIdx + 1;
              activeSongIndexRef.current = nextIdx;
              setActiveSongIndex(nextIdx);
              loadVideo(pl.songs[nextIdx], null);
              return;
            } else {
              // Sudah lagu terakhir → reset
              activePlaylistRef.current = null;
              activeSongIndexRef.current = null;
              setActivePlaylist(null);
              setActiveSongIndex(null);
            }
          }

            // 🔹 Jika sedang memutar hasil pencarian
            if (searchResults.length) {
              const nextIndex = currentIndexRef.current + 1;
              if (nextIndex < searchResults.length) {
                loadVideo(searchResults[nextIndex], nextIndex);
              }
            }
          }, 800);
        }

  };

  // Controls
  const togglePlayPause = () => {
    const p = playerRef.current;
    if (!p || !p.getPlayerState) return;
    const state = p.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      p.pauseVideo();
      setIsPlaying(false);
    } else {
      p.playVideo();
      setIsPlaying(true);
    }
  };
  const playNext = () => {
    if (currentIndex < searchResults.length - 1) loadVideo(searchResults[currentIndex + 1], currentIndex + 1);
  };
  const playPrev = () => {
    if (currentIndex > 0) loadVideo(searchResults[currentIndex - 1], currentIndex - 1);
  };

  // Tick (progress)
  const startTick = () => {
    stopTick();
    const tick = () => {
      if (playerRef.current?.getCurrentTime) {
        const t = playerRef.current.getCurrentTime();
        const d = playerRef.current.getDuration();
        if (d && !isNaN(d)) {
          setDuration(Math.floor(d));
          setCurrentTime(Math.min(Math.floor(t), Math.floor(d)));
        }
      }
      tickRef.current = requestAnimationFrame(tick);
    };
    tickRef.current = requestAnimationFrame(tick);
  };
  const stopTick = () => {
    if (tickRef.current) cancelAnimationFrame(tickRef.current);
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (!playerRef.current || !playerRef.current.seekTo) return;
    playerRef.current.seekTo(val, true);
    setCurrentTime(val);
  };

  // Playlist management
  const handleAddPlaylist = () => {
    setShowCreateModal(true);
    setNewPlaylistName("");
  };

  const confirmCreatePlaylist = () => {
    const name = newPlaylistName.trim();
    if (!name) return;

    setPlaylists((prev) => {
      if (prev.find((p) => p.name === name)) {
        setToastMessage(`Nama "${name}" already exists!`);
        setTimeout(() => setToastMessage(""), 2500);
        return prev;
      }
      const updated = [...prev, { name, songs: [] }];
      try { localStorage.setItem("playlists", JSON.stringify(updated)); } catch {}
      setToastMessage(`Playlist "${name}" created successfully!`);
      setTimeout(() => setToastMessage(""), 2500);
      return updated;
    });

    setShowCreateModal(false);
    setNewPlaylistName("");
  };

  const addSongToPlaylist = (playlistName, song) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.name === playlistName
          ? {
              ...p,
              songs: p.songs.find((s) => s.videoId === song.videoId) ? p.songs : [...p.songs, song],
            }
          : p
      )
    );
    // keep popup open (user wanted popup persistent until outside click)
    setSelectedSong(song);
    try { /* persist handled by useEffect */ } catch {}
    setToastMessage(`"${song.title}" added to "${playlistName}"`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const playSongFromPlaylist = (playlistName, songIndex) => {
    const pl = playlists.find((p) => p.name === playlistName);
    if (!pl) return;
    const song = pl.songs[songIndex];
    if (!song) return;

    setActivePlaylist(playlistName);
    setActiveSongIndex(songIndex);
    activePlaylistRef.current = playlistName;
    activeSongIndexRef.current = songIndex;

    loadVideo(song, null);
  };

  const deleteSongFromPlaylist = (playlistName, songIndex) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.name === playlistName ? { ...p, songs: p.songs.filter((_, i) => i !== songIndex) } : p
      )
    );
  };

  const deletePlaylist = (playlistName) => {
    setPlaylistToDelete(playlistName);
    setShowDeleteModal(true);
  };

  const confirmDeletePlaylist = () => {
    if (!playlistToDelete) return;
    setPlaylists((prev) => prev.filter((p) => p.name !== playlistToDelete));
    setToastMessage(`Playlist "${playlistToDelete}" deleted successfully.`);
    setTimeout(() => setToastMessage(""), 2500);
    setShowDeleteModal(false);
    setPlaylistToDelete(null);
  };


  const onDragStart = (e, playlistName, fromIndex) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ playlistName, fromIndex }));
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const onDrop = (e, playlistName, toIndex) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (!data || data.playlistName !== playlistName) return;
      const fromIndex = data.fromIndex;
      if (fromIndex === toIndex) return;
      setPlaylists((prev) =>
        prev.map((p) => {
          if (p.name !== playlistName) return p;
          const newSongs = [...p.songs];
          const [moved] = newSongs.splice(fromIndex, 1);
          newSongs.splice(toIndex, 0, moved);
          return { ...p, songs: newSongs };
        })
      );
    } catch (err) {
      console.warn("drop parse error", err);
    }
  };

  // Utility for opening popup anchored near click target
  const openPlaylistPopupNear = (e, song) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    // position the popup slightly above the button and center horizontally on button
    const top = rect.top + window.scrollY - 8; // slightly above
    const left = rect.left + window.scrollX + rect.width / 2; // center
    setSelectedSong(song);
    setShowPlaylistMenu({ top, left, anchorRect: rect });
    // when opening popup, also close expanded playlist/search depending on need
    setExpandedPlaylist(null);
  };

  // Close popup if clicked outside the mini player area or popup
  useEffect(() => {
    const onDocClick = (ev) => {
      // if popup open, close it
      if (!showPlaylistMenu) return;
      setShowPlaylistMenu(null);
      setSelectedSong(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [showPlaylistMenu]);

  useEffect(() => {
    return () => {
      stopTick();
      if (playerRef.current && playerRef.current.destroy) {
        try { playerRef.current.destroy(); } catch {}
      }
    };
  }, []);

  const getProgressPercent = () => {
    if (!duration || duration <= 0) return 0;
    const pct = (currentTime / duration) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  const sliderRef = useRef(null); // tambah ref ini
  const getAdjustedProgress = () => {
    const pct = getProgressPercent(); // 0–100
    if (!sliderRef.current) return pct;

    const trackWidth = sliderRef.current.offsetWidth;
    const thumbWidth = 16; // harus sama dengan CSS thumb width

    // Rumus persis sama dengan browser internal:
    // thumbCenter = (pct/100) * (trackWidth - thumbWidth) + thumbWidth/2
    // fillPct = thumbCenter / trackWidth * 100
    const thumbCenter = (pct / 100) * (trackWidth - thumbWidth) + thumbWidth / 2;
    return (thumbCenter / trackWidth) * 100;
  };


  // Helper for slider text (truncate)
  const sliderText = () => {
    if (!currentVideo) return "No songs played";
    const t = currentVideo.title || "";
    if (t.length > 36) return t.slice(0, 33) + "...";
    return t;
  };

  // When opening expanded playlist, close search results (mutually exclusive)
  useEffect(() => {
    if (expandedPlaylist) {
      setSearchResults([]);
    }
  }, [expandedPlaylist]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="relative min-h-screen overflow-x-hidden">
              <AuroraCanvas />
              <Navbar />
              <div className="relative z-10">
                <Hero />
                <About />
                <Projects />
                <Contact />
                <Footer />
              </div>

              {/* Player container - SELALU ada di DOM, jangan pindah */}
              <div
                id={playerContainerId}
                style={{ width: 0, height: 0, overflow: "hidden", position: "absolute", left: "-9999px" }}
              />

              {/* Mini bar saat minimize */}
              {isMinimized && (
                <div style={{
                  position: "fixed", bottom: 16, left: 16, zIndex: 9999,
                  background: "rgba(20,10,40,0.85)", backdropFilter: "blur(16px)",
                  borderRadius: 12, padding: "8px 12px",
                  display: "flex", alignItems: "center", gap: 10,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)", minWidth: 200, maxWidth: 280,
                }}>
                  {currentVideo?.artwork && (
                    <img src={currentVideo.artwork} alt={currentVideo.title} width={32} height={32} style={{ borderRadius: 6, flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {currentVideo?.title || "No song playing"}
                    </div>
                    {isPlaying && (
                      <div style={{ fontSize: 10, color: "rgba(180,100,255,0.9)", marginTop: 2 }}>▶ Playing</div>
                    )}
                  </div>
                  <button
                    onClick={() => setIsMinimized(false)}
                    style={{
                      background: "rgba(180,100,255,0.7)", border: "none", color: "white",
                      borderRadius: 8, width: 28, height: 28,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", fontSize: 14, flexShrink: 0,
                    }}
                  >▲</button>
                </div>
              )}

              {/* MINI PLAYER - pakai display:none saat minimize, bukan unmount */}
              <div
                style={{
                  position: "fixed",
                  top: "80px",
                  left: "20px",
                  zIndex: 50,
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(20px)",
                  borderRadius: "14px",
                  padding: "10px",
                  width: "280px",
                  boxShadow: "0 0 10px rgba(255,255,255,0.05)",
                  display: isMinimized ? "none" : "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Tombol minimize + add playlist */}
                <div
                  style={{
                    position: "absolute", right: -40, top: 0,
                    display: "flex", flexDirection: "column", gap: 8, alignItems: "center",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                    title="Minimize"
                    style={{
                      background: "rgba(180,100,255,0.75)", color: "white", border: "none",
                      padding: "6px", borderRadius: 8, cursor: "pointer",
                      width: 28, height: 28, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 14, boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
                    }}
                  >−</button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleAddPlaylist(); }}
                    title="Tambah playlist"
                    style={{
                      background: "rgba(180,100,255,0.75)", color: "white", border: "none",
                      padding: "6px", borderRadius: 8, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 28, height: 28, boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
                    }}
                  ><Plus size={14} /></button>
                </div>

                {/* Search */}
                <div style={{ width: "100%", marginBottom: "8px" }}>
                  <input
                    type="text"
                    placeholder="Find Songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchSongs()}
                    style={{
                      width: "100%", padding: "8px 10px", borderRadius: "8px",
                      border: "none", outline: "none", fontSize: "13px",
                      background: "rgba(255,255,255,0.08)", color: "white",
                    }}
                    onFocus={() => { setExpandedPlaylist(null); setShowPlaylistMenu(null); }}
                  />
                  <button
                    onClick={() => { searchSongs(); setExpandedPlaylist(null); }}
                    style={btn}
                  >Search</button>
                </div>

                {/* Daftar Playlist */}
                <div style={{
                  marginTop: "6px", width: "100%",
                  background: "rgba(255,255,255,0.03)", padding: "6px",
                  borderRadius: "8px", color: "white", fontSize: "12px",
                  maxHeight: "120px", overflowY: "auto",
                }}>
                  <strong>Playlist :</strong>
                  {playlists.length ? (
                    playlists.map((p, i) => (
                      <div
                        key={p.name + i}
                        onClick={() => setExpandedPlaylist(expandedPlaylist === p.name ? null : p.name)}
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          marginTop: 4, background: "rgba(255,255,255,0.05)",
                          padding: "4px 6px", borderRadius: "6px", cursor: "pointer",
                        }}
                      >
                        <div style={{ cursor: "pointer", userSelect: "none", minWidth: 0 }}>
                          🎵 {p.name} ({p.songs.length})
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {p.songs.length > 0 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); playSongFromPlaylist(p.name, 0); }}
                              style={{ ...smallMiniBtn, fontSize: "10px", cursor: "pointer" }}
                              title="Play first song"
                            >▶</button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); deletePlaylist(p.name); }}
                            title="Hapus playlist"
                            style={{ ...smallMiniBtn, background: "rgba(255,80,80,0.12)", fontSize: "12px", padding: "4px 6px" }}
                          >🗑️</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ marginTop: 6 }}>Belum ada playlist</div>
                  )}
                </div>

                {/* Expanded playlist */}
                {expandedPlaylist && (
                  <div style={{
                    marginTop: 8, width: "100%", background: "rgba(20,20,20,0.8)",
                    padding: 8, borderRadius: 8, color: "white", fontSize: 12,
                    maxHeight: 180, overflowY: "auto",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong>{expandedPlaylist}</strong>
                      <button onClick={() => setExpandedPlaylist(null)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>Close</button>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      {playlists.find((p) => p.name === expandedPlaylist)?.songs.map((s, idx) => (
                        <div
                          key={s.videoId + idx}
                          draggable
                          onDragStart={(e) => onDragStart(e, expandedPlaylist, idx)}
                          onDragOver={onDragOver}
                          onDrop={(e) => onDrop(e, expandedPlaylist, idx)}
                          style={{
                            display: "flex", gap: 8, alignItems: "center",
                            padding: "6px", background: "rgba(255,255,255,0.02)",
                            borderRadius: 6, marginBottom: 6,
                          }}
                        >
                          <img src={s.artwork} alt={s.title} width={36} height={36} style={{ borderRadius: 6 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{s.artist}</div>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => playSongFromPlaylist(expandedPlaylist, idx)} style={smallMiniBtn} title="Play">▶</button>
                            <button onClick={() => deleteSongFromPlaylist(expandedPlaylist, idx)} style={{ ...smallMiniBtn, background: "rgba(255,80,80,0.15)" }} title="Hapus">🗑️</button>
                            <div style={{ alignSelf: "center", fontSize: 12, opacity: 0.7 }}>↕</div>
                          </div>
                        </div>
                      )) ?? <div style={{ color: "white" }}>Playlist kosong</div>}
                    </div>
                  </div>
                )}

                {/* Hasil pencarian */}
                <div style={{ marginTop: 8, maxHeight: 120, overflowY: "auto", width: "100%" }}>
                  {searchResults.map((song, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: "rgba(255,255,255,0.05)", borderRadius: 6,
                        padding: 6, marginBottom: 6, position: "relative", width: "100%",
                      }}
                    >
                      <img src={song.artwork} alt={song.title} width={36} height={36} style={{ borderRadius: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{song.title}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{song.artist}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => loadVideo(song, idx)} style={smallMiniBtn} title="Play">▶</button>
                        <button onClick={(e) => openPlaylistPopupNear(e, song)} style={{ ...smallMiniBtn, cursor: "pointer" }} title="Tambah ke playlist">➕</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Popup pilih playlist */}
                {showPlaylistMenu && selectedSong && (
                  <div
                    style={{
                      position: "fixed",
                      top: showPlaylistMenu.top - 56,
                      left: Math.max(8, showPlaylistMenu.left - 110),
                      background: "rgba(20,20,20,0.95)", padding: "8px",
                      borderRadius: "8px", minWidth: 180, zIndex: 9999,
                      boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ fontSize: 13, color: "white", marginBottom: 6, textAlign: "center" }}>Tambahkan ke playlist:</div>
                    {playlists.length ? (
                      playlists.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => addSongToPlaylist(p.name, selectedSong)}
                          style={{
                            display: "block", width: "100%", marginTop: 6, padding: 6,
                            background: "rgba(180,100,255,0.2)", color: "white",
                            border: "none", borderRadius: 4, textAlign: "left", cursor: "pointer",
                          }}
                        >{p.name}</button>
                      ))
                    ) : (
                      <div style={{ color: "white", fontSize: 12, textAlign: "center" }}>Belum ada playlist</div>
                    )}
                    <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                      <button
                        onClick={() => { setShowPlaylistMenu(null); setSelectedSong(null); }}
                        style={{ flex: 1, padding: 6, borderRadius: 6, border: "none", cursor: "pointer", background: "#333", color: "white" }}
                      >Batal</button>
                    </div>
                  </div>
                )}

                {/* Slider */}
                <div style={{
                  position: "relative", width: "100%", marginTop: 8,
                  height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <input
                    ref={sliderRef}
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={Math.min(currentTime, duration || 100)}
                    onChange={handleSeek}
                    style={{
                      width: "100%", appearance: "none", height: "18px", borderRadius: "8px",
                      background: `linear-gradient(90deg, rgba(180,100,255,0.6) ${getAdjustedProgress()}%, rgba(255,255,255,0.12) ${getAdjustedProgress()}%)`,
                      outline: "none", cursor: duration ? "pointer" : "default", position: "relative",
                    }}
                  />
                  <span style={{
                    position: "absolute", color: "rgba(255,255,255,0.95)", fontSize: "11px",
                    maxWidth: "90%", overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap", textAlign: "center", userSelect: "none", pointerEvents: "none",
                  }}>
                    {sliderText()}
                  </span>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: 16 }}>
                  <button onClick={playPrev} style={iconBtn} title="Previous"><SkipBack size={18} /></button>
                  <button onClick={togglePlayPause} style={iconBtn}>{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
                  <button onClick={playNext} style={iconBtn} title="Next"><SkipForward size={18} /></button>
                </div>

                {/* Modal create playlist */}
                {showCreateModal && (
                  <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
                    onClick={() => setShowCreateModal(false)}
                  >
                    <div style={{ background: "rgba(25,25,25,0.95)", padding: 16, borderRadius: 10, color: "white", width: 260 }} onClick={(e) => e.stopPropagation()}>
                      <h4 style={{ marginBottom: 10 }}>Create New Playlist</h4>
                      <input
                        type="text" placeholder="Playlist name..." value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "none", outline: "none", marginBottom: "10px", background: "rgba(255,255,255,0.08)", color: "white" }}
                        onKeyDown={(e) => e.key === "Enter" && confirmCreatePlaylist()}
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button onClick={() => setShowCreateModal(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "white" }}>Cancel</button>
                        <button onClick={confirmCreatePlaylist} style={{ background: "rgba(180,100,255,0.8)", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "white" }}>Create</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal delete playlist */}
                {showDeleteModal && (
                  <div
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
                    onClick={() => setShowDeleteModal(false)}
                  >
                    <div style={{ background: "rgba(25,25,25,0.95)", padding: 16, borderRadius: 10, color: "white", width: 280 }} onClick={(e) => e.stopPropagation()}>
                      <h4 style={{ marginBottom: 10 }}>Delete Playlist</h4>
                      <p style={{ fontSize: 13, marginBottom: 14 }}>
                        Are you sure you want to delete playlist <strong>{playlistToDelete}</strong>? <br />This will remove all songs in it.
                      </p>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button onClick={() => { setShowDeleteModal(false); setPlaylistToDelete(null); }} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "white" }}>Cancel</button>
                        <button onClick={confirmDeletePlaylist} style={{ background: "rgba(255,80,80,0.8)", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", color: "white" }}>Delete</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Toast */}
                {toastMessage && (
                  <div style={{
                    position: "fixed", bottom: 24, right: 24, background: "rgba(20,20,20,0.85)",
                    color: "white", padding: "10px 14px", borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)", fontSize: 13, zIndex: 9999,
                  }}>
                    {toastMessage}
                  </div>
                )}
              </div>
            </div>
          }
        />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}

// Styles
const btn = {
  width: "100%",
  marginTop: "6px",
  padding: "6px",
  borderRadius: "6px",
  background: "rgba(180,100,255,0.3)",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
};
const smallMiniBtn = {
  background: "rgba(255,255,255,0.08)",
  border: "none",
  color: "white",
  padding: "6px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: 12,
};
const iconBtn = {
  background: "none",
  border: "none",
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
