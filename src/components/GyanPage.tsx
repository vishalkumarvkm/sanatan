"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types/onboarding";
import { JapaMeditationModal } from "@/components/JapaMeditationModal";
import { WisdomShareModal } from "@/components/WisdomShareModal";
import { InlineSakhaChatModal } from "@/components/InlineSakhaChatModal";
import { fetchGyanContent } from "@/lib/api";

interface GyanPageProps {
  profile?: UserProfile;
  onOpenGitaReader?: (chapter?: number) => void;
  onNavigateToChat?: (initialPrompt?: string) => void;
}

export const GyanPage: React.FC<GyanPageProps> = ({ profile, onOpenGitaReader, onNavigateToChat }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [japaCounter, setJapaCounter] = useState(54);
  const [searchQuery, setSearchQuery] = useState("");
  const [showJapaModal, setShowJapaModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);

  const [gyanData, setGyanData] = useState<any>(null);

  useEffect(() => {
    fetchGyanContent().then((res) => {
      if (res.success && res.data) {
        setGyanData(res.data);
      }
    }).catch((err) => {
      console.warn("[GyanPage] Backend fetch error:", err);
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col relative select-none font-sans pb-32 md:pb-12">
      <div className="flex-1 w-full max-w-lg md:max-w-4xl mx-auto flex flex-col pt-4 px-4 sm:px-6 gap-5">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#C9A55C]">✨</span>
            <span className="text-[10px] font-bold text-[#C9A55C] tracking-wider uppercase">
              KNOWLEDGE SANCTUARY
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-semibold text-white/50">
            <span>📖</span>
            <span>940+ Verses Available</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h1 className="font-serif-fraunces text-2xl sm:text-3xl font-bold text-white">
            Gyan & Sacred Verses
          </h1>
          <p className="text-xs text-white/54 mt-0.5 leading-relaxed">
            Timeless Vedic truths, chanting meters, and illuminated translations for mindful living.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-white/40">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scriptures, mantras, shlokas..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-white/40 outline-none"
          />
          <button type="button" className="text-white/40 hover:text-white text-sm">🎙️</button>
          <button type="button" className="text-white/40 hover:text-white text-sm">🎛️</button>
        </div>

        {/* Recent Tags */}
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="font-bold text-[10px] uppercase text-[#C9A55C]">RECENT:</span>
          {["#Karma", "#Peace of Mind", "#Shiva Stotram"].map((tag) => (
            <span
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="bg-white/5 hover:bg-white/10 border border-white/8 px-2.5 py-1 rounded-lg text-white/70 text-[11px] cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {["All (142)", "Gita Verses (700)", "Mantras & Suktams", "Chalisas"].map((filter) => {
            const isSelected = activeFilter === filter || (filter.startsWith("All") && activeFilter === "All");
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter.startsWith("All") ? "All" : filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#C9A55C] text-[#0A0A0A] shadow-md"
                    : "bg-[#141414] border border-white/10 text-white/70 hover:text-white"
                }`}
              >
                {isSelected ? `✓ ${filter}` : filter}
              </button>
            );
          })}
        </div>

        {/* Card 1: Bhagavad Gita Verse Card */}
        <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-wider">
              Karma Yoga • Lord Krishna
            </span>
            <span className="text-white/40 text-xs">📑</span>
          </div>

          <h2 className="font-serif-fraunces text-xl font-bold text-white">
            Bhagavad Gita — Chapter 2, Verse 47
          </h2>

          <p className="devanagari-font text-base font-bold text-[#C9A55C] leading-relaxed">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।<br />
            मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥
          </p>

          <p className="font-serif-fraunces italic text-xs text-white/80 leading-relaxed">
            &ldquo;You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of results, nor be attached to inaction.&rdquo;
          </p>

          <div className="flex items-center gap-2 text-[10px] text-white/50">
            <span className="bg-white/5 px-2.5 py-0.5 rounded-full">#Core Wisdom</span>
            <span className="bg-white/5 px-2.5 py-0.5 rounded-full">#Duty & Detachment</span>
            <span>⏱ 01:10 min</span>
          </div>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => onOpenGitaReader?.(2)}
              className="bg-[#C9A55C] text-[#0A0A0A] hover:bg-[#B8944B] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
            >
              <span>📖</span>
              <span>Read 18 Chapters</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenGitaReader?.(2)}
              className="bg-[#C9A55C]/15 border border-[#C9A55C]/40 text-[#C9A55C] hover:bg-[#C9A55C]/25 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>▶</span>
              <span>Listen Verse</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShareText("कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । - Bhagavad Gita 2.47");
                setShowShareModal(true);
              }}
              className="bg-white/8 hover:bg-white/12 text-white/80 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>🖼️</span>
              <span>Share Wallpaper</span>
            </button>
          </div>
        </div>

        {/* Card 2: Featured Moksha Suktam Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A55C]">🔱</span>
              <span className="text-[10px] font-bold text-[#C9A55C] tracking-wider uppercase">
                FEATURED MOKSHA SUKTAM
              </span>
            </div>
            <span className="text-[11px] text-white/40">Rig veda 7.59.12</span>
          </div>

          <h2 className="font-serif-fraunces text-xl font-bold text-white">
            Maha Mrityunjaya Mantra
          </h2>

          <div className="flex items-center gap-2 text-[11px] text-white/60">
            <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">Lord Shiva</span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">⏱ 01:32 Loop</span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">👥 32.4k Seekers</span>
          </div>

          <p className="devanagari-font text-lg font-bold text-[#C9A55C] leading-relaxed">
            ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।<br />
            उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥
          </p>

          <p className="font-serif-fraunces italic text-xs text-white/80 leading-relaxed">
            &ldquo;We worship the Three-Eyed Lord who nourishes all beings. May He liberate us from the bondage of mortality, as effortlessly as a ripe cucumber detaches from its vine.&rdquo;
          </p>

          {/* Rosary Counter Box */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div
              onClick={() => setShowJapaModal(true)}
              className="flex items-center gap-2.5 text-xs text-white/80 min-w-0 cursor-pointer hover:opacity-80"
            >
              <div className="w-7 h-7 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/40 text-[#C9A55C] flex items-center justify-center font-bold text-xs shrink-0">
                📿
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-[#FAFAFA] truncate">108x Japa Mala Mode</span>
                <span className="text-[10px] text-[#C9A55C] truncate">Tap to open interactive 108 bead wheel →</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
              <span className="font-serif-fraunces text-base font-bold text-[#C9A55C]">
                {japaCounter}/108
              </span>
              <button
                type="button"
                onClick={() => setJapaCounter((prev) => (prev >= 108 ? 0 : prev + 1))}
                className="bg-[#C9A55C]/20 hover:bg-[#C9A55C]/30 text-[#C9A55C] border border-[#C9A55C]/40 font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors active:scale-95"
              >
                +1 Tap
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setShowJapaModal(true)}
                className="bg-[#C9A55C] text-[#0A0A0A] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-[#B8944B] cursor-pointer transition-transform active:scale-95 shadow-md"
              >
                <span>▶</span>
                <span>Chant 108 Japa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setChatPrompt("Explain the spiritual meaning and benefits of Maha Mrityunjaya Mantra");
                  setShowChatModal(true);
                }}
                className="bg-white/10 text-white hover:bg-white/15 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors active:scale-95"
              >
                <span>💬</span>
                <span>Ask Meaning</span>
              </button>
            </div>
            <div className="flex items-center gap-3.5 text-xs text-white/50 ml-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShareText("ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥ - Maha Mrityunjaya Mantra");
                  setShowShareModal(true);
                }}
                className="flex items-center gap-1 hover:text-[#C9A55C] cursor-pointer"
              >
                <span>🖼️</span>
                <span>Share Card</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Hanuman Chalisa Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-wider">
              🛡️ GOSWAMI TULSIDAS • Awadhi
            </span>
            <span className="text-[#C9A55C] text-sm">▶</span>
          </div>

          <h2 className="font-serif-fraunces text-lg font-bold text-white">
            Hanuman Chalisa
          </h2>
          <div className="text-[10px] text-white/40">Playing • Verse 14 of 40 | 07:16</div>

          <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="text-[9px] font-bold text-[#C9A55C] uppercase tracking-wider flex justify-between items-center">
              <span>LYRICS DRAWER</span>
              <button
                type="button"
                onClick={() => {
                  setShareText("भूत पिशाच निकट नहिं आवै । महाबीर जब नाम सुनावै ॥ नासै रोग हरै सब पीरा । जपत निरंतर हनुमत बीरा ॥ - Hanuman Chalisa");
                  setShowShareModal(true);
                }}
                className="text-white/60 hover:text-[#C9A55C] cursor-pointer"
              >
                🖼️ Share Card
              </button>
            </div>
            <p className="devanagari-font text-sm text-white font-semibold leading-relaxed">
              भूत पिशाच निकट नहिं आवै । महाबीर जब नाम सुनावै ॥<br />
              नासै रोग हरै सब पीरा । जपत निरंतर हनुमत बीरा ॥
            </p>
          </div>
        </div>

        {/* Card 4: Gayatri Mantra Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-wider">
              ☀️ RIGVEDA 3.62.10 • Savitr / Gayatri
            </span>
            <span className="text-[10px] text-white/40">05:00</span>
          </div>

          <h2 className="font-serif-fraunces text-lg font-bold text-white">
            Gayatri Mantra
          </h2>

          <p className="devanagari-font text-base font-bold text-[#C9A55C] leading-relaxed">
            ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥
          </p>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-white/50">Pranava Chanting with Tanpura Resonance</span>
            <button
              type="button"
              onClick={() => setShowJapaModal(true)}
              className="text-[#C9A55C] font-bold cursor-pointer hover:underline"
            >
              Start 108 Chants →
            </button>
          </div>
        </div>

        {/* Quote Footer */}
        <div className="text-center py-6 border-t border-white/10 flex flex-col items-center gap-1">
          <div className="devanagari-font text-lg text-[#C9A55C] font-bold">
            विद्या ददाति विनयं
          </div>
          <div className="font-serif-fraunces italic text-xs text-white/50">
            &ldquo;Knowledge bestows humility, discipline, and enlightenment.&rdquo;
          </div>
        </div>

      </div>

      {showJapaModal && (
        <JapaMeditationModal onClose={() => setShowJapaModal(false)} />
      )}

      {showShareModal && (
        <WisdomShareModal
          onClose={() => setShowShareModal(false)}
          customText={shareText || undefined}
        />
      )}

      <InlineSakhaChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        initialPrompt={chatPrompt}
        profile={profile}
      />
    </div>
  );
};
