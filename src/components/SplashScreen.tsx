"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ChevronRight, Bell, Compass, X } from "lucide-react";

interface SplashScreenProps {
  onEnter: () => void;
  onEnterExistingUser?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onEnter,
  onEnterExistingUser,
}) => {
  const [showTapBlessing, setShowTapBlessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleTapOm = () => {
    // Play bell sound if available
    try {
      const audio = new Audio("https://cdn.freesound.org/previews/530/530635_11861866-lq.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {}

    setShowTapBlessing(true);
    setTimeout(() => {
      setShowTapBlessing(false);
    }, 2500);
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center text-center bg-[#0A0A0A] overflow-hidden select-none p-6 font-sans">
      {/* Radial Golden Cosmic Gradient Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(201, 165, 92, 0.22) 0%, rgba(10, 10, 10, 1) 75%)",
        }}
      />

      {/* Floating Aura Sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/5 w-1.5 h-1.5 bg-[#C9A55C] rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#C9A55C] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#E8722A] rounded-full" />
      </div>

      {/* Top spacer */}
      <div className="w-full h-4 sm:h-8 shrink-0" />

      {/* Center Core Pulsing & Rotating Mandala Om Emblem */}
      <div className="relative z-10 flex flex-col items-center gap-3 my-auto max-w-sm">
        <div
          onClick={handleTapOm}
          className="relative w-40 h-40 flex items-center justify-center cursor-pointer group"
        >
          {/* Outer Sun / Mandala Rotating Ring */}
          <div className="absolute inset-0 rounded-full border border-[#C9A55C]/30 animate-[spin_20s_linear_infinite] flex items-center justify-center">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="absolute w-2 h-2 bg-[#C9A55C] rounded-full shadow-[0_0_8px_#C9A55C]"
                style={{
                  transform: `rotate(${deg}deg) translate(76px)`,
                }}
              />
            ))}
          </div>

          {/* Breathing Inner Om Container */}
          <div className="w-32 h-32 rounded-full bg-[#141414] border-2 border-[#C9A55C] flex flex-col items-center justify-center shadow-[0_0_35px_rgba(201,165,92,0.45)] group-hover:scale-105 transition-transform duration-300 overflow-hidden relative">
            <img src="/images/app_logo.png" alt="Om Logo" className="w-full h-full object-cover p-1 rounded-full" />
          </div>
        </div>

        <p className="text-[11px] text-[rgba(250,250,250,0.4)] mt-1 flex items-center gap-1">
          <span>Tap Om to awaken divine vibration</span>
          <Bell className="w-3 h-3 text-[#C9A55C] inline" />
        </p>

        {showTapBlessing && (
          <div className="bg-[#C9A55C]/20 border border-[#C9A55C]/50 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#C9A55C] animate-fadein flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A55C]" />
            <span>ॐ Shanti • Divine Energy Awakened</span>
          </div>
        )}

        <div className="mt-4 flex flex-col items-center gap-1.5">
          <h1 className="font-serif-fraunces text-3xl sm:text-4xl text-[#FAFAFA] font-bold tracking-tight">
            Spiritual Sakha
          </h1>
          <h2 className="text-xs sm:text-sm font-bold text-[#C9A55C] tracking-widest uppercase">
            Sanatan Dharma Wisdom & Sacred Companion
          </h2>
          <p className="text-xs sm:text-sm text-[rgba(250,250,250,0.6)] leading-relaxed max-w-xs mt-1">
            Walk the eternal path of peace, devotion, and divine self-discovery.
          </p>
        </div>
      </div>

      {/* Bottom Get Started Action Button */}
      <div className="relative z-20 pb-6 sm:pb-10 shrink-0 w-full max-w-xs">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C9A55C] to-[#A88238] text-[#0A0A0A] font-bold text-base tracking-wide uppercase transition-all shadow-[0_4px_25px_rgba(201,165,92,0.4)] hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Enter Divine Space</span>
          <ArrowRight className="w-5 h-5 text-[#0A0A0A]" />
        </button>
      </div>

      {/* Welcome Seeker User Type Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadein">
          <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 flex flex-col gap-4 shadow-[0_0_40px_rgba(201,165,92,0.25)] relative text-left">
            {/* Handle bar */}
            <div className="w-10 h-1 bg-[rgba(250,250,250,0.2)] rounded-full mx-auto sm:hidden" />

            <div className="flex justify-between items-start pt-1">
              <div>
                <h3 className="font-serif-fraunces text-2xl font-bold text-[#FAFAFA]">
                  Welcome Seeker 🙏
                </h3>
                <p className="text-xs text-[rgba(250,250,250,0.6)] mt-1">
                  Are you beginning a new spiritual journey or returning to your daily Sadhana?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[rgba(250,250,250,0.4)] hover:text-[#FAFAFA] font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {/* Option 1: New User Card */}
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onEnter();
                }}
                className="bg-gradient-to-r from-[#C9A55C] to-[#A88238] p-4 rounded-2xl text-[#0A0A0A] text-left cursor-pointer transition-all hover:scale-[1.01] active:scale-98 shadow-md flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-black/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-[#0A0A0A]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif-fraunces text-base font-bold">
                      New User
                    </span>
                    <span className="text-[11px] font-semibold text-[#0A0A0A]/80 leading-snug">
                      Start Onboarding & setup Isht Devta, Kundali chart & goals
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#0A0A0A]" />
              </button>

              {/* Option 2: Existing User Card */}
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  if (onEnterExistingUser) {
                    onEnterExistingUser();
                  } else {
                    onEnter();
                  }
                }}
                className="bg-black/40 border border-[rgba(250,250,250,0.15)] p-4 rounded-2xl text-[#FAFAFA] text-left cursor-pointer transition-all hover:bg-black/60 active:scale-98 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#C9A55C]/15 flex items-center justify-center shrink-0">
                    <Compass className="w-5 h-5 text-[#C9A55C]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif-fraunces text-base font-bold">
                      Existing User
                    </span>
                    <span className="text-[11px] text-[rgba(250,250,250,0.6)] leading-snug">
                      Enter sacred MySpace directly with your saved profile
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#C9A55C]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

