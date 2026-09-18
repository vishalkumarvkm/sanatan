"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/onboarding";

interface ShrinePageProps {
  profile?: UserProfile;
}

const deities = [
  {
    name: "Lord Shiva",
    symbol: "🔱",
    key: "Shiva",
    subtitle: "MAHADEVA • THE SUPREME ASCETIC",
    desc: "Lord of cosmic dance, stillness, and eternal transformation.",
    mantra: "ॐ नमः शिवाय",
  },
  {
    name: "Lord Krishna",
    symbol: "🪈",
    key: "Krishna",
    subtitle: "YOGESHWARA • LORD OF DEVOTION",
    desc: "Surrender all your actions unto Me, and I shall liberate you.",
    mantra: "ॐ नमो भगवते वासुदेवाय",
  },
  {
    name: "Lord Rama",
    symbol: "🏹",
    key: "Rama",
    subtitle: "MARYADA PURUSHOTTAMA • RIGHTEOUS KING",
    desc: "Truth and righteousness are the ultimate armor.",
    mantra: "ॐ श्री रामाय नमः",
  },
  {
    name: "Maa Durga",
    symbol: "🌸",
    key: "Durga",
    subtitle: "ADISHAKTI • DIVINE MOTHER",
    desc: "She protects the righteous and vanquishes dark illusions.",
    mantra: "ॐ दुं दुर्गायै नमः",
  },
];

