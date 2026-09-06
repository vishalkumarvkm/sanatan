"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/onboarding";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  onSkip?: (profile?: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [language, setLanguage] = useState("Hindi");
  const [lifeChapter, setLifeChapter] = useState("Student");
  const [profession, setProfession] = useState("");
  const [ishtDevta, setIshtDevta] = useState("Shiva");
  const [innerSeason, setInnerSeason] = useState("Hopeful");
  const [seeking, setSeeking] = useState("Peace of mind");
  const [voiceMode, setVoiceMode] = useState("Voice & Text");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languages = ["Hindi", "Tamil", "Telugu", "Bengali", "English"];
  const lifeChapters = [
    "Student",
    "Early career",
    "Building a family",
    "Parenting",
    "Retired",
    "Between chapters",
  ];
  const deities = [
    "Shiva",
    "Vishnu",
    "Devi",
    "Ganesha",
    "Krishna",
    "Hanuman",
    "Still discovering",
  ];
  const innerFeelings = [
    "Peaceful",
    "Hopeful",
    "Restless",
    "Searching",
    "Heavy",
    "Grateful",
    "Prefer not to say",
  ];
  const seekingOptions = ["Peace of mind", "Clarity", "Strength", "Healing"];

  const getRashiFromDOB = (dobString: string): string => {
    if (!dobString) return "Karka (Cancer)";
    const d = new Date(dobString);
    if (isNaN(d.getTime())) return "Karka (Cancer)";
    const month = d.getMonth() + 1;
    const day = d.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Mesha (Aries)";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Vrishabha (Taurus)";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Mithuna (Gemini)";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Karka (Cancer)";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Simha (Leo)";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Kanya (Virgo)";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Tula (Libra)";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Vrishchika (Scorpio)";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Dhanu (Sagittarius)";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Makara (Capricorn)";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Kumbha (Aquarius)";
    return "Meena (Pisces)";
  };

  const getAgeFromDOB = (dobString: string): string => {
    if (!dobString) return "26";
    const d = new Date(dobString);
    if (isNaN(d.getTime())) return "26";
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }
    return age > 0 ? String(age) : "26";
  };

  const buildProfile = (): UserProfile => {
    const calculatedRashi = getRashiFromDOB(dateOfBirth);
    const calculatedAge = getAgeFromDOB(dateOfBirth);
    return {
      name: name.trim() || "Priya",
      language,
      dateOfBirth: dateOfBirth || undefined,
      age: calculatedAge,
      email: "",
      gender: "Prefer not to say",
      genderCustom: "",
      lifeChapter,
      dailyRhythm: "Morning",
      relationshipStatus: "Single",
      livingSituation: "Family",
      profession: profession.trim() || "Software Engineer",
      workRhythm: "Flexible hours",
      ishtDevta,
      practiceFrequency: "A few times a week",
      innerSeason,
      feelingText: innerSeason,
      seekingQuestion1: seeking,
      seekingQuestion2: "",
      seekingQuestion3: "",
      whatLiftsYou: "Daily prayers & reflection",
      whatWeighsOnYou: "Daily routine stress",
      meditationPractice: "Sometimes",
      groundingTime: "Sunrise",
      completedOnboarding: true,
      phone: "+91 98765 43210",
      faithLevel: "Devoted",
      tradition: "Sanatan Dharma",
      deities: [ishtDevta.toLowerCase()],
      rashi: calculatedRashi,
    };
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (isSubmitting) return;
      setIsSubmitting(true);
      onComplete(buildProfile());
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (onSkip) {
      onSkip(buildProfile());
    } else {
      onComplete(buildProfile());
    }
  };

  return (
    <div className="w-full h-full max-h-[100dvh] bg-[#0A0A0A] text-[#FAFAFA] flex flex-col justify-between relative overflow-hidden select-none">
      {/* Top Bar with Progress */}
      <div className="pt-2 sm:pt-6 px-3.5 sm:px-6 pb-1 sm:pb-2 flex flex-col items-center gap-1.5 sm:gap-3 relative shrink-0">
        <button
          onClick={handleSkip}
          disabled={isSubmitting}
          className="absolute top-2 sm:top-6 right-3.5 sm:right-6 text-[11px] sm:text-xs font-semibold text-[#C9A55C] hover:opacity-80 tracking-wide cursor-pointer transition-opacity z-10 disabled:opacity-50"
        >
          Skip
        </button>
        <div className="w-full h-[2px] bg-[rgba(250,250,250,0.07)] rounded-full overflow-hidden mt-3 sm:mt-6">
          <div
            className="h-full bg-[#C9A55C] transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <span className="text-[9.5px] sm:text-[11px] font-semibold text-[rgba(250,250,250,0.3)] tracking-wider uppercase">
          step {step} of {totalSteps}
        </span>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 px-3.5 sm:px-8 py-1.5 sm:py-5 flex flex-col justify-center overflow-hidden">
        {step === 1 && (
          <div className="flex flex-col flex-1 justify-center animate-fadein">
            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[rgba(201,165,92,0.12)] flex items-center justify-center mb-2 sm:mb-5 shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#C9A55C" strokeWidth="1.6" />
                <path
                  d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
                  stroke="#C9A55C"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="font-serif-fraunces text-[17.5px] sm:text-2xl font-normal text-[#FAFAFA] mb-1 sm:mb-1.5 leading-tight">
              What should we call you?
            </h2>
            <p className="text-[11px] sm:text-[13.5px] text-[rgba(250,250,250,0.6)] leading-snug sm:leading-relaxed mb-2 sm:mb-5 font-normal">
              And which language feels most like home.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2.5 sm:mb-5">
              <div>
                <label className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-wider uppercase text-[rgba(250,250,250,0.3)] mb-1 sm:mb-2 block">
                  your name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full bg-[#141414] border border-[rgba(250,250,250,0.07)] focus:border-[#C9A55C] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3.5 text-xs sm:text-[15px] text-[#FAFAFA] placeholder:text-[rgba(250,250,250,0.3)] outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <label className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-wider uppercase text-[rgba(250,250,250,0.3)] block">
                    date of birth
                  </label>
                  {dateOfBirth && (
                    <span className="text-[9px] sm:text-[10.5px] text-[#C9A55C] font-medium tracking-wide">
                      {getRashiFromDOB(dateOfBirth)}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-[#141414] border border-[rgba(250,250,250,0.07)] focus:border-[#C9A55C] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3.5 text-xs sm:text-[15px] text-[#FAFAFA] placeholder:text-[rgba(250,250,250,0.3)] outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>

            <label className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-wider uppercase text-[rgba(250,250,250,0.3)] mb-1 sm:mb-2.5 block">
              language
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium cursor-pointer transition-all border ${
                    language === lang
                      ? "bg-[#C9A55C] border-[#C9A55C] text-[#0A0A0A] font-semibold"
                      : "bg-transparent border-[rgba(250,250,250,0.07)] text-[rgba(250,250,250,0.6)] hover:border-[rgba(201,165,92,0.4)]"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col flex-1 justify-center animate-fadein">
            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[rgba(201,165,92,0.12)] flex items-center justify-center mb-2 sm:mb-5 shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z"
                  stroke="#C9A55C"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
            <h2 className="font-serif-fraunces text-[17.5px] sm:text-2xl font-normal text-[#FAFAFA] mb-1 sm:mb-1.5 leading-tight">
              Where are you in life right now?
            </h2>
            <p className="text-[11px] sm:text-[13.5px] text-[rgba(250,250,250,0.6)] leading-snug sm:leading-relaxed mb-2 sm:mb-5 font-normal">
              This helps Sakha understand the kind of guidance that fits.
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-6">
              {lifeChapters.map((chapter) => (
                <button
                  key={chapter}
                  type="button"
                  onClick={() => setLifeChapter(chapter)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-medium cursor-pointer transition-all border ${
                    lifeChapter === chapter
                      ? "bg-[#C9A55C] border-[#C9A55C] text-[#0A0A0A] font-semibold"
                      : "bg-transparent border-[rgba(250,250,250,0.07)] text-[rgba(250,250,250,0.6)] hover:border-[rgba(201,165,92,0.4)]"
                  }`}
                >
                  {chapter}
                </button>
              ))}
            </div>

            <label className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-wider uppercase text-[rgba(250,250,250,0.3)] mb-1 sm:mb-2">
              what fills your working hours?
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Software engineer, teacher, homemaker…"
              className="w-full bg-[#141414] border border-[rgba(250,250,250,0.07)] focus:border-[#C9A55C] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-3.5 text-xs sm:text-[15px] text-[#FAFAFA] placeholder:text-[rgba(250,250,250,0.3)] outline-none transition-colors"
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col flex-1 justify-center animate-fadein">
            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[rgba(201,165,92,0.12)] flex items-center justify-center mb-2 sm:mb-5 shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="#C9A55C"
                  strokeWidth="1.6"
                />
              </svg>
            </div>
            <h2 className="font-serif-fraunces text-[17.5px] sm:text-2xl font-normal text-[#FAFAFA] mb-1 sm:mb-1.5 leading-tight">
              Who does your heart turn to?
            </h2>
            <p className="text-[11px] sm:text-[13.5px] text-[rgba(250,250,250,0.6)] leading-snug sm:leading-relaxed mb-2.5 sm:mb-6 font-normal">
              Your Isht Devta shapes the mantras, stories and guidance Sakha brings you.
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
              {deities.map((deity) => {
                const isGhost = deity === "Still discovering";
                return (
                  <button
                    key={deity}
                    type="button"
                    onClick={() => setIshtDevta(deity)}
                    className={`px-2.5 sm:px-4 py-1 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-medium cursor-pointer transition-all border ${
                      ishtDevta === deity
                        ? "bg-[#C9A55C] border-[#C9A55C] text-[#0A0A0A] font-semibold"
                        : isGhost
                        ? "border-dashed border-[rgba(250,250,250,0.2)] text-[rgba(250,250,250,0.4)]"
                        : "bg-transparent border-[rgba(250,250,250,0.07)] text-[rgba(250,250,250,0.6)] hover:border-[rgba(201,165,92,0.4)]"
                    }`}
                  >
                    {deity}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col flex-1 justify-center animate-fadein">
            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[rgba(201,165,92,0.12)] flex items-center justify-center mb-2 sm:mb-5 shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#C9A55C" strokeWidth="1.6" />
                <path
                  d="M12 8v4l3 2"
                  stroke="#C9A55C"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="font-serif-fraunces text-[17.5px] sm:text-2xl font-normal text-[#FAFAFA] mb-1 sm:mb-1.5 leading-tight">
              How has your inner world felt lately?
            </h2>
            <p className="text-[11px] sm:text-[13.5px] text-[rgba(250,250,250,0.6)] leading-snug sm:leading-relaxed mb-2 sm:mb-5 font-normal">
              Only to soften how Sakha speaks with you. Never analysed clinically, never shared.
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-5">
              {innerFeelings.map((feeling) => (
                <button
                  key={feeling}
                  type="button"
                  onClick={() => setInnerSeason(feeling)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium cursor-pointer transition-all border ${
                    innerSeason === feeling
                      ? "bg-[#C9A55C] border-[#C9A55C] text-[#0A0A0A] font-semibold"
                      : "bg-transparent border-[rgba(250,250,250,0.07)] text-[rgba(250,250,250,0.6)] hover:border-[rgba(201,165,92,0.4)]"
                  }`}
                >
                  {feeling}
                </button>
              ))}
            </div>

            <label className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-wider uppercase text-[rgba(250,250,250,0.3)] mb-1 sm:mb-2">
              what are you seeking most right now?
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {seekingOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSeeking(opt)}
                  className={`px-2.5 sm:px-4 py-1 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium cursor-pointer transition-all border ${
                    seeking === opt
                      ? "bg-[#C9A55C] border-[#C9A55C] text-[#0A0A0A] font-semibold"
                      : "bg-transparent border-[rgba(250,250,250,0.07)] text-[rgba(250,250,250,0.6)] hover:border-[rgba(201,165,92,0.4)]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col flex-1 justify-center animate-fadein">
            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[rgba(201,165,92,0.12)] flex items-center justify-center mb-2 sm:mb-5 shrink-0">
              <svg className="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z"
                  stroke="#C9A55C"
                  strokeWidth="1.6"
                />
                <path
                  d="M19 11v1a7 7 0 01-14 0v-1M12 19v3"
                  stroke="#C9A55C"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="font-serif-fraunces text-[17.5px] sm:text-2xl font-normal text-[#FAFAFA] mb-1 sm:mb-1.5 leading-tight">
              Speak, or type. Your choice.
            </h2>
            <p className="text-[11px] sm:text-[13.5px] text-[rgba(250,250,250,0.6)] leading-snug sm:leading-relaxed mb-2.5 sm:mb-6 font-normal">
              Sakha listens by voice too — ideal for hands-free moments during prayer or meditation. Recordings aren&apos;t stored.
            </p>

            <div className="space-y-2 sm:space-y-3">
              {[
                {
                  id: "Voice & Text",
                  title: "Voice & Text (Recommended)",
                  desc: "Ask questions naturally hands-free with real-time sacred dialogue",
                },
                {
                  id: "Text mostly",
                  title: "Text mostly",
                  desc: "Quiet contemplative reading and reflective typing",
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setVoiceMode(m.id)}
                  className={`p-2.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                    voiceMode === m.id
                      ? "bg-[#141414] border-[#C9A55C]"
                      : "bg-[#141414]/50 border-[rgba(250,250,250,0.07)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <span className="text-xs sm:text-sm font-semibold text-[#FAFAFA]">
                      {m.title}
                    </span>
                    <div
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center ${
                        voiceMode === m.id
                          ? "border-[#C9A55C] bg-[#C9A55C]"
                          : "border-[rgba(250,250,250,0.3)]"
                      }`}
                    >
                      {voiceMode === m.id && (
                        <div className="w-1.5 h-1.5 bg-[#0A0A0A] rounded-full" />
                      )}
                    </div>
                  </div>
                  <p className="text-[10.5px] sm:text-xs text-[rgba(250,250,250,0.5)] leading-snug sm:leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav Actions */}
      <div className="shrink-0 px-3.5 sm:px-8 pb-3 sm:pb-8 pt-1.5 sm:pt-4 flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          style={{ visibility: step === 1 ? "hidden" : "visible" }}
          className="bg-transparent text-[rgba(250,250,250,0.4)] hover:text-[#FAFAFA] font-semibold text-xs sm:text-sm py-2.5 sm:py-3.5 px-2.5 sm:px-3 cursor-pointer transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="flex-1 bg-[#C9A55C] hover:bg-[#A8904D] text-[#0A0A0A] font-bold text-xs sm:text-sm py-2.5 sm:py-3.5 px-4 sm:px-5 rounded-lg sm:rounded-xl cursor-pointer tracking-tight transition-all active:scale-[0.98] text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === totalSteps
            ? isSubmitting
              ? "Entering…"
              : "Enter Spiritual Sakha"
            : "Continue"}
        </button>
      </div>
    </div>
  );
};
