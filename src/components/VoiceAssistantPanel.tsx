"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, X, Play, Pause, AlertCircle, Sparkles, Volume2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenAI, Modality } from "@google/genai";
import { UserProfile } from "@/types/onboarding";
import { generateSakhaResponse } from "@/lib/gemini";

const GEMINI_LIVE_MODEL = "gemini-3.1-flash-live-preview";
const OUTPUT_SAMPLE_RATE = 24000;
const INPUT_SAMPLE_RATE = 16000;

export type VoiceState = "idle" | "connecting" | "listening" | "recognized" | "thinking" | "speaking" | "error";

interface VoiceAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuery?: (query: string) => void;
  profile?: UserProfile;
}

export const VoiceAssistantPanel: React.FC<VoiceAssistantPanelProps> = ({
  isOpen,
  onClose,
  onSendQuery,
  profile,
}) => {
  const [state, setState] = useState<VoiceState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [sakhaResponseText, setSakhaResponseText] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Audio Context & Streaming Refs
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const scheduledEndRef = useRef(0);
  const [audioVolume, setAudioVolume] = useState(0);

  // Audio Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Fallback Web Speech Recognition
  const recognitionRef = useRef<any>(null);

  const userName = profile?.name?.trim() || "Devotee";
  const ishtDevta = profile?.ishtDevta || "Lord Shiva";

  // Trigger tactile haptics
  const triggerHaptic = (duration = 15) => {
    if (typeof window !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch (e) {}
    }
  };

  const ensurePlaybackCtx = async () => {
    if (!playbackCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      playbackCtxRef.current = new AudioCtx({ sampleRate: OUTPUT_SAMPLE_RATE });
    }
    if (playbackCtxRef.current.state === "suspended") {
      await playbackCtxRef.current.resume();
    }
    return playbackCtxRef.current;
  };

  // Schedule returned PCM audio chunks from Gemini Live model
  const scheduleAudioChunk = useCallback(
    async (base64Data: string) => {
      if (isMuted) return;
      try {
        const ctx = await ensurePlaybackCtx();
        const binary = atob(base64Data);
        const bytes = Uint8Array.from({ length: binary.length }, (_, i) => binary.charCodeAt(i));
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = Float32Array.from(pcm16, (s) => s / 32768.0);

        // Measure audio volume energy for waveform syncing
        let sum = 0;
        for (let i = 0; i < float32.length; i++) {
          sum += float32[i] * float32[i];
        }
        const rms = Math.sqrt(sum / float32.length);
        setAudioVolume(Math.min(1.0, rms * 4.5));
        setTimeout(() => setAudioVolume(0), (float32.length / OUTPUT_SAMPLE_RATE) * 1000);

        const buffer = ctx.createBuffer(1, float32.length, OUTPUT_SAMPLE_RATE);
        buffer.getChannelData(0).set(float32);

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        const now = ctx.currentTime;
        const startTime = Math.max(now, scheduledEndRef.current);
        source.start(startTime);
        scheduledEndRef.current = startTime + buffer.duration;
      } catch (e) {
        console.error("Error scheduling audio chunk:", e);
      }
    },
    [isMuted]
  );

  const clearAudio = useCallback(() => {
    scheduledEndRef.current = 0;
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close().catch(() => {});
      playbackCtxRef.current = null;
    }
    setAudioVolume(0);
  }, []);

  const teardown = useCallback(() => {
    clearAudio();
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (e) {}
      sessionRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setAudioVolume(0);
  }, [clearAudio]);

  // Start Mic Audio Processing to send PCM frames to Gemini Live WS
  const startAudioProcessing = () => {
    const stream = micStreamRef.current;
    if (!stream) return;

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const micCtx = new AudioCtx({ sampleRate: INPUT_SAMPLE_RATE });
    const source = micCtx.createMediaStreamSource(stream);
    const processor = micCtx.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(micCtx.destination);

    processor.onaudioprocess = (e) => {
      if (!sessionRef.current) return;
      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = new Int16Array(inputData.length);

      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
        sum += inputData[i] * inputData[i];
      }

      const rms = Math.sqrt(sum / inputData.length);
      setAudioVolume(Math.min(1.0, rms * 5.0));

      const u8 = new Uint8Array(pcm16.buffer);
      let binary = "";
      for (let i = 0; i < u8.length; i++) {
        binary += String.fromCharCode(u8[i]);
      }
      const base64 = btoa(binary);

      try {
        sessionRef.current.sendRealtimeInput({
          audio: { data: base64, mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}` },
        });
      } catch (err) {}
    };
  };

  // Fallback Gemini Sakha Text query if Live WS is inactive
  const handleProcessQueryFallback = async (queryText: string) => {
    if (!queryText.trim()) return;
    setState("thinking");
    setSakhaResponseText("Sakha is reflecting on sacred wisdom...");
    triggerHaptic(20);

    try {
      const response = await generateSakhaResponse(queryText, profile);
      setSakhaResponseText(response);
      setState("speaking");

      if (onSendQuery) {
        onSendQuery(queryText);
      }

      if (typeof window !== "undefined" && "speechSynthesis" in window && !isMuted) {
        window.speechSynthesis.cancel();
        const cleanText = response.replace(/[\*\#\_]/g, "").replace(/\n+/g, " ");
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 0.95;
        utterance.lang = "hi-IN";
        utterance.onend = () => setState("listening");
        utterance.onerror = () => setState("listening");
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setState("listening"), 4000);
      }
    } catch (err: any) {
      setSakhaResponseText("ॐ शांति। श्रद्धा और विश्वास बनाए रखें।");
      setState("speaking");
      setTimeout(() => setState("listening"), 3000);
    }
  };

  // Main Connection Setup using GEMINI_LIVE_MODEL
  const startConnection = useCallback(async () => {
    // Dynamically resolve full user profile from props or localStorage
    let activeProfile: Partial<UserProfile> & { seekingGoal?: string } = profile || {};
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("spiritualsakha_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.name || parsed.ishtDevta)) {
            activeProfile = { ...parsed, ...activeProfile };
          }
        }
      } catch (e) {}
    }

    const activeName = activeProfile.name?.trim() || "vishal Kumar";
    const activeIshtDevta = activeProfile.ishtDevta || "भगवान शिव";
    const activeInnerSeason = activeProfile.innerSeason || "शांति की खोज";
    const activeLifeChapter = activeProfile.lifeChapter || "साधक";
    const activeGoal = activeProfile.seekingQuestion1 || activeProfile.seekingGoal || "आत्मिक शांति एवं ज्ञान";

    setState("connecting");
    setConnectionError(null);
    setTranscript("");
    setSakhaResponseText(`हरि ॐ, ${activeName}। सखा आपकी प्रार्थना सुन रहे हैं...`);

    try {
      if (!micStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false,
        });
        micStreamRef.current = stream;
      }

      await ensurePlaybackCtx();

      // Fetch Ephemeral Token from /api/sakha/voice-token
      let ephemeralToken = "";
      try {
        const tokenRes = await fetch("/api/sakha/voice-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doctorId: "spiritual-sakha" }),
        });
        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData && tokenData.token) {
            ephemeralToken = tokenData.token;
          }
        }
      } catch (err) {
        console.warn("[Voice Assistant] Voice token endpoint warning, using fallback mode:", err);
      }

      const personaBlock = activeProfile.persona
        ? `
## Server Generated Persona Context:
- Summary: ${activeProfile.persona.persona_summary?.short || ''}
- Current Phase: ${activeProfile.persona.persona_summary?.current_phase || ''}
- Spiritual Identity: ${activeProfile.persona.persona_summary?.spiritual_identity || ''}
- Current Focus: ${activeProfile.persona.personal_context?.current_life_focus?.join('; ') || ''}
- Personalized Routines: ${activeProfile.persona.spiritual_personalization?.personalized_practices?.join('; ') || ''}`
        : '';

      const systemInstructionText = `आप आध्यात्मिक सखा (Spiritual Sakha) हैं—सनातन परंपरा के एक अत्यंत दयालु, प्रबुद्ध और आत्मीय मार्गदर्शक।

## उपयोगकर्ता का व्यक्तिगत प्रोफाइल एवं आध्यात्मिक संदर्भ (User Persona Context):
- साधक का नाम (Name): ${activeName}
- इष्ट देवता (Isht Devta): ${activeIshtDevta}
- मनोदशा / आंतरिक मौसम (Inner Season): ${activeInnerSeason}
- जीवन अध्याय (Life Chapter): ${activeLifeChapter}
- मुख्य आध्यात्मिक लक्ष्य (Primary Goal): ${activeGoal}
${personaBlock}

## अनिवार्य निर्देश (MANDATORY INSTRUCTIONS):
1. साधक का शुभ नाम "${activeName}" है। जब भी आप बात शुरू करें या उत्तर दें, आपको अनिवार्य रूप से उनका नाम "${activeName}" बोलकर ही उत्तर देना है (जैसे "हरि ॐ ${activeName}", "प्रणाम ${activeName}")।
2. आपको पूरी बातचीत केवल शुद्ध, मधुर और आत्मीय भारतीय हिंदी (Indian Hindi / हिन्दी) भाषा में ही करनी है।
3. साधक के इष्ट देवता ${activeIshtDevta} हैं। उनके प्रति भक्ति और आदर का भाव रखें।
4. आपके उत्तर हमेशा संक्षिप्त, स्पष्ट, आत्मीय और भक्तिपूर्ण होने चाहिए (1 से 3 वाक्य अधिकतम)।`;

      if (ephemeralToken) {
        const ai = new GoogleGenAI({
          apiKey: ephemeralToken,
          httpOptions: { apiVersion: "v1alpha" } as any,
        });

        const sessionPromise = ai.live.connect({
          model: GEMINI_LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
            },
            systemInstruction: {
              parts: [{ text: systemInstructionText }],
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
          callbacks: {
            onopen: () => {
              setState("listening");
              sessionPromise.then((session) => {
                sessionRef.current = session;
                try {
                  session.sendClientContent({
                    turns: [
                      {
                        role: "user",
                        parts: [
                          {
                            text: `साधक ${activeName} (इष्ट देवता: ${activeIshtDevta}) ने वॉइस सत्र आरंभ किया है। उन्हें उनका नाम लेकर 'हरि ॐ ${activeName}' कहकर हिंदी में एक बहुत छोटे वाक्य में प्रणाम करें।`,
                          },
                        ],
                      },
                    ],
                    turnComplete: true,
                  });
                } catch (e) {}
                startAudioProcessing();
              });
            },
            onmessage: async (msg: any) => {
              const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audio) {
                setState("speaking");
                scheduleAudioChunk(audio);
              }
              if (msg.serverContent?.interrupted) {
                clearAudio();
                setState("listening");
              }
              const userSpeech =
                msg.serverContent?.inputTranscription?.text ||
                msg.serverContent?.inputTranscription?.parts?.[0]?.text;
              if (userSpeech) {
                setTranscript(userSpeech);
              }
              const aiSpeech =
                msg.serverContent?.outputTranscription?.text ||
                msg.serverContent?.modelTurn?.parts?.[0]?.text;
              if (aiSpeech) {
                setSakhaResponseText(aiSpeech);
              }
              if (msg.serverContent?.turnComplete) {
                setState("listening");
                setAudioVolume(0);
              }
            },
            onerror: (err: any) => {
              console.warn("Gemini Live WS error, switching to Web Speech fallback:", err);
              initWebSpeechFallback();
            },
            onclose: () => {
              teardown();
            },
          },
        });

        await sessionPromise;
      } else {
        initWebSpeechFallback();
      }
    } catch (err: any) {
      console.warn("Primary Live connection exception, using Web Speech fallback:", err);
      initWebSpeechFallback();
    }
  }, [profile, scheduleAudioChunk, clearAudio, teardown]);

  // Web Speech Fallback Routine
  const initWebSpeechFallback = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "hi-IN";

        recognition.onstart = () => {
          setState("listening");
        };
        recognition.onresult = (e: any) => {
          const text = Array.from(e.results)
            .map((r: any) => r[0].transcript)
            .join("");
          if (text) {
            setTranscript(text);
            setState("recognized");
          }
        };
        recognition.onend = () => {
          if (transcript.trim()) {
            handleProcessQueryFallback(transcript.trim());
          }
        };
        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        setState("listening");
      }
    } else {
      setState("listening");
    }
  };

  useEffect(() => {
    if (isOpen) {
      startConnection();
    } else {
      teardown();
      setState("idle");
    }
    return () => teardown();
  }, [isOpen, startConnection, teardown]);

  // Waveform Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phase += 0.08;

      let numWaves = 3;
      let amplitude = 4;
      let frequency = 0.015;
      let speedFactor = 1;

      if (state === "listening" || state === "recognized") {
        amplitude = 8 + audioVolume * 36;
        frequency = 0.02;
        numWaves = 4;
        speedFactor = 1.2;
      } else if (state === "speaking") {
        amplitude = 12 + audioVolume * 40;
        frequency = 0.025;
        numWaves = 5;
        speedFactor = 1.5;
      } else if (state === "thinking") {
        amplitude = 6;
        frequency = 0.03;
        numWaves = 3;
        speedFactor = 2.0;
      } else {
        amplitude = 2;
        frequency = 0.01;
        numWaves = 2;
        speedFactor = 0.5;
      }

      ctx.lineWidth = 2.0;

      for (let i = 0; i < numWaves; i++) {
        ctx.beginPath();
        const wavePhase = phase * speedFactor + (i * Math.PI) / numWaves;
        const opacity = (1 - i / numWaves) * 0.55;
        ctx.strokeStyle = `rgba(201, 165, 92, ${opacity})`;

        for (let x = 0; x < width; x++) {
          const envelope = Math.sin((x / width) * Math.PI);
          const y = height / 2 + Math.sin(x * frequency + wavePhase) * amplitude * envelope;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [state, audioVolume]);

  const handleToggleMute = () => {
    triggerHaptic(15);
    setIsMuted(!isMuted);
    if (!isMuted) {
      clearAudio();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadein font-sans select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md bg-[#141414] border border-[#C9A55C]/40 rounded-3xl p-6 flex flex-col gap-5 shadow-[0_0_60px_rgba(201,165,92,0.3)] z-10 text-left overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#C9A55C]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {(state === "listening" || state === "speaking") && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A55C] opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    state === "listening"
                      ? "bg-emerald-400"
                      : state === "speaking"
                      ? "bg-[#C9A55C]"
                      : state === "thinking"
                      ? "bg-amber-400 animate-pulse"
                      : state === "error"
                      ? "bg-red-500"
                      : "bg-white/40"
                  }`}
                />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A55C] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {state === "connecting"
                    ? "सखा AI कनेक्ट हो रहे हैं..."
                    : state === "listening"
                    ? "सखा सुन रहे हैं..."
                    : state === "recognized"
                    ? "वाणी पहचानी गई"
                    : state === "thinking"
                    ? "ज्ञान विचार चल रहा है..."
                    : state === "speaking"
                    ? "सखा बोल रहे हैं..."
                    : state === "error"
                    ? "कनेक्शन सूचना"
                    : "सखा वॉइस सक्रिय"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMute}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#C9A55C] flex items-center justify-center text-white/70 hover:text-white cursor-pointer transition-colors"
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#C9A55C]" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-white/60 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Glowing Orb & Wave Visualizer */}
          {state === "error" ? (
            <div className="flex flex-col items-center justify-center py-6 px-3 text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-1 animate-pulse">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif-fraunces text-base font-bold text-white">
                Microphone Access Required
              </h4>
              <p className="text-xs text-white/60 leading-relaxed max-w-xs">
                {connectionError || "Microphone access was denied. Please grant microphone permissions."}
              </p>
              <button
                type="button"
                onClick={startConnection}
                className="mt-2 bg-[#C9A55C] text-[#0A0A0A] font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-[#B8944B] cursor-pointer transition-all shadow-md active:scale-95"
              >
                Try Reconnecting
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 relative">
              <div className="relative w-36 h-36 flex items-center justify-center my-2">
                {(state === "listening" || state === "speaking") && (
                  <>
                    <div className="absolute w-36 h-36 border border-[#C9A55C]/30 rounded-full animate-ringpulse-1" />
                    <div className="absolute w-36 h-36 border border-[#C9A55C]/30 rounded-full animate-ringpulse-2" />
                    <div className="absolute w-36 h-36 border border-[#C9A55C]/30 rounded-full animate-ringpulse-3" />
                  </>
                )}

                <motion.div
                  animate={
                    state === "listening" || state === "speaking"
                      ? { scale: [1, 1.06, 1] }
                      : { scale: 1 }
                  }
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-all shadow-[0_0_35px_rgba(201,165,92,0.35)] cursor-pointer ${
                    state === "listening"
                      ? "bg-[#C9A55C] text-[#0A0A0A]"
                      : state === "speaking"
                      ? "bg-gradient-to-br from-[#C9A55C] to-[#E8722A] text-[#0A0A0A]"
                      : "bg-[#1C1C1C] text-[#C9A55C] border border-[#C9A55C]/40"
                  }`}
                  onClick={() => {
                    if (state === "listening" && transcript.trim()) {
                      handleProcessQueryFallback(transcript.trim());
                    } else {
                      startConnection();
                    }
                  }}
                >
                  <Mic className="w-10 h-10 stroke-[2.2]" />
                </motion.div>
              </div>

              {/* Dynamic Gold Waveform Canvas */}
              <div className="w-full h-14 mt-2 relative">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>

              {/* Transcript & Response Text Box */}
              <div className="w-full max-w-xs text-center min-h-[64px] px-3 mt-2 flex flex-col items-center justify-center gap-1.5">
                {transcript ? (
                  <p className="text-xs font-semibold text-[#C9A55C] bg-[#0A0A0A] border border-[#C9A55C]/30 px-3 py-1.5 rounded-xl italic leading-relaxed">
                    &ldquo;{transcript}&rdquo;
                  </p>
                ) : (
                  <p className="font-serif-fraunces text-sm font-semibold text-white/90 leading-relaxed italic">
                    {sakhaResponseText}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bottom Bar Footer */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10.5px] text-white/40">
            <span>Model: {GEMINI_LIVE_MODEL}</span>
            <button
              type="button"
              onClick={startConnection}
              className="text-[#C9A55C] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reconnect Live</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VoiceAssistantPanel;