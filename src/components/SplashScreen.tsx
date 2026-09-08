"use client";

import React from "react";

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div
      onClick={onEnter}
      className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center text-center bg-[#0A0A0A] overflow-hidden select-none cursor-pointer p-6"
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, rgba(201, 165, 92, 0.15) 0%, transparent 100%)",
        }}
      />

      {/* Top spacer */}
      <div className="w-full h-4 sm:h-8 shrink-0" />

      {/* Center Core Emblem & Title */}
      <div className="relative z-10 flex flex-col items-center gap-3 my-auto">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center mb-2">
          <div
            className="absolute rounded-full border border-[rgba(201,165,92,0.35)] w-[125px] h-[125px] sm:w-[140px] sm:h-[140px]"
            style={{ animation: "breathe 3s ease-in-out infinite" }}
          />
          <div
            className="absolute rounded-full border border-[rgba(201,165,92,0.35)] w-[95px] h-[95px] sm:w-[110px] sm:h-[110px]"
            style={{ animation: "breathe 3s ease-in-out infinite 0.5s" }}
          />
          <div
            className="absolute rounded-full border border-[rgba(201,165,92,0.35)] w-[65px] h-[65px] sm:w-[80px] sm:h-[80px]"
            style={{ animation: "breathe 3s ease-in-out infinite 1s" }}
          />
          <span className="devanagari-font text-3xl sm:text-4xl text-[#C9A55C] relative z-20 select-none">
            ॐ
          </span>
        </div>

        <h1 className="font-serif-fraunces text-2xl sm:text-4xl text-[#FAFAFA] tracking-tight font-normal">
          Spiritual Sakha
        </h1>
        <p className="text-xs sm:text-sm font-normal text-[rgba(250,250,250,0.6)] tracking-wide">
          A spiritual guide to wellness
        </p>
        <div className="w-10 h-[1px] bg-[#C9A55C] mt-2 opacity-50" />
      </div>

      {/* Bottom Action Area (Always visible, zero scroll needed) */}
      <div className="relative z-20 pb-6 sm:pb-10 shrink-0 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEnter();
          }}
          className="px-8 py-3.5 rounded-full bg-[#C9A55C] hover:bg-[#A8904D] text-[#0A0A0A] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_24px_rgba(201,165,92,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          Tap to Begin →
        </button>
        <span className="text-[10px] text-[rgba(250,250,250,0.35)] tracking-widest uppercase mt-1">
          Touch anywhere to continue
        </span>
      </div>
    </div>
  );
};
