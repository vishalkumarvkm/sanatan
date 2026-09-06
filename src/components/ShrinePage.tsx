"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/onboarding";
import { useAudioPlayer, formatTime } from "@/context/AudioPlayerContext";

interface ShrinePageProps {
  profile?: UserProfile;
}

/* 3D Golden Trishul Staff Artwork SVG (Scaled to 75-85px width, 115-125px height) */
const TridentArtworkSVG = () => (
  <svg
    viewBox="0 0 160 220"
    className="w-[76px] h-[118px] sm:w-[86px] sm:h-[126px] drop-shadow-[0_8px_20px_rgba(215,170,74,0.35)] shrink-0 transition-transform duration-300 select-none"
  >
    <defs>
      <linearGradient id="shrineGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2B2" />
        <stop offset="50%" stopColor="#D7AA4A" />
        <stop offset="100%" stopColor="#7A4E0B" />
      </linearGradient>
      <linearGradient id="shrineGoldGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFEAA5" />
        <stop offset="100%" stopColor="#C98B1B" />
      </linearGradient>
    </defs>
    <rect x="76" y="25" width="8" height="185" rx="4" fill="url(#shrineGoldGrad)" />
    <path d="M80 0 L88 35 L80 42 L72 35 Z" fill="url(#shrineGoldGrad)" />
    <path d="M80 0 L84 35 L80 38 L76 35 Z" fill="#FFF2B2" opacity="0.6" />
    <path d="M80 42 Q38 42 28 15 Q22 52 72 68 Z" fill="url(#shrineGoldGrad)" />
    <path d="M80 42 Q122 42 132 15 Q138 52 88 68 Z" fill="url(#shrineGoldGrad)" />
    <path d="M62 90 L98 90 L68 125 L92 125 Z" fill="url(#shrineGoldGlow)" stroke="#5A3604" strokeWidth="1.5" />
    <ellipse cx="80" cy="90" rx="18" ry="4" fill="#FFEAA5" />
    <ellipse cx="80" cy="125" rx="12" ry="3" fill="#7A4E0B" />
  </svg>
);

