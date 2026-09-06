"use client";

import React from "react";
import { UserProfile } from "@/types/onboarding";

interface NavigationProps {
  activeTab: "sakha" | "gyan" | "shrine" | "myspace" | "home" | "chat" | "profile" | "onboarding" | "login" | "splash";
  onTabChange: (tab: any) => void;
  profile: UserProfile;
  onOpenVoice?: () => void;
  onOpenProfile?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  profile,
  onOpenVoice,
  onOpenProfile,
}) => {
  const isSakha = activeTab === "sakha" || activeTab === "chat";
  const isGyan = activeTab === "gyan";
  const isShrine = activeTab === "shrine";
  const isMySpace = activeTab === "myspace" || activeTab === "home" || activeTab === "profile";

  const goldColor = "#D9A441";
  const dimColor = "#9A9A9A";

  const navItems = [
    {
      id: "sakha",
      label: "Sakha",
      active: isSakha,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isSakha ? goldColor : dimColor}
          strokeWidth="1.8"
          className="transition-colors"
        >
          <path
            d="M12 3c-4 0-7 3.5-7 8v5l-2 2h18l-2-2v-5c0-4.5-3-8-7-8z"
            strokeLinejoin="round"
          />
          <path d="M9 19a3 3 0 006 0" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "gyan",
      label: "Gyan",
      active: isGyan,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isGyan ? goldColor : dimColor}
          strokeWidth="1.8"
          className="transition-colors"
        >
          <path d="M4 5h11a2 2 0 012 2v13H6a2 2 0 01-2-2V5z" />
          <path d="M17 5h3v15h-3" />
        </svg>
      ),
    },
    {
      id: "shrine",
      label: "Shrine",
      active: isShrine,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isShrine ? goldColor : dimColor}
          strokeWidth="1.8"
          className="transition-colors"
        >
          <path d="M12 2C8 6 6 9 6 13a6 6 0 0012 0c0-4-2-7-6-11z" />
          <path
            d="M12 18a2 2 0 100-4 2 2 0 000 4z"
            fill={isShrine ? goldColor : "none"}
          />
        </svg>
      ),
    },
    {
      id: "myspace",
      label: "My Space",
      active: isMySpace,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isMySpace ? goldColor : dimColor}
          strokeWidth="1.8"
          className="transition-colors"
        >
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
        </svg>
      ),
    },
  ];

  const userInitial = (profile.name?.trim() || "P").charAt(0).toUpperCase();

  return (
    <>
      {/* ── DESKTOP HEADER NAVIGATION (md: and above) ── */}
      <header className="hidden md:flex sticky top-0 inset-x-0 w-full z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[rgba(250,250,250,0.07)] px-6 lg:px-12 py-3.5 items-center justify-between select-none">
        {/* Brand */}
        <div
          onClick={() => onTabChange("myspace")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9A55C] to-[#E8722A] flex items-center justify-center shadow-[0_0_15px_rgba(201,165,92,0.3)] group-hover:scale-105 transition-transform">
            <span className="devanagari-font text-base text-[#0A0A0A] font-bold">
              ॐ
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif-fraunces text-base font-medium tracking-wide text-[#FAFAFA]">
              Spiritual Sakha
            </span>
            <span className="text-[10px] text-[rgba(250,250,250,0.4)] tracking-wider">
              Divine Guide & Sanctuary
            </span>
          </div>
        </div>

        {/* Center Pill Switcher */}
        <div className="flex items-center bg-[#141414] border border-[rgba(250,250,250,0.07)] rounded-full p-1 gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                item.active
                  ? "bg-[#C9A55C] text-[#0A0A0A] shadow-sm"
                  : "text-[rgba(250,250,250,0.5)] hover:text-[#FAFAFA] hover:bg-[#1C1C1C]"
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Voice CTA & Profile Avatar */}
        <div className="flex items-center gap-3">
          {onOpenVoice && (
            <button
              onClick={onOpenVoice}
              className="flex items-center gap-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#C9A55C]/40 text-[#C9A55C] hover:text-[#FAFAFA] px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-[#C9A55C] animate-pulse" />
              <span>Voice Sakha</span>
            </button>
          )}

          <button
            onClick={onOpenProfile || (() => onTabChange("profile"))}
            title={profile.name || "Devotee Profile"}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9A55C] to-[#E8722A] flex items-center justify-center text-[#0A0A0A] font-serif-fraunces font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity"
          >
            {userInitial}
          </button>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAVIGATION (< md) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 w-full h-[68px] pb-[env(safe-area-inset-bottom)] bg-[#151515]/98 backdrop-blur-md border-t border-[#252525] flex items-center justify-around px-2 z-40 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 gap-1 cursor-pointer bg-transparent border-none group transition-all"
          >
            <div className="relative flex items-center justify-center">
              {item.icon}
            </div>
            <span
              className={`text-[11px] tracking-wide transition-colors ${
                item.active
                  ? "text-[#D9A441] font-semibold"
                  : "text-[#9A9A9A] font-medium group-hover:text-[#F5F5F5]"
              }`}
            >
              {item.label}
            </span>
            {item.active && (
              <span className="w-1 h-1 rounded-full bg-[#D9A441] -mt-0.5" />
            )}
          </button>
        ))}
      </nav>
    </>
  );
};
