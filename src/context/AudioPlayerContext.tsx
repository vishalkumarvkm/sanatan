"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { BhajanTrack } from "@/types/onboarding";

export interface ShrineTrack extends BhajanTrack {
  icon: string;
  audioUrl: string;
}

export const bhajanPlaylist: ShrineTrack[] = [
  {
    id: "1",
    title: "Shiva Tandav Stotram",
    deity: "Shiva",
    duration: "3:08",
    icon: "🔱",
    audioUrl: "/Shiv%20Tandav%20Stotram%20Mp3%20Download.mp3",
  },
  {
    id: "2",
    title: "Om Namah Shivaya",
    deity: "Shiva",
    duration: "4:22",
    icon: "🪷",
    audioUrl: "/om_namo_bhagwate.mp3",
  },
  {
    id: "3",
    title: "Mahamrityunjaya Mantra",
    deity: "Shiva",
    duration: "3:53",
    icon: "🔱",
    audioUrl: "/Om%20Tryambakam%20Yajamahe%20Sugandhim%20Pushtivardhanam%20-%20Mantra.mp3",
  },
  {
    id: "4",
    title: "Hanuman Chalisa",
    deity: "Hanuman",
    duration: "9:30",
    icon: "🚩",
    audioUrl: "/Hanuman-Chalisa-Jai-Hanuman-Gyan-Gun-Sagar.mp3",
  },
  {
    id: "5",
    title: "Ganesh Atharvashirsha",
    deity: "Ganesha",
    duration: "6:15",
    icon: "🐘",
    audioUrl: "/c1cd4c4a29572d1cfa44ccc9c39a633ed22aafad.mp3",
  },
  {
    id: "6",
    title: "Madhurashtakam",
    deity: "Krishna",
    duration: "4:50",
    icon: "🪈",
    audioUrl: "/Madhurashtakam.mp3",
  },
  {
    id: "7",
    title: "Shri Ramchandra Kripalu",
    deity: "Ram",
    duration: "6:24",
    icon: "🏹",
    audioUrl: "/Shri%20Ramchandra%20Kripalu%20Bhajman.mp3",
  },
  {
    id: "8",
    title: "Durga Chalisa & Aarti",
    deity: "Devi",
    duration: "8:15",
    icon: "🌺",
    audioUrl: "/Durga-Chalisa.mp3",
  },
];

export const formatTime = (sec: number): string => {
  if (!sec || isNaN(sec)) return "0:00";
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

interface AudioPlayerContextType {
  currentTrackIndex: number;
  currentTrack: ShrineTrack;
  isPlaying: boolean;
  progress: number;
  currentTimeSec: number;
  durationSec: number;
  volume: number;
  isLiked: boolean;
  playlist: ShrineTrack[];
  togglePlay: () => void;
  playTrack: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (percent: number) => void;
  setVolume: (val: number) => void;
  toggleLike: () => void;
  isFullScreenPlayerOpen: boolean;
  setIsFullScreenPlayerOpen: (open: boolean) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFullScreenPlayerOpen, setIsFullScreenPlayerOpen] = useState(false);

  const currentTrack = bhajanPlaylist[currentTrackIndex] || bhajanPlaylist[0];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    audio.volume = volume / 100;

    const handleTimeUpdate = () => {
      const cur = audio.currentTime;
      const dur = audio.duration || 1;
      setCurrentTimeSec(cur);
      setDurationSec(dur);
      setProgress((cur / dur) * 100);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const currentSrc = audio.getAttribute("src");
      if (currentSrc !== currentTrack.audioUrl) {
        audio.src = currentTrack.audioUrl;
        audio.load();
        if (isPlaying) {
          audio.play().catch((err) => {
            console.warn("Autoplay was prevented:", err);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrackIndex]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (isPlaying) {
        if (!audio.src || audio.getAttribute("src") !== currentTrack.audioUrl) {
          audio.src = currentTrack.audioUrl;
        }
        audio.play().catch((err) => {
          console.warn("Playback error:", err);
          setIsPlaying(false);
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const playTrack = (index: number) => {
    if (index === currentTrackIndex) {
      setIsPlaying(true);
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % bhajanPlaylist.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + bhajanPlaylist.length) % bhajanPlaylist.length);
    setIsPlaying(true);
  };

  const seekTo = (percent: number) => {
    setProgress(percent);
    if (audioRef.current && durationSec) {
      audioRef.current.currentTime = (percent / 100) * durationSec;
    }
  };

  const toggleLike = () => {
    setIsLiked((prev) => !prev);
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrackIndex,
        currentTrack,
        isPlaying,
        progress,
        currentTimeSec,
        durationSec,
        volume,
        isLiked,
        playlist: bhajanPlaylist,
        togglePlay,
        playTrack,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleLike,
        isFullScreenPlayerOpen,
        setIsFullScreenPlayerOpen,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};
