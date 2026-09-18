"use client";

import React, { useState } from "react";
import { X, Calendar, Bell, Sun, Moon, Compass, Sparkles, Check } from "lucide-react";

interface PanchangFestivalModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const PanchangFestivalModal: React.FC<PanchangFestivalModalProps> = ({
  isOpen = true,
  onClose,
}) => {
  const [alarmSet, setAlarmSet] = useState(false);

  const upcomingFestivals = [
    { name: "Ananta Chaturdashi", date: "Sep 17, 2026", desc: "Visarjan & Ganesha Abhishekam" },
    { name: "Indira Ekadashi", date: "Sep 22, 2026", desc: "Sacred fast for ancestral liberation" },
    { name: "Shardiya Navratri Begins", date: "Oct 03, 2026", desc: "Nine sacred nights of Maa Durga" },
    { name: "Vijayadashami (Dussehra)", date: "Oct 12, 2026", desc: "Victory of Truth & Lord Rama" },
    { name: "Sharad Purnima", date: "Oct 17, 2026", desc: "Divine Raas Leela of Shri Krishna" },
  ];

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
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-fraunces text-lg font-bold text-white">
                Vedic Panchang & Sacred Calendar
              </h3>
              <p className="text-[10px] text-white/50">
                Panchang Tithis, Auspicious Timings & Upcoming Fasting Days
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

        <div className="flex flex-col gap-4 z-10 overflow-y-auto max-h-[70vh] no-scrollbar">
          {/* Today's Tithi & Nakshatra Box */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-wider">
                TODAY&apos;S ALMANAC (SEPTEMBER 15)
              </span>
              <span className="text-[10px] text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full">
                Bhadrapada Shukla
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#141414] border border-white/6 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-white/40 font-bold uppercase">Tithi</span>
                <span className="text-xs font-bold text-white">Shukla Chaturthi</span>
                <span className="text-[9.5px] text-white/40">Until 11:14 PM</span>
              </div>

              <div className="bg-[#141414] border border-white/6 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-white/40 font-bold uppercase">Nakshatra</span>
                <span className="text-xs font-bold text-white">Swati (Pada 2)</span>
                <span className="text-[9.5px] text-white/40">Until 04:32 PM</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#141414] border border border-[#C9A55C]/30 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-[#C9A55C] font-bold uppercase">Abhijit Muhurat</span>
                <span className="text-xs font-bold text-white">11:50 AM – 12:40 PM</span>
                <span className="text-[9.5px] text-[#C9A55C]">Most Auspicious</span>
              </div>

              <div className="bg-[#141414] border border-red-500/20 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-red-400 font-bold uppercase">Rahu Kaal</span>
                <span className="text-xs font-bold text-white">03:15 PM – 04:45 PM</span>
                <span className="text-[9.5px] text-red-400/80">Avoid New Tasks</span>
              </div>
            </div>
          </div>

          {/* Brahma Muhurta Alarm Card */}
          <div className="bg-gradient-to-r from-[#C9A55C]/20 to-transparent border border-[#C9A55C]/40 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A55C]/20 border border-[#C9A55C] flex items-center justify-center text-[#C9A55C]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-fraunces text-sm font-bold text-white">
                  Brahma Muhurta Alarm (04:30 AM)
                </h4>
                <p className="text-[10px] text-white/60">
                  Daily sunrise chime for quiet morning Sadhana
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAlarmSet(!alarmSet)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                alarmSet
                  ? "bg-[#C9A55C] text-[#0A0A0A] shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {alarmSet ? <Check className="w-4 h-4" /> : null}
              <span>{alarmSet ? "Alarm Set" : "Set Reminder"}</span>
            </button>
          </div>

          {/* Upcoming Fasting & Festivals */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upcoming Festivals & Fasting Days</span>
            </span>

            <div className="flex flex-col gap-2">
              {upcomingFestivals.map((f) => (
                <div
                  key={f.name}
                  className="bg-[#0A0A0A] border border-white/8 rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">{f.name}</span>
                    <span className="text-[10px] text-white/40">{f.desc}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#C9A55C] bg-[#C9A55C]/15 border border-[#C9A55C]/30 px-3 py-1 rounded-lg shrink-0">
                    {f.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
