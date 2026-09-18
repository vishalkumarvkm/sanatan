"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/onboarding";
import { JapaMeditationModal } from "@/components/JapaMeditationModal";
import { PanchangFestivalModal } from "@/components/PanchangFestivalModal";
import { WisdomShareModal } from "@/components/WisdomShareModal";

interface HomePageProps {
  profile: UserProfile;
  onNavigateToChat: (initialPrompt?: string) => void;
  onNavigateToShrine: () => void;
  onOpenVoice?: () => void;
  onOpenProfile?: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
  onResetOnboarding?: () => void;
  onOpenGitaReader?: (chapter?: number) => void;
  initialSubTab?: "daily" | "profile";
}

export const HomePage: React.FC<HomePageProps> = ({
  profile,
  onNavigateToChat,
  onNavigateToShrine,
  onOpenGitaReader,
}) => {
  const [rituals, setRituals] = useState({
    meditation: true,
    diya: true,
    japa: false,
    gita: false,
    evening: false,
  });

  const [isWisdomLiked, setIsWisdomLiked] = useState(false);
  const [showCustomiseModal, setShowCustomiseModal] = useState(false);
  const [showJapaMeditationModal, setShowJapaMeditationModal] = useState(false);
  const [showPanchangModal, setShowPanchangModal] = useState(false);
  const [showWisdomShareModal, setShowWisdomShareModal] = useState(false);
  const [activeAudioToast, setActiveAudioToast] = useState<string | null>(null);

  const toggleRitual = (key: keyof typeof rituals) => {
    setRituals((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(rituals).filter(Boolean).length;
  const sadhanaPct = Math.round((completedCount / 5) * 100);
  const userName = profile.name ? profile.name.trim() : "vishal Kumar";

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col relative select-none font-sans pb-32 md:pb-12">
      <div className="flex-1 w-full max-w-lg md:max-w-4xl mx-auto flex flex-col pt-4 px-4 sm:px-6 gap-5">
        
        {/* Pills Sub-header Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-white/70">
            <span>📅</span>
            <span>TODAY • TUESDAY, 15 SEP</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/40 text-[#C9A55C] text-[11px] font-bold">
            <span>🔥</span>
            <span>5 Day Sadhana</span>
          </div>
        </div>

        {/* Namaste Greeting */}
        <div>
          <h1 className="font-serif-fraunces text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center flex-wrap gap-2 leading-tight">
            <span>Namaste, {userName}</span>
            <span className="inline-block shrink-0">🙏</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            May your day be filled with peace & clarity.
          </p>
        </div>

        {/* Today's Sadhana Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border border-[#C9A55C] flex items-center justify-center text-[#C9A55C] text-xs">
                ✓
              </div>
              <div>
                <h2 className="font-serif-fraunces text-base font-bold text-white">
                  Today&apos;s Sadhana
                </h2>
                <p className="text-[10px] text-white/40">
                  Mindful daily dedication to inner s...
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-serif-fraunces text-xl font-bold text-[#C9A55C]">
                {sadhanaPct}%
              </div>
              <div className="text-[10px] text-white/50">
                {completedCount} of 5 practices
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9A55C] rounded-full transition-all duration-300"
              style={{ width: `${sadhanaPct}%` }}
            />
          </div>

          {/* Rhythm Capsule */}
          <div className="bg-white/4 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span>🌱</span>
              <span className="text-[#C9A55C] font-semibold text-[11px] truncate">
                You&apos;re building a beautiful rhyt...
              </span>
            </div>
            <span className="text-white/60 text-[11px] font-medium shrink-0">
              +{completedCount * 10} Karma
            </span>
          </div>
        </div>

        {/* Vedic Panchang Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/6 rounded-lg text-[#C9A55C]">
                🌅
              </div>
              <div>
                <h3 className="font-serif-fraunces text-base font-bold text-white">
                  Vedic Panchang
                </h3>
                <p className="text-[10px] text-white/40">
                  New Delhi • Sunrise 06:08 AM
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#C9A55C] bg-[#C9A55C]/15 border border-[#C9A55C]/30 px-2.5 py-1 rounded-full">
              Bhadrapada
            </span>
          </div>

          {/* Tithi & Nakshatra */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-[#1C1C1C] border border-white/5 rounded-xl p-2.5">
              <span className="text-base">🌕</span>
              <div>
                <div className="text-xs font-bold text-white">Shukla Chaturthi</div>
                <div className="text-[9px] text-white/40">Tithi ends at 11:14 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#1C1C1C] border border-white/5 rounded-xl p-2.5">
              <span className="text-base">✨</span>
              <div>
                <div className="text-xs font-bold text-white">Swati Nakshatra</div>
                <div className="text-[9px] text-white/40">Until 04:32 PM</div>
              </div>
            </div>
          </div>

          {/* Abhijit Muhurat & Rahu Kaal */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/4 border border-white/6 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/70 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A55C]" />
                <span>Abhijit Muhurat</span>
              </div>
              <div className="font-serif-fraunces text-xs font-bold text-[#C9A55C]">
                11:50 AM – 12:40 PM
              </div>
              <div className="text-[9px] text-white/40 mt-0.5">Highly auspicious for ven...</div>
            </div>

            <div className="bg-white/4 border border-white/6 rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-white/70 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>Rahu Kaal</span>
              </div>
              <div className="font-serif-fraunces text-xs font-bold text-white/80">
                03:15 PM – 04:45 PM
              </div>
              <div className="text-[9px] text-white/40 mt-0.5">Avoid initiating new ta...</div>
            </div>
          </div>

          {/* Sun / Moon / Disha Shool */}
          <div className="bg-black/30 rounded-xl p-2.5 flex items-center justify-around text-[10px] text-white/60">
            <div className="flex items-center gap-1.5">
              <span>☀️</span>
              <div>Sun<br />06:08 • 18:25</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🌙</span>
              <div>Moon<br />09:12 • 20:44</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🧭</span>
              <div>Disha Shool<br />North</div>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setShowPanchangModal(true)}
              className="text-[11px] font-bold text-[#C9A55C] bg-white/4 hover:bg-white/8 border border-white/10 px-5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              View Full Panchang & Festival Calendar →
            </button>
          </div>
        </div>

        {/* Daily Sadhana Rituals List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-serif-fraunces text-lg font-bold text-white">
                Daily Sadhana Rituals
              </h3>
              <p className="text-[11px] text-white/40">
                Sacred habits anchor mindful living
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomiseModal(true)}
              className="text-[10px] font-bold text-[#C9A55C] tracking-wider uppercase cursor-pointer hover:underline"
            >
              CUSTOMISE
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Ritual 1 */}
            <div
              onClick={() => setShowJapaMeditationModal(true)}
              className="bg-[#141414] hover:bg-[#1C1C1C] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    rituals.meditation
                      ? "bg-[#C9A55C] text-[#0A0A0A]"
                      : "border border-white/20 text-transparent"
                  }`}
                >
                  ✓
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold ${rituals.meditation ? "line-through text-white/80" : "text-white"} truncate`}>
                    Morning Meditation & Pranayama
                  </div>
                  <div className="text-[10px] text-white/40 truncate">
                    🕒 10 mins • +10 Sadhana • Dhyana Player
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#0A0A0A] bg-[#C9A55C] px-3.5 py-1.5 rounded-xl shrink-0">
                Meditate
              </span>
            </div>

            {/* Ritual 2 */}
            <div
              onClick={onNavigateToShrine}
              className="bg-[#141414] hover:bg-[#1C1C1C] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-5 h-5 rounded-full bg-[#C9A55C] text-[#0A0A0A] flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold line-through text-white/80 truncate">
                    Light Sacred Diya & Puja
                  </div>
                  <div className="text-[10px] text-white/40 truncate">
                    ⛩️ Virtual Sanctum Shrine • Offering Mala & Jal
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-white/60 bg-white/8 px-3.5 py-1.5 rounded-xl shrink-0">
                Done
              </span>
            </div>

            {/* Ritual 3 */}
            <div
              onClick={() => setShowJapaMeditationModal(true)}
              className="bg-[#141414] hover:bg-[#1C1C1C] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    rituals.japa
                      ? "bg-[#C9A55C] text-[#0A0A0A]"
                      : "border border-white/20 text-transparent"
                  }`}
                >
                  ✓
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold ${rituals.japa ? "line-through text-white/80" : "text-white"} truncate`}>
                    Chant Isht Devta (108 Mala)
                  </div>
                  <div className="text-[10px] text-white/40 truncate">
                    💭 Interactive 108 Bead Japa Mala Counter 🔱
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#0A0A0A] bg-[#C9A55C] px-3.5 py-1.5 rounded-xl shrink-0">
                Start Japa
              </span>
            </div>

            {/* Ritual 4 */}
            <div
              onClick={() => {
                if (onOpenGitaReader) {
                  onOpenGitaReader(2);
                } else {
                  onNavigateToChat("Explain Gita Chapter 2 Verse 47");
                }
              }}
              className="bg-[#141414] hover:bg-[#1C1C1C] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold text-transparent">
                  ✓
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    Read Bhagavad Gita Verse
                  </div>
                  <div className="text-[10px] text-white/40 truncate">
                    📖 Verse 2.47 • Karma Yoga
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-white/80 bg-white/12 px-3.5 py-1.5 rounded-xl shrink-0">
                Read
              </span>
            </div>

            {/* Ritual 5 */}
            <div
              onClick={() => toggleRitual("evening")}
              className="bg-[#141414] hover:bg-[#1C1C1C] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold text-transparent">
                  ✓
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    Evening Reflection
                  </div>
                  <div className="text-[10px] text-white/40 truncate">
                    🌙 3 mins quiet contemplation
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-white/40 bg-white/5 px-3.5 py-1.5 rounded-xl shrink-0">
                Pending
              </span>
            </div>
          </div>
        </div>

        {/* Wisdom of the Day Card */}
        <div className="bg-[#141414] border border-[#C9A55C]/30 rounded-2xl p-5 shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#C9A55C] text-[10px] font-bold tracking-wider uppercase">
              <span>★</span>
              <span>WISDOM OF THE DAY</span>
            </div>
            <span className="text-white/40 text-[11px]">Bhagavad Gita 2.47</span>
          </div>

          <p className="devanagari-font text-lg text-[#C9A55C] font-bold leading-relaxed">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
          </p>

          <p className="font-serif-fraunces italic text-white/90 text-sm leading-relaxed">
            &ldquo;Whatever happened, happened for good. Whatever is happening, is happening for good. Whatever will happen, will also happen for good.&rdquo;
          </p>

          <p className="text-xs text-white/60 leading-relaxed">
            You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of results, nor be attached to inaction.
          </p>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setActiveAudioToast("Playing Gita 2.47 Recitation Audio...");
                setTimeout(() => setActiveAudioToast(null), 3000);
              }}
              className="flex items-center gap-1.5 bg-white/6 hover:bg-white/12 px-3 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer transition-colors"
            >
              <span>🔊</span>
              <span>Listen</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToChat("Provide commentary on Gita Chapter 2 Verse 47")}
              className="flex items-center gap-1.5 bg-white/6 hover:bg-white/12 px-3 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer transition-colors"
            >
              <span>📝</span>
              <span>Commentary</span>
            </button>
            <button
              type="button"
              onClick={() => setShowWisdomShareModal(true)}
              className="flex items-center gap-1.5 bg-[#C9A55C]/20 hover:bg-[#C9A55C]/30 border border-[#C9A55C]/40 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#C9A55C] cursor-pointer transition-colors"
            >
              <span>🖼️</span>
              <span>Share Wallpaper</span>
            </button>
            <button
              type="button"
              onClick={() => setIsWisdomLiked(!isWisdomLiked)}
              className={`p-2 hover:text-[#C9A55C] cursor-pointer text-sm transition-colors ${
                isWisdomLiked ? "text-[#C9A55C]" : "text-white/60"
              }`}
            >
              {isWisdomLiked ? "♥" : "♡"}
            </button>
          </div>

          {activeAudioToast && (
            <div className="bg-[#C9A55C]/20 border border-[#C9A55C]/40 text-[#C9A55C] text-xs font-bold p-2.5 rounded-xl animate-fadein text-center">
              {activeAudioToast}
            </div>
          )}

          {/* Ask Sakha AI doubt box */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 mt-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[#C9A55C] text-base shrink-0">✨</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  Have doubts about this verse?
                </div>
                <div className="text-[10px] text-white/40 truncate">
                  Ask how to apply Karma Yoga in life
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToChat("How do I apply Karma Yoga in my daily life according to Gita 2.47?")}
              className="bg-[#C9A55C] text-[#0A0A0A] font-bold text-xs px-3.5 py-1.5 rounded-xl shrink-0 hover:bg-[#B8944B] cursor-pointer"
            >
              Ask Sakha ▶
            </button>
          </div>
        </div>

        {/* Daily Jyotirlinga Darshan Card */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A55C]">🛕</span>
              <h3 className="font-serif-fraunces text-base font-bold text-white">
                Daily Jyotirlinga Darshan
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#C9A55C]">
              Live from Kashi
            </span>
          </div>

          <div className="relative h-44 w-full rounded-xl overflow-hidden border border-[#C9A55C]/30 p-4 flex flex-col justify-end bg-black">
            <img
              src="/images/kashi_darshan.png"
              alt="Shri Kashi Vishwanath"
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-end justify-between">
              <div>
                <h4 className="font-serif-fraunces text-lg font-bold text-white">
                  Shri Kashi Vishwanath
                </h4>
                <p className="text-xs text-[#C9A55C] font-semibold">
                  Mangala Aarti & Sacred Darshan
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToShrine}
                className="bg-[#C9A55C] text-[#0A0A0A] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs hover:bg-[#B8944B] cursor-pointer"
              >
                📹 Darshan
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Customise Sadhana Modal */}
      {showCustomiseModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadein">
          <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-2xl max-w-sm w-full p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-serif-fraunces text-lg font-bold text-white">
                Customise Sadhana Rituals
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomiseModal(false)}
                className="text-white/40 hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/60">
              Select which daily spiritual habits anchor your rhythm:
            </p>

            <div className="flex flex-col gap-2">
              {Object.entries(rituals).map(([key, val]) => (
                <label
                  key={key}
                  className="flex items-center justify-between bg-black/40 border border-white/10 p-3 rounded-xl cursor-pointer hover:bg-black/60"
                >
                  <span className="text-xs font-semibold text-white capitalize">
                    {key === "meditation"
                      ? "🧘 Morning Meditation & Pranayama"
                      : key === "diya"
                      ? "🪔 Light Sacred Diya & Puja"
                      : key === "japa"
                      ? "📿 Chant Isht Devta (108 Japa)"
                      : key === "gita"
                      ? "📖 Read Bhagavad Gita Verse"
                      : "🌙 Evening Reflection"}
                  </span>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={() => toggleRitual(key as any)}
                    className="accent-[#C9A55C] w-4 h-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowCustomiseModal(false)}
              className="bg-[#C9A55C] hover:bg-[#B8944B] text-[#0A0A0A] font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md mt-1"
            >
              Save Custom Rhythm
            </button>
          </div>
        </div>
      )}

      {/* Feature Modals */}
      {showJapaMeditationModal && (
        <JapaMeditationModal onClose={() => setShowJapaMeditationModal(false)} />
      )}

      {showPanchangModal && (
        <PanchangFestivalModal onClose={() => setShowPanchangModal(false)} />
      )}

      {showWisdomShareModal && (
        <WisdomShareModal onClose={() => setShowWisdomShareModal(false)} />
      )}
    </div>
  );
};
