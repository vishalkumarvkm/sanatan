"use client";

import React from "react";
import { UserProfile, PanchangData, AstroBriefData, WisdomQuoteData } from "@/types/onboarding";

interface HomePageProps {
  profile: UserProfile;
  onNavigateToChat: (initialPrompt?: string) => void;
  onNavigateToShrine: () => void;
  onOpenVoice?: () => void;
}

const mockPanchang: PanchangData = {
  date: "2026-08-23",
  day: "Ravivaar (Sunday)",
  tithi: {
    name: "Shukla Chaturthi",
    deity: "Ganesha",
    endTime: "14:32 IST",
  },
  nakshatra: {
    name: "Uttara Phalguni",
    ruler: "Sun",
    endTime: "18:45 IST",
  },
  yoga: "Siddha",
  karana: "Baalav",
  rahuKaal: {
    start: "16:30",
    end: "18:00",
  },
  sunrise: "06:02",
  sunset: "18:34",
  moonrise: "09:15",
  festivals: ["Ganesh Chaturthi approaching in 3 days"],
  interpretation:
    "Chaturthi is auspicious for Ganesha worship and new beginnings. Focus on patience and completing pending work.",
};

const mockAstro: AstroBriefData = {
  rashi: "Karka",
  rashiName: "Cancer",
  rashiNameHi: "कर्क",
  rulingPlanet: "Moon",
  brief:
    "Today the Moon strengthens your intuition. Trust the quiet voice within when making decisions.",
  luckyColor: "Cream / White",
  luckyNumber: 2,
  advice: "Spend 5 minutes in reflection before your first meeting today.",
};

const mockQuote: WisdomQuoteData = {
  text: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
  source: "Bhagavad Gita 2.47",
  context:
    "Focus on doing your best work today and release attachment to external outcomes.",
};

/* Custom Illustrated Category SVGs matching stitch design */
const WorkCareerIconSVG = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12">
    <rect x="12" y="24" width="40" height="28" rx="6" fill="#F3E5D8" stroke="#7A3315" strokeWidth="2.5" />
    <path d="M24 24 V18 Q24 12 32 12 Q40 12 40 18 V24" fill="none" stroke="#7A3315" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="32" cy="38" r="7" fill="#E0A737" stroke="#7A3315" strokeWidth="2" />
    <path d="M32 31 V45 M25 38 H39" stroke="#7A3315" strokeWidth="2" />
  </svg>
);

const InnerPeaceIconSVG = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12">
    <path d="M32 16 Q38 28 32 40 Q26 28 32 16 Z" fill="#E89B93" stroke="#7A3315" strokeWidth="2" />
    <path d="M20 28 Q30 32 32 40 Q22 42 20 28 Z" fill="#F4C5C0" stroke="#7A3315" strokeWidth="2" />
    <path d="M44 28 Q34 32 32 40 Q42 42 44 28 Z" fill="#F4C5C0" stroke="#7A3315" strokeWidth="2" />
    <path d="M12 38 Q26 38 32 40 Q18 48 12 38 Z" fill="#E89B93" stroke="#7A3315" strokeWidth="2" />
    <path d="M52 38 Q38 38 32 40 Q46 48 52 38 Z" fill="#E89B93" stroke="#7A3315" strokeWidth="2" />
  </svg>
);

const RelationshipsIconSVG = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12">
    <path d="M32 18 Q28 10 20 16 Q14 22 32 36 Q50 22 44 16 Q36 10 32 18 Z" fill="#D65A48" stroke="#7A3315" strokeWidth="2" />
    <path d="M14 42 L26 32 L36 38 L50 28" fill="none" stroke="#7A3315" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LifeDecisionsIconSVG = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12">
    <line x1="32" y1="12" x2="32" y2="48" stroke="#7A3315" strokeWidth="3" strokeLinecap="round" />
    <line x1="16" y1="20" x2="48" y2="20" stroke="#7A3315" strokeWidth="3" strokeLinecap="round" />
    <path d="M16 20 L8 36 Q16 42 24 36 Z" fill="#EFCB86" stroke="#7A3315" strokeWidth="2" />
    <path d="M48 20 L40 36 Q48 42 56 36 Z" fill="#EFCB86" stroke="#7A3315" strokeWidth="2" />
  </svg>
);

const DailyDevotionIconSVG = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12">
    <path d="M22 42 Q32 54 42 42 Q36 44 32 44 Q28 44 22 42 Z" fill="#A84E29" stroke="#7A3315" strokeWidth="2" />
    <path d="M32 24 Q36 34 32 40 Q28 34 32 24 Z" fill="#FF7A00" stroke="#7A3315" strokeWidth="1.5" />
    <text x="32" y="20" textAnchor="middle" fill="#7A3315" fontSize="16" fontWeight="bold" fontFamily="serif">ॐ</text>
  </svg>
);

