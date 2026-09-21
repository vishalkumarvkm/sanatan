"use client";

import React from "react";
import { UserProfile } from "@/types/onboarding";
import { SpiritualShortsReels } from "@/components/SpiritualShortsReels";

interface ShrinePageProps {
  profile?: UserProfile;
  onNavigateToChat?: (prompt?: string) => void;
}

export const ShrinePage: React.FC<ShrinePageProps> = ({ onNavigateToChat }) => {
  return (
    <div className="w-full h-[calc(100dvh-120px)] sm:h-[calc(100vh-90px)] bg-[#0A0A0A] text-[#FAFAFA] flex flex-col justify-center items-center relative select-none font-sans overflow-hidden">
      <SpiritualShortsReels onAskSakha={(prompt) => onNavigateToChat?.(prompt)} />
    </div>
  );
};

