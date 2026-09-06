"use client";

import React from "react";
import { useAudioPlayer, formatTime } from "@/context/AudioPlayerContext";

interface GlobalMiniPlayerProps {
  currentTab: string;
}

export const GlobalMiniPlayer: React.FC<GlobalMiniPlayerProps> = ({ currentTab }) => {
  const {
    currentTrack,
    isPlaying,
    progress,
    currentTimeSec,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setIsFullScreenPlayerOpen,
  } = useAudioPlayer();

  // On the Shrine tab, ShrinePage already provides the dedicated MiniPlayer.
  // On splash or onboarding, hide mini player.
  if (
    currentTab === "shrine" ||
    currentTab === "splash" ||
    currentTab === "onboarding" ||
    !isPlaying
  ) {
    return null;
  }

  return (
    <aside
      onClick={() => setIsFullScreenPlayerOpen(true)}
      className="fixed bottom-[68px] md:bottom-0 inset-x-0 w-full max-w-3xl mx-auto h-[74px] bg-[#151515]/95 backdrop-blur-md border-t border-[#292929] md:border-x md:rounded-t-[16px] px-4 flex flex-col justify-between z-30 shadow-2xl cursor-pointer hover:bg-[#181818] transition-all animate-fadein"
    >
      {/* Top Scrubber Progress Bar */}
      <div
        className="w-full pt-1.5 flex items-center gap-2 cursor-pointer group"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[9.5px] text-[#888888] font-medium tabular-nums min-w-[22px]">
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
        <span className="text-[9.5px] text-[#888888] font-medium tabular-nums min-w-[22px] text-right">
          {currentTrack.duration}
        </span>
      </div>

      {/* Bottom Row: Artwork + Track Details + Playback Controls */}
      <div className="flex items-center justify-between pb-1.5 gap-3">
        {/* Left: 36px Artwork Icon + Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-[8px] bg-[#1C1C1C] border border-[#292929] flex items-center justify-center text-base shrink-0 shadow-xs">
            {currentTrack.icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-[#F5F5F5] truncate leading-tight">
              {currentTrack.title}
            </span>
            <span className="text-[11px] text-[#888888] truncate">
              {currentTrack.deity} Devotional Stuti
            </span>
          </div>
        </div>

        {/* Right Controls: Previous | Play/Pause | Next */}
        <div
          className="flex items-center gap-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={prevTrack}
            className="w-10 h-10 flex items-center justify-center text-[#888888] hover:text-[#F5F5F5] transition-colors cursor-pointer"
            title="Previous Chant"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <polygon points="19 20 9 12 19 4 19 20" />
              <rect x="4" y="4" width="2.5" height="16" rx="1" />
            </svg>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-[#FFFFFF] hover:bg-[#EFEFEF] text-[#0A0A0A] flex items-center justify-center shadow-xs transition-transform duration-150 active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24">
                <polygon points="6 4 18 12 6 20 6 4" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            className="w-10 h-10 flex items-center justify-center text-[#888888] hover:text-[#F5F5F5] transition-colors cursor-pointer"
            title="Next Chant"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <polygon points="5 4 15 12 5 20 5 4" />
              <rect x="16.5" y="4" width="2.5" height="16" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
