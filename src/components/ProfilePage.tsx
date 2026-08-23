"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/onboarding";

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

  const handleSave = () => {
    onUpdateProfile(formData);
    setEditing(false);
  };

  const displayName = profile.name.trim() || "SpiritualSakha Seeker";
  const avatarChar = displayName.charAt(0).toUpperCase();

  return (
    <div className="w-full h-[calc(100vh-3.25rem)] text-[#362A22] px-4 sm:px-6 lg:px-8 py-4 pb-8 max-w-4xl mx-auto flex flex-col gap-3.5 no-scrollbar overflow-y-auto font-sans">
      
      {/* COMPACT PROFILE HEADER */}
      <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[18px] p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#B4392B] text-[#FFFDF9] flex items-center justify-center font-serif text-xl sm:text-2xl font-bold shadow-xs flex-shrink-0">
            {avatarChar}
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="font-serif text-[19px] sm:text-[22px] font-bold text-[#362A22] leading-snug">
              {displayName}
            </h1>
            <p className="text-[12px] text-[#6B5C4E] font-medium">
              {profile.phone || "+91 9876543210"} • {profile.language || "Hindi"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="bg-[#FFFDF9] hover:bg-[#FBF3E6] border border-[rgba(54,42,34,0.2)] text-[#362A22] px-4 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-xs cursor-pointer active:scale-98"
        >
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* EDIT FORM OR READ-ONLY VIEW */}
      {editing ? (
        <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[18px] p-4 flex flex-col gap-3 shadow-xs animate-fade-in">
          <h2 className="font-serif text-[16px] font-bold text-[#362A22] border-b border-[rgba(54,42,34,0.1)] pb-2">
            Edit Spiritual Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-extrabold uppercase text-[#6B5C4E] mb-1 block">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-[rgba(54,42,34,0.15)] bg-[#FBF3E6] rounded-[12px] p-2 text-[12px] font-medium outline-none focus:border-[#B4392B]"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase text-[#6B5C4E] mb-1 block">Isht Devta</label>
              <select
                value={formData.ishtDevta}
                onChange={(e) => setFormData({ ...formData, ishtDevta: e.target.value })}
                className="w-full border border-[rgba(54,42,34,0.15)] bg-[#FBF3E6] rounded-[12px] p-2 text-[12px] font-medium outline-none focus:border-[#B4392B]"
              >
                {["Shiva", "Vishnu", "Devi", "Ganesha", "Krishna", "Hanuman", "Still discovering"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase text-[#6B5C4E] mb-1 block">Preferred Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full border border-[rgba(54,42,34,0.15)] bg-[#FBF3E6] rounded-[12px] p-2 text-[12px] font-medium outline-none focus:border-[#B4392B]"
              />
            </div>
            <div>
              <label className="text-[10px] font-extrabold uppercase text-[#6B5C4E] mb-1 block">Life Chapter</label>
              <input
                type="text"
                value={formData.lifeChapter}
                onChange={(e) => setFormData({ ...formData, lifeChapter: e.target.value })}
                className="w-full border border-[rgba(54,42,34,0.15)] bg-[#FBF3E6] rounded-[12px] p-2 text-[12px] font-medium outline-none focus:border-[#B4392B]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-1 bg-[#B4392B] text-[#FFFDF9] py-2.5 rounded-[12px] font-bold text-xs hover:bg-[#8E2C21] transition-all shadow-sm cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          
          {/* COMPACT SPIRITUAL IDENTITY CARD */}
          <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[18px] p-4 flex flex-col gap-2.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[rgba(54,42,34,0.1)] pb-2">
              <span className="text-base">🕉️</span>
              <span className="text-[11px] font-extrabold uppercase text-[#B4392B] tracking-wider">
                SPIRITUAL IDENTITY
              </span>
            </div>

            <div className="flex justify-between items-center text-[12px] py-1 border-b border-dashed border-[rgba(54,42,34,0.08)]">
              <span className="text-[#6B5C4E] font-medium flex items-center gap-1.5">
                <span>🔱</span> Isht Devta
              </span>
              <span className="font-bold text-[#362A22]">{profile.ishtDevta || "Shiva"}</span>
            </div>

            <div className="flex justify-between items-center text-[12px] py-1 border-b border-dashed border-[rgba(54,42,34,0.08)]">
              <span className="text-[#6B5C4E] font-medium flex items-center gap-1.5">
                <span>🪷</span> Faith Level
              </span>
              <span className="font-bold text-[#362A22]">{profile.faithLevel || "Devoted"}</span>
            </div>

            <div className="flex justify-between items-center text-[12px] py-1">
              <span className="text-[#6B5C4E] font-medium flex items-center gap-1.5">
                <span>☸️</span> Tradition
              </span>
              <span className="font-bold text-[#362A22]">{profile.tradition || "Sanatan Dharma"}</span>
            </div>
          </div>

          {/* COMPACT DAILY RHYTHM CARD */}
          <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.12)] rounded-[18px] p-4 flex flex-col gap-2.5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[rgba(54,42,34,0.1)] pb-2">
              <span className="text-base">☀️</span>
              <span className="text-[11px] font-extrabold uppercase text-[#B4392B] tracking-wider">
                DAILY RHYTHM
              </span>
            </div>

            <div className="flex justify-between items-center text-[12px] py-1 border-b border-dashed border-[rgba(54,42,34,0.08)]">
              <span className="text-[#6B5C4E] font-medium flex items-center gap-1.5">
                <span>📖</span> Life Chapter
              </span>
              <span className="font-bold text-[#362A22]">{profile.lifeChapter || "Student"}</span>
            </div>

            <div className="flex justify-between items-center text-[12px] py-1 border-b border-dashed border-[rgba(54,42,34,0.08)]">
              <span className="text-[#6B5C4E] font-medium flex items-center gap-1.5">
                <span>🌅</span> Grounding Time
              </span>
              <span className="font-bold text-[#362A22]">{profile.groundingTime || "Sunrise"}</span>
            </div>

            <div className="flex justify-between items-center text-[12px] py-1">
              <span className="text-[#6B5C4E] font-medium flex items-center gap-1.5">
                <span>🧘</span> Practice Frequency
              </span>
              <span className="font-bold text-[#362A22]">{profile.practiceFrequency || "A few times a week"}</span>
            </div>
          </div>

        </div>
      )}

      {/* COMPACT DATA PRIVACY & SECURITY SECTION */}
      <div className="bg-[#FBF3E6]/60 border border-[rgba(54,42,34,0.12)] rounded-[18px] p-4 flex flex-col gap-2.5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[rgba(54,42,34,0.1)] pb-2">
          <span className="text-base">🔒</span>
          <span className="text-[11px] font-extrabold uppercase text-[#362A22] tracking-wider">
            YOUR DATA PRIVACY & SECURITY
          </span>
        </div>

        <p className="text-[11.5px] text-[#6B5C4E] leading-relaxed font-medium">
          In accordance with India&apos;s Digital Personal Data Protection (DPDP) Act, your responses are encrypted and stored locally on your device. You have full control.
        </p>

        <button
          type="button"
          onClick={onResetOnboarding}
          className="bg-[#B4392B] hover:bg-[#8E2C21] text-[#FFFDF9] w-full py-2.5 rounded-[12px] text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-1.5"
        >
          <span>Re-do Onboarding Flow</span>
          <span className="text-sm">🔄</span>
        </button>
      </div>

    </div>
  );
};
