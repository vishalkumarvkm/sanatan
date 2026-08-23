"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile, BhajanTrack } from "@/types/onboarding";

interface ShrinePageProps {
  profile: UserProfile;
}

interface ShrineTrack extends BhajanTrack {
  icon: string;
  audioUrl: string;
}

const bhajanPlaylist: ShrineTrack[] = [
  { 
    id: "1", 
    title: "Shiva Tandav Stotram", 
    deity: "Shiva", 
    duration: "3:08", 
    icon: "🔱",
    audioUrl: "/Shiv%20Tandav%20Stotram%20Mp3%20Download.mp3" 
  },
  { 
    id: "2", 
    title: "Om Namah Shivaya", 
    deity: "Shiva", 
    duration: "4:22", 
    icon: "🪷",
    audioUrl: "/om_namo_bhagwate.mp3" 
  },
  { 
    id: "3", 
    title: "Mahamrityunjaya Mantra", 
    deity: "Shiva", 
    duration: "3:53", 
    icon: "🔱",
    audioUrl: "/Om%20Tryambakam%20Yajamahe%20Sugandhim%20Pushtivardhanam%20-%20Mantra.mp3" 
  },
  { 
    id: "4", 
    title: "Hanuman Chalisa", 
    deity: "Hanuman", 
    duration: "9:30", 
    icon: "🚩",
    audioUrl: "/Hanuman-Chalisa-Jai-Hanuman-Gyan-Gun-Sagar.mp3" 
  },
  { 
    id: "5", 
    title: "Ganesh Atharvashirsha", 
    deity: "Ganesha", 
    duration: "6:15", 
    icon: "🐘",
    audioUrl: "/c1cd4c4a29572d1cfa44ccc9c39a633ed22aafad.mp3" 
  },
  { 
    id: "6", 
    title: "Madhurashtakam", 
    deity: "Krishna", 
    duration: "4:50", 
    icon: "🪈",
    audioUrl: "/Madhurashtakam.mp3" 
  },
  { 
    id: "7", 
    title: "Shri Ramchandra Kripalu", 
    deity: "Ram", 
    duration: "6:24", 
    icon: "🏹",
    audioUrl: "/Shri%20Ramchandra%20Kripalu%20Bhajman.mp3" 
  },
  { 
    id: "8", 
    title: "Durga Chalisa & Aarti", 
    deity: "Devi", 
    duration: "8:15", 
    icon: "🌺",
    audioUrl: "/Durga-Chalisa.mp3" 
  },
];

