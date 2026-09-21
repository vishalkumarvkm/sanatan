"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types/onboarding";
import { fetchUserProfile } from "@/lib/api";
import { 
  Bell, 
  RotateCcw, 
  Volume2, 
  Languages, 
  Lock, 
  HelpCircle, 
  ChevronRight,
  Flame,
  BookOpen,
  Sparkles,
  Edit2,
  LogOut,
  Shield,
  Star,
  Sun
} from "lucide-react";

interface ProfilePageProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetOnboarding: () => void;
  onOpenAuth?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onUpdateProfile,
  onResetOnboarding,
}) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [diyasCount, setDiyasCount] = useState(5);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const [backendUserDetail, setBackendUserDetail] = useState<any>(null);

  useEffect(() => {
    if (profile.userId) {
      fetchUserProfile(profile.userId).then((res) => {
        if (res.success) {
          setBackendUserDetail(res);
        }
      }).catch((err) => {
        console.warn("[ProfilePage] Could not fetch backend user profile:", err);
      });
    }
  }, [profile.userId]);

  const handleSave = () => {
    onUpdateProfile(formData);
    setEditing(false);
  };

  const displayName = profile.name?.trim() || "Vishal Kumar";
  const avatarChar = displayName.charAt(0).toUpperCase();

  return (
    <div className="w-full text-[#FAFAFA] px-4 py-4 max-w-md mx-auto flex flex-col gap-4 no-scrollbar font-sans pb-28">
      {/* 1. Top Avatar & User Card */}
      <div className="bg-[#141414] border border-[#C9A55C]/30 rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
        {/* Background ambient radial glow */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#C9A55C]/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#E8722A]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Circular Glowing Avatar with Bell Notification Badge */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border-2 border-[#C9A55C] flex items-center justify-center shadow-[0_0_25px_rgba(201,165,92,0.35)]">
            <span className="font-serif-fraunces text-3xl font-bold text-[#C9A55C]">
              {avatarChar}
            </span>
          </div>
          <div className="absolute bottom-0 right-0 bg-[#C9A55C] rounded-full p-1.5 shadow-md text-black flex items-center justify-center">
            <Bell className="w-3 h-3 text-black fill-black" />
          </div>
        </div>

        {/* Name & Phone */}
        <h1 className="font-serif-fraunces text-xl font-bold text-[#FAFAFA] tracking-wide">
          {displayName}
        </h1>
        <p className="text-xs text-[rgba(250,250,250,0.4)] mt-0.5 tracking-wider font-mono">
          {profile.phone || "+91 98765 43210"}
        </p>

        {/* Devotee & Streak Badges */}
        <div className="flex flex-col items-center gap-1.5 mt-3">
          <div className="bg-[#C9A55C]/15 border border-[#C9A55C]/40 text-[#C9A55C] px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span>🙏</span>
            <span>Devotee of {profile.ishtDevta || "Shiva"} (Isht Devta)</span>
          </div>

          <div className="bg-[#C9A55C]/15 border border-[#C9A55C]/40 text-[#C9A55C] px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#E8722A] fill-[#E8722A]" />
            <span>5 Day Sadhana Streak</span>
          </div>
        </div>
      </div>

      {/* 2. Spiritual Milestones */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
            Spiritual Milestones
          </h2>
          <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-wider">
            THIS MONTH
          </span>
        </div>

        {/* 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1 */}
          <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl p-3.5 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <Flame className="w-4 h-4 text-[#E8722A] fill-[#E8722A]" />
              <span className="bg-[#C9A55C]/15 text-[#C9A55C] text-[9.5px] font-bold px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <div>
              <div className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
                5 Days
              </div>
              <div className="text-[10.5px] text-[rgba(250,250,250,0.4)]">
                Current Streak
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl p-3.5 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <Sparkles className="w-4 h-4 text-[#C9A55C]" />
              <span className="bg-[#C9A55C]/15 text-[#C9A55C] text-[9.5px] font-bold px-2 py-0.5 rounded-md">
                +14% wk
              </span>
            </div>
            <div>
              <div className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
                42 Mins
              </div>
              <div className="text-[10.5px] text-[rgba(250,250,250,0.4)]">
                Dhyana Meditation
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl p-3.5 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-base">📿</span>
              <span className="bg-[#C9A55C]/15 text-[#C9A55C] text-[9.5px] font-bold px-2 py-0.5 rounded-md">
                1 Mala
              </span>
            </div>
            <div>
              <div className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
                34
              </div>
              <div className="text-[10.5px] text-[rgba(250,250,250,0.4)]">
                Japa Chants
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl p-3.5 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <BookOpen className="w-4 h-4 text-[#C9A55C]" />
              <span className="bg-[#C9A55C]/15 text-[#C9A55C] text-[9.5px] font-bold px-2 py-0.5 rounded-md">
                Ch. 2
              </span>
            </div>
            <div>
              <div className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
                7 Verses
              </div>
              <div className="text-[10.5px] text-[rgba(250,250,250,0.4)]">
                Bhagavad Gita
              </div>
            </div>
          </div>
        </div>

        {/* Diyas Lit Full Card */}
        <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-[#E8722A] fill-[#E8722A]" />
            <div className="flex flex-col">
              <span className="font-serif-fraunces text-sm font-bold text-[#FAFAFA]">
                {diyasCount} Sacred Diyas Lit
              </span>
              <span className="text-[10.5px] text-[rgba(250,250,250,0.4)]">
                Devotional flame offered at...
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDiyasCount((prev) => prev + 1)}
            className="bg-[#C9A55C] hover:bg-[#A8904D] text-[#0A0A0A] font-bold px-3 py-1.5 rounded-xl text-xs transition-all active:scale-95 shadow-md"
          >
            Offer Now
          </button>
        </div>
      </div>

      {/* 3. Vedic & Spiritual Foundation */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
            Vedic & Spiritual Foundation
          </h2>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="text-xs font-bold text-[#C9A55C] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{editing ? "Cancel" : "Edit"}</span>
            <Edit2 className="w-3 h-3 text-[#C9A55C]" />
          </button>
        </div>

        {editing ? (
          <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl p-4 flex flex-col gap-3 animate-fadein">
            <div>
              <label className="text-[10px] font-bold uppercase text-[rgba(250,250,250,0.4)] mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[rgba(250,250,250,0.1)] rounded-xl p-2.5 text-xs text-[#FAFAFA]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-[rgba(250,250,250,0.4)] mb-1 block">
                Isht Devta
              </label>
              <select
                value={formData.ishtDevta}
                onChange={(e) => setFormData({ ...formData, ishtDevta: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[rgba(250,250,250,0.1)] rounded-xl p-2.5 text-xs text-[#FAFAFA]"
              >
                {["Shiva", "Vishnu", "Devi", "Ganesha", "Krishna", "Hanuman", "Still discovering"].map((d) => (
                  <option key={d} value={d} className="bg-[#141414] text-[#FAFAFA]">
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#C9A55C] text-[#0A0A0A] py-2.5 rounded-xl font-bold text-xs hover:bg-[#A8904D] transition-all cursor-pointer mt-1"
            >
              Save Foundation Changes
            </button>
          </div>
        ) : (
          <>
            {/* Box 1: SPIRITUAL IDENTITY */}
            <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A55C]" />
                <span>SPIRITUAL IDENTITY</span>
              </div>

              <div className="bg-[#0A0A0A]/60 rounded-xl p-2.5 flex justify-between items-center text-xs">
                <span className="text-[rgba(250,250,250,0.4)]">Isht Devta</span>
                <span className="font-bold text-[#C9A55C]">🔱 Lord Shiva</span>
              </div>

              <div className="bg-[#0A0A0A]/60 rounded-xl p-2.5 flex justify-between items-center text-xs">
                <span className="text-[rgba(250,250,250,0.4)]">Inner Season</span>
                <span className="font-bold text-[#C9A55C]">Seeking Clarity</span>
              </div>

              <div className="bg-[#0A0A0A]/60 rounded-xl p-2.5 flex justify-between items-center text-xs">
                <span className="text-[rgba(250,250,250,0.4)]">Sadhana Rhythm</span>
                <span className="font-bold text-[#C9A55C]">🌅 Brahma Muhurta</span>
              </div>
            </div>

            {/* Box 2: VEDIC & KUNDALI PROFILE */}
            <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl p-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                  <Star className="w-3.5 h-3.5 text-[#C9A55C] fill-[#C9A55C]" />
                  <span>VEDIC & KUNDALI PROFILE</span>
                </div>
                <span className="text-[9.5px] text-[rgba(250,250,250,0.5)] bg-white/5 px-2 py-0.5 rounded-md">
                  Verified Chart
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0A0A0A]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
                  <span className="text-[9.5px] text-[rgba(250,250,250,0.4)]">Vedic Rashi</span>
                  <span className="text-xs font-bold text-[#FAFAFA]">Karka (Cancer)</span>
                </div>

                <div className="bg-[#0A0A0A]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
                  <span className="text-[9.5px] text-[rgba(250,250,250,0.4)]">Nakshatra</span>
                  <span className="text-xs font-bold text-[#FAFAFA]">Swati (Pada 2)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0A0A0A]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
                  <span className="text-[9.5px] text-[rgba(250,250,250,0.4)]">Birth Place</span>
                  <span className="text-xs font-bold text-[#FAFAFA]">Varanasi, India</span>
                </div>

                <div className="bg-[#0A0A0A]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
                  <span className="text-[9.5px] text-[rgba(250,250,250,0.4)]">Time of Birth</span>
                  <span className="text-xs font-bold text-[#FAFAFA]">08:30 AM</span>
                </div>
              </div>

              <div className="bg-[#0A0A0A]/60 rounded-xl p-2.5 flex flex-col gap-0.5">
                <span className="text-[9.5px] text-[rgba(250,250,250,0.4)]">Date of Birth</span>
                <span className="text-xs font-bold text-[#FAFAFA]">01 Jan 2000</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 4. Saved Bookmarks & Reflection Journal */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
            Saved Bookmarks & Reflection Journal
          </h2>
          <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-wider">
            PERSONAL SANCTUARY
          </span>
        </div>

        <div className="bg-[#141414] border border-[#C9A55C]/30 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A55C]">🔖</span>
              <span className="text-xs font-bold text-white">Bookmarked Shlokas (3)</span>
            </div>
            <span className="text-[10px] text-[#C9A55C] font-semibold">View All →</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Gita Chapter 2, Verse 47</div>
                <div className="text-[10px] text-white/40">Karma Yoga • Detachment from results</div>
              </div>
              <span className="text-white/40 hover:text-[#C9A55C] cursor-pointer">▶</span>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Maha Mrityunjaya Mantra</div>
                <div className="text-[10px] text-white/40">Rig Veda 7.59.12 • Moksha Suktam</div>
              </div>
              <span className="text-white/40 hover:text-[#C9A55C] cursor-pointer">▶</span>
            </div>
          </div>

          <div className="border-t border-white/10 pt-2 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>📝</span> Daily Reflection Notes
              </span>
              <button
                type="button"
                onClick={() => {
                  const note = prompt("Enter your personal spiritual reflection note:");
                  if (note) alert("✨ Reflection saved to your spiritual journal!");
                }}
                className="text-[10px] font-bold text-[#0A0A0A] bg-[#C9A55C] px-2.5 py-1 rounded-lg cursor-pointer hover:bg-[#B8944B]"
              >
                + New Entry
              </button>
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-2.5 text-xs text-white/70 italic">
              &ldquo;Felt immense peace during morning Brahma Muhurta meditation today. Focused on detached action.&rdquo;
              <div className="text-[9px] text-[#C9A55C] not-italic mt-1">15 Sep • Morning Sadhana</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Preferences & Settings */}
      <div className="flex flex-col gap-2.5">
        <h2 className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
          Preferences & Settings
        </h2>

        <div className="bg-[#141414] border border-[rgba(250,250,250,0.08)] rounded-2xl overflow-hidden flex flex-col divide-y divide-[rgba(250,250,250,0.06)]">
          <button
            type="button"
            onClick={onResetOnboarding}
            className="p-3.5 hover:bg-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/30 text-[#C9A55C] flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FAFAFA]">
                  Re-take Spiritual Onboarding
                </span>
                <span className="text-[10px] text-[rgba(250,250,250,0.4)]">
                  Update Isht Devta, birth details & goals
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[rgba(250,250,250,0.4)]" />
          </button>

          <button
            type="button"
            onClick={() => alert("🔔 Spiritual Reminders set for Brahma Muhurta (04:30 AM) and Evening Reflection (07:00 PM)")}
            className="p-3.5 hover:bg-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/30 text-[#C9A55C] flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FAFAFA]">
                  Spiritual Reminders & Alerts
                </span>
                <span className="text-[10px] text-[rgba(250,250,250,0.4)]">
                  Morning Sadhana, Brahma Muhurta, Rahu Kaal
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[rgba(250,250,250,0.4)]" />
          </button>

          <button
            type="button"
            onClick={() => alert("🔊 Voice Resonance tuned to Sacred Tanpura Harmonics (432 Hz)")}
            className="p-3.5 hover:bg-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/30 text-[#C9A55C] flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FAFAFA]">
                  Audio & Sakha Voice
                </span>
                <span className="text-[10px] text-[rgba(250,250,250,0.4)]">
                  Voice warmth, resonant frequency & chants
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[rgba(250,250,250,0.4)]" />
          </button>

          <button
            type="button"
            onClick={() => alert("🌐 Indic Regional Support active: English, Hindi (हिन्दी), Sanskrit (संस्कृतम्), Tamil, & Telugu available")}
            className="p-3.5 hover:bg-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/30 text-[#C9A55C] flex items-center justify-center shrink-0">
                <Languages className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FAFAFA]">
                  Language & Script
                </span>
                <span className="text-[10px] text-[rgba(250,250,250,0.4)]">
                  English + Sanskrit (Devanagari) + Hindi
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[rgba(250,250,250,0.4)]" />
          </button>

          <button
            type="button"
            className="p-3.5 hover:bg-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/30 text-[#C9A55C] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FAFAFA]">
                  Privacy & Offline Chants
                </span>
                <span className="text-[10px] text-[rgba(250,250,250,0.4)]">
                  4 offline chants stored • End-to-end encrypted
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[rgba(250,250,250,0.4)]" />
          </button>

          <button
            type="button"
            className="p-3.5 hover:bg-white/5 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/30 text-[#C9A55C] flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#FAFAFA]">
                  Help & Vedic Guidance
                </span>
                <span className="text-[10px] text-[rgba(250,250,250,0.4)]">
                  Reach Sakha Acharyas & sacred FAQ
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[rgba(250,250,250,0.4)]" />
          </button>
        </div>
      </div>

      {/* 5. Footer Mantra & Sign Out Button */}
      <div className="flex flex-col items-center text-center gap-2 mt-4">
        <span className="text-[#C9A55C] text-sm">✨</span>
        <span className="devanagari-font text-[#C9A55C] text-xl font-bold">
          ॐ नमः शिवाय
        </span>
        <p className="text-[11px] text-[rgba(250,250,250,0.4)]">
          May your daily sadhana bring inner illumination.
        </p>

        <button
          type="button"
          onClick={() => setShowSignOutConfirm(true)}
          className="mt-4 text-[10px] font-bold tracking-widest text-[rgba(250,250,250,0.4)] hover:text-[#E8722A] uppercase cursor-pointer transition-colors"
        >
          SIGN OUT OF SACRED SESSION
        </button>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadein">
          <div className="bg-[#161616] border border-[#C9A55C]/30 rounded-2xl max-w-sm w-full p-6 flex flex-col gap-4">
            <h3 className="font-serif-fraunces text-xl font-bold text-[#FAFAFA]">
              Sign Out
            </h3>
            <p className="text-xs text-[rgba(250,250,250,0.7)] leading-relaxed">
              Are you sure you want to sign out of your sacred session?
            </p>
            <div className="flex justify-end items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-[rgba(250,250,250,0.5)] hover:text-[#FAFAFA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSignOutConfirm(false);
                  onResetOnboarding();
                }}
                className="px-4 py-2 bg-[#C9A55C] hover:bg-[#A8904D] text-[#0A0A0A] text-xs font-bold rounded-xl"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


