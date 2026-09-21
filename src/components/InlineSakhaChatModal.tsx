"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Sparkles, Bot, User, RefreshCw, MessageSquare } from "lucide-react";
import { UserProfile } from "@/types/onboarding";
import { generateSakhaResponse, ChatHistoryItem } from "@/lib/gemini";

interface InlineSakhaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  profile?: UserProfile;
}

export const InlineSakhaChatModal: React.FC<InlineSakhaChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  profile,
}) => {
  const [messages, setMessages] = useState<ChatHistoryItem[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && initialPrompt) {
      const userMsg: ChatHistoryItem = { role: "user", text: initialPrompt };
      setMessages([userMsg]);
      setIsLoading(true);

      generateSakhaResponse(initialPrompt, profile, [])
        .then((resp) => {
          setMessages([userMsg, { role: "sakha", text: resp }]);
        })
        .catch((err) => {
          console.warn("[InlineSakhaChat] Error:", err);
          setMessages([
            userMsg,
            {
              role: "sakha",
              text: "Hari Om! I am reflecting on your sacred verse query. Please ask your question again.",
            },
          ]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, initialPrompt, profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const textToSend = inputMessage.trim();
    setInputMessage("");

    const newMessages: ChatHistoryItem[] = [...messages, { role: "user", text: textToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await generateSakhaResponse(textToSend, profile, newMessages);
      setMessages([...newMessages, { role: "sakha", text: response }]);
    } catch (err) {
      console.warn("[InlineSakhaChat] Error:", err);
      setMessages([
        ...newMessages,
        { role: "sakha", text: "Hari Om. Divine wisdom flows within you. Feel free to ask another question." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div className="w-full max-w-2xl h-[85vh] sm:h-[80vh] bg-[#121212] border border-[#C9A55C]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#1A1A1A] via-[#141414] to-[#1A1A1A] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C9A55C] to-[#8C6D2D] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0A0A0A] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#C9A55C] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-fraunces text-base font-bold text-white">
                  Sakha AI Spiritual Companion
                </h3>
                <span className="text-[10px] font-bold text-[#C9A55C] bg-[#C9A55C]/15 border border-[#C9A55C]/30 px-2 py-0.5 rounded-full">
                  In-Page Chat
                </span>
              </div>
              <p className="text-[11px] text-white/50">
                Ask questions & explore verse purports directly on this page
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Conversation Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 no-scrollbar bg-[#0A0A0A]/50">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-sm ${
                    isUser
                      ? "bg-[#C9A55C] text-[#0A0A0A]"
                      : "bg-[#1F1F1F] border border-[#C9A55C]/30 text-[#C9A55C]"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? "bg-gradient-to-r from-[#C9A55C] to-[#A88238] text-[#0A0A0A] font-medium rounded-tr-none"
                      : "bg-[#181818] border border-white/10 text-white/90 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-[#1F1F1F] border border-[#C9A55C]/30 text-[#C9A55C] flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#181818] border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-[#C9A55C]">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sakha AI is reflecting on sacred Vedic scriptures...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Quick Pills */}
        <div className="px-4 py-2 bg-[#121212] border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase text-[#C9A55C] shrink-0">Suggestions:</span>
          {[
            "Explain in simple modern terms",
            "How to apply this in daily work?",
            "What is the key takeaway?",
          ].map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => {
                setInputMessage(pill);
              }}
              className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Bottom Input Field */}
        <div className="p-4 bg-[#141414] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Sakha AI anything about this verse..."
            className="flex-1 bg-black/50 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/40 outline-none focus:border-[#C9A55C] transition-colors"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading}
            className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#C9A55C] to-[#A88238] hover:opacity-90 disabled:opacity-50 text-[#0A0A0A] font-bold flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default InlineSakhaChatModal;
