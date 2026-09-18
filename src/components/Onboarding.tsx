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
  const [currentStep, setCurrentStep] = useState(0); // 0 to 3
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState("");

  // Step 1 State: Welcome Seeker
  const [name, setName] = useState("Priya");
  const [language, setLanguage] = useState("Hindi");

  // Step 2 State: Birth Details
  const [dateOfBirth, setDateOfBirth] = useState("2000-01-01");
  const [timeOfBirth, setTimeOfBirth] = useState("08:30 AM");
  const [placeOfBirth, setPlaceOfBirth] = useState("Varanasi, India");

  // Step 3 State: Isht Devta
  const [ishtDevta, setIshtDevta] = useState("Shiva");

  // Step 4 State: Inner Season & Advice
  const [innerSeason, setInnerSeason] = useState("Seeking Clarity");
  const [seekingAdvice, setSeekingAdvice] = useState("Inner peace and divine guidance");

  const deities = [
    { id: "Shiva", name: "Lord Shiva", symbol: "🔱", mantra: "Om Namah Shivaya" },
    { id: "Krishna", name: "Lord Krishna", symbol: "🪈", mantra: "Hare Krishna" },
    { id: "Hanuman", name: "Lord Hanuman", symbol: "🚩", mantra: "Jai Bajrangbali" },
    { id: "Durga", name: "Maa Durga", symbol: "🌸", mantra: "Jai Mata Di" },
    { id: "Ganesha", name: "Lord Ganesha", symbol: "🐘", mantra: "Om Gam Ganapataye" },
    { id: "Rama", name: "Lord Rama", symbol: "🏹", mantra: "Jai Shree Ram" },
    { id: "Lakshmi", name: "Maa Lakshmi", symbol: "🪷", mantra: "Om Shreem Mahalakshmiye" },
  ];

  const innerSeasons = [
    "Peaceful & Grounded",
    "Seeking Clarity",
    "Navigating Stress & Anxiety",
    "Deep Devotion & Love",
    "Restless Mind",
  ];

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

  const buildProfile = (): UserProfile => {
    const rashi = getRashiFromDOB(dateOfBirth);
    return {
      name: name.trim() || "Priya",
      language,
      dateOfBirth: dateOfBirth || "2000-01-01",
      age: "26",
      email: "",
      gender: "Prefer not to say",
      genderCustom: "",
      lifeChapter: "Student",
      dailyRhythm: "Morning",
      relationshipStatus: "Single",
      livingSituation: "Family",
      profession: "Software Engineer",
      workRhythm: "Flexible hours",
      ishtDevta,
      practiceFrequency: "A few times a week",
      innerSeason,
      feelingText: innerSeason,
      seekingQuestion1: seekingAdvice,
      seekingQuestion2: "",
      seekingQuestion3: "",
      whatLiftsYou: "Daily prayers & reflection",
      whatWeighsOnYou: "Daily routine stress",
      meditationPractice: "Sometimes",
      groundingTime: "Sunrise",
      completedOnboarding: true,
      phone: phoneVerified || "+91 98765 43210",
      faithLevel: "Devoted",
      tradition: "Sanatan Dharma",
      deities: [ishtDevta.toLowerCase()],
      rashi,
    };
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (isSubmitting) return;
      setIsSubmitting(true);
      onComplete(buildProfile());
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
    <div className="w-full h-full max-h-[100dvh] bg-[#0A0A0A] text-[#FAFAFA] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Top Header Bar */}
      <div className="pt-3 px-4 pb-2 flex items-center justify-between gap-3 relative shrink-0 border-b border-[rgba(250,250,250,0.06)]">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="text-xs font-semibold text-[rgba(250,250,250,0.6)] hover:text-[#FAFAFA] flex items-center gap-1 cursor-pointer"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-semibold text-[rgba(250,250,250,0.5)] hover:text-[#C9A55C] cursor-pointer"
          >
            Skip
          </button>
        )}

        {/* Progress Bar */}
        <div className="flex-1 max-w-xs mx-2 flex flex-col gap-1 items-center">
          <div className="w-full h-1.5 bg-[rgba(250,250,250,0.1)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9A55C] transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        <span className="text-xs font-bold text-[#C9A55C]">
          {currentStep + 1}/4
        </span>
      </div>

      {/* Step Body Content */}
      <div className="flex-1 px-4 sm:px-8 py-4 overflow-y-auto no-scrollbar max-w-md mx-auto w-full flex flex-col justify-center">
        {currentStep === 0 && (
          <div className="flex flex-col gap-4 animate-fadein">
            <div>
              <h2 className="font-serif-fraunces text-2xl font-bold text-[#FAFAFA]">
                Welcome, Seeker
              </h2>
              <p className="text-xs text-[rgba(250,250,250,0.6)] mt-1">
                Let us personalize your spiritual journey.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                Your Preferred Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya"
                className="w-full bg-[#141414] border border-[rgba(250,250,250,0.1)] focus:border-[#C9A55C] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[rgba(250,250,250,0.4)]">
                Preferred Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("Hindi")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    language === "Hindi"
                      ? "bg-[#C9A55C] text-[#0A0A0A] border-[#C9A55C]"
                      : "bg-[#141414] text-[#FAFAFA] border-[rgba(250,250,250,0.08)]"
                  }`}
                >
                  Hindi (हिंदी)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("English")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    language === "English"
                      ? "bg-[#C9A55C] text-[#0A0A0A] border-[#C9A55C]"
                      : "bg-[#141414] text-[#FAFAFA] border-[rgba(250,250,250,0.08)]"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-2 bg-[#141414] border border-[#C9A55C]/40 hover:border-[#C9A55C] text-[#C9A55C] py-3 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span>📱</span>
              <span>
                {phoneVerified
                  ? `Phone Verified (${phoneVerified})`
                  : "Verify Phone via OTP (Optional)"}
              </span>
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col gap-4 animate-fadein">
            <div>
              <h2 className="font-serif-fraunces text-2xl font-bold text-[#FAFAFA]">
                Sacred Birth Details
              </h2>
              <p className="text-xs text-[rgba(250,250,250,0.6)] mt-1">
                Used for Vedic Astro Insights, Panchang & Personal Nakshatra.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between items-center">
                <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                  Date of Birth (YYYY-MM-DD)
                </label>
                <span className="text-[10px] text-[#C9A55C] font-semibold bg-[#C9A55C]/15 border border-[#C9A55C]/30 px-2 py-0.5 rounded-full">
                  {getRashiFromDOB(dateOfBirth)}
                </span>
              </div>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-[#141414] border border-[rgba(250,250,250,0.1)] focus:border-[#C9A55C] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] outline-none [color-scheme:dark]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                Time of Birth (e.g. 08:30 AM)
              </label>
              <input
                type="text"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                placeholder="08:30 AM"
                className="w-full bg-[#141414] border border-[rgba(250,250,250,0.1)] focus:border-[#C9A55C] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                Place of Birth (City / Region)
              </label>
              <input
                type="text"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="Varanasi, India"
                className="w-full bg-[#141414] border border-[rgba(250,250,250,0.1)] focus:border-[#C9A55C] rounded-xl px-4 py-3 text-sm text-[#FAFAFA] outline-none"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="flex flex-col gap-3 animate-fadein">
            <div>
              <h2 className="font-serif-fraunces text-2xl font-bold text-[#FAFAFA]">
                Select Your Isht Devta
              </h2>
              <p className="text-xs text-[rgba(250,250,250,0.6)] mt-1">
                Choose the divine form closest to your heart.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-2">
              {deities.map((d) => {
                const isSelected = ishtDevta === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setIshtDevta(d.id)}
                    className={`p-3 rounded-2xl flex flex-col items-center text-center gap-1 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-[#C9A55C]/15 border-[#C9A55C] shadow-[0_0_15px_rgba(201,165,92,0.2)]"
                        : "bg-[#141414] border-[rgba(250,250,250,0.07)] hover:border-[rgba(250,250,250,0.2)]"
                    }`}
                  >
                    <span className="text-2xl">{d.symbol}</span>
                    <span className="text-xs font-bold text-[#FAFAFA]">
                      {d.name}
                    </span>
                    <span className="text-[9.5px] text-[#C9A55C] font-mono">
                      {d.mantra}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="flex flex-col gap-4 animate-fadein">
            <div>
              <h2 className="font-serif-fraunces text-2xl font-bold text-[#FAFAFA]">
                Your Current Inner Season
              </h2>
              <p className="text-xs text-[rgba(250,250,250,0.6)] mt-1">
                What feeling or state brings you to Spiritual Sakha today?
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {innerSeasons.map((season) => {
                const isSelected = innerSeason === season;
                return (
                  <button
                    key={season}
                    type="button"
                    onClick={() => setInnerSeason(season)}
                    className={`p-3 rounded-xl flex items-center gap-3 text-xs font-medium cursor-pointer transition-all border text-left ${
                      isSelected
                        ? "bg-[#C9A55C]/15 border-[#C9A55C] text-[#FAFAFA]"
                        : "bg-[#141414] border-[rgba(250,250,250,0.07)] text-[rgba(250,250,250,0.7)]"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-[#C9A55C] bg-[#C9A55C]"
                          : "border-[rgba(250,250,250,0.3)]"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
                      )}
                    </div>
                    <span>{season}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                What advice or direction are you seeking right now?
              </label>
              <textarea
                rows={2}
                value={seekingAdvice}
                onChange={(e) => setSeekingAdvice(e.target.value)}
                placeholder="Inner peace and divine guidance"
                className="w-full bg-[#141414] border border-[rgba(250,250,250,0.1)] focus:border-[#C9A55C] rounded-xl p-3 text-xs text-[#FAFAFA] outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 border-t border-[rgba(250,250,250,0.06)] bg-[#0A0A0A] shrink-0 max-w-md mx-auto w-full">
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="w-full bg-[#C9A55C] hover:bg-[#A8904D] text-[#0A0A0A] py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
        >
          {currentStep === 3
            ? isSubmitting
              ? "Entering Divine Space…"
              : "Complete & Begin Journey"
            : "Continue"}
        </button>
      </div>

      {/* Optional Phone OTP Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadein">
          <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-2xl max-w-sm w-full p-5 flex flex-col gap-3 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[rgba(250,250,250,0.07)] pb-2.5">
              <span className="font-serif-fraunces text-base font-bold text-[#C9A55C]">
                Verify Mobile Phone
              </span>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="text-xs text-[rgba(250,250,250,0.4)]"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[rgba(250,250,250,0.6)]">
              Enter mobile number for OTP verification.
            </p>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              defaultValue="+91 98765 43210"
              className="bg-[#0A0A0A] border border-[rgba(250,250,250,0.1)] rounded-xl p-2.5 text-xs text-[#FAFAFA]"
            />
            <button
              type="button"
              onClick={() => {
                setPhoneVerified("+91 98765 43210");
                setIsAuthModalOpen(false);
              }}
              className="bg-[#C9A55C] text-[#0A0A0A] py-2.5 rounded-xl text-xs font-bold hover:bg-[#A8904D]"
            >
              Verify OTP (Demo Code: 123456)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

