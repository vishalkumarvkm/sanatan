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

  const displayName = profile.name?.trim() || "Spiritual Seeker";
  const avatarChar = displayName.charAt(0).toUpperCase();

  return (
    <div className="w-full text-[#FAFAFA] px-4 py-6 max-w-md mx-auto flex flex-col gap-3.5 no-scrollbar font-sans">
      {/* Profile Header */}
      <div className="bg-[#141414] border border-[rgba(250,250,250,0.07)] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A55C] to-[#E8722A] text-[#0A0A0A] flex items-center justify-center font-serif-fraunces text-xl font-bold flex-shrink-0">
            {avatarChar}
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif-fraunces text-lg font-normal text-[#FAFAFA] leading-snug">
              {displayName}
            </h1>
            <p className="text-xs text-[rgba(250,250,250,0.4)]">
              {profile.language || "Hindi"} · {profile.lifeChapter || "Student"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="bg-[#1C1C1C] hover:bg-[#C9A55C] hover:text-[#0A0A0A] border border-[rgba(250,250,250,0.1)] text-[#FAFAFA] px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Edit Form or Read View */}
      {editing ? (
        <div className="bg-[#141414] border border-[rgba(250,250,250,0.07)] rounded-2xl p-4 flex flex-col gap-3 animate-fadein">
          <h2 className="font-serif-fraunces text-sm font-normal text-[#C9A55C] border-b border-[rgba(250,250,250,0.07)] pb-2 uppercase tracking-wider">
            Edit Profile
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-semibold uppercase text-[rgba(250,250,250,0.4)] mb-1 block">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-[rgba(250,250,250,0.07)] bg-[#0A0A0A] rounded-xl p-2.5 text-xs text-[#FAFAFA] outline-none focus:border-[#C9A55C]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-[rgba(250,250,250,0.4)] mb-1 block">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full border border-[rgba(250,250,250,0.07)] bg-[#0A0A0A] rounded-xl p-2.5 text-xs text-[#FAFAFA] outline-none focus:border-[#C9A55C] [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-[rgba(250,250,250,0.4)] mb-1 block">
                Isht Devta
              </label>
              <select
                value={formData.ishtDevta}
                onChange={(e) => setFormData({ ...formData, ishtDevta: e.target.value })}
                className="w-full border border-[rgba(250,250,250,0.07)] bg-[#0A0A0A] rounded-xl p-2.5 text-xs text-[#FAFAFA] outline-none focus:border-[#C9A55C]"
              >
                {["Shiva", "Vishnu", "Devi", "Ganesha", "Krishna", "Hanuman", "Still discovering"].map((d) => (
                  <option key={d} value={d} className="bg-[#141414] text-[#FAFAFA]">
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-[rgba(250,250,250,0.4)] mb-1 block">
                Preferred Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full border border-[rgba(250,250,250,0.07)] bg-[#0A0A0A] rounded-xl p-2.5 text-xs text-[#FAFAFA] outline-none focus:border-[#C9A55C]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-2 bg-[#C9A55C] text-[#0A0A0A] py-2.5 rounded-xl font-bold text-xs hover:bg-[#A8904D] transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Spiritual Identity Card */}
          <div className="bg-[#141414] border border-[rgba(250,250,250,0.07)] rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 border-b border-[rgba(250,250,250,0.07)] pb-2">
              <span className="text-sm">🕉️</span>
              <span className="text-[10.5px] font-semibold uppercase text-[#C9A55C] tracking-wider">
                Spiritual Identity
              </span>
            </div>

            {profile.dateOfBirth && (
              <div className="flex justify-between items-center text-xs py-1.5 border-b border-dashed border-[rgba(250,250,250,0.07)]">
                <span className="text-[rgba(250,250,250,0.4)]">Date of Birth</span>
                <span className="font-medium text-[#FAFAFA]">{profile.dateOfBirth}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs py-1.5 border-b border-dashed border-[rgba(250,250,250,0.07)]">
              <span className="text-[rgba(250,250,250,0.4)]">Isht Devta</span>
              <span className="font-medium text-[#FAFAFA]">{profile.ishtDevta || "Shiva"}</span>
            </div>

            <div className="flex justify-between items-center text-xs py-1.5 border-b border-dashed border-[rgba(250,250,250,0.07)]">
              <span className="text-[rgba(250,250,250,0.4)]">Faith Level</span>
              <span className="font-medium text-[#FAFAFA]">{profile.faithLevel || "Devoted"}</span>
            </div>

            <div className="flex justify-between items-center text-xs py-1.5">
              <span className="text-[rgba(250,250,250,0.4)]">Tradition</span>
              <span className="font-medium text-[#FAFAFA]">{profile.tradition || "Sanatan Dharma"}</span>
            </div>
          </div>

          {/* Daily Rhythm Card */}
          <div className="bg-[#141414] border border-[rgba(250,250,250,0.07)] rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 border-b border-[rgba(250,250,250,0.07)] pb-2">
              <span className="text-sm">☀️</span>
              <span className="text-[10.5px] font-semibold uppercase text-[#C9A55C] tracking-wider">
                Daily Rhythm
              </span>
            </div>

            <div className="flex justify-between items-center text-xs py-1.5 border-b border-dashed border-[rgba(250,250,250,0.07)]">
              <span className="text-[rgba(250,250,250,0.4)]">Life Chapter</span>
              <span className="font-medium text-[#FAFAFA]">{profile.lifeChapter || "Student"}</span>
            </div>

            <div className="flex justify-between items-center text-xs py-1.5">
              <span className="text-[rgba(250,250,250,0.4)]">Practice Frequency</span>
              <span className="font-medium text-[#FAFAFA]">{profile.practiceFrequency || "A few times a week"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Reset Onboarding Button */}
      <div className="bg-[#141414] border border-[rgba(250,250,250,0.07)] rounded-2xl p-4 flex flex-col gap-2.5">
        <span className="text-[10px] font-semibold uppercase text-[rgba(250,250,250,0.4)] tracking-wider">
          Spiritual Preferences
        </span>
        <button
          type="button"
          onClick={onResetOnboarding}
          className="bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#C9A55C] border border-[#C9A55C]/30 w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-1.5"
        >
          <span>Retake Onboarding Discovery</span>
          <span>🔄</span>
        </button>
      </div>
    </div>
  );
};
