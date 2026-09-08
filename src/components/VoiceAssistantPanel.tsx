"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/types/onboarding";
import { generateSakhaResponse } from "@/lib/gemini";

interface VoiceAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuery?: (query: string) => void;
  profile?: Partial<UserProfile>;
}

export const VoiceAssistantPanel: React.FC<VoiceAssistantPanelProps> = ({
  isOpen,
  onClose,
  onSendQuery,
  profile,
}) => {
  const [phase, setPhase] = useState<"listening" | "recognized" | "thinking" | "speaking">(
    "listening"
  );
  const [userTranscript, setUserTranscript] = useState("");
  const [sakhaSpeech, setSakhaSpeech] = useState("Speak whenever you're ready.");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    setPhase("listening");
    setUserTranscript("");
    setSakhaSpeech("Speak whenever you're ready.");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          const transcriptText = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          if (transcriptText) {
            setUserTranscript(transcriptText);
            setPhase("recognized");
          }
        };

        recognition.onend = async () => {
          if (userTranscript.trim()) {
            await handleProcessVoiceQuery(userTranscript.trim());
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn("Speech recognition error:", e);
      }
    } else {
      // Fallback demo sequence if browser lacks Web Speech API
      const timer1 = setTimeout(() => {
        setPhase("recognized");
        setUserTranscript("What mantra helps with difficult decisions?");

        const timer2 = setTimeout(() => {
          setPhase("thinking");
          setSakhaSpeech("");

          const timer3 = setTimeout(() => {
            setPhase("speaking");
            const answer =
              "The Gayatri Mantra illuminates the intellect. Chant 108 times at sunrise for clarity before any important decision.";
            setSakhaSpeech(answer);
            if (onSendQuery) onSendQuery(answer);
          }, 1200);
          return () => clearTimeout(timer3);
        }, 1400);
        return () => clearTimeout(timer2);
      }, 2500);

      return () => clearTimeout(timer1);
    }
  }, [isOpen]);

  const handleProcessVoiceQuery = async (query: string) => {
    setPhase("thinking");
    setSakhaSpeech("");

    try {
      const response = await generateSakhaResponse(query, profile);
      setPhase("speaking");
      setSakhaSpeech(response);

      if (onSendQuery) {
        onSendQuery(query);
      }

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("Voice assistant query processing error:", err);
      setPhase("speaking");
      setSakhaSpeech(
        "Om Shanti. Keep your focus inward and trust the divine order."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between text-[#FAFAFA] px-7 pt-14 pb-9 animate-fadein select-none"
      style={{
        background:
          "radial-gradient(70% 50% at 50% 35%, rgba(201,165,92,0.1), #0A0A0A 100%)",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="self-end w-9 h-9 rounded-full bg-[#1C1C1C] border border-[rgba(250,250,250,0.07)] text-[#FAFAFA] hover:border-[#C9A55C] flex items-center justify-center cursor-pointer transition-colors"
      >
        ✕
      </button>

      {/* Orb Animation */}
      <div className="relative w-52 h-52 flex items-center justify-center my-auto">
        {(phase === "listening" || phase === "speaking") && (
          <>
            <div className="absolute w-52 h-52 border border-[rgba(201,165,92,0.3)] rounded-full animate-ringpulse-1" />
            <div className="absolute w-52 h-52 border border-[rgba(201,165,92,0.3)] rounded-full animate-ringpulse-2" />
            <div className="absolute w-52 h-52 border border-[rgba(201,165,92,0.3)] rounded-full animate-ringpulse-3" />
          </>
        )}

        <div className="w-24 h-24 rounded-full bg-[rgba(201,165,92,0.12)] border border-[rgba(201,165,92,0.4)] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(201,165,92,0.2)]">
          {/* Waveform Bars */}
          <div className="flex items-center gap-1 h-8">
            <span
              className="w-1 bg-[#C9A55C] rounded-full"
              style={{
                height: phase === "thinking" ? "4px" : "12px",
                animation:
                  phase === "listening" || phase === "speaking"
                    ? "wave 1s ease-in-out infinite"
                    : "none",
              }}
            />
            <span
              className="w-1 bg-[#C9A55C] rounded-full"
              style={{
                height: phase === "thinking" ? "6px" : "22px",
                animation:
                  phase === "listening" || phase === "speaking"
                    ? "wave 1s ease-in-out infinite 0.1s"
                    : "none",
              }}
            />
            <span
              className="w-1 bg-[#C9A55C] rounded-full"
              style={{
                height: phase === "thinking" ? "10px" : "32px",
                animation:
                  phase === "listening" || phase === "speaking"
                    ? "wave 1s ease-in-out infinite 0.2s"
                    : "none",
              }}
            />
            <span
              className="w-1 bg-[#C9A55C] rounded-full"
              style={{
                height: phase === "thinking" ? "6px" : "20px",
                animation:
                  phase === "listening" || phase === "speaking"
                    ? "wave 1s ease-in-out infinite 0.3s"
                    : "none",
              }}
            />
            <span
              className="w-1 bg-[#C9A55C] rounded-full"
              style={{
                height: phase === "thinking" ? "4px" : "14px",
                animation:
                  phase === "listening" || phase === "speaking"
                    ? "wave 1s ease-in-out infinite 0.4s"
                    : "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Status & Caption */}
      <div className="text-center max-w-xs flex flex-col items-center gap-2 mb-6">
        <div className="font-serif-fraunces text-xl text-[#FAFAFA]">
          {phase === "listening" && "Listening…"}
          {phase === "recognized" && "You said:"}
          {phase === "thinking" && "Thinking…"}
          {phase === "speaking" && "Sakha"}
        </div>
        <div className="text-[13.5px] text-[#A8904D] leading-relaxed min-h-[44px]">
          {phase === "recognized"
            ? `“${userTranscript}”`
            : sakhaSpeech.replace(/\*['"](.*?)['"]\*/g, '"$1"').replace(/\*([^*]+)\*/g, '$1')}
        </div>
      </div>

      <div className="text-[11px] text-[rgba(250,250,250,0.3)] tracking-wide">
        Conversation is saved to your chat
      </div>
    </div>
  );
};

export default VoiceAssistantPanel;