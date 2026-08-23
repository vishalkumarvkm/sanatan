'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from "@google/genai";
import { UserProfile } from '@/types/onboarding';

// Types of voice states
export type VoiceState = 'idle' | 'connecting' | 'listening' | 'paused' | 'thinking' | 'speaking' | 'error';

interface VoiceAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuery?: (query: string) => void;
  profile?: Partial<UserProfile>;
}

const GEMINI_LIVE_MODEL = process.env.NEXT_PUBLIC_GEMINI_LIVE_MODEL || process.env.GEMINI_LIVE_MODEL || "gemini-3.1-flash-live-preview";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyD32ydW_3ArD6ePyd1PmIQdMvXUxBbJhmc";
const OUTPUT_SAMPLE_RATE = 24000;
const INPUT_SAMPLE_RATE = 16000;

export default function VoiceAssistantPanel({
  isOpen,
  onClose,
  onSendQuery,
  profile,
}: VoiceAssistantPanelProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Screen Wake Lock support
  const wakeLockRef = useRef<any>(null);
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator && (navigator as any).wakeLock) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch {}
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {}
  }, []);

  // Keep screen awake while voice panel is active
  useEffect(() => {
    if (isOpen) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isOpen, state, requestWakeLock, releaseWakeLock]);

  // Audio refs
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const scheduledEndRef = useRef(0);

  // Voice transcription accumulation refs
  const userSpeechAccumulatedRef = useRef<string>("");
  const aiSpeechAccumulatedRef = useRef<string>("");
  const sessionStartTimeRef = useRef<number | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());

  // Real-time audio amplitude for waveform syncing (0 to 1 scale)
  const [audioVolume, setAudioVolume] = useState(0);

  // Canvas waveform ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Trigger tactile haptics if available
  const triggerHaptic = (duration = 15) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch {}
    }
  };

  const ensurePlaybackCtx = async () => {
    if (!playbackCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      playbackCtxRef.current = new AudioCtx({
        sampleRate: OUTPUT_SAMPLE_RATE,
      });
    }
    if (playbackCtxRef.current.state === 'suspended') {
      await playbackCtxRef.current.resume();
    }
    return playbackCtxRef.current;
  };

  const scheduleAudioChunk = useCallback(async (base64Data: string) => {
    if (isMuted) return;
    try {
      const ctx = await ensurePlaybackCtx();
      const binary = atob(base64Data);
      const bytes = Uint8Array.from({ length: binary.length }, (_, i) => binary.charCodeAt(i));
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = Float32Array.from(pcm16, s => s / 32768.0);

      // Measure volume energy
      let sum = 0;
      for (let i = 0; i < float32.length; i++) {
        sum += float32[i] * float32[i];
      }
      const rms = Math.sqrt(sum / float32.length);
      
      // Update real-time speaker amplitude
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
  }, [isMuted]);

  const clearAudio = useCallback(() => {
    scheduledEndRef.current = 0;
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close().catch(() => {});
      playbackCtxRef.current = null;
    }
    setAudioVolume(0);
  }, []);

  const teardown = useCallback((preserveError = false) => {
    clearAudio();
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (sessionRef.current) {
      try {
        sessionRef.current.close();
      } catch (_) {}
      sessionRef.current = null;
    }
    userSpeechAccumulatedRef.current = "";
    aiSpeechAccumulatedRef.current = "";
    if (!preserveError) {
      setState('idle');
    }
    setAudioVolume(0);
  }, [clearAudio]);

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
      
      // Measure microphone input volume level for waveform animation
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
        sum += inputData[i] * inputData[i];
      }

      const rms = Math.sqrt(sum / inputData.length);
      if (state === 'listening') {
        setAudioVolume(Math.min(1.0, rms * 5.0));
      }

      if (rms > 0.005) {
        lastActivityTimeRef.current = Date.now();
      }

      const u8 = new Uint8Array(pcm16.buffer);
      let binary = '';
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

  const startConnection = useCallback(async () => {
    setState('connecting');
    setConnectionError(null);
    userSpeechAccumulatedRef.current = "";
    aiSpeechAccumulatedRef.current = "";

    try {
      // 1. Acquire mic stream first if not already active
      if (!micStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
          video: false
        });
        micStreamRef.current = stream;
        
        stream.getAudioTracks().forEach(track => {
          track.onended = () => {
            console.warn("Microphone track ended/revoked during session.");
            setState('error');
            setConnectionError('Microphone permission revoked during session.');
            teardown(true);
          };
        });
      }

      await ensurePlaybackCtx();

      // 2. Initialize GenAI Live API Client with requested Gemini Live model
      const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
      });

      const hasName = Boolean(profile?.name && profile.name.trim().length > 0);
      const pName = hasName ? profile!.name!.trim() : "";
      const pDevta = profile?.ishtDevta || "Shiva";
      const pLang = profile?.language || "English";

      const spiritualInstruction = `You are Sakha (सखा), a warm, wise, and trusted spiritual companion grounded in Sanatan Dharma.

## Identity & Boundaries
- Non-clinical digital spiritual coach drawing from Bhagavad Gita, Vedic life philosophy, Yoga Sutras, and Sanatan wisdom.
- You NEVER claim to be divine, a deity, or guru.
- You NEVER give medical, legal, or financial advice. For health: "This is beyond my wisdom — please speak with a doctor/professional."
- If user expresses self-harm or crisis, recommend: iCall (9152987821) or Vandrevala Foundation (9999 666 555).

## Voice Response Rules
1. Speak naturally, warmly, and soothingly in Hinglish / ${pLang}.
2. If user's name is available (${hasName ? pName : "none"}), address them by name. If no name is specified, greet directly with "Namaste" without using filler words like "Seeker".
3. Keep spoken responses brief (1 to 3 short sentences max). Never use long lists, markdown, or bullet points.
4. End with a gentle question or invitation.

[User Context]
Name: ${hasName ? pName : "Not specified"}
Isht Devta: ${pDevta}
Language: ${pLang}`;

      const sessionPromise = ai.live.connect({
        model: GEMINI_LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
          },
          systemInstruction: {
            parts: [{ text: spiritualInstruction }]
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setState('listening');
            sessionStartTimeRef.current = Date.now();
            sessionPromise.then(session => {
              sessionRef.current = session;
              
              try {
                const promptText = hasName 
                  ? `${pName} joined the voice session. Say a warm, brief 1-sentence welcome greeting ${pName} by name and inviting them to share their concern today under the grace of ${pDevta}.`
                  : `User joined the voice session. Say a warm, brief 1-sentence welcome greeting them directly with "Namaste" and inviting them to share their concern today under the grace of ${pDevta}. Do not use filler names like Seeker.`;
                session.sendClientContent({
                  turns: [{
                    role: 'user',
                    parts: [{ text: promptText }]
                  }],
                  turnComplete: true
                });
              } catch (e) {
                console.error('[Voice Assistant] Failed to send initial welcome prompt:', e);
              }
              
              startAudioProcessing();
            });
          },

          onmessage: async (msg: any) => {
            lastActivityTimeRef.current = Date.now();

            // 1. Play returned model voice audio
            const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio) {
              setState('speaking');
              scheduleAudioChunk(audio);
            }

            // 2. Handle interruption
            if (msg.serverContent?.interrupted) {
              clearAudio();
              setState('listening');
            }

            // 3. Process Live Transcriptions
            const userSpeech =
              msg.serverContent?.inputTranscription?.text ||
              msg.serverContent?.inputTranscription?.parts?.[0]?.text ||
              msg.inputAudioTranscription?.parts?.[0]?.text;
            if (userSpeech) {
              setTranscript(userSpeech);
              userSpeechAccumulatedRef.current += (userSpeech + " ");
            }

            const aiSpeech =
              msg.serverContent?.outputTranscription?.text ||
              msg.serverContent?.modelTurn?.parts?.[0]?.text ||
              msg.serverContent?.modelTurn?.parts?.find((p: any) => p.text)?.text;
            if (aiSpeech) {
              setTranscript(aiSpeech);
              aiSpeechAccumulatedRef.current += (aiSpeech + " ");
            }

            if (msg.serverContent?.turnComplete) {
              setState('listening');
              setAudioVolume(0);

              userSpeechAccumulatedRef.current = "";
              aiSpeechAccumulatedRef.current = "";
            }
          },

          onerror: (err: any) => {
            console.error('Live API error:', err);
            setState('error');
            setConnectionError('Voice connection error. Please try again.');
            teardown(true);
          },

          onclose: () => {
            teardown(false);
          }
        }
      });

      await sessionPromise;

    } catch (err: any) {
      console.error('Failed to connect to Gemini Live:', err);
      setState('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.toLowerCase().includes('permission')) {
        setConnectionError('Microphone access denied. Voice input cannot be used until microphone permission is granted.');
      } else {
        setConnectionError(err.message || 'Connection failed.');
      }
      teardown(true);
    }
  }, [scheduleAudioChunk, clearAudio, teardown, profile, onSendQuery]);

  const handleRetryPermission = async () => {
    triggerHaptic(20);
    setState('connecting');
    setConnectionError(null);
    startConnection();
  };

  // Reset transcript and connect on fresh open
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setConnectionError(null);
      triggerHaptic(20);
      startConnection();
    } else {
      teardown(false);
      setTranscript('');
    }
    return () => teardown(false);
  }, [isOpen, startConnection, teardown]);

  // Visual Waveform Animation Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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
      let amplitude = 0;
      let frequency = 0.015;
      let speedFactor = 1;

      if (state === 'listening') {
        amplitude = 6 + audioVolume * 32;
        frequency = 0.02;
        numWaves = 4;
        speedFactor = 1.1;
      } else if (state === 'speaking') {
        amplitude = 8 + audioVolume * 40;
        frequency = 0.025;
        numWaves = 5;
        speedFactor = 1.4;
      } else if (state === 'connecting') {
        amplitude = 4;
        frequency = 0.01;
        numWaves = 2;
        speedFactor = 0.5;
      } else {
        amplitude = 0.5;
        frequency = 0.005;
        numWaves = 1;
        speedFactor = 0.1;
      }

      ctx.lineWidth = 2.5;

      for (let i = 0; i < numWaves; i++) {
        ctx.beginPath();
        const wavePhase = phase * speedFactor + i * Math.PI / numWaves;
        const opacity = (1 - (i / numWaves)) * 0.45;
        ctx.strokeStyle = state === 'speaking' 
          ? `rgba(180, 57, 43, ${opacity})`
          : state === 'listening'
            ? `rgba(69, 97, 59, ${opacity})`
            : `rgba(54, 42, 34, ${opacity})`;

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
    }
  };

  const handleTryClose = () => {
    triggerHaptic(15);
    onClose();
  };

  // Inactivity timeout guard (45 seconds of silence)
  useEffect(() => {
    if (!isOpen || state === 'idle' || state === 'connecting' || state === 'error') {
      return;
    }

    lastActivityTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const inactiveMs = Date.now() - lastActivityTimeRef.current;
      if (inactiveMs >= 45000) {
        onClose();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, state, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-md p-0 md:p-4 animate-fade-in">
      
      <div className="absolute inset-0" onClick={handleTryClose} />

      <AnimatePresence>
          <motion.div
            initial={{ y: "100%", opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative w-full max-w-full md:max-w-[480px] bg-[#FFFDF9] 
              border border-[rgba(54,42,34,0.15)]
              rounded-t-[28px] md:rounded-[28px] shadow-2xl overflow-hidden
              min-h-[55vh] max-h-[85vh] md:h-auto flex flex-col z-50 p-5 sm:p-6 pb-8 md:pb-6 select-none text-[#362A22]"
          >
            {/* Minimal Drag Notch */}
            <div className="md:hidden w-12 h-1 rounded-full bg-[#362A22]/15 mx-auto -mt-2 mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {(state === 'listening' || state === 'speaking') && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B4392B] opacity-75" />
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    state === 'listening' ? 'bg-[#45613B]' :
                    state === 'speaking' ? 'bg-[#B4392B]' :
                    state === 'connecting' ? 'bg-[#EFCB86]' :
                    state === 'error' ? 'bg-red-500' : 'bg-neutral-400'
                  }`} />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#6B5C4E]">
                  {state === 'connecting' ? 'Connecting to Sakha...' :
                   state === 'listening' ? 'Sakha is listening...' :
                   state === 'speaking' ? 'Sakha is speaking...' :
                   state === 'error' ? 'Connection Error' : 'Ready'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTryClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B5C4E] hover:text-[#362A22] bg-[#FBF3E6] hover:bg-[#EDE7DC] transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            {state === 'error' ? (
              <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 animate-pulse">
                  <MicOff className="w-8 h-8" />
                </div>
                
                <h3 className="text-base font-bold uppercase tracking-wider mb-2 font-serif text-[#362A22]">
                  Microphone Access Required
                </h3>
                
                <p className="text-xs text-[#6B5C4E] leading-relaxed mb-6 max-w-[320px]">
                  {connectionError || 'Microphone access denied. Voice input cannot be used until microphone permission is granted.'}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleRetryPermission}
                    className="px-6 py-2.5 rounded-full bg-[#B4392B] hover:bg-[#8E2C21] text-[#FFFDF9] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
                
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <AnimatePresence>
                    {(state === 'listening' || state === 'speaking') && (
                      <>
                        <motion.div
                          animate={{ scale: 1.1 + audioVolume * 0.45 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full border border-[#B4392B]/20"
                        />
                        <motion.div
                          animate={{ scale: 1.02 + audioVolume * 0.25 }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full bg-[#B4392B]/5"
                        />
                      </>
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={(state === 'listening' || state === 'speaking') ? {
                      scale: 1 + audioVolume * 0.08,
                    } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleToggleMute}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 cursor-pointer shadow-md ${
                      state === 'listening'
                        ? 'bg-[#45613B] text-[#FFFDF9]'
                        : state === 'speaking'
                          ? 'bg-[#B4392B] text-[#FFFDF9]'
                          : 'bg-[#FBF3E6] text-[#6B5C4E]'
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="w-8 h-8 text-red-500" />
                    ) : (
                      <Mic className={`w-8 h-8 ${state === 'listening' ? 'stroke-[2.5]' : ''}`} />
                    )}
                  </motion.div>
                </div>

                {/* Real dynamic audio-synced waveform */}
                <div className="w-full h-16 mt-4 relative">
                  <canvas ref={canvasRef} className="w-full h-full block" />
                </div>

                {/* Static Voice Guidance Box */}
                <div className="w-full max-w-[340px] text-center min-h-[48px] px-4 mt-2 bg-[#FBF3E6]/60 border border-[rgba(54,42,34,0.1)] rounded-[16px] py-3 flex items-center justify-center">
                  <p className="text-sm font-medium text-[#362A22] leading-relaxed italic">
                    Boliye... Sakha aapke saath hai.
                  </p>
                </div>
              </div>
            )}

            <div className="h-4" />

          </motion.div>
      </AnimatePresence>

    </div>
  );
}

export { VoiceAssistantPanel };