"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile, initialProfile } from "@/types/onboarding";
import { SplashScreen } from "@/components/SplashScreen";
import { Onboarding } from "@/components/Onboarding";
import { HomePage as MySpacePage } from "@/components/HomePage";
import { SakhaShrine as SakhaChatPage } from "@/components/SakhaShrine";
import { GyanPage } from "@/components/GyanPage";
import { ShrinePage } from "@/components/ShrinePage";
import { ProfilePage } from "@/components/ProfilePage";
import { Navigation } from "@/components/Navigation";
import VoiceAssistantPanel from "@/components/VoiceAssistantPanel";
import { submitOnboardingData, fetchGeneratedPersona } from "@/lib/api";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import { GlobalMiniPlayer } from "@/components/GlobalMiniPlayer";

type ScreenTab =
  | "splash"
  | "onboarding"
  | "sakha"
  | "gyan"
  | "shrine"
  | "myspace"
  | "profile";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<ScreenTab>("splash");
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isOnboardingSubmittingRef = useRef(false);

  const handleTabChange = (tab: ScreenTab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem("spiritualsakha_active_tab", tab);
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("spiritualsakha_profile");
      const savedTab = localStorage.getItem("spiritualsakha_active_tab") as any;

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
      }

      if (
        savedTab &&
        ["splash", "onboarding", "sakha", "gyan", "shrine", "myspace", "profile"].includes(
          savedTab
        )
      ) {
        setActiveTab(savedTab);
      } else if (savedTab === "home") {
        setActiveTab("myspace");
      } else if (savedTab === "chat") {
        setActiveTab("sakha");
      } else {
        setActiveTab("splash");
      }
    } catch (e) {
      console.error("Failed to load saved state", e);
    } finally {
      setLoaded(true);
    }
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem("spiritualsakha_profile", JSON.stringify(newProfile));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  const handleOnboardingComplete = async (completedProfile: UserProfile) => {
    if (isOnboardingSubmittingRef.current) return;
    isOnboardingSubmittingRef.current = true;

    setChatInitialPrompt(undefined);
    saveProfile(completedProfile);
    handleTabChange("sakha");

    try {
      const res = await submitOnboardingData(completedProfile);
      if (res.success && res.user_id) {
        const fullProfileRes = await fetchGeneratedPersona(res.user_id);
        if (fullProfileRes.success) {
          const updated = { 
            ...completedProfile, 
            userId: res.user_id,
            persona: fullProfileRes.persona 
          };
          saveProfile(updated);
        }
      }
    } catch (err) {
      console.warn("Background onboarding sync exception:", err);
    } finally {
      isOnboardingSubmittingRef.current = false;
    }
  };

  const handleNavigateToChat = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    handleTabChange("sakha");
  };

  if (!loaded) {
    return (
      <div className="w-full h-screen bg-[#0A0A0A] flex items-center justify-center text-[#FAFAFA]">
        <div className="flex flex-col items-center gap-2">
          <span className="devanagari-font text-4xl text-[#C9A55C] animate-pulse">
            ॐ
          </span>
          <span className="font-serif-fraunces text-sm font-normal text-[rgba(250,250,250,0.6)]">
            Spiritual Sakha
          </span>
        </div>
      </div>
    );
  }

  const showNav =
    activeTab === "sakha" ||
    activeTab === "gyan" ||
    activeTab === "shrine" ||
    activeTab === "myspace" ||
    activeTab === "profile";

  return (
    <AudioPlayerProvider>
      <div className="min-h-screen w-full bg-[#0A0A0A] text-[#FAFAFA] flex flex-col font-sans relative selection:bg-[#C9A55C] selection:text-[#0A0A0A]">
        {/* Responsive Navigation: Top Header on Desktop, Bottom Bar on Mobile */}
        {showNav && (
          <Navigation
            activeTab={activeTab as any}
            onTabChange={(tab) => handleTabChange(tab)}
            profile={profile}
            onOpenVoice={() => setIsVoiceAssistantOpen(true)}
            onOpenProfile={() => handleTabChange("profile")}
          />
        )}

        {/* Main Responsive Canvas */}
        <main
          className={`flex-1 flex flex-col w-full relative ${
            activeTab === "onboarding" || activeTab === "splash" ? "h-[100dvh] max-h-[100dvh] overflow-hidden" : ""
          }`}
        >
          {activeTab === "splash" && (
            <SplashScreen onEnter={() => handleTabChange("onboarding")} />
          )}

          {activeTab === "onboarding" && (
            <div className="w-full max-w-xl mx-auto h-[100dvh] max-h-[100dvh] flex flex-col p-0 sm:py-6 sm:px-6 overflow-hidden">
              <Onboarding
                onComplete={handleOnboardingComplete}
                onSkip={() => {
                  setChatInitialPrompt(undefined);
                  handleTabChange("sakha");
                }}
              />
            </div>
          )}

          {activeTab === "sakha" && (
            <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col md:px-4 md:py-3">
              <SakhaChatPage
                profile={profile}
                initialPrompt={chatInitialPrompt}
                onPromptConsumed={() => setChatInitialPrompt(undefined)}
                onOpenVoice={() => setIsVoiceAssistantOpen(true)}
              />
            </div>
          )}

          {activeTab === "gyan" && (
            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col px-4 sm:px-6 lg:px-8">
              <GyanPage profile={profile} />
            </div>
          )}

          {activeTab === "shrine" && (
            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col px-4 sm:px-6 lg:px-8">
              <ShrinePage profile={profile} />
            </div>
          )}

          {(activeTab === "myspace" || activeTab === "profile") && (
            <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col px-4 sm:px-6 lg:px-8">
              <MySpacePage
                profile={profile}
                onNavigateToChat={handleNavigateToChat}
                onNavigateToShrine={() => handleTabChange("shrine")}
                onOpenVoice={() => setIsVoiceAssistantOpen(true)}
                onUpdateProfile={saveProfile}
                onResetOnboarding={() => {
                  isOnboardingSubmittingRef.current = false;
                  setChatInitialPrompt(undefined);
                  handleTabChange("onboarding");
                }}
                initialSubTab={activeTab === "profile" ? "profile" : "daily"}
              />
            </div>
          )}
        </main>

        {/* Global Mini Player when audio is active across non-Shrine tabs */}
        <GlobalMiniPlayer currentTab={activeTab} />

        {/* Global Voice Assistant Overlay */}
        <VoiceAssistantPanel
          isOpen={isVoiceAssistantOpen}
          onClose={() => setIsVoiceAssistantOpen(false)}
          onSendQuery={(query) => handleNavigateToChat(query)}
          profile={profile}
        />
      </div>
    </AudioPlayerProvider>
  );
}
