'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from "@google/genai";
import { UserProfile } from '@/types/onboarding';
import { generateSakhaResponse } from '@/lib/gemini';

export type VoiceState = 'idle' | 'connecting' | 'listening' | 'paused' | 'thinking' | 'speaking' | 'error';

interface VoiceAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendQuery?: (query: string) => void;
  profile?: Partial<UserProfile>;
}

const OUTPUT_SAMPLE_RATE = 24000;
const INPUT_SAMPLE_RATE = 16000;

export default function VoiceAssistantPanel({
  isOpen,
  onClose,
  onSendQuery,
  profile,
}: VoiceAssistantPanelProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const stateRef = useRef<VoiceState>(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const hasConnectedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [userQueryInput, setUserQueryInput] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState(0);
  const audioVolumeRef = useRef(0);
  useEffect(() => {
    audioVolumeRef.current = audioVolume;
  }, [audioVolume]);

  // Audio & Mic refs
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const scheduledEndRef = useRef(0);
  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const userSpeechAccumulatedRef = useRef<string>("");
  const aiSpeechAccumulatedRef = useRef<string>("");
  const sessionStartTimeRef = useRef<number | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());
  const isSpeakingRef = useRef<boolean>(false);
  const volumeIntervalRef = useRef<any>(null);
  const isLiveWsRef = useRef<boolean>(false);

  // Screen Wake Lock
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

  useEffect(() => {
    if (isOpen) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
    return () => {
      releaseWakeLock();
    };
  }, [isOpen, requestWakeLock, releaseWakeLock]);

  const triggerHaptic = (duration = 15) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch {}
    }
  };

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
  }, []);

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
    stopSpeech();
    clearAudio();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

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

    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }

    analyserRef.current = null;
    userSpeechAccumulatedRef.current = "";
    aiSpeechAccumulatedRef.current = "";
    isLiveWsRef.current = false;

    if (!preserveError) {
      setState('idle');
    }
    setAudioVolume(0);
  }, [clearAudio, stopSpeech]);

  // Speak AI Text using Browser SpeechSynthesis (TTS)
  const speakResponse = useCallback((text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setState('listening');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').trim();
    if (!cleanText) {
      setState('listening');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    isSpeakingRef.current = true;
    setState('speaking');

    if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    volumeIntervalRef.current = setInterval(() => {
      if (!isSpeakingRef.current) {
        clearInterval(volumeIntervalRef.current);
        return;
      }
      setAudioVolume(0.2 + Math.random() * 0.5);
    }, 120);

    utterance.onend = () => {
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      isSpeakingRef.current = false;
      setAudioVolume(0);
      setState('listening');

      setTimeout(() => {
        try {
          if (recognitionRef.current && stateRef.current === 'listening') {
            recognitionRef.current.start();
          }
        } catch {}
      }, 300);
    };

    utterance.onerror = () => {
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      isSpeakingRef.current = false;
      setAudioVolume(0);
      setState('listening');
    };

    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  // Handle user speech query via secure server /api/sakha/chat
  const handleProcessQuery = useCallback(async (query: string) => {
    if (!query || !query.trim()) return;
    stopSpeech();
    setState('thinking');
    setAudioVolume(0.3);
    setUserQueryInput(query);

    if (onSendQuery) {
      onSendQuery(query);
    }

    try {
      const sakhaReply = await generateSakhaResponse(query, profile);
      setTranscript(sakhaReply);
      speakResponse(sakhaReply);
    } catch (err) {
      console.error("[Voice Assistant] Error calling backend API:", err);
      const errorMsg = "Man me shanti rakhein. Kripya punah prayaas karein.";
      setTranscript(errorMsg);
      speakResponse(errorMsg);
    }
  }, [onSendQuery, profile, speakResponse, stopSpeech]);

  const startAudioProcessing = useCallback(() => {
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
      if (stateRef.current === 'listening') {
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
  }, []);

  const startConnection = useCallback(async () => {
    setState('connecting');
    setConnectionError(null);
    userSpeechAccumulatedRef.current = "";
    aiSpeechAccumulatedRef.current = "";

    try {
      // 1. Acquire mic permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
      micStreamRef.current = stream;

      stream.getAudioTracks().forEach(track => {
        track.onended = () => {
          console.warn("Microphone track ended during session.");
          setState('error');
          setConnectionError('Microphone permission revoked during session.');
          teardown(true);
        };
      });

      // 2. Fetch runtime voice session token securely from server API route
      const tokenRes = await fetch('/api/sakha/voice-token');
      const tokenData = await tokenRes.json();

      // Connect to Gemini Live WebSocket via GoogleGenAI SDK
      const liveToken = tokenData.token || tokenData.accessToken;
      if (tokenData.success && liveToken) {
        isLiveWsRef.current = true;
        await ensurePlaybackCtx();

        const ai = new GoogleGenAI({
          apiKey: liveToken,
          httpOptions: { apiVersion: 'v1alpha' }
        });
        const hasName = Boolean(profile?.name && profile.name.trim().length > 0);
        const pName = hasName ? profile!.name!.trim() : "";
        const pDevta = profile?.ishtDevta || "Shiva";
        const pLang = profile?.language || "English";

        const spiritualInstruction = `You are Sakha (सखा), a warm, wise, and trusted spiritual companion grounded in Sanatan Dharma.
- Non-clinical digital spiritual coach drawing from Bhagavad Gita, Vedic life philosophy, and Sanatan wisdom.
- Speak naturally, warmly, and soothingly in Hinglish / ${pLang}. Keep responses brief (1-3 sentences max).
- Name: ${hasName ? pName : "Not specified"} | Isht Devta: ${pDevta}`;

        const sessionPromise = ai.live.connect({
          model: tokenData.model || "gemini-3.1-flash-live-preview",
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
                    ? `${pName} joined the voice session. Say a warm, brief 1-sentence welcome greeting ${pName} by name under the grace of ${pDevta}.`
                    : `User joined the voice session. Say a warm, brief 1-sentence welcome greeting them directly with "Namaste" under the grace of ${pDevta}.`;
                  session.sendClientContent({
                    turns: [{ role: 'user', parts: [{ text: promptText }] }],
                    turnComplete: true
                  });
                } catch (e) {}
                startAudioProcessing();
              });
            },
            onmessage: async (msg: any) => {
              lastActivityTimeRef.current = Date.now();
              const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audio) {
                setState('speaking');
                scheduleAudioChunk(audio);
              }
              if (msg.serverContent?.interrupted) {
                clearAudio();
                setState('listening');
              }
              const userSpeech = msg.serverContent?.inputTranscription?.text || msg.inputAudioTranscription?.parts?.[0]?.text;
              if (userSpeech) setTranscript(userSpeech);
              const aiSpeech = msg.serverContent?.outputTranscription?.text || msg.serverContent?.modelTurn?.parts?.[0]?.text;
              if (aiSpeech) setTranscript(aiSpeech);
              if (msg.serverContent?.turnComplete) {
                setState('listening');
                setAudioVolume(0);
              }
            },
            onerror: (err: any) => {
              console.warn('Live WS API notice:', err);
              setState('error');
              setConnectionError('Voice connection notice. Please try again.');
              teardown(true);
            },
            onclose: () => teardown(false)
          }
        });
        await sessionPromise;
        return;
      }

      // 3. Fallback: Secure Server Voice mode via /api/sakha/chat (0 API keys exposed!)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        if (!analyserRef.current || isSpeakingRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normVol = Math.min(1.0, avg / 128);
        setAudioVolume(normVol);
      };

      setInterval(checkVolume, 50);

      const SpeechRecognition = typeof window !== 'undefined'
        ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
        : null;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = profile?.language === 'Hindi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setUserQueryInput(currentTranscript);
          }

          if (event.results[0].isFinal && currentTranscript.trim()) {
            handleProcessQuery(currentTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'aborted' || event.error === 'no-speech') return;
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setState('error');
            setConnectionError('Microphone permission was denied by your browser.');
            teardown(true);
          }
        };

        recognition.onend = () => {
          if (stateRef.current === 'listening' && isOpen && !isSpeakingRef.current) {
            try { recognition.start(); } catch {}
          }
        };

        recognitionRef.current = recognition;
        try { recognition.start(); } catch {}
      }

      setState('listening');
      const userHasName = Boolean(profile?.name && profile.name.trim().length > 0);
      const greetingHint = userHasName
        ? `Namaste ${profile!.name!.trim()}! Boliye... Sakha aapke saath hai.`
        : `Namaste! Boliye... Sakha aapke saath hai.`;
      setTranscript(greetingHint);

    } catch (err: any) {
      console.error('[Voice Assistant] Connection error:', err);
      setState('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.toLowerCase().includes('permission')) {
        setConnectionError('Microphone access denied. Please grant microphone permission in your browser.');
      } else {
        setConnectionError(err.message || 'Connection failed.');
      }
      teardown(true);
    }
  }, [scheduleAudioChunk, startAudioProcessing, teardown, profile, onSendQuery, handleProcessQuery]);

  const handleRetryPermission = async () => {
    triggerHaptic(20);
    setState('connecting');
    setConnectionError(null);
    startConnection();
  };

  useEffect(() => {
    if (isOpen) {
      if (!hasConnectedRef.current) {
        hasConnectedRef.current = true;
        setTranscript('');
        setConnectionError(null);
        triggerHaptic(20);
        startConnection();
      }
    } else {
      hasConnectedRef.current = false;
      teardown(false);
      setTranscript('');
    }
    return () => {
      hasConnectedRef.current = false;
      teardown(false);
    };
  }, [isOpen, startConnection, teardown]);

  // Waveform canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    let smoothedVolume = 0;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
    };

    updateSize();

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth volume interpolation to prevent jumpy waves
      const targetVol = audioVolumeRef.current;
      smoothedVolume += (targetVol - smoothedVolume) * 0.12;

      phase += 0.05;

      let numWaves = 3;
      let amplitude = 0;
      let frequency = 0.015;
      let speedFactor = 1;

      const currentState = stateRef.current;

      if (currentState === 'listening') {
        amplitude = 8 + smoothedVolume * 36;
        frequency = 0.018;
        numWaves = 4;
        speedFactor = 1.0;
      } else if (currentState === 'speaking') {
        amplitude = 10 + smoothedVolume * 42;
        frequency = 0.022;
        numWaves = 5;
        speedFactor = 1.3;
      } else if (currentState === 'thinking' || currentState === 'connecting') {
        amplitude = 4;
        frequency = 0.01;
        numWaves = 2;
        speedFactor = 0.5;
      } else {
        amplitude = 1;
        frequency = 0.005;
        numWaves = 1;
        speedFactor = 0.15;
      }

      ctx.lineWidth = 2.2;

      for (let i = 0; i < numWaves; i++) {
        ctx.beginPath();
        const wavePhase = phase * speedFactor + (i * Math.PI) / numWaves;
        const opacity = (1 - i / numWaves) * 0.45;
        ctx.strokeStyle =
          currentState === 'speaking'
            ? `rgba(180, 57, 43, ${opacity})`
            : currentState === 'listening'
            ? `rgba(69, 97, 59, ${opacity})`
            : `rgba(54, 42, 34, ${opacity})`;

        for (let x = 0; x <= width; x += 2) {
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
      isRunning = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [state]);

  const handleMicButtonClick = () => {
    triggerHaptic(15);
    if (state === 'speaking') {
      stopSpeech();
      setState('listening');
      try { recognitionRef.current?.start(); } catch {}
    } else if (state === 'listening') {
      if (userQueryInput && userQueryInput.trim()) {
        handleProcessQuery(userQueryInput.trim());
      }
    }
  };

  const handleToggleMute = () => {
    triggerHaptic(15);
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
      stopSpeech();
      clearAudio();
    }
  };

  const handleTryClose = () => {
    triggerHaptic(15);
    onClose();
  };

  const quickPrompts = [
    "Mujhe shanti chahiye",
    "Din ki shuruaat kaise karun?",
    "Bhagavad Gita se prerna"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-md p-0 md:p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={handleTryClose} />

      <AnimatePresence>
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-full md:max-w-[480px] bg-[#FFFDF9] 
            border border-[rgba(54,42,34,0.15)]
            rounded-t-[28px] md:rounded-[28px] shadow-2xl overflow-hidden
            min-h-[55vh] max-h-[85vh] md:h-auto flex flex-col z-50 p-5 sm:p-6 pb-8 md:pb-6 select-none text-[#362A22]"
        >
          {/* Drag Notch */}
          <div className="md:hidden w-12 h-1 rounded-full bg-[#362A22]/15 mx-auto -mt-2 mb-4" />

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {(state === 'listening' || state === 'speaking' || state === 'thinking') && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B4392B] opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    state === 'listening'
                      ? 'bg-[#45613B]'
                      : state === 'speaking'
                      ? 'bg-[#B4392B]'
                      : state === 'thinking' || state === 'connecting'
                      ? 'bg-[#EFCB86]'
                      : state === 'error'
                      ? 'bg-red-500'
                      : 'bg-neutral-400'
                  }`}
                />
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#6B5C4E]">
                {state === 'connecting'
                  ? 'Connecting to Sakha Voice...'
                  : state === 'listening'
                  ? 'Sakha is listening...'
                  : state === 'thinking'
                  ? 'Sakha is reflecting...'
                  : state === 'speaking'
                  ? 'Sakha is speaking...'
                  : state === 'error'
                  ? 'Connection Error'
                  : 'Ready'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B5C4E] hover:text-[#362A22] bg-[#FBF3E6] hover:bg-[#EDE7DC] transition cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
              </button>

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
                {connectionError ||
                  'Microphone access denied. Voice input cannot be used until microphone permission is granted.'}
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
            <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <AnimatePresence>
                  {(state === 'listening' || state === 'speaking') && (
                    <>
                      <motion.div
                        animate={{ scale: 1.1 + audioVolume * 0.45 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border border-[#B4392B]/20"
                      />
                      <motion.div
                        animate={{ scale: 1.02 + audioVolume * 0.25 }}
                        transition={{ duration: 0.1, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full bg-[#B4392B]/5"
                      />
                    </>
                  )}
                </AnimatePresence>

                <motion.div
                  animate={
                    state === 'listening' || state === 'speaking'
                      ? {
                          scale: 1 + audioVolume * 0.08,
                        }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.15 }}
                  onClick={handleMicButtonClick}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 cursor-pointer shadow-md active:scale-95 ${
                    state === 'listening'
                      ? 'bg-[#45613B] text-[#FFFDF9]'
                      : state === 'speaking'
                      ? 'bg-[#B4392B] text-[#FFFDF9]'
                      : state === 'thinking'
                      ? 'bg-[#EFCB86] text-[#362A22]'
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

              {/* Dynamic Waveform Canvas */}
              <div className="w-full h-14 mt-3 relative">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>

              {/* Guidance Box */}
              <div className="w-full max-w-[360px] text-center min-h-[64px] px-5 mt-2 bg-gradient-to-b from-[#FBF3E6]/90 to-[#FAF1E4]/70 border border-[rgba(54,42,34,0.12)] rounded-[20px] py-3 flex flex-col items-center justify-center shadow-inner transition-all">
                <p className="text-[13px] font-semibold text-[#362A22] leading-relaxed italic tracking-wide font-serif">
                  {state === 'connecting'
                    ? 'Connecting to Sakha Live...'
                    : state === 'listening'
                    ? 'Namaste! Boliye... Sakha aapke saath hai.'
                    : state === 'speaking'
                    ? 'Sakha is speaking...'
                    : state === 'thinking'
                    ? 'Sakha AI is reflecting...'
                    : 'Sakha Voice Assistant'}
                </p>
              </div>



            </div>
          )}

          <div className="h-2" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { VoiceAssistantPanel };