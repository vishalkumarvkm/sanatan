"use client";

import React, { useState } from "react";
import { UserProfile, initialProfile } from "@/types/onboarding";
import { Rangoli } from "./Rangoli";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onSkip: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [recording, setRecording] = useState(false);
  const [micLabel, setMicLabel] = useState("Speak");
  const [showHelplineModal, setShowHelplineModal] = useState(false);

  const totalSteps = 13;

  const updateField = <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const completed = { ...profile, completedOnboarding: true };
      setProfile(completed);
      onComplete(completed);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkipClick = () => {
    const skipped = { ...profile, completedOnboarding: true };
    onSkip(skipped);
  };

  const toggleRecording = () => {
    if (recording) return;
    setRecording(true);
    setMicLabel("Listening…");

    setTimeout(() => {
      setRecording(false);
      setMicLabel("Speak");
      if (!profile.feelingText.trim()) {
        updateField(
          "feelingText",
          "I've been a little anxious about work, but grateful for my family."
        );
      }
    }, 2200);
  };

  const isHeavyMood = ["Heavy", "Overwhelmed"].includes(profile.innerSeason);

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(120%_65%_at_50%_-10%,var(--prabhat-deep)_0%,var(--prabhat-cream)_55%)] flex flex-col justify-between text-[#362A22] no-scrollbar">
      
      {/* ULTRA-COMPACT TOP HEADER BAR */}
      <header className="w-full px-4 sm:px-8 lg:px-12 py-1.5 sm:py-2 flex items-center justify-between border-b border-[rgba(54,42,34,0.08)] bg-white/20 backdrop-blur-xs flex-shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="font-serif text-[13px] text-[#B4392B] font-semibold tracking-wider uppercase flex items-center gap-1">
            <span className="devanagari-font text-sm sm:text-base">ॐ</span> DEVABHUMI
          </span>
        </div>

        {/* Center Rangoli Progress & Step Counter (Hidden on Desktop/Windows mode) */}
        <div className="flex md:hidden items-center gap-2">
          <div className="scale-70 sm:scale-75">
            <Rangoli currentStep={currentStep} totalSteps={totalSteps} />
          </div>
          <div className="flex flex-col text-center">
            <span className="text-[9.5px] sm:text-[10px] font-extrabold tracking-wider text-[#6B5C4E] uppercase">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="hidden sm:inline text-[8px] text-[#6B5C4E] italic">
              Optional — skip anything
            </span>
          </div>
        </div>

        {/* Right Skip Link */}
        <div>
          <button
            type="button"
            onClick={handleSkipClick}
            className="text-[10.5px] sm:text-[11px] font-bold text-[#B4392B] underline hover:opacity-80 transition-opacity cursor-pointer"
          >
            Skip, explore first
          </button>
        </div>
      </header>

      {/* MAIN STEP CONTENT WORKSPACE */}
      <main className="flex-1 px-4 sm:px-8 md:px-12 py-2 sm:py-3 no-scrollbar overflow-y-auto max-w-2xl mx-auto w-full flex flex-col justify-center">
        
        {/* STEP 1: Welcome */}
        {currentStep === 1 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              <span className="devanagari-font mr-1">ॐ</span> DEVABHUMI
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              Namaste. I&apos;m Sakha — I&apos;d like to truly know you.
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              Not just your name — your days, your people, your practice, and
              how you&apos;re really doing. Share what feels right; the rest
              can wait.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={profile.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs transition-colors"
                />
              </div>

              <div>
                <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                  Preferred language
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Hindi",
                    "Tamil",
                    "Telugu",
                    "Bengali",
                    "Gujarati",
                    "Marathi",
                    "English",
                  ].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => updateField("language", lang)}
                      className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                        profile.language === lang
                          ? "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9] shadow-xs"
                          : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22] hover:border-[#B4392B]/50"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Basics */}
        {currentStep === 2 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              A FEW BASICS
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              A little about you.
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              So I can reach you, and speak to you rightly.
            </p>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 29"
                    value={profile.age}
                    onChange={(e) => updateField("age", e.target.value)}
                    className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={profile.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                  Gender
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Woman", "Man", "Non-binary", "Prefer not to say"].map(
                    (g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => updateField("gender", g)}
                        className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                          g === "Prefer not to say" ? "border-dashed" : ""
                        } ${
                          profile.gender === g
                            ? g === "Prefer not to say"
                              ? "bg-[#6B5C4E] border-[#6B5C4E] text-[#FFFDF9]"
                              : "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9]"
                            : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                        }`}
                      >
                        {g}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                  Or describe in your own words{" "}
                  <span className="lowercase font-medium text-[#6B5C4E]">
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Optional — only if you'd like to"
                  value={profile.genderCustom}
                  onChange={(e) => updateField("genderCustom", e.target.value)}
                  className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Trust */}
        {currentStep === 3 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              MY PROMISE, FIRST
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              Before I ask anything closer to the heart.
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              Here&apos;s what happens with what follows:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col bg-[#FFFDF9] border border-[rgba(54,42,34,0.13)] rounded-[16px] p-3.5 shadow-xs">
                <svg
                  className="w-5.5 h-5.5 text-[#45613B] mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M9 12l2 2 4-4M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z" />
                </svg>
                <div className="text-[12.5px] font-bold text-[#362A22] mb-0.5">
                  Nothing is required
                </div>
                <div className="text-[11px] text-[#6B5C4E] leading-relaxed">
                  Skip any question. Answer only what feels natural today.
                </div>
              </div>

              <div className="flex flex-col bg-[#FFFDF9] border border-[rgba(54,42,34,0.13)] rounded-[16px] p-3.5 shadow-xs">
                <svg
                  className="w-5.5 h-5.5 text-[#B4392B] mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 6h16M4 12h16M4 18h9" />
                </svg>
                <div className="text-[12.5px] font-bold text-[#362A22] mb-0.5">
                  Never used to sell
                </div>
                <div className="text-[11px] text-[#6B5C4E] leading-relaxed">
                  No ad targeting on this data — ever. It only shapes how I
                  speak with you.
                </div>
              </div>

              <div className="flex flex-col bg-[#FFFDF9] border border-[rgba(54,42,34,0.13)] rounded-[16px] p-3.5 shadow-xs">
                <svg
                  className="w-5.5 h-5.5 text-[#D9A441] mb-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 018 0v3" />
                </svg>
                <div className="text-[12.5px] font-bold text-[#362A22] mb-0.5">
                  Yours to export/erase
                </div>
                <div className="text-[11px] text-[#6B5C4E] leading-relaxed">
                  Protected under India&apos;s DPDP Act. Delete any of it,
                  anytime.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Life Chapter */}
        {currentStep === 4 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              YOUR DAYS
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              What chapter of life are you in?
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              This shapes the rhythm I suggest — when I nudge you, and for
              what.
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {[
                "Student",
                "Early career",
                "Building a family",
                "Parenting young kids",
                "Empty nest",
                "Retired",
                "Caregiving",
                "Between chapters",
              ].map((chap) => (
                <button
                  key={chap}
                  type="button"
                  onClick={() => updateField("lifeChapter", chap)}
                  className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                    profile.lifeChapter === chap
                      ? "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9] shadow-xs"
                      : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                  }`}
                >
                  {chap}
                </button>
              ))}
            </div>

            <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
              Your daily rhythm
            </label>
            <div className="flex flex-wrap gap-2">
              {["Early riser", "Night owl", "Varies a lot"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => updateField("dailyRhythm", r)}
                  className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                    profile.dailyRhythm === r
                      ? "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9] shadow-xs"
                      : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Relationships & Family */}
        {currentStep === 5 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              YOUR PEOPLE
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              Who shares this journey with you?
            </h1>
            <div className="text-[11.3px] text-[#45613B] bg-[rgba(69,97,59,0.08)] rounded-[10px] p-3 my-2 leading-relaxed">
              <span className="font-extrabold">Why I ask:</span> so I can
              include the right names in a sankalp, or gently check in around
              family occasions.
            </div>

            <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mt-2 mb-1.5 block">
              Relationship status
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "Single",
                "In a relationship",
                "Married",
                "Separated / divorced",
                "Widowed",
                "Prefer not to say",
              ].map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => updateField("relationshipStatus", rel)}
                  className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                    rel === "Prefer not to say" ? "border-dashed" : ""
                  } ${
                    profile.relationshipStatus === rel
                      ? rel === "Prefer not to say"
                        ? "bg-[#6B5C4E] border-[#6B5C4E] text-[#FFFDF9]"
                        : "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9]"
                      : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>

            <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
              At home, you&apos;re usually with
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Living alone",
                "Parents",
                "Spouse / partner",
                "Children",
                "Joint family",
                "Roommates",
              ].map((home) => (
                <button
                  key={home}
                  type="button"
                  onClick={() => updateField("livingSituation", home)}
                  className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                    profile.livingSituation === home
                      ? "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9]"
                      : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                  }`}
                >
                  {home}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Career */}
        {currentStep === 6 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              YOUR WORK
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              And what fills your working hours?
            </h1>
            <div className="text-[11.3px] text-[#45613B] bg-[rgba(69,97,59,0.08)] rounded-[10px] p-3 my-2 leading-relaxed">
              <span className="font-extrabold">Why I ask:</span> so reminders
              land at a good moment — never mid-meeting.
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                  Field or profession
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software engineer, homemaker, teacher…"
                  value={profile.profession}
                  onChange={(e) => updateField("profession", e.target.value)}
                  className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs"
                />
              </div>

              <div>
                <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                  Work rhythm
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Fixed office hours",
                    "Shift work",
                    "Flexible / freelance",
                    "Studying",
                    "Not working right now",
                    "Prefer not to say",
                  ].map((wr) => (
                    <button
                      key={wr}
                      type="button"
                      onClick={() => updateField("workRhythm", wr)}
                      className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                        wr === "Prefer not to say" ? "border-dashed" : ""
                      } ${
                        profile.workRhythm === wr
                          ? wr === "Prefer not to say"
                            ? "bg-[#6B5C4E] border-[#6B5C4E] text-[#FFFDF9]"
                            : "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9]"
                          : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                      }`}
                    >
                      {wr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Practice */}
        {currentStep === 7 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              YOUR PRACTICE
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              Who does your heart turn to first?
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              Your Isht Devta shapes the mantras, pujas and stories I bring you.
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { name: "Shiva", icon: "🔱" },
                { name: "Vishnu", icon: "🪷" },
                { name: "Devi", icon: "🌺" },
                { name: "Ganesha", icon: "🐘" },
                { name: "Krishna", icon: "🪈" },
                { name: "Hanuman", icon: "🚩" },
                { name: "Still discovering", icon: "" },
              ].map((devta) => (
                <button
                  key={devta.name}
                  type="button"
                  onClick={() => updateField("ishtDevta", devta.name)}
                  className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold flex items-center gap-1.5 transition-all ${
                    profile.ishtDevta === devta.name
                      ? "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9] shadow-xs"
                      : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                  }`}
                >
                  {devta.icon && (
                    <span className="opacity-80">{devta.icon}</span>
                  )}
                  <span>{devta.name}</span>
                </button>
              ))}
            </div>

            <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
              How often does practice happen, currently?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "Daily puja",
                "A few times a week",
                "Occasionally",
                "Just beginning",
                "Returning, after time away",
              ].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => updateField("practiceFrequency", freq)}
                  className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                    profile.practiceFrequency === freq
                      ? "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9]"
                      : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Right Now */}
        {currentStep === 8 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              RIGHT NOW
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              How has your heart felt, most days lately?
            </h1>
            <div className="text-[11.3px] text-[#45613B] bg-[rgba(69,97,59,0.08)] rounded-[10px] p-3 my-2 leading-relaxed">
              <span className="font-extrabold">Why I ask:</span> only to soften
              how I speak with you — never a diagnosis, never shared.
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {[
                "Peaceful",
                "Hopeful",
                "Restless",
                "Searching",
                "Heavy",
                "Overwhelmed",
                "Grateful",
                "Prefer not to say",
              ].map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => updateField("innerSeason", mood)}
                  className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                    mood === "Prefer not to say" ? "border-dashed" : ""
                  } ${
                    profile.innerSeason === mood
                      ? mood === "Prefer not to say"
                        ? "bg-[#6B5C4E] border-[#6B5C4E] text-[#FFFDF9]"
                        : "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9]"
                      : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2 mb-1.5">
              <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E]">
                In your own words
              </label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 border-[1.5px] rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                  recording
                    ? "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9]"
                    : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    recording
                      ? "bg-[#FFFDF9] animate-pulse-ring"
                      : "bg-[#B4392B]"
                  }`}
                />
                <span>{micLabel}</span>
              </button>
            </div>

            <textarea
              placeholder="Whatever's true for you right now — a sentence is enough."
              value={profile.feelingText}
              onChange={(e) => updateField("feelingText", e.target.value)}
              className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] p-3.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] resize-none min-h-[76px] leading-relaxed shadow-xs"
            />

            {isHeavyMood && (
              <div className="mt-3 bg-[#EFCB86] rounded-[12px] p-3 text-[12px] text-[#362A22] leading-relaxed animate-fade-in shadow-xs">
                Thank you for trusting me with that. I&apos;ll go gently with you.
              </div>
            )}
          </div>
        )}

        {/* STEP 9: Seeking */}
        {currentStep === 9 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              SEEKING
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              What are you hoping I can help you find?
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              Up to three questions on your mind about guidance or peace — big
              or small.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-5.5 h-5.5 rounded-full bg-[#B4392B] text-[#FFFDF9] text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <input
                  type="text"
                  placeholder="e.g. How do I stay calm when work overwhelms me?"
                  value={profile.seekingQuestion1}
                  onChange={(e) =>
                    updateField("seekingQuestion1", e.target.value)
                  }
                  className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5.5 h-5.5 rounded-full bg-[#B4392B] text-[#FFFDF9] text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <input
                  type="text"
                  placeholder="e.g. What mantra helps with difficult decisions?"
                  value={profile.seekingQuestion2}
                  onChange={(e) =>
                    updateField("seekingQuestion2", e.target.value)
                  }
                  className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-5.5 h-5.5 rounded-full bg-[#B4392B] text-[#FFFDF9] text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <input
                  type="text"
                  placeholder="Optional"
                  value={profile.seekingQuestion3}
                  onChange={(e) =>
                    updateField("seekingQuestion3", e.target.value)
                  }
                  className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: What Lifts You */}
        {currentStep === 10 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              WHAT LIFTS YOU
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              What&apos;s been a source of joy or strength lately?
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              A person, a place, a small daily thing — whatever comes to mind.
            </p>

            <textarea
              placeholder="e.g. My mother's cooking, evenings with my dog, finishing a hard project…"
              value={profile.whatLiftsYou}
              onChange={(e) => updateField("whatLiftsYou", e.target.value)}
              className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] p-3.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] resize-none min-h-[120px] leading-relaxed shadow-xs"
            />
          </div>
        )}

        {/* STEP 11: What Weighs On You */}
        {currentStep === 11 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              WHAT WEIGHS ON YOU
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              And what&apos;s been harder, lately?
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              Only if you want to say. A word or a sentence is enough — no need
              to explain fully.
            </p>

            <textarea
              placeholder="Write only as much as feels right…"
              value={profile.whatWeighsOnYou}
              onChange={(e) => updateField("whatWeighsOnYou", e.target.value)}
              className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] p-3.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] resize-none min-h-[100px] leading-relaxed mb-3 shadow-xs"
            />

            <div className="text-[11.3px] text-[#7A4B26] bg-[rgba(217,164,65,0.16)] rounded-[10px] p-3 leading-relaxed shadow-xs">
              If this feels like more than a few words can hold, you don&apos;t
              have to write it here.{" "}
              <button
                type="button"
                onClick={() => setShowHelplineModal(true)}
                className="text-[#B4392B] font-bold underline cursor-pointer hover:opacity-80"
              >
                Find someone to talk to
              </button>{" "}
              instead.
            </div>
          </div>
        )}

        {/* STEP 12: Sanctuary */}
        {currentStep === 12 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              YOUR SANCTUARY
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              Where or when do you feel most at peace?
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-5">
              A time of day, a practice, or a quiet space.
            </p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                  Grounding time
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Early morning (Brahma Muhurta)",
                    "Sunset / Sandhya",
                    "Late night",
                    "Mid-day pause",
                  ].map((gt) => (
                    <button
                      key={gt}
                      type="button"
                      onClick={() => updateField("groundingTime", gt)}
                      className={`px-3.5 py-2 rounded-full border-[1.5px] text-[12.5px] font-semibold transition-all ${
                        profile.groundingTime === gt
                          ? "bg-[#B4392B] border-[#B4392B] text-[#FFFDF9]"
                          : "bg-[#FFFDF9] border-[rgba(54,42,34,0.13)] text-[#362A22]"
                      }`}
                    >
                      {gt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10.8px] font-bold tracking-wider uppercase text-[#6B5C4E] mb-1.5 block">
                  Meditation / quiet practice
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10 mins breath awareness, listening to stutis…"
                  value={profile.meditationPractice}
                  onChange={(e) =>
                    updateField("meditationPractice", e.target.value)
                  }
                  className="w-full border-[1.5px] border-[rgba(54,42,34,0.13)] bg-[#FFFDF9] rounded-[14px] px-3.5 py-2.5 text-[13.5px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 13: Summary / Ready */}
        {currentStep === 13 && (
          <div className="flex flex-col animate-fade-in my-auto py-1">
            <div className="font-serif text-[12px] text-[#B4392B] tracking-[0.13em] uppercase font-semibold mb-0.5">
              YOUR DEVABHUMI SANCTUARY
            </div>
            <h1 className="font-serif text-[20px] sm:text-[22px] font-normal leading-snug text-[#362A22] my-1">
              Thank you, {profile.name || "Seeker"}. We are ready.
            </h1>
            <p className="text-[12.6px] text-[#6B5C4E] leading-relaxed mb-4">
              Here is a summary of what will shape your Sakha AI companion and daily rhythm:
            </p>

            <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.13)] rounded-[18px] p-4 flex flex-col gap-2.5 text-[12.5px] mb-4 shadow-xs">
              <div className="flex justify-between py-1 border-b border-dashed border-[rgba(54,42,34,0.1)]">
                <span className="text-[#6B5C4E] font-medium">Name & Language</span>
                <span className="font-bold text-[#362A22]">{profile.name || "—"} ({profile.language})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-[rgba(54,42,34,0.1)]">
                <span className="text-[#6B5C4E] font-medium">Isht Devta</span>
                <span className="font-bold text-[#B4392B]">{profile.ishtDevta}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-[rgba(54,42,34,0.1)]">
                <span className="text-[#6B5C4E] font-medium">Life Chapter</span>
                <span className="font-bold text-[#362A22]">{profile.lifeChapter}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6B5C4E] font-medium">Grounding Time</span>
                <span className="font-bold text-[#362A22]">{profile.groundingTime}</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ULTRA-COMPACT BOTTOM CONTROL BAR */}
      <footer className="w-full px-4 sm:px-8 md:px-12 py-2 sm:py-2.5 border-t border-[rgba(54,42,34,0.08)] bg-white/30 backdrop-blur-xs flex items-center justify-between flex-shrink-0 z-20">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="text-[12px] font-bold text-[#6B5C4E] hover:text-[#362A22] transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNext}
            className="bg-[#B4392B] hover:bg-[#8E2C21] text-[#FFFDF9] px-6 sm:px-8 py-2 rounded-full font-bold text-[13px] shadow-xs active:scale-98 transition-all"
          >
            {currentStep === totalSteps ? "Enter Devabhumi →" : "Continue →"}
          </button>
        </div>
      </footer>

      {/* Mental Health Support Modal */}
      {showHelplineModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.13)] rounded-[24px] max-w-md w-full p-5 flex flex-col gap-3 shadow-2xl animate-fade-in">
            <h3 className="font-serif text-[18px] font-bold text-[#362A22]">
              Compassionate Support Helplines
            </h3>
            <p className="text-[12px] text-[#6B5C4E] leading-relaxed">
              If you are going through an intense time, please consider reaching out to trained professionals who are available to listen without judgment:
            </p>
            <div className="flex flex-col gap-2 text-[12.5px] bg-[#FBF3E6] p-3 rounded-[14px]">
              <div><span className="font-bold text-[#B4392B]">KIRAN (Govt. Support):</span> 1800-599-0019</div>
              <div><span className="font-bold text-[#B4392B]">Tele-MANAS:</span> 14416</div>
              <div><span className="font-bold text-[#B4392B]">Vandrevala Foundation:</span> +91 9999 666 555</div>
            </div>
            <button
              type="button"
              onClick={() => setShowHelplineModal(false)}
              className="bg-[#362A22] text-[#FFFDF9] py-2 rounded-[12px] font-bold text-xs mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
