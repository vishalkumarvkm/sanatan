"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { UserProfile } from "@/types/onboarding";
import { VoiceAssistantPanel } from "@/components/VoiceAssistantPanel";
import { generateSakhaResponse } from "@/lib/gemini";

interface SakhaShrineProps {
  profile: UserProfile;
  onResetOnboarding: () => void;
  initialPrompt?: string;
}

interface Message {
  id: string;
  sender: "sakha" | "user";
  text: string;
  timestamp: string;
  isAnimated?: boolean;
}

const TypewriterText: React.FC<{ text: string; onCharacterTyped?: () => void }> = ({
  text,
  onCharacterTyped,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsTyping(true);

    const timer = setInterval(() => {
      index++;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        if (onCharacterTyped) onCharacterTyped();
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [text, onCharacterTyped]);

  return (
    <span>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#B4392B] animate-pulse rounded-xs align-middle" />
      )}
    </span>
  );
};

export const SakhaShrine: React.FC<SakhaShrineProps> = ({
  profile,
  onResetOnboarding,
  initialPrompt,
}) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("spiritualsakha_chat_messages");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((m: Message) => ({ ...m, isAnimated: false }));
          }
        }
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }

    const userHasName = Boolean(profile.name && profile.name.trim().length > 0);
    const namePart = userHasName ? ` ${profile.name.trim()}` : "";
    const devta = profile.ishtDevta || "Shiva";
    const moodNote = profile.innerSeason
      ? ` Aapki ${profile.innerSeason.toLowerCase()} bhavna ka main samman karta hoon.`
      : " Aapka man yahan shanti aur clarity praapt kare.";
    const questionRef = profile.seekingQuestion1
      ? ` Aapke sawal "${profile.seekingQuestion1}" par milkar vichar karte hain.`
      : " Aaj aapke man mein kya vichar ya sawal hai?";

    return [
      {
        id: "1",
        sender: "sakha",
        text: `Namaste${namePart}! SpiritualSakha mein aapka hardik swagat hai. Bhagwan ${devta} ki pawan kripa se, main aapke saath hoon.${moodNote}${questionRef}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isAnimated: true,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("spiritualsakha_chat_messages", JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history", e);
    }
  }, [messages]);

  const [inputMessage, setInputMessage] = useState("");
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingAI, scrollToBottom]);

  const handleSendMessage = async (textToSend?: string) => {
    const msgText = textToSend || inputMessage;
    if (!msgText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setLoadingAI(true);

    try {
      const aiReply = await generateSakhaResponse(msgText, profile);
      const sakhaMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "sakha",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isAnimated: true,
      };
      setMessages((prev) => [...prev, sakhaMsg]);
    } catch (err) {
      console.error("Failed to generate Sakha AI reply:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handledPromptRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && handledPromptRef.current !== initialPrompt) {
      handledPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const exportDataJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `spiritualsakha_profile_${profile.name || "user"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] md:h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#362A22] no-scrollbar overflow-hidden pt-13">
      
      {/* Voice Assistant Panel Modal */}
      <VoiceAssistantPanel
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        profile={profile}
      />

      {/* SAKHA CHAT MESSAGE HISTORY STREAM WITH TYPING ANIMATION */}
      <main
        ref={chatScrollRef}
        className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 py-3.5 sm:py-4 overflow-y-auto no-scrollbar flex flex-col gap-3.5 max-w-3xl mx-auto w-full scroll-smooth"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[90%] sm:max-w-[82%] ${
              msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div
              className={`p-3.5 sm:p-4 rounded-[20px] text-[13.5px] sm:text-[14px] leading-relaxed font-medium shadow-2xs ${
                msg.sender === "user"
                  ? "bg-[#EFE1CE] text-[#362A22] rounded-tr-xs font-semibold whitespace-pre-wrap border border-[rgba(54,42,34,0.08)]"
                  : "bg-[#F7EFE2] text-[#2C211A] rounded-tl-xs font-medium whitespace-pre-wrap border border-[rgba(54,42,34,0.08)]"
              }`}
            >
              {msg.sender === "sakha" && msg.isAnimated ? (
                <TypewriterText text={msg.text} onCharacterTyped={scrollToBottom} />
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              )}
            </div>
            <span className="text-[10px] text-[#8C7A6B] mt-1 px-1.5 font-medium">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {loadingAI && (
          <div className="mr-auto items-start flex flex-col max-w-[75%]">
            <div className="p-3 bg-[#F7EFE2] border border-[rgba(54,42,34,0.08)] rounded-[18px] text-[12.5px] text-[#6B5C4E] flex items-center gap-2">
              <span className="devanagari-font text-base text-[#B4392B] animate-pulse">ॐ</span>
              <span>Sakha AI is reflecting...</span>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM COMPACT FLOATING PILL INPUT BAR */}
      <footer className="w-full px-3 sm:px-6 md:px-12 py-2 md:py-3 border-t border-[rgba(54,42,34,0.08)] bg-[#FDFBF7]/95 backdrop-blur-md flex-shrink-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center bg-[#FFFDF9] border border-[rgba(54,42,34,0.15)] rounded-full p-1 pl-5 shadow-sm">
          <input
            type="text"
            placeholder="Ask Sakha for guidance..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-transparent border-none text-[13.5px] text-[#362A22] font-medium outline-none placeholder-[#8C7A6B]"
          />
          
          {/* Microphone Button */}
          <button
            type="button"
            onClick={() => setIsVoiceAssistantOpen(true)}
            title="Sakha Voice Agent"
            className="p-2 rounded-full transition-colors text-[#6B5C4E] hover:text-[#B4392B] hover:bg-[#FBF3E6] flex-shrink-0 cursor-pointer"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={loadingAI}
            className="bg-[#B4392B] hover:bg-[#8E2C21] text-[#FFFDF9] px-6 py-2 rounded-full font-bold text-[13px] transition-all active:scale-98 shadow-xs flex-shrink-0 disabled:opacity-50 cursor-pointer"
          >
            Send
          </button>
        </div>
      </footer>

      {/* DPDP Profile & Privacy Drawer Modal */}
      {showProfileDrawer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.13)] rounded-[24px] max-w-lg w-full p-5 flex flex-col gap-4 animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl">
            <div className="flex justify-between items-center border-b border-[rgba(54,42,34,0.13)] pb-3">
              <div>
                <h3 className="font-serif text-[18px] font-bold text-[#362A22]">
                  DPDP Rights & Profile Data
                </h3>
                <p className="text-[11px] text-[#6B5C4E]">
                  Your data is protected under India&apos;s Digital Personal Data Protection Act.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileDrawer(false)}
                className="text-[#6B5C4E] hover:text-[#362A22] text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 text-[12px] text-[#362A22]">
              <div className="bg-[#FBF3E6] p-3 rounded-[12px] flex justify-between">
                <span className="font-bold">Seeker Name:</span>
                <span>{profile.name || "Guest"}</span>
              </div>
              <div className="bg-[#FBF3E6] p-3 rounded-[12px] flex justify-between">
                <span className="font-bold">Isht Devta:</span>
                <span>{profile.ishtDevta || "Shiva"}</span>
              </div>
              <div className="bg-[#FBF3E6] p-3 rounded-[12px] flex justify-between">
                <span className="font-bold">Language:</span>
                <span>{profile.language || "English"}</span>
              </div>
              <div className="bg-[#FBF3E6] p-3 rounded-[12px] flex justify-between">
                <span className="font-bold">Inner Feeling:</span>
                <span>{profile.innerSeason || "Seeking Peace"}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={exportDataJSON}
                className="px-4 py-2 rounded-full bg-[#362A22] text-[#FFFDF9] text-xs font-bold hover:bg-[#1C2140] transition-colors"
              >
                📥 Export My Data (JSON)
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetOnboarding();
                  setShowProfileDrawer(false);
                }}
                className="px-4 py-2 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
              >
                🗑️ Erase Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
