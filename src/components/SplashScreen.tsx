"use client";

import React from "react";

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="relative w-full h-full min-h-[800px] flex flex-col items-center justify-center text-center bg-[#0A0A0A] overflow-hidden select-none">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 35%, rgba(201, 165, 92, 0.12) 0%, transparent 100%)",
        }}
      />

      {/* Core Emblem */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative w-36 h-36 flex items-center justify-center mb-3">
          <div
            className="absolute rounded-full border border-[rgba(201,165,92,0.35)] w-[140px] h-[140px]"
            style={{ animation: "breathe 3s ease-in-out infinite" }}
          />
          <div
            className="absolute rounded-full border border-[rgba(201,165,92,0.35)] w-[110px] h-[110px]"
            style={{ animation: "breathe 3s ease-in-out infinite 0.5s" }}
          />
          <div
            className="absolute rounded-full border border-[rgba(201,165,92,0.35)] w-[80px] h-[80px]"
            style={{ animation: "breathe 3s ease-in-out infinite 1s" }}
          />
          <span className="devanagari-font text-4xl text-[#C9A55C] relative z-20 select-none">
            ॐ
          </span>
        </div>

        <h1 className="font-serif-fraunces text-3xl md:text-4xl text-[#FAFAFA] tracking-tight font-normal">
          Spiritual Sakha
        </h1>
        <p className="text-sm font-normal text-[rgba(250,250,250,0.6)] tracking-wide">
          A spiritual guide to wellness
        </p>
        <div className="w-10 h-[1px] bg-[#C9A55C] mt-4 opacity-50" />
      </div>

      {/* Tap to enter button */}
      <button
        onClick={onEnter}
        className="absolute bottom-12 inset-x-0 mx-auto w-fit text-xs font-semibold text-[rgba(250,250,250,0.4)] hover:text-[#C9A55C] tracking-widest uppercase transition-colors py-2 px-4 cursor-pointer z-20 animate-pulse"
      >
        tap to begin
      </button>
    </div>
  );
};
