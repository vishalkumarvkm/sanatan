"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart, Share2, Volume2, VolumeX, Sparkles, Disc, MessageCircle, Play, Pause } from "lucide-react";
import { fetchSpiritualShorts } from "@/lib/api";

export interface SpiritualShortItem {
  id: string;
  deity: string;
  title: string;
  description: string;
  sanskritCaption: string;
  likesCount: string;
  diyasCount: string;
  bgImage: string;
  audioTitle: string;
  audioUrl: string;
  askPrompt: string;
}

const DEFAULT_SHORTS: SpiritualShortItem[] = [
  {
    id: "reel-1",
    deity: "Lord Shiva 🔱",
    title: "Mangala Aarti at Kashi Vishwanath Sanctum",
    description: "Experience the sacred vibrations of Bhasma Aarti at Varanasi. Tap to offer flowers & diya!",
    sanskritCaption: "ॐ नमः शिवाय ॥ हर हर महादेव",
    likesCount: "24.8K",
    diyasCount: "12.4K",
    bgImage: "/images/kashi_darshan.png",
    audioTitle: "Shiva Tandav Stotram • Studio Resonance",
    audioUrl: "/Shiv%20Tandav%20Stotram%20Mp3%20Download.mp3",
    askPrompt: "Explain the spiritual significance of Kashi Vishwanath Bhasma Aarti",
  },
  {
    id: "reel-2",
    deity: "Lord Krishna 🪈",
    title: "Karma Yoga in Daily Life — Gita Chapter 2 Verse 47",
    description: "Perform your duty with complete devotion without attachment to outcomes.",
    sanskritCaption: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।",
    likesCount: "41.2K",
    diyasCount: "18.9K",
    bgImage: "/images/lord_krishna.png",
    audioTitle: "Madhurashtakam • Flute Resonance",
    audioUrl: "/Madhurashtakam.mp3",
    askPrompt: "How can I apply Gita Chapter 2 Verse 47 Karma Yoga in my daily work?",
  },
  {
    id: "reel-3",
    deity: "Lord Shiva 🔱",
    title: "Sacred Bilva Patram & Chandan Abhishekam",
    description: "Offering three-leaf Bilva patram dissolves karmic bondages of past, present, and future.",
    sanskritCaption: "त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रयायुधम् । त्रिपापसंहारं एकबिल्वं शिवार्पणम् ॥",
    likesCount: "19.5K",
    diyasCount: "9.8K",
    bgImage: "/images/bilva_offering.png",
    audioTitle: "Mahamrityunjaya Chants • 108 Loop",
    audioUrl: "/Om%20Tryambakam%20Yajamahe%20Sugandhim%20Pushtivardhanam%20-%20Mantra.mp3",
    askPrompt: "What is the spiritual significance of offering Bilva leaves to Lord Shiva?",
  },
  {
    id: "reel-4",
    deity: "Lord Hanuman 🚩",
    title: "Hanuman Chalisa — Divine Protection & Strength",
    description: "Chanting Hanuman Chalisa eliminates all fear, sorrow, and negative energies.",
    sanskritCaption: "भूत पिशाच निकट नहिं आवै । महाबीर जब नाम सुनावै ॥",
    likesCount: "58.1K",
    diyasCount: "31.2K",
    bgImage: "/images/lord_shiva.png",
    audioTitle: "Hanuman Chalisa • Full Recitation",
    audioUrl: "/Hanuman-Chalisa-Jai-Hanuman-Gyan-Gun-Sagar.mp3",
    askPrompt: "What are the benefits of daily Hanuman Chalisa chanting?",
  },
  {
    id: "reel-5",
    deity: "Maa Durga 🔱",
    title: "Durga Chalisa — Divine Shakti Chants",
    description: "Invocation of Maa Durga's cosmic shakti energy for courage and spiritual liberation.",
    sanskritCaption: "नमो नमो दुर्गे सुख करनी । नमो नमो अम्बे दुःख हरनी ॥",
    likesCount: "33.7K",
    diyasCount: "15.8K",
    bgImage: "/images/kashi_darshan.png",
    audioTitle: "Durga Chalisa • Divine Chants",
    audioUrl: "/Durga-Chalisa.mp3",
    askPrompt: "What is the spiritual significance of chanting Durga Chalisa?",
  },
  {
    id: "reel-6",
    deity: "Lord Rama 🏹",
    title: "Shri Ramchandra Kripalu Bhajman — Divine Stuti",
    description: "Celebration of Lord Rama's grace, nobility, and righteousness.",
    sanskritCaption: "श्रीरामचन्द्र कृपालु भजु मन हरण भवभय दारुणम् ।",
    likesCount: "45.9K",
    diyasCount: "22.1K",
    bgImage: "/images/lord_krishna.png",
    audioTitle: "Shri Ramchandra Kripalu Bhajman",
    audioUrl: "/Shri%20Ramchandra%20Kripalu%20Bhajman.mp3",
    askPrompt: "Explain the devotional meaning of Shri Ramchandra Kripalu Bhajman",
  },
  {
    id: "reel-7",
    deity: "Lord Vishnu 🪷",
    title: "Om Namo Bhagavate Vasudevaya — Maha Mantra",
    description: "12-syllable liberation mantra dedicated to Lord Vishnu and Lord Krishna.",
    sanskritCaption: "ॐ नमो भगवते वासुदेवाय ॥",
    likesCount: "52.4K",
    diyasCount: "28.3K",
    bgImage: "/images/bilva_offering.png",
    audioTitle: "Om Namo Bhagavate Vasudevaya",
    audioUrl: "/om_namo_bhagwate.mp3",
    askPrompt: "What are the spiritual benefits of Om Namo Bhagavate Vasudevaya mantra?",
  },
];

