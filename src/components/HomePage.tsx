"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/onboarding";

interface HomePageProps {
  profile: UserProfile;
  onNavigateToChat: (initialPrompt?: string) => void;
  onNavigateToShrine: () => void;
  onOpenVoice?: () => void;
  onOpenProfile?: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
  onResetOnboarding?: () => void;
  initialSubTab?: "daily" | "profile";
}

export const HomePage: React.FC<HomePageProps> = ({
  profile,
  onNavigateToChat,
  onUpdateProfile,
  onResetOnboarding,
  initialSubTab = "daily",
}) => {
  const [subTab, setSubTab] = useState<"daily" | "profile">(initialSubTab);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isWisdomModalOpen, setIsWisdomModalOpen] = useState(false);

  const userName = profile.name ? profile.name.trim() : "Vishal";
  const userInitial = userName.charAt(0).toUpperCase() || "V";
  const userRashi = profile.rashi || "Karka (Cancer)";
  const ishtDevta = profile.ishtDevta || "Shiva";

  const discussionTopics = [
    "Managing anxiety during exams",
    "Finding purpose in early career",
    "Coping with family conflict",
    "Building a daily spiritual routine",
    "Dealing with loss and grief",
  ];

  const handleSaveProfile = () => {
    if (onUpdateProfile) {
      onUpdateProfile(formData);
    }
    setEditing(false);
  };

  return (
    <div className="w-full min-h-screen text-[#F5F5F5] flex flex-col relative select-none">
      {/* ═══════════════ MAIN VERTICAL SCROLL CONTAINER ═══════════════ */}
      <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col overflow-y-auto no-scrollbar scroll-smooth pb-32 sm:pb-36 md:pb-16">
        {/* 1. Profile Header Area (Safe-Area Aware) */}
        <header className="pt-6 sm:pt-8 px-[18px] sm:px-6 shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* 56 × 56px Warm Saffron/Orange Avatar */}
            <div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D9A441] to-[#E8722A] flex items-center justify-center text-[#0A0A0A] font-serif-fraunces font-bold text-2xl shrink-0 shadow-[0_2px_16px_rgba(217,164,65,0.22)] border border-white/10"
              title={`Devotee ${userName}`}
            >
              <span className="leading-none select-none">{userInitial}</span>
            </div>

            {/* Profile Greeting, Devotee Badge, and Prominent Name */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[13.5px] text-[#9A9A9A] font-medium leading-none">
                  Namaste
                </span>
                <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/35 text-[#D9A441] font-medium tracking-wide">
                  Devotee of {ishtDevta}
                </span>
              </div>
              <h1 className="font-serif-fraunces text-[28px] sm:text-[30px] font-semibold text-[#F5F5F5] mt-1 leading-tight truncate">
                {userName}
              </h1>
            </div>
          </div>
        </header>

        {/* 2. Profile Sub-Tabs: Height 50px, Radius 25px, 4px Padding */}
        <div className="mt-5 px-[18px] sm:px-6 shrink-0 max-w-md">
          <div className="h-[50px] w-full bg-[#151515] border border-[#252525] rounded-[25px] p-1 flex items-center shadow-xs">
            <button
              type="button"
              onClick={() => {
                setSubTab("daily");
                setEditing(false);
              }}
              className={`flex-1 h-full rounded-full text-[13px] sm:text-[14px] font-medium transition-all duration-150 flex items-center justify-center cursor-pointer ${
                subTab === "daily"
                  ? "bg-[#D9A441] text-[#0A0A0A] font-semibold shadow-xs"
                  : "text-[#9A9A9A] hover:text-[#F5F5F5] hover:bg-[#1C1C1C]"
              }`}
            >
              Daily Reflection
            </button>
            <button
              type="button"
              onClick={() => setSubTab("profile")}
              className={`flex-1 h-full rounded-full text-[13px] sm:text-[14px] font-medium transition-all duration-150 flex items-center justify-center cursor-pointer ${
                subTab === "profile"
                  ? "bg-[#D9A441] text-[#0A0A0A] font-semibold shadow-xs"
                  : "text-[#9A9A9A] hover:text-[#F5F5F5] hover:bg-[#1C1C1C]"
              }`}
            >
              Spiritual Profile
            </button>
          </div>
        </div>

        {/* 3. Subtle Content Divider (24px Top & Bottom Spacing) */}
        <div className="mt-6 px-[18px] sm:px-6 shrink-0">
          <div className="w-full border-t border-[#252525]/60" />
        </div>

        {/* ═══════════════ TAB 1: DAILY REFLECTION ═══════════════ */}
        {subTab === "daily" && (
          <div className="mt-6 px-[18px] sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-start animate-fadein">
            {/* Left 7 Columns on Desktop: Hero Cards */}
            <div className="md:col-span-7 flex flex-col gap-5">
              {/* 1. Daily Wisdom Hero Card */}
              <article
                onClick={() => setIsWisdomModalOpen(true)}
                className="w-full rounded-[18px] bg-[#151515] border border-[#252525] border-l-[3.5px] border-l-[#D9A441] p-6 cursor-pointer transition-all duration-150 active:scale-[0.98] hover:border-[#D9A441]/40 shadow-xs group relative overflow-hidden"
              >
                <blockquote className="font-serif-fraunces text-[17px] sm:text-[18px] italic font-semibold leading-[26px] text-[#F5F5F5] mb-4">
                  &quot;You have the right to work, but never to the fruit of work.&quot;
                </blockquote>

                {/* Responsive Metadata Row: Left & Right with safe mobile wrapping */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[12.5px] pt-1">
                  <span className="font-semibold text-[#D9A441]">
                    Bhagavad Gita 2.47 — Daily Wisdom
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#888888] sm:text-right">
                    KARMA YOGA
                  </span>
                </div>
              </article>

              {/* 2. Today's Astro Guidance Card */}
              <article className="w-full rounded-[18px] bg-[#151515] border border-[#252525] hover:border-[#D9A441]/40 p-[22px] relative overflow-hidden shadow-xs transition-colors duration-200">
                {/* Intentional, Soft Upper-Right Radial Gold Glow */}
                <div
                  className="absolute -right-8 -top-8 w-44 h-44 rounded-full pointer-events-none opacity-70"
                  style={{
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(217,164,65,0.14) 0%, rgba(217,164,65,0.04) 50%, transparent 75%)",
                  }}
                />

                {/* Category */}
                <div className="text-[12px] font-semibold tracking-[0.5px] uppercase text-[#D9A441] mb-2">
                  TODAY&apos;S ASTRO GUIDANCE
                </div>

                {/* Zodiac Title (22-24px Serif Semibold) */}
                <h2 className="font-serif-fraunces text-[22px] sm:text-[24px] font-semibold text-[#F5F5F5] mb-3 leading-snug">
                  {userRashi}
                </h2>

                {/* Astro Description (15px, 22-23px line-height) */}
                <p className="text-[15px] text-[#A0A0A0] leading-[22.5px] mb-4 font-normal">
                  A day for quiet reflection. Avoid major impulsive decisions during Rahu Kaal (4:30–6:00pm). Evening hours are especially auspicious for {ishtDevta} worship.
                </p>

                {/* Responsive Metadata Row: Inline on desktop, graceful stacking on narrow screens */}
                <div className="pt-3.5 border-t border-[#252525] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[12.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#7A7A7A]">Lucky Color:</span>
                    <span className="text-[#F5F5F5] font-semibold">Cream / White</span>
                  </div>
                  <span className="hidden sm:inline text-[#444444]">·</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#7A7A7A]">Ruling Planet:</span>
                    <span className="text-[#F5F5F5] font-semibold">Moon</span>
                  </div>
                </div>
              </article>

              {/* 3. Vedic Panchang Card (P0 Bug Fix: Never hidden, completely scrollable) */}
              <article className="w-full rounded-[18px] bg-[#151515] border border-[#252525] hover:border-[#D9A441]/40 p-5 sm:p-6 shadow-xs transition-colors duration-200">
                {/* Panchang Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-semibold tracking-wider uppercase text-[#D9A441]">
                    VEDIC PANCHANG
                  </span>
                  <span className="text-[12.5px] text-[#888888] font-medium">
                    Ravivaar
                  </span>
                </div>

                {/* Main Tithi Title */}
                <h2 className="font-serif-fraunces text-[22px] sm:text-[24px] font-semibold text-[#F5F5F5] mb-4">
                  Trayodashi
                </h2>

                {/* Panchang Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                    <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mb-1 font-medium">
                      Nakshatra
                    </div>
                    <div className="text-[14px] font-semibold text-[#F5F5F5]">
                      Rohini
                    </div>
                  </div>

                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                    <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mb-1 font-medium">
                      Rahu Kaal
                    </div>
                    <div className="text-[14px] font-semibold text-[#E8722A]">
                      4:30–6:00 PM
                    </div>
                  </div>

                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                    <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mb-1 font-medium">
                      Sunrise
                    </div>
                    <div className="text-[14px] font-semibold text-[#F5F5F5]">
                      5:58 AM
                    </div>
                  </div>

                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                    <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mb-1 font-medium">
                      Sunset
                    </div>
                    <div className="text-[14px] font-semibold text-[#F5F5F5]">
                      6:42 PM
                    </div>
                  </div>

                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                    <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mb-1 font-medium">
                      Abhijit Muhurta
                    </div>
                    <div className="text-[14px] font-semibold text-[#D9A441]">
                      11:48 AM–12:38 PM
                    </div>
                  </div>

                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                    <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mb-1 font-medium">
                      Moon Sign
                    </div>
                    <div className="text-[14px] font-semibold text-[#F5F5F5]">
                      Vrishabha (Taurus)
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Right 5 Columns on Desktop: Discuss with Sakha & Practice Overview */}
            <div className="md:col-span-5 flex flex-col gap-5">
              {/* One-Tap Spiritual Counsel with Sakha */}
              <div className="bg-[#151515] border border-[#252525] rounded-[20px] p-5 shadow-xs flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold tracking-wider uppercase text-[#D9A441]">
                    DISCUSS WITH SAKHA
                  </span>
                  <span className="text-[11.5px] text-[#7A7A7A]">
                    One-tap counsel
                  </span>
                </div>

                <div className="space-y-2">
                  {discussionTopics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onNavigateToChat(t)}
                      className="w-full bg-[#1C1C1C] hover:bg-[#222222] border border-[#252525] hover:border-[#D9A441]/40 rounded-[14px] px-4 py-3 flex items-center justify-between text-left cursor-pointer transition-all duration-150 active:scale-[0.99] group shadow-xs"
                    >
                      <span className="text-[13.5px] text-[#F5F5F5] group-hover:text-[#D9A441] transition-colors font-medium">
                        {t}
                      </span>
                      <span className="text-[#666666] group-hover:text-[#D9A441] text-sm group-hover:translate-x-1 transition-all">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sadhana Practice Highlight Card */}
              <div className="bg-[#151515] border border-[#252525] rounded-[20px] p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold tracking-wider uppercase text-[#D9A441]">
                    DAILY SADHANA
                  </span>
                  <span className="text-[11.5px] text-[#7A7A7A]">
                    Today&apos;s Rhythm
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[12px] p-2.5">
                    <div className="font-serif-fraunces text-xl font-bold text-[#D9A441]">7</div>
                    <div className="text-[10px] uppercase text-[#7A7A7A] mt-0.5">Day Streak</div>
                  </div>
                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[12px] p-2.5">
                    <div className="font-serif-fraunces text-xl font-bold text-[#F5F5F5]">140</div>
                    <div className="text-[10px] uppercase text-[#7A7A7A] mt-0.5">Mins Dhyan</div>
                  </div>
                  <div className="bg-[#1C1C1C] border border-[#252525] rounded-[12px] p-2.5">
                    <div className="font-serif-fraunces text-xl font-bold text-[#F5F5F5]">12</div>
                    <div className="text-[10px] uppercase text-[#7A7A7A] mt-0.5">Verses Read</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ TAB 2: SPIRITUAL PROFILE ═══════════════ */}
        {subTab === "profile" && (
          <div className="mt-6 px-[18px] sm:px-6 flex flex-col gap-5 animate-fadein">
            {editing ? (
              /* Inline Edit Form */
              <div className="bg-[#151515] border border-[#252525] rounded-[20px] p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#252525] pb-3 mb-5">
                  <h2 className="font-serif-fraunces text-lg text-[#F5F5F5] font-semibold">
                    Edit Spiritual Profile
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="text-xs text-[#9A9A9A] hover:text-[#F5F5F5] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-5">
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-[#7A7A7A] mb-1.5 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-[#252525] bg-[#0A0A0A] rounded-xl p-3 text-xs text-[#F5F5F5] outline-none focus:border-[#D9A441]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-[#7A7A7A] mb-1.5 block">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full border border-[#252525] bg-[#0A0A0A] rounded-xl p-3 text-xs text-[#F5F5F5] outline-none focus:border-[#D9A441] [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-[#7A7A7A] mb-1.5 block">
                      Isht Devta (Chosen Deity)
                    </label>
                    <select
                      value={formData.ishtDevta}
                      onChange={(e) => setFormData({ ...formData, ishtDevta: e.target.value })}
                      className="w-full border border-[#252525] bg-[#0A0A0A] rounded-xl p-3 text-xs text-[#F5F5F5] outline-none focus:border-[#D9A441]"
                    >
                      {["Shiva", "Vishnu", "Devi", "Ganesha", "Krishna", "Hanuman", "Still discovering"].map((d) => (
                        <option key={d} value={d} className="bg-[#151515] text-[#F5F5F5]">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-[#7A7A7A] mb-1.5 block">
                      Preferred Language
                    </label>
                    <input
                      type="text"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full border border-[#252525] bg-[#0A0A0A] rounded-xl p-3 text-xs text-[#F5F5F5] outline-none focus:border-[#D9A441]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase text-[#7A7A7A] mb-1.5 block">
                      Life Chapter
                    </label>
                    <input
                      type="text"
                      value={formData.lifeChapter}
                      onChange={(e) => setFormData({ ...formData, lifeChapter: e.target.value })}
                      className="w-full border border-[#252525] bg-[#0A0A0A] rounded-xl p-3 text-xs text-[#F5F5F5] outline-none focus:border-[#D9A441]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="bg-[#D9A441] text-[#0A0A0A] font-bold py-2.5 px-6 rounded-xl text-xs hover:bg-[#C29235] transition-all cursor-pointer shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            ) : (
              /* Profile Details View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Spiritual Identity Card */}
                <div className="bg-[#151515] border border-[#252525] rounded-[20px] p-5 sm:p-6 flex flex-col gap-3 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#252525] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="devanagari-font text-base text-[#D9A441]">ॐ</span>
                      <span className="text-[12px] font-semibold uppercase text-[#D9A441] tracking-wider">
                        Spiritual Identity
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="text-xs text-[#D9A441] hover:underline cursor-pointer font-medium"
                    >
                      Edit
                    </button>
                  </div>

                  {profile.dateOfBirth && (
                    <div className="flex justify-between items-center text-[13px] py-2 border-b border-[#202020]">
                      <span className="text-[#888888]">Date of Birth</span>
                      <span className="font-semibold text-[#F5F5F5]">{profile.dateOfBirth}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[13px] py-2 border-b border-[#202020]">
                    <span className="text-[#888888]">Chosen Isht Devta</span>
                    <span className="font-semibold text-[#F5F5F5]">{profile.ishtDevta || "Shiva"}</span>
                  </div>

                  <div className="flex justify-between items-center text-[13px] py-2 border-b border-[#202020]">
                    <span className="text-[#888888]">Faith Level</span>
                    <span className="font-semibold text-[#F5F5F5]">{profile.faithLevel || "Devoted"}</span>
                  </div>

                  <div className="flex justify-between items-center text-[13px] py-2 border-b border-[#202020]">
                    <span className="text-[#888888]">Tradition</span>
                    <span className="font-semibold text-[#F5F5F5]">{profile.tradition || "Sanatan Dharma"}</span>
                  </div>

                  <div className="flex justify-between items-center text-[13px] py-2">
                    <span className="text-[#888888]">Vedic Rashi</span>
                    <span className="font-semibold text-[#F5F5F5]">{profile.rashi || "Karka (Cancer)"}</span>
                  </div>
                </div>

                {/* 2. Sadhana & Daily Practice Stats */}
                <div className="bg-[#151515] border border-[#252525] rounded-[20px] p-5 sm:p-6 shadow-xs">
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-[#D9A441] mb-3">
                    PRACTICE & SADHANA
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                      <div className="font-serif-fraunces text-2xl font-bold text-[#D9A441]">
                        7
                      </div>
                      <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mt-0.5">
                        Day Streak
                      </div>
                    </div>
                    <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                      <div className="font-serif-fraunces text-2xl font-bold text-[#F5F5F5]">
                        140
                      </div>
                      <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mt-0.5">
                        Mins Dhyan
                      </div>
                    </div>
                    <div className="bg-[#1C1C1C] border border-[#252525] rounded-[14px] p-3">
                      <div className="font-serif-fraunces text-2xl font-bold text-[#F5F5F5]">
                        12
                      </div>
                      <div className="text-[10.5px] uppercase tracking-wider text-[#7A7A7A] mt-0.5">
                        Verses Read
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Daily Rhythm & Life Chapter Card */}
                <div className="bg-[#151515] border border-[#252525] rounded-[20px] p-5 sm:p-6 flex flex-col gap-3 shadow-xs">
                  <div className="text-[12px] font-semibold uppercase tracking-wider text-[#D9A441] mb-1">
                    DAILY RHYTHM & LIFE CHAPTER
                  </div>

                  <div className="flex justify-between items-center text-[13px] py-2 border-b border-[#202020]">
                    <span className="text-[#888888]">Life Chapter</span>
                    <span className="font-semibold text-[#F5F5F5]">{profile.lifeChapter || "Student"}</span>
                  </div>

                  <div className="flex justify-between items-center text-[13px] py-2 border-b border-[#202020]">
                    <span className="text-[#888888]">Grounding Time</span>
                    <span className="font-semibold text-[#F5F5F5]">{profile.groundingTime || "Sunrise"}</span>
                  </div>

                  <div className="flex justify-between items-center text-[13px] py-2 border-b border-[#202020]">
                    <span className="text-[#888888]">Practice Frequency</span>
                    <span className="font-semibold text-[#F5F5F5]">{profile.practiceFrequency || "A few times a week"}</span>
                  </div>

                  <div className="flex justify-between items-center text-[13px] py-2">
                    <span className="text-[#888888]">Inner Season</span>
                    <span className="font-semibold text-[#F5F5F5]">{profile.innerSeason || "Peaceful"}</span>
                  </div>
                </div>

                {/* 4. Retake Discovery Onboarding Action */}
                <div className="md:col-span-2 bg-[#151515] border border-[#252525] rounded-[20px] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                  <div>
                    <div className="text-[14px] font-semibold text-[#F5F5F5]">
                      Spiritual Discovery Journey
                    </div>
                    <div className="text-[12px] text-[#7A7A7A] mt-0.5">
                      Retake the guided discovery questions to refresh your persona and guidance.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onResetOnboarding}
                    className="w-full sm:w-auto bg-[#1C1C1C] hover:bg-[#252525] border border-[#D9A441]/40 text-[#D9A441] px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Retake Onboarding</span>
                    <span>🔄</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════ WISDOM MODAL DIALOG ═══════════════ */}
      {isWisdomModalOpen && (
        <div
          onClick={() => setIsWisdomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadein"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#151515] border border-[#252525] rounded-[24px] p-6 sm:p-7 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#D9A441]">
                Bhagavad Gita 2.47
              </span>
              <button
                type="button"
                onClick={() => setIsWisdomModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#222222] text-[#9A9A9A] hover:text-[#F5F5F5] flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-[16px] bg-[#1C1C1C] border border-[#252525] mb-4 text-center">
              <p className="devanagari-font text-lg text-[#D9A441] leading-relaxed">
                कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br />
                मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
              </p>
            </div>

            <blockquote className="font-serif-fraunces text-base italic text-[#F5F5F5] leading-relaxed mb-4">
              &quot;You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.&quot;
            </blockquote>

            <p className="text-[13.5px] text-[#A0A0A0] leading-relaxed mb-6">
              This foundational verse of Karma Yoga teaches the art of selfless action. When we release anxiety about future rewards and dedicate our present actions with sincerity, the mind attains deep poise and freedom.
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsWisdomModalOpen(false)}
                className="px-5 py-2 rounded-full bg-[#D9A441] text-[#0A0A0A] text-xs font-semibold hover:bg-[#C29235] transition-all cursor-pointer shadow-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
