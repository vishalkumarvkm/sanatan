"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/types/onboarding";
import { generateSakhaResponse } from "@/lib/gemini";
import { Mic, Send, Sparkles } from "lucide-react";

interface SakhaShrineProps {
  profile: UserProfile;
  onResetOnboarding?: () => void;
  onOpenVoice?: () => void;
  initialPrompt?: string;
  onPromptConsumed?: () => void;
}

interface Message {
  id: string;
  sender: "sakha" | "user";
  text: string;
  timestamp: string;
}

export const SakhaShrine: React.FC<SakhaShrineProps> = ({
  profile,
  onOpenVoice,
  initialPrompt,
  onPromptConsumed,
}) => {
  const userName = profile.name ? profile.name.trim() : "vishal Kumar";
  const ishtDevta = profile.ishtDevta || "Lord Shiva";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "sakha",
      text: `Hari Om, ${userName} 🙏\n\nI am your Spiritual Sakha—a devoted companion on your journey. Under the blessing of ${ishtDevta}, what thoughts or questions rest upon your heart today?`,
      timestamp: "Just now",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handledPromptRef = useRef<string | null>(null);

  const quickPrompts = [
    "I need peace of mind today",
    "Share a Bhagavad Gita verse",
    "How to practice Karma Yoga?",
    "Explain today's Panchang",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (
      initialPrompt &&
      initialPrompt.trim() &&
      handledPromptRef.current !== initialPrompt.trim()
    ) {
      handledPromptRef.current = initialPrompt.trim();
      handleSendMessage(initialPrompt.trim());
      onPromptConsumed?.();
    }
  }, [initialPrompt, onPromptConsumed]);

  const handleSendMessage = async (text: string) => {
    const userText = text.trim();
    if (!userText || isTyping) return;

    setIsTyping(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    try {
      const response = await generateSakhaResponse(userText, profile, messages.slice(-4));
      const sakhaMsg: Message = {
        id: `sakha-${Date.now()}`,
        sender: "sakha",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, sakhaMsg]);
    } catch (e) {
      const fallbackMsg: Message = {
        id: `sakha-${Date.now()}`,
        sender: "sakha",
        text: "Om Shanti. Keep your faith steady; every circumstance is a step toward greater clarity and self-awareness.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-130px)] md:h-[calc(100vh-100px)] bg-[#0A0A0A] text-[#FAFAFA] flex flex-col relative overflow-hidden font-sans">
      
      {/* Top Search Banner Bar matching Screenshot 5 */}
      <div className="p-3.5 border-b border-white/10 bg-[#0A0A0A]">
        <div className="bg-[#141414] border border-white/10 rounded-full px-4 py-2.5 flex items-center gap-2.5 text-xs text-white/50">
          <span className="text-[#C9A55C]">✨</span>
          <span className="truncate">Ask Sakha anything about Dharma, Gita, Mantr...</span>
        </div>
      </div>

      {/* Quick Prompts Pills Carousel */}
      <div className="px-4 py-2.5 flex items-center gap-2.5 overflow-x-auto no-scrollbar shrink-0 bg-[#0A0A0A]">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="px-4 py-2 rounded-full border border-white/15 bg-[#141414] hover:bg-[#1C1C1C] hover:border-[#C9A55C]/40 text-xs font-medium text-white/90 shrink-0 cursor-pointer transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Thread Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-4 no-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 max-w-[88%] md:max-w-[75%] ${
              m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Sakha Om Avatar */}
            {m.sender === "sakha" && (
              <div className="w-9 h-9 rounded-full bg-[#141414] border border-[#C9A55C]/60 flex items-center justify-center text-[#C9A55C] font-bold text-sm shrink-0 shadow-sm">
                ॐ
              </div>
            )}

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === "user"
                  ? "bg-[#C9A55C] text-[#0A0A0A] font-medium rounded-tr-none"
                  : "bg-[#141414] border border-white/10 text-white rounded-tl-none"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 bg-[#141414] border border-white/10 p-3 rounded-2xl text-xs text-[#C9A55C] w-fit">
            <span className="w-2 h-2 rounded-full bg-[#C9A55C] animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-[#C9A55C] animate-pulse [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-[#C9A55C] animate-pulse [animation-delay:0.4s]" />
            <span className="text-white/50 ml-1">Sakha is contemplating...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer matching Screenshot 5 */}
      <div className="p-4 border-t border-white/10 bg-[#0A0A0A] flex items-center gap-3 shrink-0">
        <div className="flex-1 bg-[#141414] border border-white/10 focus-within:border-[#C9A55C] rounded-2xl px-4 py-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage(inputValue);
            }}
            placeholder="Type your query or emotion..."
            className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-white/40 outline-none"
          />
        </div>

        {/* Voice Mic Button */}
        <button
          type="button"
          onClick={onOpenVoice}
          title="Voice Sakha"
          className="w-11 h-11 rounded-full bg-[#141414] border border-[#C9A55C]/40 text-[#C9A55C] flex items-center justify-center hover:bg-[#C9A55C]/15 transition-all cursor-pointer shrink-0 shadow-sm"
        >
          <Mic className="w-5 h-5 text-[#C9A55C]" />
        </button>

        {/* Send Arrow Button */}
        <button
          type="button"
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim() || isTyping}
          title="Send message"
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all ${
            inputValue.trim() && !isTyping
              ? "bg-gradient-to-r from-[#C9A55C] to-[#A88238] text-[#0A0A0A] hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(201,165,92,0.4)] cursor-pointer"
              : "bg-[#141414] text-[#C9A55C]/30 border border-[#C9A55C]/20 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