interface SpiritualShortsReelsProps {
  onAskSakha: (prompt: string) => void;
}

export const SpiritualShortsReels: React.FC<SpiritualShortsReelsProps> = ({ onAskSakha }) => {
  const [shortsList, setShortsList] = useState<SpiritualShortItem[]>(DEFAULT_SHORTS);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [diyaOfferedMap, setDiyaOfferedMap] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [showPlayIndicator, setShowPlayIndicator] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSpiritualShorts()
      .then((res) => {
        if (res.success && res.shorts && res.shorts.length > 0) {
          setShortsList(res.shorts);
        }
      })
      .catch((err) => {
        console.warn("[ShortsReels] Backend fetch error:", err);
      });
  }, []);

  // Sync music playback when active reel or mute status changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    const audio = audioRef.current;
    const currentReel = shortsList[activeReelIndex];

    if (currentReel && currentReel.audioUrl) {
      const currentSrc = audio.src || "";
      const newUrl = currentReel.audioUrl;
      
      if (!currentSrc.includes(encodeURI(newUrl)) && !currentSrc.includes(newUrl)) {
        audio.src = newUrl;
        audio.currentTime = 0;
      }

      if (!isMuted && isPlaying) {
        audio.play().catch((err) => {
          console.warn("Audio play error (user interaction required on first load):", err);
        });
      } else {
        audio.pause();
      }
    }

    return () => {
      audio.pause();
    };
  }, [activeReelIndex, isMuted, isPlaying, shortsList]);

  // Toggle Play / Pause audio & video stream
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (isMuted) setIsMuted(false);
      audioRef.current.play().catch(console.warn);
      setIsPlaying(true);
    }
    setShowPlayIndicator(true);
    setTimeout(() => {
      setShowPlayIndicator(false);
    }, 1200);
  };

  // Handle scroll detection for active reel
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const height = container.clientHeight;
    const index = Math.round(container.scrollTop / height);
    if (index !== activeReelIndex && index >= 0 && index < shortsList.length) {
      setActiveReelIndex(index);
      setIsPlaying(true);
    }
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDiya = (id: string) => {
    setDiyaOfferedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeReel = shortsList[activeReelIndex] || shortsList[0];

  return (
    <div className="w-full h-[calc(100dvh-130px)] md:h-[calc(100vh-100px)] bg-[#050505] text-white relative font-sans flex justify-center">
      {/* Snap Scroll Reels Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full max-w-md h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar relative bg-black shadow-2xl rounded-2xl border border-white/10"
      >
        {shortsList.map((reel, idx) => {
          const isLiked = Boolean(likedMap[reel.id]);
          const isDiyaOffered = Boolean(diyaOfferedMap[reel.id]);

          return (
            <div
              key={reel.id}
              className="w-full h-full snap-start snap-always relative flex flex-col justify-end p-5 shrink-0 overflow-hidden"
            >
              {/* Reel Background Image & Gradient Overlays */}
              <img
                src={reel.bgImage}
                alt={reel.title}
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20 pointer-events-none" />

              {/* Center Tap Area to Pause / Play */}
              <div
                onClick={togglePlayPause}
                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center"
              >
                {(!isPlaying || showPlayIndicator) && (
                  <div className="w-16 h-16 rounded-full bg-black/60 border border-[#C9A55C]/60 text-[#C9A55C] flex items-center justify-center backdrop-blur-md shadow-[0_0_25px_rgba(201,165,92,0.4)] transition-all transform scale-110 pointer-events-none">
                    {!isPlaying ? (
                      <Play className="w-8 h-8 fill-current ml-1" />
                    ) : (
                      <Pause className="w-8 h-8 fill-current" />
                    )}
                  </div>
                )}
              </div>

              {/* Top Header Overlay Bar */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                <span className="text-xs font-bold text-[#C9A55C] bg-black/60 border border-[#C9A55C]/40 px-3 py-1 rounded-full backdrop-blur-md">
                  {reel.deity}
                </span>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-9 h-9 rounded-full bg-black/60 border border-white/20 text-[#C9A55C] flex items-center justify-center backdrop-blur-md cursor-pointer hover:bg-black/80 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
                </button>
              </div>

              {/* Floating Right Action Column */}
              <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-5">
                {/* Like Heart */}
                <button
                  type="button"
                  onClick={() => toggleLike(reel.id)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform group-hover:scale-110 active:scale-90 ${
                      isLiked
                        ? "bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                        : "bg-black/60 border-white/20 text-white"
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white shadow-xs">
                    {isLiked ? "Liked" : reel.likesCount}
                  </span>
                </button>

                {/* Offer Diya */}
                <button
                  type="button"
                  onClick={() => toggleDiya(reel.id)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform group-hover:scale-110 active:scale-90 ${
                      isDiyaOffered
                        ? "bg-[#C9A55C]/30 border-[#C9A55C] text-[#C9A55C] shadow-[0_0_15px_rgba(201,165,92,0.6)] animate-pulse"
                        : "bg-black/60 border-white/20 text-white"
                    }`}
                  >
                    <span className="text-xl">🪔</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#C9A55C] shadow-xs">
                    {isDiyaOffered ? "Offered" : reel.diyasCount}
                  </span>
                </button>

                {/* Ask Sakha AI */}
                <button
                  type="button"
                  onClick={() => onAskSakha(reel.askPrompt)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                  title="Ask Sakha AI"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C9A55C] to-[#A88238] border border-white/30 text-[#0A0A0A] flex items-center justify-center shadow-[0_0_15px_rgba(201,165,92,0.5)] group-hover:scale-110 active:scale-90 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-[#C9A55C] tracking-wide">
                    Ask Sakha
                  </span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => alert(`Reel link copied: ${reel.title}`)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md group-hover:scale-110 active:scale-90 transition-transform">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-white/70">Share</span>
                </button>
              </div>

              {/* Bottom Metadata Overlay */}
              <div className="relative z-10 flex flex-col gap-2 max-w-[80%] text-left">
                {/* Devanagari Caption Banner */}
                <div className="devanagari-font text-base sm:text-lg font-bold text-[#C9A55C] leading-snug drop-shadow-md">
                  {reel.sanskritCaption}
                </div>

                {/* Title & Description */}
                <h3 className="font-serif-fraunces text-base font-bold text-white drop-shadow-md">
                  {reel.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed line-clamp-2 drop-shadow-xs">
                  {reel.description}
                </p>

                {/* Spinning Audio Track Banner */}
                <div className="flex items-center gap-2 pt-1">
                  <Disc className={`w-4 h-4 text-[#C9A55C] ${!isMuted ? "animate-spin" : ""}`} />
                  <span className="text-[11px] text-white/70 font-semibold truncate max-w-[200px]">
                    {reel.audioTitle}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpiritualShortsReels;