export const ShrinePage: React.FC<ShrinePageProps> = () => {
  const [selectedDeityKey, setSelectedDeityKey] = useState("Shiva");
  const [japaCount, setJapaCount] = useState(0);
  const [bilvaCount, setBilvaCount] = useState(3);
  const [isRingingBell, setIsRingingBell] = useState(false);
  const [showFlowerRain, setShowFlowerRain] = useState(false);
  const [activeDarshanModal, setActiveDarshanModal] = useState<string | null>(null);

  const activeDeity = deities.find(
    (d) => selectedDeityKey.toLowerCase() === d.key.toLowerCase()
  ) || deities[0];

  const ringBell = () => {
    setIsRingingBell(true);
    setTimeout(() => setIsRingingBell(false), 600);
  };

  const offerFlowers = () => {
    setBilvaCount((prev) => prev + 1);
    setShowFlowerRain(true);
    setTimeout(() => setShowFlowerRain(false), 2500);
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col relative select-none font-sans pb-32 md:pb-12">
      
      {/* Flower Rain Overlay */}
      {showFlowerRain && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-around pt-12 animate-fadein">
          <span className="text-3xl animate-bounce">🌸</span>
          <span className="text-4xl animate-bounce [animation-delay:0.2s]">🪷</span>
          <span className="text-2xl animate-bounce [animation-delay:0.4s]">🌼</span>
          <span className="text-3xl animate-bounce [animation-delay:0.1s]">🌸</span>
        </div>
      )}

      <div className="flex-1 w-full max-w-lg md:max-w-4xl mx-auto flex flex-col pt-4 px-4 sm:px-6 gap-5">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#C9A55C]">✨</span>
            <span className="text-[10px] font-bold text-[#C9A55C] tracking-wider uppercase">
              SACRED SANCTUM
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Brahmamuhurta Energy</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-serif-fraunces text-2xl sm:text-3xl font-bold text-white">
            Virtual Shrine & Puja
          </h1>
          <p className="text-xs text-white/54 mt-0.5">
            Establish daily inner stillness through sacred consecrated darshan.
          </p>
        </div>

        {/* Deity Selector Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {deities.map((d) => {
            const isSelected = selectedDeityKey.toLowerCase() === d.key.toLowerCase();
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDeityKey(d.key)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#C9A55C] text-[#0A0A0A] shadow-md"
                    : "bg-[#141414] border border-white/10 text-white/70 hover:text-white"
                }`}
              >
                <span>{d.symbol}</span>
                <span>{d.name} {isSelected ? "●" : ""}</span>
              </button>
            );
          })}
        </div>

        {/* Center Consecrated Shrine Container */}
        <div className="bg-[#141414] border border-[#C9A55C]/30 rounded-3xl p-6 relative shadow-xl text-center flex flex-col items-center">
          
          {/* Bell Icon Trigger */}
          <div
            onClick={ringBell}
            className={`w-12 h-12 rounded-full bg-white/6 border border-[#C9A55C]/50 flex items-center justify-center text-[#C9A55C] cursor-pointer transition-transform duration-300 mb-2 ${
              isRingingBell ? "scale-125 rotate-12" : "hover:scale-105"
            }`}
            title="Tap Bell to Ring"
          >
            🔔
          </div>
          <div className="text-xs font-bold text-white mb-0.5">Tap Bell to Ring</div>
          <div className="text-[10px] text-white/40 mb-5">May your mind become still</div>

          {/* Deity Image Sphere */}
          <div className="w-40 h-40 rounded-full bg-[#0F0F0F] border-4 border-[#C9A55C] shadow-[0_0_35px_rgba(201,165,92,0.35)] flex items-center justify-center text-6xl mb-4 relative overflow-hidden">
            {activeDeity.key === "Shiva" ? (
              <img
                src="/images/lord_shiva.png"
                alt="Lord Shiva"
                className="w-full h-full object-cover"
              />
            ) : activeDeity.key === "Krishna" ? (
              <img
                src="/images/lord_krishna.png"
                alt="Lord Krishna"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{activeDeity.symbol}</span>
            )}
          </div>

          <h2 className="font-serif-fraunces text-2xl font-bold text-white flex items-center justify-center gap-2">
            <span>{activeDeity.name}</span>
            <span className="text-xl">{activeDeity.symbol}</span>
          </h2>
          <div className="text-[10px] font-bold text-[#C9A55C] tracking-widest uppercase mt-1 mb-2">
            {activeDeity.subtitle}
          </div>
          <p className="text-xs text-white/60 max-w-md leading-relaxed mb-5">
            {activeDeity.desc}
          </p>

          {/* Moola Mantra Box */}
          <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3 mb-3">
            <div className="text-left min-w-0">
              <div className="text-[9px] text-white/40 font-bold tracking-wider uppercase">
                MOOLA MANTRA
              </div>
              <div className="devanagari-font text-sm font-bold text-[#C9A55C] truncate">
                {activeDeity.mantra}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setJapaCount((prev) => prev + 1)}
              className="bg-[#C9A55C] text-[#0A0A0A] font-bold text-xs px-3.5 py-1.5 rounded-xl shrink-0 hover:bg-[#B8944B] cursor-pointer"
            >
              ▶ 108 Chants ({japaCount})
            </button>
          </div>

          {/* Akhand Diya Box */}
          <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 text-left">
              <span className="text-lg">🪔</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Akhand Diya Lit</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
                <div className="text-[10px] text-white/40">18 mins remaining in Sadhana</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert("✨ Pure Ghee offered to Akhand Diya. Flames brightened!")}
              className="bg-white/8 text-[#C9A55C] border border-[#C9A55C]/40 font-bold text-xs px-3.5 py-1.5 rounded-xl shrink-0 hover:bg-white/15 cursor-pointer"
            >
              + Offer Ghee
            </button>
          </div>
        </div>

        {/* Two Cards Row */}
        <div className="grid grid-cols-2 gap-3.5">
          <div
            onClick={() => setActiveDarshanModal("kashi")}
            className="relative h-28 rounded-2xl border border-[#C9A55C]/30 p-3.5 flex flex-col justify-end overflow-hidden bg-black cursor-pointer hover:border-[#C9A55C] transition-all group"
          >
            <img
              src="/images/kashi_darshan.png"
              alt="Kashi Vishwanath"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[9px] font-bold text-[#C9A55C] uppercase tracking-wider block">
                HOLY SANCTUM
              </span>
              <span className="font-serif-fraunces text-sm font-bold text-white">
                Kashi Vishwanath
              </span>
            </div>
          </div>

          <div
            onClick={() => setActiveDarshanModal("bilva")}
            className="relative h-28 rounded-2xl border border-[#C9A55C]/30 p-3.5 flex flex-col justify-end overflow-hidden bg-black cursor-pointer hover:border-[#C9A55C] transition-all group"
          >
            <img
              src="/images/bilva_offering.png"
              alt="Bilva & Chandan"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[9px] font-bold text-[#C9A55C] uppercase tracking-wider block">
                SACRED OFFERINGS
              </span>
              <span className="font-serif-fraunces text-sm font-bold text-white">
                Bilva & Chandan
              </span>
            </div>
          </div>
        </div>

        {/* Puja Sadhana Actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif-fraunces text-base font-bold text-white">
              Puja Sadhana Actions
            </h3>
            <span className="text-[11px] text-white/40">Tap to perform ritual</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="bg-[#141414] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌸</span>
                <div>
                  <div className="text-xs font-bold text-white">Offer Bilva & Flowers</div>
                  <div className="text-[10px] text-white/40">{bilvaCount} offered today (+5 Sadhana)</div>
                </div>
              </div>
              <button
                type="button"
                onClick={offerFlowers}
                className="w-8 h-8 rounded-full bg-white/6 text-white/80 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-white/12"
              >
                ⊕
              </button>
            </div>

            <div className="bg-[#141414] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🪔</span>
                <div>
                  <div className="text-xs font-bold text-white">Light Sacred Diya</div>
                  <div className="text-[10px] text-white/40">1m • 5m • 10m Dhyan Timer</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("🪔 10-Minute Dhyan Timer started.")}
                className="w-8 h-8 rounded-full bg-white/6 text-[#C9A55C] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-white/12"
              >
                🔥
              </button>
            </div>

            <div className="bg-[#141414] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <div className="text-xs font-bold text-white">Ring Sacred Bell</div>
                  <div className="text-[10px] text-white/40">Awaken higher consciousness</div>
                </div>
              </div>
              <button
                type="button"
                onClick={ringBell}
                className="w-8 h-8 rounded-full bg-white/6 text-white/80 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-white/12"
              >
                👆
              </button>
            </div>

            <div className="bg-[#141414] border border-white/6 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📣</span>
                <div>
                  <div className="text-xs font-bold text-white">Play Vedic Rudram</div>
                  <div className="text-[10px] text-white/40">Namakam & Chamakam Chants</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert("Playing Rudram Chants...")}
                className="w-8 h-8 rounded-full bg-white/6 text-[#C9A55C] flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-white/12"
              >
                📊
              </button>
            </div>
          </div>
        </div>

        {/* Today's Puja Merits Progress Box */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-serif-fraunces text-sm font-bold text-white">
              Today&apos;s Puja Merits
            </h4>
            <span className="text-xs font-bold text-[#C9A55C]">
              Level 4 Seeker
            </span>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#C9A55C] w-[50%] rounded-full" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/50">
            <span>2 of 4 Rituals Completed</span>
            <span className="text-white/80 font-semibold">+15 Sadhana Points</span>
          </div>
        </div>

      </div>

      {/* Darshan & Offering Modal */}
      {activeDarshanModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadein">
          <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-2xl max-w-md w-full p-5 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-serif-fraunces text-lg font-bold text-white flex items-center gap-2">
                <span>{activeDarshanModal === "kashi" ? "🛕 Live Kashi Darshan" : "🌿 Sacred Bilva Offering"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveDarshanModal(null)}
                className="text-white/40 hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {activeDarshanModal === "kashi" ? (
              <div className="flex flex-col gap-3">
                <div className="relative h-48 rounded-xl overflow-hidden border border-[#C9A55C]/40">
                  <img
                    src="/images/kashi_darshan.png"
                    alt="Shri Kashi Vishwanath"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-widest">
                      SANCTUM SANCTORUM
                    </span>
                    <h4 className="font-serif-fraunces text-base font-bold text-white">
                      Shri Kashi Vishwanath Temple
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Experience the sacred vibrations of Lord Shiva at the holiest of Jyotirlingas in Varanasi.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    ringBell();
                    alert("✨ Mangala Aarti Bell sounded in Sanctum Darshan!");
                  }}
                  className="bg-[#C9A55C] hover:bg-[#B8944B] text-[#0A0A0A] font-bold text-xs py-3 rounded-xl cursor-pointer transition-all shadow-md"
                >
                  🔔 Sound Aarti Bell & Offer Prayers
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative h-48 rounded-xl overflow-hidden border border-[#C9A55C]/40">
                  <img
                    src="/images/bilva_offering.png"
                    alt="Bilva Leaves & Chandan"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-widest">
                      SACRED RITUAL
                    </span>
                    <h4 className="font-serif-fraunces text-base font-bold text-white">
                      Tridalam Trigunakarum Bilva Patram
                    </h4>
                  </div>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Bilva leaves and sacred Chandan paste represent the destruction of three karmic bondages (Trikala).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    offerFlowers();
                    setActiveDarshanModal(null);
                  }}
                  className="bg-[#C9A55C] hover:bg-[#B8944B] text-[#0A0A0A] font-bold text-xs py-3 rounded-xl cursor-pointer transition-all shadow-md"
                >
                  🌸 Offer Bilva Patram Now (+5 Sadhana)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