export const ShrinePage: React.FC<ShrinePageProps> = () => {
  const {
    currentTrackIndex,
    currentTrack,
    isPlaying,
    progress,
    currentTimeSec,
    durationSec,
    playlist,
    togglePlay,
    playTrack,
    nextTrack,
    prevTrack,
    seekTo,
    isLiked,
    toggleLike,
    isFullScreenPlayerOpen,
    setIsFullScreenPlayerOpen,
  } = useAudioPlayer();

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#090909] text-[#F5F5F5] flex flex-col relative select-none font-sans">
      {/* ═══════════════ MAIN SCROLLABLE CONTENT ═══════════════ */}
      {/* Critical P0 Bottom Inset: pb-48 on mobile, md:pb-28 on desktop */}
      <div className="flex-1 w-full max-w-2xl lg:max-w-6xl mx-auto flex flex-col lg:flex-row p-0 lg:p-6 gap-6 overflow-y-auto no-scrollbar scroll-smooth pb-48 md:pb-28">
        
        {/* Main Playlist Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Safe-Area Aware Top Clearance on Mobile */}
          <div className="pt-6 sm:pt-8 lg:pt-0" />

          {/* 1. PLAYLIST HERO CARD (Height ~195-205px, 3-Zone Layout) */}
          <div className="mx-[18px] sm:mx-6 lg:mx-0 shrink-0">
            <div className="w-full min-h-[195px] max-h-[210px] rounded-[20px] bg-[#151515] border border-[#292929] hover:border-[#D7AA4A]/30 p-5 flex items-center justify-between gap-3 shadow-xs relative overflow-hidden transition-colors">
              {/* Ambient Warm Golden Glow in Center-Right */}
              <div
                className="absolute right-12 top-0 bottom-0 w-48 pointer-events-none opacity-20"
                style={{
                  background:
                    "radial-gradient(circle at 60% 50%, rgba(215,170,74,0.3) 0%, transparent 70%)",
                }}
              />

              {/* Zone 1 (Left): Category, Hindi Title, English Title */}
              <div className="flex flex-col justify-center gap-1.5 z-10 max-w-[55%] sm:max-w-[58%]">
                <span className="text-[11.5px] font-semibold uppercase tracking-[0.8px] text-[#D7AA4A]">
                  DEVOTIONAL PLAYLIST · SANATAN DHARMA
                </span>
                <h2 className="devanagari-font font-serif-fraunces text-[20px] sm:text-[22px] font-normal leading-tight text-[#F5F5F5]">
                  भगवान शिव —
                </h2>
                <h1 className="font-serif-fraunces text-[23px] sm:text-[25px] font-semibold leading-tight text-[#F5F5F5]">
                  Sacred Chants
                </h1>
              </div>

              {/* Zone 2 (Center-Right): Shiva Trident Artwork */}
              <div className="flex items-center justify-center z-10 shrink-0">
                <TridentArtworkSVG />
              </div>

              {/* Zone 3 (Far Right): 52px Circular Gold Play Button */}
              <div className="flex items-center justify-center z-10 shrink-0">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-[52px] h-[52px] rounded-full bg-[#D7AA4A] hover:bg-[#C59938] text-[#0A0A0A] flex items-center justify-center shadow-[0_4px_16px_rgba(215,170,74,0.3)] transition-transform duration-150 active:scale-95 cursor-pointer shrink-0"
                  title={isPlaying ? "Pause Playlist" : "Play Playlist"}
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <polygon points="6 4 18 12 6 20 6 4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 2. TRACK LIST CONTAINER (Standardized 64px Rows for Every Track) */}
          <div className="mt-5 px-[18px] sm:px-6 lg:px-0">
            <div className="flex flex-col gap-2.5">
              {playlist.map((track, idx) => {
                const isSelected = currentTrackIndex === idx;
                const isThisPlaying = isSelected && isPlaying;

                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(idx)}
                    className={`h-[64px] rounded-[14px] px-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 active:scale-[0.99] border ${
                      isSelected
                        ? "bg-[#1C1C1C] border-[#D7AA4A]/35 shadow-xs"
                        : "bg-[#151515] border-[#292929] hover:bg-[#1C1C1C]/60 hover:border-[#383838]"
                    }`}
                  >
                    {/* Track Number / Equalizer (Width ~28px) */}
                    <div className="w-7 flex items-center justify-center shrink-0">
                      {isThisPlaying ? (
                        /* Animated Equalizer Bars */
                        <div className="flex items-end gap-0.5 h-3.5">
                          <span className="w-1 bg-[#D7AA4A] rounded-xs animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                          <span className="w-1 bg-[#D7AA4A] rounded-xs animate-[pulse_0.8s_ease-in-out_infinite] h-4" />
                          <span className="w-1 bg-[#D7AA4A] rounded-xs animate-[pulse_0.5s_ease-in-out_infinite] h-2.5" />
                        </div>
                      ) : isSelected ? (
                        <span className="text-xs text-[#D7AA4A] font-bold">▶</span>
                      ) : (
                        <span className="text-[13.5px] text-[#888888] font-normal">
                          {idx + 1}.
                        </span>
                      )}
                    </div>

                    {/* Track Info (Title + Subtitle Directly Underneath) */}
                    <div className="flex-1 flex flex-col min-w-0 pr-2">
                      <span
                        className={`text-[14.5px] font-semibold truncate leading-snug ${
                          isSelected ? "text-[#D7AA4A]" : "text-[#F5F5F5]"
                        }`}
                      >
                        {track.title}
                      </span>
                      <span className="text-[12.5px] text-[#888888] font-normal leading-[17px] truncate">
                        {track.deity}
                      </span>
                    </div>

                    {/* Track Duration (Fixed Width ~42px, Right-Aligned, Never Wraps) */}
                    <div className="w-[42px] text-right shrink-0">
                      <span className="text-[12.5px] text-[#888888] font-normal tabular-nums">
                        {track.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop-Only Sacred Altar Sidebar (visible on lg screens) */}
        <aside className="hidden lg:flex w-80 bg-[#151515] border border-[#292929] rounded-[20px] p-6 flex-col justify-between shrink-0 shadow-lg self-start sticky top-6">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D7AA4A]">
              SACRED SHRINE ALTAR
            </span>

            <div className="w-48 h-48 rounded-[24px] bg-[#1C1C1C] border border-[#292929] flex items-center justify-center shadow-md relative overflow-hidden my-2">
              <div className="scale-110">
                <TridentArtworkSVG />
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="font-serif-fraunces text-lg font-semibold text-[#F5F5F5]">
                {currentTrack.title}
              </h3>
              <span className="text-xs text-[#D7AA4A] font-medium mt-0.5">
                {currentTrack.deity} Devotional Stuti
              </span>
            </div>
          </div>

          <div className="bg-[#1C1C1C] border border-[#292929] p-4 rounded-[16px] text-xs text-[#A0A0A0] leading-relaxed font-serif mt-6">
            <span className="font-bold text-[#D7AA4A] block font-sans text-[10px] uppercase mb-1">
              Sanatan Wisdom
            </span>
            &ldquo;In the vibration of sacred sound, the restless mind dissolves into stillness.&rdquo;
          </div>
        </aside>
      </div>

      {/* ═══════════════ FIXED MINI PLAYER (Above Bottom Navigation on Mobile, Docked to Bottom on Desktop) ═══════════════ */}
      {/* Positioned at bottom-[68px] on mobile, md:bottom-0 on desktop */}
      <aside
        onClick={() => setIsFullScreenPlayerOpen(true)}
        className="fixed bottom-[68px] md:bottom-0 inset-x-0 w-full bg-[#151515] border-t border-[#292929] px-4 sm:px-6 h-[78px] flex flex-col justify-between z-30 shadow-2xl cursor-pointer hover:bg-[#181818] transition-colors"
      >
        <div className="max-w-6xl mx-auto w-full flex flex-col justify-between h-full">
          {/* Top Scrubber Progress Bar */}
          <div
            className="w-full pt-2 flex items-center gap-2.5 cursor-pointer group"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[10.5px] text-[#888888] font-medium tabular-nums min-w-[26px]">
              {formatTime(currentTimeSec)}
            </span>
            <div
              className="flex-1 h-1 bg-[#252525] group-hover:h-1.5 rounded-full overflow-hidden relative transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = (clickX / rect.width) * 100;
                seekTo(newPct);
              }}
            >
              <div
                className="h-full bg-[#D7AA4A] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10.5px] text-[#888888] font-medium tabular-nums min-w-[26px] text-right">
              {currentTrack.duration}
            </span>
          </div>

          {/* Bottom Row: Artwork + Track Details + Playback Controls */}
          <div className="flex items-center justify-between pb-2 gap-4">
            {/* Left: 40px Artwork Icon + Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-[10px] bg-[#1C1C1C] border border-[#292929] flex items-center justify-center text-lg shrink-0 shadow-xs">
                {currentTrack.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13.5px] font-semibold text-[#F5F5F5] truncate leading-tight">
                  {currentTrack.title}
                </span>
                <span className="text-[11.5px] text-[#888888] truncate mt-0.5">
                  {currentTrack.deity} Devotional Stuti
                </span>
              </div>
            </div>

            {/* Right Controls: Previous | Play/Pause | Next */}
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Track Button (44px touch target) */}
              <button
                type="button"
                onClick={prevTrack}
                className="w-11 h-11 flex items-center justify-center text-[#888888] hover:text-[#F5F5F5] transition-colors cursor-pointer"
                title="Previous Chant"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <polygon points="19 20 9 12 19 4 19 20" />
                  <rect x="4" y="4" width="2.5" height="16" rx="1" />
                </svg>
              </button>

              {/* Play/Pause Button (36px circular with dark icon) */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#EFEFEF] text-[#0A0A0A] flex items-center justify-center shadow-xs transition-transform duration-150 active:scale-95 cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <polygon points="6 4 18 12 6 20 6 4" />
                  </svg>
                )}
              </button>

              {/* Next Track Button (44px touch target) */}
              <button
                type="button"
                onClick={nextTrack}
                className="w-11 h-11 flex items-center justify-center text-[#888888] hover:text-[#F5F5F5] transition-colors cursor-pointer"
                title="Next Chant"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <rect x="16.5" y="4" width="2.5" height="16" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══════════════ FULL SCREEN PLAYER MODAL ═══════════════ */}
      {isFullScreenPlayerOpen && (
        <div className="fixed inset-0 z-50 bg-[#090909] flex flex-col justify-between px-6 py-8 animate-fadein select-none">
          {/* Top Bar: Down Chevron Dismiss & Title */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsFullScreenPlayerOpen(false)}
              className="w-10 h-10 rounded-full bg-[#151515] border border-[#292929] flex items-center justify-center text-lg text-[#888888] hover:text-[#F5F5F5] cursor-pointer"
              title="Collapse Player"
            >
              ⌄
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D7AA4A]">
                SACRED SHRINE PLAYER
              </span>
              <span className="text-xs text-[#888888]">Sanatan Devotional Chants</span>
            </div>
            <button
              type="button"
              onClick={toggleLike}
              className="w-10 h-10 rounded-full bg-[#151515] border border-[#292929] flex items-center justify-center text-base cursor-pointer"
              title="Favorite Chant"
            >
              {isLiked ? "❤️" : "♡"}
            </button>
          </div>

          {/* Center: Large Artwork & Glow */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-[28px] bg-[#151515] border border-[#292929] flex items-center justify-center relative shadow-2xl overflow-hidden"
              style={{
                boxShadow: "0 0 50px rgba(215,170,74,0.15)",
              }}
            >
              <div className="scale-125">
                <TridentArtworkSVG />
              </div>
            </div>

            {/* Track Info in Full Player */}
            <div className="mt-8 text-center max-w-xs">
              <h2 className="font-serif-fraunces text-2xl font-semibold text-[#F5F5F5] leading-snug">
                {currentTrack.title}
              </h2>
              <p className="text-[14px] text-[#D7AA4A] mt-1 font-medium">
                {currentTrack.deity} Devotional Stuti
              </p>
            </div>
          </div>

          {/* Bottom: Scrubber & Extended Controls */}
          <div className="max-w-md w-full mx-auto space-y-5">
            {/* Scrubber Line */}
            <div className="space-y-1.5">
              <div
                className="w-full h-2 bg-[#252525] rounded-full overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPct = (clickX / rect.width) * 100;
                  seekTo(newPct);
                }}
              >
                <div
                  className="h-full bg-[#D7AA4A] rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#888888] font-medium tabular-nums">
                <span>{formatTime(currentTimeSec)}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Full Controls: Shuffle | Previous | Play/Pause | Next | Repeat */}
            <div className="flex items-center justify-between px-4">
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                className={`w-10 h-10 flex items-center justify-center transition-colors cursor-pointer ${
                  isShuffle ? "text-[#D7AA4A]" : "text-[#888888] hover:text-[#F5F5F5]"
                }`}
                title="Shuffle"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
              </button>

              <button
                type="button"
                onClick={prevTrack}
                className="w-12 h-12 flex items-center justify-center text-[#F5F5F5] hover:text-[#D7AA4A] transition-colors cursor-pointer"
                title="Previous Track"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <polygon points="19 20 9 12 19 4 19 20" />
                  <rect x="4" y="4" width="2.5" height="16" rx="1" />
                </svg>
              </button>

              {/* 56px Circular Play/Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-[#D7AA4A] hover:bg-[#C59938] text-[#0A0A0A] flex items-center justify-center shadow-lg transition-transform duration-150 active:scale-95 cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <polygon points="6 4 18 12 6 20 6 4" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                className="w-12 h-12 flex items-center justify-center text-[#F5F5F5] hover:text-[#D7AA4A] transition-colors cursor-pointer"
                title="Next Track"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <rect x="16.5" y="4" width="2.5" height="16" rx="1" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`w-10 h-10 flex items-center justify-center transition-colors cursor-pointer ${
                  isRepeat ? "text-[#D7AA4A]" : "text-[#888888] hover:text-[#F5F5F5]"
                }`}
                title="Repeat"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