const HealthWellbeingIconSVG = () => (
  <svg viewBox="0 0 64 64" className="w-12 h-12">
    <circle cx="32" cy="18" r="6" fill="#F3E5D8" stroke="#7A3315" strokeWidth="2" />
    <path d="M18 42 C24 30 40 30 46 42" fill="none" stroke="#7A3315" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 26 Q18 20 22 28 Q18 36 14 26 Z" fill="#78A55A" stroke="#7A3315" strokeWidth="1.5" />
    <path d="M50 26 Q46 20 42 28 Q46 36 50 26 Z" fill="#78A55A" stroke="#7A3315" strokeWidth="1.5" />
  </svg>
);

export const HomePage: React.FC<HomePageProps> = ({
  profile,
  onNavigateToChat,
  onNavigateToShrine,
  onOpenVoice,
}) => {
  const greetingName = profile.name.trim() || "Friend";

  const concernCards = [
    { title: "Work & Career", SVG: WorkCareerIconSVG, prompt: "I'm feeling stressed about a work decision." },
    { title: "Inner Peace", SVG: InnerPeaceIconSVG, prompt: "How can I find calm and mental quiet right now?" },
    { title: "Relationships", SVG: RelationshipsIconSVG, prompt: "How should I approach a difficult conversation with family?" },
    { title: "Life Decisions", SVG: LifeDecisionsIconSVG, prompt: "What wisdom helps when facing major choices?" },
    { title: "Daily Devotion", SVG: DailyDevotionIconSVG, prompt: "Suggest a simple daily practice for my schedule." },
    { title: "Health & Wellbeing", SVG: HealthWellbeingIconSVG, prompt: "How can I balance physical effort and spiritual rest?" },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-3.25rem)] bg-[#FDFBF7] text-[#362A22] flex flex-col font-sans pb-16 no-scrollbar overflow-y-auto">
      
      {/* TOP HERO GRADIENT BANNER */}
      <div className="w-full bg-gradient-to-r from-[#1D2942] via-[#482537] to-[#B4392B] pt-8 sm:pt-12 pb-28 sm:pb-32 px-4 sm:px-8 lg:px-16 text-[#FFFDF9] relative shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left Text Content */}
          <div className="flex flex-col gap-2 max-w-xl">
            <h1 className="font-serif text-[32px] sm:text-[44px] font-normal leading-tight tracking-wide">
              Namaste, {greetingName}.
            </h1>
            <p className="text-[14px] sm:text-[16px] text-[#FBF3E6]/90 leading-relaxed font-sans">
              Sakha is here with you today under the grace of {profile.ishtDevta || "Shiva"}. What brings you to your quiet space right now?
            </p>
          </div>

          {/* Right Action Pill Buttons */}
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            {onOpenVoice && (
              <button
                type="button"
                onClick={onOpenVoice}
                className="bg-[#EFCB86]/20 hover:bg-[#EFCB86]/30 text-[#FFFDF9] border border-[#EFCB86]/60 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <svg className="w-4 h-4 text-[#EFCB86]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
                <span>Voice Sakha</span>
              </button>
            )}
            <button
              type="button"
              onClick={onNavigateToShrine}
              className="bg-[#EFCB86]/20 hover:bg-[#EFCB86]/30 text-[#FFFDF9] border border-[#EFCB86]/60 px-5 py-2.5 rounded-full text-[13px] font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>🏠 Open Shrine</span>
            </button>
          </div>

        </div>
      </div>

      {/* MAIN OVERLAPPING CONTENT CONTAINER */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 lg:px-16 -mt-20 sm:-mt-24 flex flex-col gap-10 z-20">
        
        {/* THREE OVERLAPPING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* PANCHANG CARD */}
          <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[24px] p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(54,42,34,0.1)] mb-3">
                <span className="text-[10.5px] font-extrabold uppercase text-[#B4392B] tracking-wider">
                  DAILY PANCHANG
                </span>
                <span className="text-[11.5px] font-medium text-[#6B5C4E]">
                  {mockPanchang.day}
                </span>
              </div>

              <div className="flex flex-col gap-2 text-[13px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5C4E] font-medium">Tithi:</span>
                  <span className="font-bold text-[#362A22]">{mockPanchang.tithi.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5C4E] font-medium">Nakshatra:</span>
                  <span className="font-bold text-[#362A22]">{mockPanchang.nakshatra.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5C4E] font-medium">Rahu Kaal:</span>
                  <span className="font-bold text-[#B4392B]">{mockPanchang.rahuKaal.start}–{mockPanchang.rahuKaal.end}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B5C4E] font-medium">Sunrise / Sunset:</span>
                  <span className="font-bold text-[#362A22]">{mockPanchang.sunrise} / {mockPanchang.sunset}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(54,42,34,0.08)] text-[11.5px] text-[#362A22] bg-[#FBF3E6] p-3.5 rounded-[16px] leading-relaxed">
              <span className="font-bold text-[#B4392B]">Sanatan Insight:</span> {mockPanchang.interpretation}
            </div>
          </div>

          {/* ASTRO GUIDANCE CARD */}
          <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[24px] p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(54,42,34,0.1)] mb-3">
                <span className="text-[10.5px] font-extrabold uppercase text-[#B4392B] tracking-wider">
                  ASTRO GUIDANCE ({mockAstro.rashiNameHi})
                </span>
                <span className="text-[11px] font-bold bg-[#EFCB86] text-[#362A22] px-3 py-0.5 rounded-full shadow-2xs">
                  {mockAstro.rashi}
                </span>
              </div>

              <p className="text-[13px] text-[#362A22] font-medium leading-relaxed mb-3">
                Today the Moon strengthens your intuition. Trust the quiet voice within when making decisions.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11.5px] mb-2">
                <div className="bg-[#F5EFE6] p-2.5 rounded-[12px]">
                  <span className="text-[#6B5C4E] block text-[9.5px] uppercase font-extrabold">LUCKY COLOR:</span>
                  <span className="font-bold text-[#362A22]">{mockAstro.luckyColor}</span>
                </div>
                <div className="bg-[#F5EFE6] p-2.5 rounded-[12px]">
                  <span className="text-[#6B5C4E] block text-[9.5px] uppercase font-extrabold">LUCKY NUMBER:</span>
                  <span className="font-bold text-[#362A22]">{mockAstro.luckyNumber}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(54,42,34,0.08)] text-[11.5px] text-[#362A22] font-medium bg-[#F5EFE6] p-3.5 rounded-[16px] leading-relaxed">
              <span className="font-bold text-[#362A22]">Advice:</span> {mockAstro.advice}
            </div>
          </div>

          {/* DAILY WISDOM CARD */}
          <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[24px] p-6 flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-[rgba(54,42,34,0.1)] mb-3">
                <span className="text-[10.5px] font-extrabold uppercase text-[#B4392B] tracking-wider">
                  DAILY WISDOM
                </span>
                <span className="text-[12px] font-serif font-bold text-[#B4392B]">
                  {mockQuote.source}
                </span>
              </div>

              <blockquote className="font-serif text-[14px] text-[#362A22] font-bold leading-relaxed mb-3 border-l-4 border-[#B4392B] pl-3 py-0.5">
                &ldquo;{mockQuote.text}&rdquo;
              </blockquote>

              <p className="text-[12px] text-[#6B5C4E] font-medium leading-relaxed">
                {mockQuote.context}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateToChat(`Explain the meaning of Bhagavad Gita verse: "${mockQuote.text}"`)}
              className="mt-4 text-[13px] font-bold text-[#B4392B] hover:underline transition-all self-start flex items-center gap-1 cursor-pointer"
            >
              <span>Reflect with Sakha →</span>
            </button>
          </div>

        </div>

        {/* EXPLORE CATEGORIES SECTION */}
        <div className="flex flex-col gap-4">
          <h2 className="font-serif text-[22px] sm:text-[26px] font-normal text-[#362A22]">
            What would you like to explore today?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {concernCards.map((c) => (
              <button
                key={c.title}
                type="button"
                onClick={() => onNavigateToChat(c.prompt)}
                className="bg-[#F5EFE6] hover:bg-[#FBF3E6] border border-[rgba(54,42,34,0.12)] rounded-[20px] p-5 flex flex-col items-center justify-center text-center gap-3 transition-all shadow-xs hover:shadow-md group cursor-pointer"
              >
                <div className="group-hover:scale-110 transition-transform">
                  <c.SVG />
                </div>
                <span className="text-[13px] font-bold text-[#362A22] leading-snug">{c.title}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* FLOATING CHATBOT ACTION BUTTON */}
      <button
        type="button"
        onClick={() => onNavigateToChat()}
        title="Chat with Sakha AI"
        className="fixed bottom-20 md:bottom-8 right-5 md:right-8 bg-[#B4392B] hover:bg-[#8E2C21] text-[#FFFDF9] p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 z-40 transition-all hover:scale-105 active:scale-95 cursor-pointer group border border-white/20"
      >
        <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span className="hidden sm:inline text-[13px] font-bold tracking-wide">Talk with Sakha</span>
      </button>

    </div>
  );
};