const formatTime = (sec: number): string => {
  if (!sec || isNaN(sec)) return "0:00";
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

/* Compact 3D Golden Trishul Staff Artwork SVG */
const TrishulArtworkSVG = () => (
  <svg viewBox="0 0 160 220" className="w-20 h-32 sm:w-28 sm:h-40 drop-shadow-[0_8px_20px_rgba(239,203,130,0.45)]">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="50%" stopColor="#E0A737" />
        <stop offset="100%" stopColor="#8C5C0D" />
      </linearGradient>
      <linearGradient id="goldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFEAA5" />
        <stop offset="100%" stopColor="#C98B1B" />
      </linearGradient>
    </defs>
    <rect x="76" y="25" width="8" height="185" rx="4" fill="url(#goldGrad)" />
    <path d="M80 0 L88 35 L80 42 L72 35 Z" fill="url(#goldGrad)" />
    <path d="M80 0 L84 35 L80 38 L76 35 Z" fill="#FFF2B2" opacity="0.6" />
    <path d="M80 42 Q38 42 28 15 Q22 52 72 68 Z" fill="url(#goldGrad)" />
    <path d="M80 42 Q122 42 132 15 Q138 52 88 68 Z" fill="url(#goldGrad)" />
    <path d="M62 90 L98 90 L68 125 L92 125 Z" fill="url(#goldGlow)" stroke="#684105" strokeWidth="1.5" />
    <ellipse cx="80" cy="90" rx="18" ry="4" fill="#FFEAA5" />
    <ellipse cx="80" cy="125" rx="12" ry="3" fill="#8C5C0D" />
  </svg>
);

/* Compact 3D Glowing Oil Diya Lamp SVG */
const GlowingDiyaSVG = () => (
  <div className="relative flex flex-col items-center justify-center my-1">
    <div className="w-28 h-28 rounded-full bg-amber-500/25 blur-xl absolute top-1 animate-pulse" />
    <div className="w-20 h-20 rounded-full bg-yellow-300/30 blur-md absolute top-2" />
    
    <svg viewBox="0 0 160 140" className="w-32 h-28 sm:w-36 sm:h-32 drop-shadow-[0_8px_20px_rgba(255,180,50,0.55)] relative z-10">
      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FFF475" />
          <stop offset="65%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#D62800" />
        </radialGradient>
        <linearGradient id="diyaBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A84E29" />
          <stop offset="40%" stopColor="#7A3315" />
          <stop offset="100%" stopColor="#4A1A07" />
        </linearGradient>
        <linearGradient id="diyaRim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E0A737" />
          <stop offset="50%" stopColor="#FFF2B2" />
          <stop offset="100%" stopColor="#8C5C0D" />
        </linearGradient>
      </defs>

      <path
        d="M80 5 C88 30 102 45 92 68 C84 82 76 82 68 68 C58 45 72 30 80 5 Z"
        fill="url(#flameGrad)"
        className="animate-pulse"
      />
      <path
        d="M80 25 C84 40 92 50 86 64 C82 72 78 72 74 64 C68 50 76 40 80 25 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      <path
        d="M20 75 Q80 135 140 75 Q125 90 80 92 Q35 90 20 75 Z"
        fill="url(#diyaBody)"
        stroke="#4A1A07"
        strokeWidth="2"
      />
      <ellipse cx="80" cy="75" rx="60" ry="10" fill="url(#diyaRim)" />
      <ellipse cx="80" cy="75" rx="54" ry="7" fill="#4A1A07" />
      <ellipse cx="80" cy="76" rx="50" ry="5" fill="#8C5C0D" opacity="0.8" />
    </svg>
  </div>
);

export const ShrinePage: React.FC<ShrinePageProps> = ({ profile }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const currentTrack = bhajanPlaylist[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Playback prevented:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration || 1;
      setCurrentTimeSec(cur);
      setDurationSec(dur);
      setProgress((cur / dur) * 100);
    }
  };

  const handleAudioEnded = () => {
    nextTrack();
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % bhajanPlaylist.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + bhajanPlaylist.length) % bhajanPlaylist.length);
    setIsPlaying(true);
  };

  const handleScrub = (newProgress: number) => {
    setProgress(newProgress);
    if (audioRef.current && durationSec) {
      audioRef.current.currentTime = (newProgress / 100) * durationSec;
    }
  };

  const filteredPlaylist = bhajanPlaylist.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.deity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-[calc(100vh-3.25rem)] bg-[#EDE7DC] text-[#362A22] flex flex-col overflow-hidden font-sans relative">
      
      {/* Real HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      {/* 3 COLUMN COMPACT REDESIGN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden p-3.5 sm:p-5 lg:p-6 gap-4 pb-22 md:pb-20">
        
        {/* LEFT COLUMN: SACRED LIBRARY SIDEBAR (NON-SCROLLABLE) */}
        <aside className="w-56 lg:w-60 bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[20px] p-4 hidden lg:flex flex-col gap-3 overflow-hidden shadow-xs">
          <h2 className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#362A22]">
            SACRED LIBRARY
          </h2>

          {/* Search Box */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5EFE6] border border-[rgba(54,42,34,0.1)] rounded-full pl-8 pr-3 py-1.5 text-[12px] text-[#362A22] outline-none placeholder-[#8C7A6B]"
            />
            <svg className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8C7A6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          {/* Quick Category Links */}
          <div className="flex flex-col gap-2 pt-0.5 border-b border-[rgba(54,42,34,0.08)] pb-3 text-[12.5px] font-medium text-[#362A22]">
            <button type="button" className="flex items-center gap-2.5 hover:text-[#B4392B] transition-colors cursor-pointer">
              <span>🧘</span> Deities
            </button>
            <button type="button" className="flex items-center gap-2.5 hover:text-[#B4392B] transition-colors cursor-pointer">
              <span>📜</span> Stotras
            </button>
            <button type="button" className="flex items-center gap-2.5 hover:text-[#B4392B] transition-colors cursor-pointer">
              <span>🎵</span> Chants
            </button>
            <button type="button" className="flex items-center gap-2.5 hover:text-[#B4392B] transition-colors cursor-pointer">
              <span>🕉️</span> Mantras
            </button>
          </div>

          {/* PLAYLISTS */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B5C4E]">
              PLAYLISTS
            </h3>

            <div className="flex flex-col gap-1.5">
              {bhajanPlaylist.map((track, idx) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`p-1.5 rounded-[12px] text-left flex items-center gap-2.5 transition-all ${
                    currentTrackIndex === idx
                      ? "bg-[#FBF3E6] text-[#B4392B] font-bold shadow-2xs"
                      : "text-[#362A22] hover:bg-[#FBF3E6]/60 font-medium"
                  }`}
                >
                  <div className="w-8 h-8 rounded-[8px] bg-[#6E1210] flex items-center justify-center text-white text-sm flex-shrink-0 shadow-2xs">
                    {track.icon}
                  </div>
                  <span className="text-[12px] truncate">{track.title}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER COLUMN: HERO BANNER & TRACKLIST */}
        <main className="flex-1 bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[20px] p-4 sm:p-5 pb-10 overflow-y-auto no-scrollbar flex flex-col gap-3.5 shadow-xs">
          
          {/* Hero Banner with Compact Golden Trishul Staff Artwork */}
          <div className="bg-gradient-to-r from-[#4A0A09] via-[#6E1210] to-[#2B0403] rounded-[18px] p-4 sm:p-5 flex flex-row items-center justify-between min-h-[135px] sm:min-h-[150px] relative overflow-hidden shadow-md text-[#FFFDF9]">
            
            <div className="flex flex-col gap-1 z-10 max-w-md">
              <span className="text-[9.5px] uppercase font-extrabold text-[#EFCB86] tracking-wider">
                DEVOTIONAL PLAYLIST • SANATAN DHARMA
              </span>
              <h1 className="font-serif text-[20px] sm:text-[26px] font-bold leading-tight">
                भगवान शिव — Sacred Chants
              </h1>
            </div>

            {/* Centered 3D Golden Trishul & Play Button */}
            <div className="flex items-center gap-3 z-10 flex-shrink-0">
              <TrishulArtworkSVG />
              <button
                type="button"
                onClick={togglePlay}
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#FFFDF9] text-[#4A0A09] hover:scale-105 font-bold flex items-center justify-center shadow-lg transition-transform z-10 cursor-pointer active:scale-95 flex-shrink-0"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <polygon points="6 4 18 12 6 20 6 4" />
                  </svg>
                )}
              </button>
            </div>

          </div>

          {/* Tracklist Table */}
          <div className="flex flex-col gap-1 pb-4">
            {filteredPlaylist.map((track, idx) => {
              const isSelected = currentTrackIndex === idx;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`grid grid-cols-12 items-center px-3 py-2 rounded-[12px] text-[12px] sm:text-[12.5px] cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#FBF3E6] text-[#B4392B] font-bold"
                      : "hover:bg-[#FBF3E6]/50 text-[#362A22] font-medium"
                  }`}
                >
                  <span className="col-span-1 text-xs text-[#8C7A6B]">
                    {idx + 1}.
                  </span>
                  <div className="col-span-7 flex flex-col min-w-0 pr-2">
                    <span className="truncate">{track.title}</span>
                    <span className="text-[10.5px] text-[#8C7A6B] font-normal">{track.deity}</span>
                  </div>
                  <span className="col-span-2 text-[11.5px] text-[#8C7A6B]">
                    {track.deity}
                  </span>
                  <span className="col-span-2 text-right text-[11.5px] text-[#8C7A6B]">
                    {track.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </main>

        {/* RIGHT COLUMN: SACRED NOW PLAYING ALTAR (NON-SCROLLABLE) */}
        <aside className="w-72 lg:w-76 bg-[#200A0A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-5 hidden md:flex flex-col justify-between text-[#FFFDF9] shadow-lg overflow-hidden flex-shrink-0">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EFCB86] text-center">
              SACRED NOW PLAYING
            </span>

            <GlowingDiyaSVG />

            <div className="flex flex-col items-center text-center gap-0.5">
              <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-[#FFFDF9]">
                {currentTrack.title}
              </h3>
              <span className="text-[11.5px] text-[#EFCB86] font-medium">
                {currentTrack.deity} Devotional Stuti
              </span>
            </div>
          </div>

          <div className="bg-[#140505]/90 border border-[rgba(239,203,130,0.2)] p-3.5 rounded-[14px] text-[11.5px] text-[#FBF3E6]/90 leading-relaxed font-serif mt-3">
            <span className="font-bold text-[#EFCB86] block font-sans text-[10px] uppercase mb-0.5">Sanatan Wisdom:</span>
            &ldquo;The voice in the silence is under the grace of Shiva.&rdquo;
          </div>
        </aside>

      </div>

      {/* RESPONSIVE FIXED FLOATING PLAYER BAR */}
      <footer className="fixed bottom-14 md:bottom-0 left-0 right-0 h-14 md:h-16 bg-[#381F1A] border-t border-white/10 px-3 sm:px-6 flex items-center justify-between z-30 text-[#FFFDF9] shadow-2xl">
        
        {/* Left: Artwork + Track Title + Subtitle */}
        <div className="flex items-center gap-2 sm:gap-3 max-w-[45%] sm:max-w-[30%] min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] bg-[#6E1210] flex items-center justify-center text-sm sm:text-lg flex-shrink-0 shadow-xs">
            {currentTrack.icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11.5px] sm:text-[12.5px] font-bold text-[#FFFDF9] truncate">
              {currentTrack.id}. {currentTrack.title}
            </span>
            <span className="text-[9.5px] sm:text-[10.5px] text-[#FBF3E6]/70 truncate">
              {currentTrack.deity} Devotional Stuti
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsLiked(!isLiked)}
            className="hidden sm:block text-base text-[#FBF3E6]/70 hover:text-red-400 transition-colors ml-1 cursor-pointer"
          >
            {isLiked ? "❤️" : "♡"}
          </button>
        </div>

        {/* Center: SVG Playback Controls & Scrubber */}
        <div className="flex flex-col items-center gap-0.5 sm:gap-1 flex-1 max-w-[48%] sm:max-w-md px-1 sm:px-2">
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Shuffle Button SVG (Hidden on mobile) */}
            <button type="button" className="hidden sm:block p-1 text-[#FBF3E6]/70 hover:text-[#FFFDF9] transition-colors cursor-pointer" title="Shuffle">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
            </button>

            {/* Previous Track SVG */}
            <button type="button" onClick={prevTrack} className="p-1 text-[#FBF3E6]/80 hover:text-[#FFFDF9] transition-colors cursor-pointer" title="Previous Track">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <polygon points="19 20 9 12 19 4 19 20" />
                <rect x="4" y="4" width="2.5" height="16" rx="1" />
              </svg>
            </button>

            {/* Play/Pause Button SVG */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFDF9] text-[#381F1A] font-bold flex items-center justify-center hover:scale-105 transition-all shadow-md cursor-pointer active:scale-95 flex-shrink-0"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <polygon points="6 4 18 12 6 20 6 4" />
                </svg>
              )}
            </button>

            {/* Next Track SVG */}
            <button type="button" onClick={nextTrack} className="p-1 text-[#FBF3E6]/80 hover:text-[#FFFDF9] transition-colors cursor-pointer" title="Next Track">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <polygon points="5 4 15 12 5 20 5 4" />
                <rect x="16.5" y="4" width="2.5" height="16" rx="1" />
              </svg>
            </button>

            {/* Repeat Button SVG (Hidden on mobile) */}
            <button type="button" className="hidden sm:block p-1 text-[#FBF3E6]/70 hover:text-[#FFFDF9] transition-colors cursor-pointer" title="Repeat">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </button>
          </div>

          {/* Timeline Scrub Line */}
          <div className="flex items-center gap-1.5 w-full text-[9px] sm:text-[10px] text-[#FBF3E6]/70">
            <span>{formatTime(currentTimeSec)}</span>
            <div
              className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = (clickX / rect.width) * 100;
                handleScrub(newPct);
              }}
            >
              <div className="h-full bg-[#FFFDF9] rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Right: Branding & Volume Control */}
        <div className="hidden md:flex items-center justify-end gap-2.5 max-w-[25%]">
          <span className="devanagari-font text-xs text-[#EFCB86]">ॐ</span>
          <span className="font-serif text-[11.5px] font-bold text-[#FFFDF9]">SpiritualSakha</span>
          <svg className="w-3.5 h-3.5 text-[#FBF3E6]/70 fill-current ml-1" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-14 accent-[#FFFDF9] cursor-pointer h-1"
          />
        </div>

      </footer>

    </div>
  );
};
