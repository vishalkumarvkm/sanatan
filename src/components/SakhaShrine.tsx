"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/types/onboarding";
import { generateSakhaResponse } from "@/lib/gemini";

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

const renderFormattedMessage = (text: string, isSakha: boolean) => {
  if (!text) return "";
  
  // Clean up weird raw combinations like *'text'* or * "text" * -> "text"
  const sanitized = text
    .replace(/\*['"](.*?)['"]\*/g, '"$1"')
    .replace(/['"]\*(.*?)\*['"]/g, '"$1"');

  // Split by **bold** or *italic*
  const parts = sanitized.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className={isSakha ? "font-semibold text-[#D9A441]" : "font-bold text-[#080808]"}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className={isSakha ? "italic font-medium text-[#D9A441]" : "italic font-medium"}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

export const SakhaShrine: React.FC<SakhaShrineProps> = ({
  profile,
  onOpenVoice,
  initialPrompt,
  onPromptConsumed,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const isShiva = profile.ishtDevta?.toLowerCase().includes("shiva") ?? true;
    const name = profile.name ? profile.name.trim() : "Priya";
    return [
      {
        id: "msg-1",
        sender: "sakha",
        text: `Namaste ${name}. Today is Trayodashi — tomorrow evening is Pradosh Vrat. A sacred time for ${isShiva ? "Shiva abhishek and deep peace" : "quiet contemplation and prayer"}. Shall I guide you through a home ritual?`,
        timestamp: "Just now",
      },
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handledPromptRef = useRef<string | null>(null);
  const isSendingRef = useRef(false);

  const quickPrompts = [
    "Show me the vidhi",
    "Today's panchang",
    "How to calm anxiety",
    "Play a bhajan",
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
    if (!userText || isSendingRef.current || isTyping) return;

    isSendingRef.current = true;
    setIsTyping(true);

    const userMsg: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const recentHistory = messages.slice(-6).map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    try {
      const response = await generateSakhaResponse(userText, profile, recentHistory);
      const sakhaMsg: Message = {
        id: `sakha-${Date.now()}-${Math.random()}`,
        sender: "sakha",
        text: response,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, sakhaMsg]);
    } catch (e) {
      console.error("Sakha response error:", e);
      const fallbackMsg: Message = {
        id: `sakha-${Date.now()}-${Math.random()}`,
        sender: "sakha",
        text: "Om Shanti. Keep your faith steady; every circumstance is a step toward greater clarity and self-awareness.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      isSendingRef.current = false;
    }
  };

  return (
    <div className="w-full h-[calc(100dvh-68px)] md:h-[calc(100vh-100px)] bg-[#080808] md:bg-[#111111] text-[#F5F5F5] flex flex-col relative overflow-hidden font-sans md:rounded-[22px] md:border md:border-[#252525] md:shadow-2xl">
      {/* 1. Header — Sakha Profile Area */}
      <header className="h-[76px] sm:h-[80px] px-5 sm:px-6 flex items-center justify-between border-b border-[#252525] shrink-0 bg-[#080808]/95 md:bg-[#151515]/90 backdrop-blur-md z-10 select-none">
        <div className="flex items-center gap-3.5">
          {/* 44x44 circular saffron/gold avatar */}
          <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#D9A441] to-[#E8722A] flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(217,164,65,0.25)]">
            <span className="devanagari-font text-lg text-[#080808] font-bold">
              ॐ
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-serif-fraunces text-[19px] sm:text-[20px] font-semibold text-[#F5F5F5] leading-tight">
              Sakha
            </h1>
            <div className="text-[12.5px] text-[#B58A3A] flex items-center gap-1.5 font-medium mt-0.5">
              <span className="w-[6.5px] h-[6.5px] rounded-full bg-[#D9A441] animate-pulse shrink-0" />
              <span>here with you</span>
            </div>
          </div>
        </div>

        {onOpenVoice && (
          <button
            onClick={onOpenVoice}
            title="Start voice dialogue"
            type="button"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151515] hover:bg-[#1D1D1D] border border-[#D9A441]/35 text-[#D9A441] text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse" />
            <span>Voice</span>
          </button>
        )}
      </header>

      {/* 2 & 3. Conversation Area — Improved Bubbles and Flex Spacing */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col gap-4 no-scrollbar scroll-smooth">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`w-fit max-w-[82%] sm:max-w-[78%] md:max-w-[70%] px-4.5 py-3.5 sm:px-5 sm:py-4 rounded-[18px] text-[15.5px] sm:text-[16px] leading-[1.55] animate-message-enter flex flex-col gap-1 shadow-xs ${
              m.sender === "sakha"
                ? "self-start bg-[#1D1D1D] text-[#F5F5F5] border border-[#252525] rounded-bl-[5px]"
                : "self-end bg-[#D9A441] text-[#080808] font-medium border border-[#B58A3A] rounded-br-[5px]"
            }`}
          >
            <div className="whitespace-pre-wrap">
              {renderFormattedMessage(m.text, m.sender === "sakha")}
            </div>
            <span
              className={`text-[11px] self-end mt-0.5 select-none ${
                m.sender === "sakha"
                  ? "text-[#9A9A9A]"
                  : "text-[rgba(8,8,8,0.65)] font-semibold"
              }`}
            >
              {m.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="self-start flex items-center gap-2 px-4.5 py-3 rounded-[18px] rounded-bl-[5px] bg-[#1D1D1D] border border-[#252525] text-xs text-[#B58A3A] font-medium animate-message-enter shadow-xs">
            <span>Sakha is thinking</span>
            <span className="flex items-center gap-1 ml-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse [animation-delay:0.4s]" />
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Quick Suggestion Chips — Horizontally Scrollable without Clipping */}
      <div className="shrink-0 py-2.5 px-4 md:px-6 flex items-center overflow-x-auto no-scrollbar scroll-smooth gap-2.5 flex-nowrap select-none">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 h-[36px] px-4 rounded-full border border-[#252525] bg-[#151515] hover:bg-[#1D1D1D] hover:border-[#D9A441]/45 text-[#F5F5F5] text-[13.5px] font-semibold cursor-pointer whitespace-nowrap transition-all active:scale-[0.97] flex items-center justify-center shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* 5. Input Composer — Redesigned with Balanced Touch Targets */}
      <div className="shrink-0 px-4 md:px-6 py-3.5 border-t border-[#252525] bg-[#080808] md:bg-[#151515] flex items-center gap-3">
        <div className="flex-1 h-[52px] bg-[#151515] border border-[#252525] focus-within:border-[#D9A441] rounded-full px-5 flex items-center transition-colors shadow-inner">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
            placeholder="Ask Sakha anything…"
            className="w-full bg-transparent text-[#F5F5F5] text-[15px] sm:text-[16px] placeholder:text-[#9A9A9A] outline-none"
          />
        </div>

        {/* 48x48 Circular Voice Button */}
        <button
          onClick={onOpenVoice}
          title="Voice conversation"
          type="button"
          className="w-[48px] h-[48px] min-h-[44px] min-w-[44px] rounded-full bg-[#151515] hover:bg-[#1D1D1D] border border-[#D9A441]/40 text-[#D9A441] flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0 shadow-xs"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M19 11v1a7 7 0 01-14 0v-1M12 19v3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* 48x48 Circular Send Button */}
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={!inputValue.trim() || isTyping}
          title={inputValue.trim() ? "Send message" : "Type a message to send"}
          type="button"
          className={`w-[48px] h-[48px] min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center transition-all shrink-0 ${
            inputValue.trim() && !isTyping
              ? "bg-[#D9A441] hover:bg-[#B58A3A] text-[#080808] shadow-[0_0_16px_rgba(217,164,65,0.35)] cursor-pointer active:scale-95"
              : "bg-[#1D1D1D] text-[#555555] border border-[#252525] cursor-not-allowed opacity-60"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
