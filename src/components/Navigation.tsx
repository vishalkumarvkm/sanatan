"use client";

import React from "react";
import { UserProfile } from "@/types/onboarding";

interface NavigationProps {
  activeTab: "home" | "chat" | "shrine" | "profile" | "onboarding" | "login";
  onTabChange: (tab: "home" | "chat" | "shrine" | "profile" | "onboarding" | "login") => void;
  profile: UserProfile;
  onOpenAuth: () => void;
  onLogout?: () => void;
  onOpenVoice?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  profile,
  onOpenAuth,
  onLogout,
  onOpenVoice,
}) => {
  if (activeTab === "onboarding" || activeTab === "login") return null;

  const isLoggedIn = Boolean(
    (profile.phone && profile.phone.trim().length > 0) ||
    profile.completedOnboarding ||
    (profile.name && profile.name.trim().length > 0) ||
    ["home", "chat", "shrine", "profile"].includes(activeTab)
  );

  const navItems = [
    { id: "home", label: "Home", shortLabel: "Home" },
    { id: "chat", label: "Sakha Chat", shortLabel: "Chat" },
    { id: "shrine", label: "Shrine", shortLabel: "Shrine" },
    { id: "profile", label: "Profile", shortLabel: "Profile" },
  ] as const;

  const renderNavIcon = (id: string) => {
    switch (id) {
      case "home":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        );
      case "chat":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        );
      case "shrine":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4"/>
            <path d="M12 6c-2.5 0-4.5 2-4.5 4.5 0 3 4.5 6.5 4.5 6.5s4.5-3.5 4.5-6.5C16.5 8 14.5 6 12 6z"/>
            <path d="M4 19h16"/>
            <path d="M6 19l1.5 3h9L18 19"/>
          </svg>
        );
      case "profile":
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* TOP HEADER BAR */}
      <header className="fixed top-0 left-0 right-0 h-13 bg-[#FBF3E6]/95 backdrop-blur-md border-b border-[rgba(54,42,34,0.1)] px-3 sm:px-6 lg:px-12 flex items-center justify-between z-40 shadow-2xs">
        
        {/* LEFT: BRAND LOGO */}
        <div 
          className="flex items-center gap-1.5 cursor-pointer flex-shrink-0" 
          onClick={() => onTabChange("home")}
        >
          <span className="devanagari-font text-lg text-[#B4392B] font-bold">ॐ</span>
          <span className="font-serif text-[15px] sm:text-[17px] font-bold text-[#362A22] tracking-wide">
            SpiritualSakha
          </span>
        </div>

        {/* CENTER: DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`text-[13.5px] transition-all font-serif py-1 relative ${
                activeTab === item.id
                  ? "text-[#B4392B] font-bold border-b-2 border-[#B4392B]"
                  : "text-[#6B5C4E] font-medium hover:text-[#362A22]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* RIGHT: CONTROLS & AUTH STATUS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {onOpenVoice && (
            <button
              type="button"
              onClick={onOpenVoice}
              title="Sakha Real-Time Voice Bot"
              className="p-1.5 rounded-full bg-[#B4392B]/10 hover:bg-[#B4392B]/20 text-[#B4392B] transition-all flex items-center gap-1 text-[11px] sm:text-[11.5px] font-bold px-2.5 sm:px-3 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <span className="inline sm:inline text-[11px]">Voice Sakha</span>
            </button>
          )}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout || onOpenAuth}
              className="bg-[#B4392B] hover:bg-[#8E2C21] text-[#FFFDF9] px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
              title="Logout from SpiritualSakha"
            >
              <span>Logout</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="bg-[#362A22] hover:bg-[#1C2140] text-[#FFFDF9] px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Sign In</span>
            </button>
          )}
        </div>

      </header>

      {/* THEMED MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#FBF3E6]/95 backdrop-blur-md border-t border-[rgba(54,42,34,0.12)] px-4 flex items-center justify-around z-40 shadow-lg">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-[#B4392B] font-bold scale-105"
                  : "text-[#8C7A6B] hover:text-[#362A22]"
              }`}
            >
              {renderNavIcon(item.id)}
              <span className="text-[10px] font-serif tracking-tight">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
