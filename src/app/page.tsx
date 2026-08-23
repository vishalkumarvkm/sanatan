"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, initialProfile } from "@/types/onboarding";
import { Onboarding } from "@/components/Onboarding";
import { HomePage } from "@/components/HomePage";
import { SakhaShrine as SakhaChatPage } from "@/components/SakhaShrine";
import { ShrinePage } from "@/components/ShrinePage";
import { ProfilePage } from "@/components/ProfilePage";
import { LoginPage } from "@/components/LoginPage";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";
import VoiceAssistantPanel from "@/components/VoiceAssistantPanel";
import { submitOnboardingData, fetchGeneratedPersona } from "@/lib/api";

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "shrine" | "profile" | "onboarding" | "login">(() => {
    if (typeof window !== "undefined") {
      try {
        const savedTab = localStorage.getItem("spiritualsakha_active_tab");
        if (savedTab && ["home", "chat", "shrine", "profile", "onboarding", "login"].includes(savedTab)) {
          return savedTab as any;
        }
      } catch (e) {}
    }
    return "login";
  });
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleTabChange = (tab: "home" | "chat" | "shrine" | "profile" | "onboarding" | "login") => {
    setActiveTab(tab);
    try {
      localStorage.setItem("spiritualsakha_active_tab", tab);
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("spiritualsakha_profile");
      const savedTab = localStorage.getItem("spiritualsakha_active_tab") as any;
      let isCompleted = false;

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        isCompleted = Boolean(parsed.completedOnboarding);
      }

      if (savedTab && ["home", "chat", "shrine", "profile", "onboarding", "login"].includes(savedTab)) {
        setActiveTab(savedTab);
      } else if (isCompleted) {
        setActiveTab("home");
      } else {
        setActiveTab("login");
      }
    } catch (e) {
      console.error("Failed to load profile", e);
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
    saveProfile(completedProfile);
    handleTabChange("home");

    try {
      const res = await submitOnboardingData(completedProfile);
      if (res.success && res.user_id) {
        console.log("Saved user onboarding ID:", res.user_id);
        const personaRes = await fetchGeneratedPersona(res.user_id);
        if (personaRes.success && personaRes.persona) {
          const updatedWithPersona = { ...completedProfile, persona: personaRes.persona };
          saveProfile(updatedWithPersona);
          console.log("Generated Persona successfully attached to user profile:", personaRes.persona);
        }
      }
    } catch (err) {
      console.warn("Background onboarding sync caught exception:", err);
    }
  };

  const handleOnboardingSkip = async (currentProfile?: UserProfile) => {
    const skippedProfile = { ...(currentProfile || profile), completedOnboarding: true };
    saveProfile(skippedProfile);
    handleTabChange("home");

    try {
      const res = await submitOnboardingData(skippedProfile);
      if (res.success && res.user_id) {
        console.log("Saved user onboarding ID on skip:", res.user_id);
        const personaRes = await fetchGeneratedPersona(res.user_id);
        if (personaRes.success && personaRes.persona) {
          const updatedWithPersona = { ...skippedProfile, persona: personaRes.persona };
          saveProfile(updatedWithPersona);
          console.log("Generated Persona successfully attached on skip:", personaRes.persona);
        }
      }
    } catch (err) {
      console.warn("Background onboarding skip sync caught exception:", err);
    }
  };

  const handleResetOnboarding = () => {
    const reset = { ...initialProfile, completedOnboarding: false };
    setProfile(reset);
    try {
      localStorage.removeItem("spiritualsakha_profile");
      localStorage.removeItem("spiritualsakha_chat_messages");
    } catch (e) {
      console.error("Failed to clear profile", e);
    }
    handleTabChange("onboarding");
  };

  const handleNavigateToChat = (prompt?: string) => {
    setChatInitialPrompt(prompt);
    handleTabChange("chat");
  };

  const handleLoginSuccess = (phone: string) => {
    const updated = { ...profile, phone, completedOnboarding: true };
    saveProfile(updated);
    handleTabChange("home");
  };

  const handleLogout = () => {
    const loggedOutProfile = { ...profile, phone: "", completedOnboarding: false };
    saveProfile(loggedOutProfile);
    try {
      localStorage.removeItem("spiritualsakha_jwt_access");
      localStorage.removeItem("spiritualsakha_jwt_refresh");
      localStorage.removeItem("spiritualsakha_active_tab");
      localStorage.removeItem("spiritualsakha_chat_messages");
    } catch (e) {
      console.error("Failed to clear auth storage", e);
    }
    handleTabChange("login");
  };

  if (!loaded) {
    return (
      <div className="w-full h-screen bg-[#EDE7DC] flex items-center justify-center text-[#362A22]">
        <div className="flex flex-col items-center gap-2">
          <span className="devanagari-font text-3xl text-[#B4392B] animate-pulse">ॐ</span>
          <span className="font-serif text-sm font-bold">Loading SpiritualSakha...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#EDE7DC] text-[#362A22] relative no-scrollbar">
      
      {/* Navigation Shell */}
      {activeTab !== "login" && activeTab !== "onboarding" && (
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => handleTabChange(tab)}
          profile={profile}
          onOpenAuth={() => handleTabChange("login")}
          onLogout={handleLogout}
          onOpenVoice={() => setIsVoiceAssistantOpen(true)}
        />
      )}

      {/* Global Voice Assistant Panel */}
      <VoiceAssistantPanel
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        profile={profile}
      />

      {/* Auth Modal (Fallback) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Main Active Page Views */}
      {activeTab === "login" && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onExploreGuest={() => handleTabChange("onboarding")}
        />
      )}

      {activeTab === "onboarding" && (
        <Onboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {activeTab === "home" && (
        <div className="pt-13 pb-16 md:pb-0">
          <HomePage
            profile={profile}
            onNavigateToChat={handleNavigateToChat}
            onNavigateToShrine={() => handleTabChange("shrine")}
            onOpenVoice={() => setIsVoiceAssistantOpen(true)}
          />
        </div>
      )}

      {activeTab === "chat" && (
        <SakhaChatPage
          profile={profile}
          onResetOnboarding={handleResetOnboarding}
          initialPrompt={chatInitialPrompt}
        />
      )}

      {activeTab === "shrine" && (
        <div className="pt-13 h-screen">
          <ShrinePage profile={profile} />
        </div>
      )}

      {activeTab === "profile" && (
        <div className="pt-13 pb-16 md:pb-0">
          <ProfilePage
            profile={profile}
            onUpdateProfile={saveProfile}
            onResetOnboarding={handleResetOnboarding}
            onOpenAuth={() => setActiveTab("login")}
          />
        </div>
      )}
    </div>
  );
}
