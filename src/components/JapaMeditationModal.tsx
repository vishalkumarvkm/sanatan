"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Flame, 
  CheckCircle,
  Clock,
  Music
} from "lucide-react";

interface JapaMeditationModalProps {
  isOpen?: boolean;
  onClose: () => void;
  defaultMantra?: string;
}

export const JapaMeditationModal: React.FC<JapaMeditationModalProps> = ({
  isOpen = true,
  onClose,
  defaultMantra = "ॐ नमः शिवाय",
}) => {
  const [activeTab, setActiveTab] = useState<"japa" | "meditation">("japa");
  
  // Japa Bead States
  const [beadCount, setBeadCount] = useState(0);
  const [completedMalas, setCompletedMalas] = useState(0);
  const [selectedMantra, setSelectedMantra] = useState(defaultMantra);

  // Meditation States
  const [selectedAudioTrack, setSelectedAudioTrack] = useState("432Hz Om Cosmic Vibrations");
  const [timerDuration, setTimerDuration] = useState(600); // 10 mins in seconds
  const [timeLeft, setTimeLeft] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const mantras = [
    "ॐ नमः शिवाय",
    "ॐ नमो भगवते वासुदेवाय",
    "ॐ श्री रामाय नमः",
    "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं",
    "ॐ दुं दुर्गायै नमः",
    "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
  ];

  const ambientTracks = [
    { title: "432Hz Om Cosmic Vibrations", desc: "Pure Sanskrit Om frequencies for deep focus" },
    { title: "528Hz Transformation & Miracle", desc: "Solfeggio healing frequency for inner peace" },
    { title: "Varanasi Ghats & Temple Flute", desc: "Resonant temple bells and evening Ganga flute" },
    { title: "Brahma Muhurta Dawn Chirps & Tanpura", desc: "Natural early morning bird chimes & tanpura" },
  ];

  // Japa Bead Tap Handler
  const handleTapBead = () => {
    // Sound chime
    try {
      const audio = new Audio("https://cdn.freesound.org/previews/530/530635_11861866-lq.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}

    if (beadCount + 1 >= 108) {
      setBeadCount(0);
      setCompletedMalas((prev) => prev + 1);
    } else {
      setBeadCount((prev) => prev + 1);
    }
  };

  // Meditation Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      try {
        const audio = new Audio("https://cdn.freesound.org/previews/530/530635_11861866-lq.mp3");
        audio.volume = 0.8;
        audio.play().catch(() => {});
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadein font-sans select-none">
      <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-3xl max-w-lg w-full p-6 flex flex-col gap-5 shadow-[0_0_50px_rgba(201,165,92,0.3)] relative text-left overflow-hidden">
        {/* Background ambient radial glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#C9A55C]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/40 flex items-center justify-center text-[#C9A55C]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-fraunces text-lg font-bold text-white">
                Sadhana Sanctuary
              </h3>
              <p className="text-[10px] text-white/50">
                108 Japa Bead Wheel & Guided Dhyana Meditation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tab Switcher (Japa Mala vs Dhyana Meditation) */}
        <div className="grid grid-cols-2 gap-2 bg-[#0A0A0A] p-1.5 rounded-2xl border border-white/10 z-10">
          <button
            type="button"
            onClick={() => setActiveTab("japa")}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "japa"
                ? "bg-[#C9A55C] text-[#0A0A0A] shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>📿 108 Japa Wheel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("meditation")}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "meditation"
                ? "bg-[#C9A55C] text-[#0A0A0A] shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span>🧘 Dhyana Meditation</span>
          </button>
        </div>

        {/* TAB 1: 108 JAPA BEAD WHEEL */}
        {activeTab === "japa" && (
          <div className="flex flex-col gap-4 z-10 animate-fadein">
            {/* Mantra Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                Select Sacred Mantra
              </label>
              <select
                value={selectedMantra}
                onChange={(e) => setSelectedMantra(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 focus:border-[#C9A55C] rounded-xl p-3 text-xs font-semibold text-white outline-none devanagari-font"
              >
                {mantras.map((m) => (
                  <option key={m} value={m} className="bg-[#141414] text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Rotating Japa Wheel */}
            <div className="flex flex-col items-center my-2">
              <div
                onClick={handleTapBead}
                className="relative w-48 h-48 rounded-full border-4 border-[#C9A55C]/40 bg-[#0A0A0A] flex flex-col items-center justify-center cursor-pointer shadow-[0_0_35px_rgba(201,165,92,0.3)] hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              >
                {/* Rotating Bead Dots Ring */}
                <div
                  className="absolute inset-0 rounded-full border border-dashed border-[#C9A55C]/30"
                  style={{
                    transform: `rotate(${beadCount * (360 / 108)}deg)`,
                    transition: "transform 0.15s ease-out",
                  }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2.5 h-2.5 bg-[#C9A55C] rounded-full shadow-[0_0_6px_#C9A55C]"
                      style={{
                        transform: `rotate(${i * 30}deg) translate(88px)`,
                      }}
                    />
                  ))}
                </div>

                <span className="devanagari-font text-lg font-bold text-[#C9A55C] mb-1 text-center px-4">
                  {selectedMantra}
                </span>

                <div className="font-serif-fraunces text-3xl font-bold text-white">
                  {beadCount} <span className="text-sm font-normal text-white/40">/ 108</span>
                </div>

                <span className="text-[10px] text-white/50 mt-1 uppercase font-bold tracking-wider group-hover:text-[#C9A55C]">
                  Tap to Chant 📿
                </span>
              </div>
            </div>

            {/* Malas Completed Stats */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#E8722A] fill-[#E8722A]" />
                <span className="text-white/70">Completed Malas Today</span>
              </div>
              <span className="font-serif-fraunces text-base font-bold text-[#C9A55C]">
                {completedMalas} Malas ({(completedMalas * 108) + beadCount} Chants)
              </span>
            </div>

            {/* Reset Action */}
            <button
              type="button"
              onClick={() => {
                setBeadCount(0);
                setCompletedMalas(0);
              }}
              className="text-xs text-white/40 hover:text-white flex items-center justify-center gap-1.5 self-center cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Japa Counter</span>
            </button>
          </div>
        )}

        {/* TAB 2: GUIDED DHYANA MEDITATION PLAYER */}
        {activeTab === "meditation" && (
          <div className="flex flex-col gap-4 z-10 animate-fadein">
            {/* Timer Display */}
            <div className="bg-[#0A0A0A] border border-[#C9A55C]/40 rounded-2xl p-5 flex flex-col items-center text-center shadow-inner">
              <div className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-widest mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Dhyana Timer</span>
              </div>

              <div className="font-serif-fraunces text-4xl font-bold text-white my-1 tracking-wider">
                {formatTime(timeLeft)}
              </div>

              <span className="text-xs text-white/60 font-medium">
                {selectedAudioTrack}
              </span>

              {/* Controls */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="bg-[#C9A55C] hover:bg-[#B8944B] text-[#0A0A0A] font-bold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isTimerRunning ? "Pause Dhyana" : "Begin Meditation"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(timerDuration);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white/50 uppercase">Duration:</span>
              {[
                { label: "5 Mins", sec: 300 },
                { label: "10 Mins", sec: 600 },
                { label: "20 Mins", sec: 1200 },
              ].map((d) => (
                <button
                  key={d.sec}
                  type="button"
                  onClick={() => {
                    setTimerDuration(d.sec);
                    setTimeLeft(d.sec);
                    setIsTimerRunning(false);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    timerDuration === d.sec
                      ? "bg-[#C9A55C]/20 border-[#C9A55C] text-[#C9A55C]"
                      : "bg-[#0A0A0A] border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Ambient Soundscapes List */}
            <div className="flex flex-col gap-2">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C] flex items-center gap-1">
                <Music className="w-3.5 h-3.5" />
                <span>Ambient Soundscapes</span>
              </label>

              {ambientTracks.map((track) => {
                const isSelected = selectedAudioTrack === track.title;
                return (
                  <button
                    key={track.title}
                    type="button"
                    onClick={() => setSelectedAudioTrack(track.title)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#C9A55C]/15 border-[#C9A55C] text-white"
                        : "bg-[#0A0A0A] border-white/8 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{track.title}</span>
                      <span className="text-[10px] text-white/40">{track.desc}</span>
                    </div>
                    {isSelected && <Volume2 className="w-4 h-4 text-[#C9A55C] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
