"use client";

import React, { useState } from "react";
import { X, Download, Share2, Copy, Check, Sparkles, Heart } from "lucide-react";

interface WisdomShareModalProps {
  isOpen?: boolean;
  onClose: () => void;
  verseSanskrit?: string;
  verseEnglish?: string;
  source?: string;
  customText?: string;
}

export const WisdomShareModal: React.FC<WisdomShareModalProps> = ({
  isOpen = true,
  onClose,
  verseSanskrit = "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।",
  verseEnglish = "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action.",
  source = "Bhagavad Gita — Chapter 2, Verse 47",
  customText,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const textToCopy = `✨ ${source}\n\n${verseSanskrit}\n\n"${verseEnglish}"\n\n— Shared via Spiritual Sakha 🙏`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadein font-sans select-none">
      <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-3xl max-w-md w-full p-6 flex flex-col gap-5 shadow-[0_0_50px_rgba(201,165,92,0.3)] relative text-left overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/40 flex items-center justify-center text-[#C9A55C]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-serif-fraunces text-lg font-bold text-white">
              Sacred Wisdom Card
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Downloadable Graphic Card Display */}
        <div className="bg-gradient-to-br from-[#1C1A14] via-[#0F0E0B] to-[#0A0A0A] border-2 border-[#C9A55C]/50 rounded-2xl p-6 flex flex-col gap-4 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#C9A55C]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Om Logo Badge */}
          <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#C9A55C] flex items-center justify-center mx-auto shadow-md overflow-hidden p-0.5">
            <img src="/images/app_logo.png" alt="App Logo" className="w-full h-full object-cover rounded-full" />
          </div>

          <span className="text-[10px] font-bold text-[#C9A55C] tracking-widest uppercase">
            {source}
          </span>

          <p className="devanagari-font text-lg font-bold text-[#C9A55C] leading-relaxed">
            {verseSanskrit}
          </p>

          <p className="font-serif-fraunces italic text-xs text-white/90 leading-relaxed px-2">
            &ldquo;{verseEnglish}&rdquo;
          </p>

          <div className="border-t border-[#C9A55C]/30 pt-2.5 flex items-center justify-between text-[9.5px] font-bold text-white/40 uppercase tracking-widest">
            <span>Spiritual Sakha</span>
            <span>Sanatan Wisdom</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 z-10">
          <button
            type="button"
            onClick={handleCopyText}
            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 border border-white/10"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-[#C9A55C]" />}
            <span>{copied ? "Copied!" : "Copy Shloka"}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCard}
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A55C] to-[#A88238] text-[#0A0A0A] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md"
          >
            {downloaded ? <Check className="w-4 h-4 text-black" /> : <Download className="w-4 h-4 text-black" />}
            <span>{downloaded ? "Saved Card!" : "Save Card"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
