"use client";

import React from "react";
import { UserProfile } from "@/types/onboarding";
import { Compass, Sparkles, Flame, BookOpen, User, Mic } from "lucide-react";

interface NavigationProps {
  activeTab: "sakha" | "gyan" | "shrine" | "myspace" | "home" | "chat" | "profile" | "onboarding" | "login" | "splash" | "gita";
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
  const activeId = activeTab === "chat" ? "sakha" : activeTab === "home" ? "myspace" : activeTab;

  const navItems = [
    {
      id: "myspace",
      label: "MySpace",
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: "sakha",
      label: "Sakha AI",
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: "shrine",
      label: "Shrine",
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: "gyan",
      label: "Gyan",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-5 h-5" />,
    },
  ];

  const userInitial = (profile.name?.trim() || "S").charAt(0).toUpperCase();

  return (
    <>
      {/* ── TOP HEADER (Flutter CustomHeader Replica) ── */}
      <header className="sticky top-0 inset-x-0 w-full z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between select-none">
        {/* Om Emblem & Brand */}
        <div
          onClick={() => onTabChange("myspace")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#141414] border border-[#C9A55C]/50 flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden p-0.5 shadow-[0_0_10px_rgba(201,165,92,0.3)]">
            <img src="/images/app_logo.png" alt="App Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif-fraunces text-[#FAFAFA] text-base font-semibold tracking-wide">
              Spiritual Sakha
            </span>
            <span className="text-[#C9A55C] text-[9px] font-semibold tracking-[1.2px] uppercase">
              SANATAN DHARMA WISDOM
            </span>
          </div>
        </div>

        {/* Center Nav Pill Switcher (Desktop) */}
        <div className="hidden md:flex items-center bg-[#141414] border border-white/10 rounded-full p-1 gap-1">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#C9A55C]/15 text-[#C9A55C] font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions: Voice Assistant & Profile Avatar */}
        <div className="flex items-center gap-3">
          {onOpenVoice && (
            <button
              onClick={onOpenVoice}
              className="flex items-center gap-2 bg-[#141414] hover:bg-[#1E1E1E] border border-[#C9A55C]/40 text-[#C9A55C] px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all active:scale-95 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#C9A55C] animate-pulse" />
              <span className="hidden sm:inline">Voice Sakha</span>
              <span className="sm:hidden">Voice</span>
            </button>
          )}

          <button
            onClick={onOpenProfile || (() => onTabChange("profile"))}
            title={profile.name || "Devotee Profile"}
            className={`w-[36px] h-[36px] rounded-full bg-[#1E1E1E] flex items-center justify-center text-[#C9A55C] font-bold text-sm cursor-pointer transition-all ${
              activeId === "profile"
                ? "border-2 border-[#C9A55C]"
                : "border border-white/20 hover:border-white/40"
            }`}
          >
            {userInitial}
          </button>
        </div>
      </header>

      {/* ── BOTTOM NAVIGATION BAR (Flutter CustomBottomNavigationBar Replica) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 w-full h-[64px] bg-[#0D0D0D]/98 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-2 z-40 select-none pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
                isActive ? "bg-[#C9A55C]/12 text-[#C9A55C]" : "text-white/54 hover:text-white/80"
              }`}
            >
              <div className="flex items-center justify-center mb-0.5">
                {item.icon}
              </div>
              <span
                className={`text-[10px] tracking-wide transition-colors ${
                  isActive ? "font-semibold text-[#C9A55C]" : "font-normal text-white/54"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

