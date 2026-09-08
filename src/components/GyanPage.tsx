"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/types/onboarding";

interface GyanArticle {
  id: string;
  tag: string;
  topic: string;
  title: string;
  icon: string;
  readTime: string;
  source: string;
  desc: string;
  artworkTheme: {
    gradient: string;
    glowColor: string;
    symbolColor: string;
    subtleAura: string;
  };
  body: string[];
}

const articlesData: GyanArticle[] = [
  {
    id: "gita-1",
    tag: "Bhagavad Gita",
    topic: "Vedas",
    title: "The Yoga of Despondency: Why Arjuna Wept",
    icon: "ॐ",
    readTime: "8 min read",
    source: "Chapter 1",
    desc: "Chapter 1 explores the crisis of conscience that precedes all transformation.",
    artworkTheme: {
      gradient: "from-[#2A1805] via-[#1E1204] to-[#0F0B05]",
      glowColor: "rgba(217, 164, 65, 0.25)",
      symbolColor: "#D9A441",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(217,164,65,0.2) 0%, rgba(232,114,42,0.08) 50%, transparent 80%)",
    },
    body: [
      "The Bhagavad Gita does not begin with a teaching. It begins with a crisis. Arjuna, the greatest warrior of his age, stands in his chariot between two armies and breaks.",
      "His bow slips from his hand. His skin burns. His mind reels. He tells Krishna he cannot fight — not because he is afraid, but because he sees his own teachers, uncles, and cousins on the other side.",
      "This is Vishada Yoga — the yoga of despair. It is the only chapter where Krishna says nothing. He listens. The entire Gita that follows is the response to this one human moment of not knowing what to do.",
      "What the tradition teaches us: every transformation begins in confusion. The fact that you do not know what to do is not failure — it is the beginning of real understanding.",
    ],
  },
  {
    id: "yoga-1",
    tag: "Patanjali Yoga",
    topic: "Yoga",
    title: "Chitta Vritti Nirodha: Stillness of the Mind",
    icon: "🧘",
    readTime: "7 min read",
    source: "Yoga Sutras 1.2",
    desc: "Patanjali defines the core essence of yoga: calming the turbulent mental whirlpool.",
    artworkTheme: {
      gradient: "from-[#05221B] via-[#091715] to-[#060D0C]",
      glowColor: "rgba(45, 170, 130, 0.22)",
      symbolColor: "#5CE1B6",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(45,170,130,0.22) 0%, rgba(20,100,80,0.08) 50%, transparent 80%)",
    },
    body: [
      "Yoga is defined by Sage Patanjali in three words: 'Yogas Chitta Vritti Nirodha'. Yoga is the intentional calming of the fluctuations and patterns of the mind.",
      "The mind is compared to a body of water. When wind ripples the surface or mud clouds the depths, you cannot see the pearls resting at the bottom. Only when the water becomes still and crystal clear does your true nature (Swaroopa) reveal itself.",
      "Patanjali prescribes two eternal wings for this flight: Abhyasa (steady, dedicated daily practice) and Vairagya (healthy detachment from outcomes). You do not fight your thoughts; you gently witness them without being swept away by their currents.",
      "In daily living, taking three conscious breaths before reacting is the beginning of yoga.",
    ],
  },
  {
    id: "dharma-1",
    tag: "Mahabharata",
    topic: "Dharma",
    title: "Yakshaprashna: The Enigma of Human Living",
    icon: "⚖️",
    readTime: "9 min read",
    source: "Vana Parva",
    desc: "Yudhishthira's answers on mortality, purpose, courage, and righteous conduct.",
    artworkTheme: {
      gradient: "from-[#1F1905] via-[#151208] to-[#0A0905]",
      glowColor: "rgba(225, 178, 80, 0.2)",
      symbolColor: "#E5B94E",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(225,178,80,0.18) 0%, rgba(180,130,40,0.08) 50%, transparent 80%)",
    },
    body: [
      "During their exile in the forest, the Pandavas grew parched with thirst. One by one, four brothers drank from an enchanted lake despite a crane's warning, and collapsed lifeless. Only Yudhishthira paused and agreed to answer the guardian Yaksha's profound questions first.",
      "The Yaksha asked: 'What is swifter than wind?' Yudhishthira answered: 'The mind.'\n'What is more numerous than blades of grass?' 'The worries of the heart.'\n'Who is the friend of the dying?' 'Righteous action (Dharma), for it alone accompanies the soul into the beyond.'",
      "Then came the supreme question: 'What is the greatest wonder in the world?' Yudhishthira replied: 'Day after day, countless creatures die before our eyes, yet those who remain believe they will live forever. What can be more wondrous than this illusion?'",
      "Pleased by his humility and adherence to truth, the Yaksha revealed himself as Dharma and revived all four brothers.",
    ],
  },
  {
    id: "upanishad-1",
    tag: "Vedic Wisdom",
    topic: "Spirituality",
    title: "Panchkosha: The Five Sheaths of Being",
    icon: "🪷",
    readTime: "6 min read",
    source: "Taittiriya Upanishad",
    desc: "Taittiriya Upanishad's map of human experience, from food body to cosmic bliss.",
    artworkTheme: {
      gradient: "from-[#1A0F2B] via-[#120B1F] to-[#0A0712]",
      glowColor: "rgba(180, 120, 240, 0.22)",
      symbolColor: "#C996FF",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(180,120,240,0.2) 0%, rgba(120,70,180,0.08) 50%, transparent 80%)",
    },
    body: [
      "The Taittiriya Upanishad describes the human being not as a single entity but as five nested layers — like sheaths wrapped around a sword, or petals around the center of a flower.",
      "• Annamaya Kosha — the food body. Your physical form, sustained by what you eat.\n• Pranamaya Kosha — the breath body. The energy that animates you.\n• Manomaya Kosha — the mind body. Thoughts, emotions, reactions.\n• Vijnanamaya Kosha — the wisdom body. Discernment, intuition, knowing.\n• Anandamaya Kosha — the bliss body. The deepest layer, closest to Atman.",
      "Most suffering, the Upanishad suggests, comes from mistaking an outer sheath for the whole self. When you identify only with your body or your thoughts, you forget the divine layers resting peacefully beneath.",
    ],
  },
  {
    id: "ayurveda-1",
    tag: "Ayurveda Wisdom",
    topic: "Ayurveda",
    title: "Dinacharya & Ritucharya: Sacred Rhythms of Healing",
    icon: "🌿",
    readTime: "8 min read",
    source: "Charaka Samhita",
    desc: "How classical Vedic science harmonizes bodily doshas with daily and seasonal cycles.",
    artworkTheme: {
      gradient: "from-[#14230D] via-[#0E1A09] to-[#070E04]",
      glowColor: "rgba(125, 190, 80, 0.22)",
      symbolColor: "#8EE058",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(125,190,80,0.2) 0%, rgba(70,130,40,0.08) 50%, transparent 80%)",
    },
    body: [
      "Ayurveda teaches that health is not merely the absence of disease, but a state of vibrant balance among the three bio-energies (Vata, Pitta, Kapha), pure digestion (Agni), and a serene spirit (Prasanna Atma).",
      "Dinacharya (daily routine) begins with Brahma Muhurta — rising before dawn when the atmosphere is charged with pure sattvic clarity. Cleaning the senses, mindful breathing, warm water hydration, and grounding exercise align our circadian clock with planetary rhythms.",
      "Ritucharya guides us through seasonal transitions (Ritu Sandhi), modifying diet and herbs so that heat, dryness, or dampness do not disturb bodily equilibrium. Health is conscious harmony with nature.",
    ],
  },
  {
    id: "purana-1",
    tag: "Mythology",
    topic: "Mythology",
    title: "Samudra Manthan: Churning for Nectar",
    icon: "🔱",
    readTime: "10 min read",
    source: "Vishnu Purana",
    desc: "Devas and Asuras cooperate — and what emerges changes everything.",
    artworkTheme: {
      gradient: "from-[#0A1A2E] via-[#071221] to-[#040A14]",
      glowColor: "rgba(70, 150, 240, 0.22)",
      symbolColor: "#6AB4FF",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(70,150,240,0.2) 0%, rgba(30,90,180,0.08) 50%, transparent 80%)",
    },
    body: [
      "The ocean of milk was churned by Devas and Asuras together, using Mount Mandara as the churning rod and Vasuki, the serpent king, as the rope. Neither side could do it alone.",
      "From the churning emerged fourteen treasures — the moon, the wish-fulfilling tree, the divine physician Dhanvantari, and goddess Lakshmi. But also emerged Halahala, a cosmic poison so lethal it could destroy all creation.",
      "Lord Shiva drank the poison and held it in his throat — turning his neck blue, earning the name Neelkanth. The sacred story teaches that profound transformation produces both nectar and poison, and one must possess patience and courage to hold the difficult truths so that goodness can emerge.",
    ],
  },
  {
    id: "vedas-1",
    tag: "Rigveda",
    topic: "Vedas",
    title: "Nasadiya Sukta: The Cosmic Hymn of Creation",
    icon: "🌌",
    readTime: "11 min read",
    source: "Mandala 10.129",
    desc: "The ancient Vedic inquiry into the primordial mystery of existence before space and time.",
    artworkTheme: {
      gradient: "from-[#2A1208] via-[#1C0D05] to-[#0F0703]",
      glowColor: "rgba(240, 110, 50, 0.22)",
      symbolColor: "#FF8C55",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(240,110,50,0.2) 0%, rgba(180,60,20,0.08) 50%, transparent 80%)",
    },
    body: [
      "Thousands of years before modern astrophysics contemplated the origin of space and time, the Rigveda articulated the Nasadiya Sukta — the hymn of non-existence becoming existence.",
      "'Then there was neither non-existence nor existence: there was no realm of air, no sky beyond it. What covered in, and where? and was there water, unfathomed depth of water?'",
      "Rather than dogmatic declaration, the Vedic seers explored with supreme intellectual courage: 'Who knows the truth? Who here can declare it? Whence was it born, and whence came this creation? Even the gods came afterwards — who knows whence it first arose?'",
      "This hymn teaches that reverence for the unknown and honest inquiry is itself a sacred spiritual discipline.",
    ],
  },
  {
    id: "spirituality-1",
    tag: "Advaita Vedanta",
    topic: "Spirituality",
    title: "Tat Tvam Asi: Realizing 'That Thou Art'",
    icon: "✨",
    readTime: "6 min read",
    source: "Chandogya Upanishad",
    desc: "The famous dialogue on the indivisible unity of the individual soul and cosmic consciousness.",
    artworkTheme: {
      gradient: "from-[#2B1F05] via-[#1C1403] to-[#0F0B02]",
      glowColor: "rgba(217, 164, 65, 0.28)",
      symbolColor: "#FFD479",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(217,164,65,0.25) 0%, rgba(190,130,30,0.09) 50%, transparent 80%)",
    },
    body: [
      "In the Chandogya Upanishad, the sage Uddalaka Aruni guides his son Svetaketu to discover the highest truth. After twelve years of studying external scriptures, Svetaketu was proud of his knowledge, yet lacked wisdom.",
      "Uddalaka asked: 'Bring me a fruit from the Nyagrodha tree. Break it. What do you see?' 'Extremely tiny seeds, father.' 'Break one seed. What do you see?' 'Nothing at all.' Uddalaka smiled: 'Yet from that subtle essence which you cannot perceive with your eyes grows this giant banyan tree.'",
      "Then he had him dissolve a lump of salt in water and taste it from the top, middle, and bottom. 'The salt is everywhere, pervading all water, though you cannot see it. In the same way, the divine consciousness pervades all reality. That is the Truth. That is the Self. And That Thou Art (Tat Tvam Asi), Svetaketu.'",
    ],
  },
  {
    id: "mythology-2",
    tag: "Ramayana",
    topic: "Mythology",
    title: "The Devotion of Shabari: Love Beyond Ritual",
    icon: "🏹",
    readTime: "7 min read",
    source: "Aranya Kanda",
    desc: "How humble, heartfelt love and lifelong patience touched Lord Rama's heart.",
    artworkTheme: {
      gradient: "from-[#251505] via-[#1A0E03] to-[#0C0702]",
      glowColor: "rgba(230, 130, 45, 0.22)",
      symbolColor: "#FFA25B",
      subtleAura: "radial-gradient(circle at 50% 50%, rgba(230,130,45,0.2) 0%, rgba(170,80,20,0.08) 50%, transparent 80%)",
    },
    body: [
      "High in the forests of Mount Matanga lived Shabari, an elderly tribal ascetic who had waited decades for Lord Rama. Her guru, Sage Matanga, had promised that if she remained steadfast in purity and love, the divine would one day walk to her hermitage.",
      "Every single morning for years, she swept the forest trail, decorated her hut with fragrant wildflowers, and gathered sweet wild berries from the thorns.",
      "When Rama and Lakshmana arrived, she offered the wild berries, tasting each one first to ensure it was sweet and not bitter. While Lakshmana hesitated at the breach of ritual decorum, Rama lovingly accepted and tasted them with joy.",
      "Rama taught that love, sincerity, and pure surrender (Bhakti) matter far more than social stature, scholarly learning, or outward ritual perfection.",
    ],
  },
];

interface GyanPageProps {
  profile?: UserProfile;
}

export const GyanPage: React.FC<GyanPageProps> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [activeArticle, setActiveArticle] = useState<GyanArticle | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [articleQuery, setArticleQuery] = useState("");
  const [articleChatHistory, setArticleChatHistory] = useState<
    Array<{ sender: "user" | "sakha"; text: string }>
  >([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const topics = [
    "All",
    "Vedas",
    "Mythology",
    "Spirituality",
    "Dharma",
    "Yoga",
    "Ayurveda",
  ];

  const filteredArticles = articlesData.filter((a) => {
    const matchesTopic =
      selectedTopic === "All" ||
      a.topic.toLowerCase() === selectedTopic.toLowerCase() ||
      a.tag.toLowerCase().includes(selectedTopic.toLowerCase());
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const handleTopicSelect = (topic: string) => {
    if (topic === selectedTopic) return;
    setIsLoading(true);
    setSelectedTopic(topic);
    setTimeout(() => {
      setIsLoading(false);
    }, 150);
  };

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (activeArticle) {
      const textToSpeak = `${activeArticle.title}. ${activeArticle.body.join(" ")}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeArticle]);

  const handleSendArticleQuestion = async () => {
    const q = articleQuery.trim();
    if (!q || !activeArticle) return;

    setArticleChatHistory((prev) => [...prev, { sender: "user", text: q }]);
    setArticleQuery("");
    setIsAnswering(true);

    try {
      const chatEndpoint = process.env.NEXT_PUBLIC_SAKHA_CHAT_API_URL || "/api/sakha/chat";
      const res = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: `Context from article '${activeArticle.title} (${activeArticle.tag})':\n${activeArticle.body.join(
            " "
          )}\n\nUser Question: ${q}\n\nPlease answer gracefully as Sakha in 2-3 short sentences.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.response) {
          setArticleChatHistory((prev) => [
            ...prev,
            { sender: "sakha", text: data.response },
          ]);
          setIsAnswering(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Error answering article question:", e);
    }

    setArticleChatHistory((prev) => [
      ...prev,
      {
        sender: "sakha",
        text: `That is a thoughtful reflection on ${activeArticle.title}. The sacred text teaches that true wisdom comes from inner contemplation and patient discernment.`,
      },
    ]);
    setIsAnswering(false);
  };

  return (
    <div className="w-full flex flex-col relative min-h-screen text-[#F5F5F5] select-none">
      {!activeArticle ? (
        /* ═══════════════ MAIN GYAN DISCOVERY SCREEN ═══════════════ */
        <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col overflow-y-auto no-scrollbar scroll-smooth pb-32 sm:pb-36 md:pb-16">
          {/* 1. Header Area with Safe-Area Top Clearance */}
          <header className="pt-6 sm:pt-8 px-[18px] sm:px-6 shrink-0">
            <h1 className="font-serif-fraunces text-[28px] sm:text-[30px] font-semibold tracking-tight text-[#F5F5F5] leading-tight">
              Gyan
            </h1>
            <p className="text-[14px] text-[#9A9A9A] mt-1 font-normal leading-[20px]">
              Wisdom from Sanatan, Vedic and spiritual traditions
            </p>
          </header>

          {/* 2. Refined Search Bar */}
          <div className="mt-4 px-[18px] sm:px-6 shrink-0 max-w-2xl">
            <div
              onClick={() => searchInputRef.current?.focus()}
              className="h-[52px] w-full bg-[#151515] border border-[#252525] focus-within:border-[#D9A441]/50 rounded-[20px] px-4 flex items-center gap-3 transition-colors duration-200 cursor-text shadow-xs"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  stroke="#D9A441"
                  strokeWidth="1.8"
                />
                <path
                  d="M16 16l4.5 4.5"
                  stroke="#D9A441"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, stories, scriptures…"
                className="flex-1 bg-transparent border-none text-[#F5F5F5] text-[15px] outline-none placeholder:text-[#9A9A9A]/60 font-normal"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="w-7 h-7 rounded-full bg-[#222222] hover:bg-[#2A2A2A] text-[#9A9A9A] hover:text-[#F5F5F5] flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 3. Topics Label */}
          <div className="mt-6 mb-3 px-[18px] sm:px-6 shrink-0">
            <span className="text-[12px] font-semibold tracking-wider uppercase text-[#D9A441]">
              TOPICS
            </span>
          </div>

          {/* 4. Topics Horizontal Selector (Never wraps, smooth horizontal scrolling) */}
          <div className="px-[18px] sm:px-6 shrink-0">
            <div className="flex flex-nowrap overflow-x-auto no-scrollbar scroll-smooth gap-2.5 pb-2">
              {topics.map((topic) => {
                const isActive = selectedTopic.toLowerCase() === topic.toLowerCase();
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicSelect(topic)}
                    className={`h-10 px-5 rounded-full text-[13px] shrink-0 cursor-pointer transition-all duration-150 flex items-center justify-center ${
                      isActive
                        ? "bg-[#D9A441] border border-[#D9A441] text-[#0A0A0A] font-semibold shadow-[0_2px_12px_rgba(217,164,65,0.25)]"
                        : "bg-[#151515] border border-[#252525] text-[#9A9A9A] font-medium hover:border-[#D9A441]/40 hover:text-[#F5F5F5]"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Article Feed */}
          <div className="mt-4 px-[18px] sm:px-6">
            {isLoading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="rounded-[20px] bg-[#151515] border border-[#252525] overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[16/9] w-full bg-[#1F1F1F]" />
                    <div className="p-5 space-y-3">
                      <div className="w-24 h-3 bg-[#262626] rounded-sm" />
                      <div className="w-3/4 h-5 bg-[#262626] rounded-sm" />
                      <div className="w-full h-4 bg-[#202020] rounded-sm" />
                      <div className="w-1/2 h-3 bg-[#1D1D1D] rounded-sm mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    onClick={() => {
                      setActiveArticle(art);
                      setArticleChatHistory([]);
                    }}
                    className="w-full rounded-[20px] bg-[#151515] border border-[#252525] hover:border-[#D9A441]/40 overflow-hidden cursor-pointer transition-all duration-150 active:scale-[0.98] active:opacity-95 shadow-xs group"
                  >
                    {/* 16:9 Deliberate Editorial Artwork */}
                    <div
                      className={`aspect-[16/9] w-full relative overflow-hidden bg-gradient-to-br ${art.artworkTheme.gradient} flex items-center justify-center border-b border-[#202020]`}
                      style={{ background: art.artworkTheme.subtleAura }}
                    >
                      {/* Sacred Ambient Circles & Rays */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                        <div
                          className="w-48 h-48 rounded-full border border-white/10"
                          style={{
                            boxShadow: `0 0 50px ${art.artworkTheme.glowColor}`,
                          }}
                        />
                        <div className="absolute w-64 h-64 rounded-full border border-white/5" />
                        <div className="absolute w-80 h-80 rounded-full border border-dashed border-white/5" />
                      </div>

                      {/* Prominent, Centered Divine Symbol with Sacred Glow */}
                      <div className="relative z-10 flex flex-col items-center justify-center">
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.35)",
                            backdropFilter: "blur(4px)",
                            border: `1px solid ${art.artworkTheme.glowColor}`,
                            boxShadow: `0 0 24px ${art.artworkTheme.glowColor}`,
                          }}
                        >
                          <span
                            className="devanagari-font text-3xl sm:text-4xl select-none"
                            style={{ color: art.artworkTheme.symbolColor }}
                          >
                            {art.icon}
                          </span>
                        </div>
                      </div>

                      {/* Subtle Category Pill on Artwork Corner */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10.5px] font-medium text-[#D9A441]">
                        {art.topic}
                      </div>
                    </div>

                    {/* Article Editorial Content Area (18-20px padding) */}
                    <div className="p-[18px] sm:p-5">
                      {/* Category */}
                      <div className="text-[12px] font-semibold uppercase tracking-[0.5px] text-[#D9A441] mb-2">
                        {art.tag}
                      </div>

                      {/* Title */}
                      <h2 className="font-serif-fraunces text-[19px] sm:text-[21px] font-semibold text-[#F5F5F5] leading-[25px] sm:leading-[27px] line-clamp-3 mb-2 group-hover:text-[#FFFFFF] transition-colors">
                        {art.title}
                      </h2>

                      {/* Description */}
                      <p className="text-[14px] text-[#9A9A9A] leading-[21px] line-clamp-3 mb-3.5 font-normal">
                        {art.desc}
                      </p>

                      {/* Metadata Row */}
                      <div className="flex items-center gap-2 text-[12px] text-[#7A7A7A] font-normal">
                        <span className="flex items-center gap-1.5">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="opacity-80"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{art.readTime}</span>
                        </span>
                        <span className="opacity-50">·</span>
                        <span>{art.source}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty States */
              <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#151515] border border-[#252525] flex items-center justify-center mb-4">
                  <span className="devanagari-font text-3xl text-[#D9A441] opacity-70">
                    ॐ
                  </span>
                </div>
                {searchQuery ? (
                  <>
                    <h3 className="font-serif-fraunces text-xl font-semibold text-[#F5F5F5] mb-1.5">
                      No wisdom found
                    </h3>
                    <p className="text-[14px] text-[#9A9A9A] max-w-xs mb-5 leading-relaxed">
                      Try another topic, scripture, or story.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="px-5 py-2.5 rounded-full bg-[#151515] hover:bg-[#202020] border border-[#252525] text-xs font-semibold text-[#D9A441] transition-all cursor-pointer"
                    >
                      Clear search
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="font-serif-fraunces text-xl font-semibold text-[#F5F5F5] mb-1.5">
                      Nothing here yet
                    </h3>
                    <p className="text-[14px] text-[#9A9A9A] max-w-xs mb-5 leading-relaxed">
                      We&apos;re preparing more wisdom for this topic.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedTopic("All")}
                      className="px-5 py-2.5 rounded-full bg-[#D9A441] text-[#0A0A0A] text-xs font-semibold hover:bg-[#C29235] transition-all cursor-pointer shadow-xs"
                    >
                      Browse all topics
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ═══════════════ ARTICLE READER VIEW ═══════════════ */
        <div className="flex-1 w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-68px)] pb-28 sm:pb-32 overflow-hidden animate-fadein">
          {/* Top Sticky Header with Back, Title, and Audio Listen */}
          <div className="pt-4 px-4 sm:px-6 pb-3.5 flex items-center gap-3 border-b border-[#252525] bg-[#0A0A0A]/95 backdrop-blur-md shrink-0 z-10">
            <button
              onClick={() => {
                setActiveArticle(null);
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
              }}
              className="w-9 h-9 rounded-full bg-[#151515] border border-[#252525] flex items-center justify-center text-[#F5F5F5] hover:border-[#D9A441] hover:text-[#D9A441] transition-colors cursor-pointer text-sm"
              title="Back to wisdom library"
            >
              ←
            </button>
            <span className="font-serif-fraunces text-[15px] font-medium flex-1 truncate text-[#F5F5F5]">
              {activeArticle.title}
            </span>
            <button
              onClick={toggleSpeech}
              title={isSpeaking ? "Stop narration" : "Listen to audio narration"}
              className={`h-9 px-3.5 rounded-full border flex items-center gap-2 cursor-pointer transition-colors text-xs font-medium ${
                isSpeaking
                  ? "bg-[#D9A441] border-[#D9A441] text-[#0A0A0A]"
                  : "bg-[#151515] border-[#252525] text-[#D9A441] hover:border-[#D9A441]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 5L6 9H2v6h4l5 4V5z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.08"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span>{isSpeaking ? "Stop" : "Listen"}</span>
            </button>
          </div>

          {/* Reader Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 no-scrollbar space-y-6">
            {/* Hero Artwork Banner */}
            <div
              className={`aspect-[16/9] w-full rounded-[20px] overflow-hidden bg-gradient-to-br ${activeArticle.artworkTheme.gradient} flex items-center justify-center border border-[#252525] relative shadow-md`}
              style={{ background: activeArticle.artworkTheme.subtleAura }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center border"
                style={{
                  borderColor: activeArticle.artworkTheme.glowColor,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  boxShadow: `0 0 30px ${activeArticle.artworkTheme.glowColor}`,
                }}
              >
                <span
                  className="devanagari-font text-4xl"
                  style={{ color: activeArticle.artworkTheme.symbolColor }}
                >
                  {activeArticle.icon}
                </span>
              </div>
            </div>

            {/* Title & Metadata */}
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-[#D9A441] mb-2">
                {activeArticle.tag} · {activeArticle.source}
              </div>
              <h1 className="font-serif-fraunces text-2xl sm:text-3xl font-semibold leading-snug text-[#F5F5F5] mb-3">
                {activeArticle.title}
              </h1>
              <div className="flex items-center gap-2 text-[12px] text-[#7A7A7A]">
                <span>{activeArticle.readTime}</span>
                <span>·</span>
                <span>Sacred Wisdom Library</span>
              </div>
            </div>

            <div className="w-12 h-[2px] bg-[#D9A441]/40 rounded-full" />

            {/* Article Paragraphs */}
            <div className="space-y-4 text-[15px] sm:text-[16px] text-[#E0E0E0] leading-[1.75] font-normal">
              {activeArticle.body.map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>

            {/* Scripture Reflection & Q&A Stream */}
            {articleChatHistory.length > 0 && (
              <div className="mt-8 pt-5 border-t border-[#252525] space-y-3.5">
                <span className="text-[12px] font-semibold tracking-wider text-[#D9A441] uppercase">
                  Scripture Discussion with Sakha
                </span>
                {articleChatHistory.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-[16px] text-[13.5px] leading-relaxed max-w-[88%] ${
                      m.sender === "user"
                        ? "bg-[#D9A441] text-[#0A0A0A] font-medium ml-auto rounded-tr-xs"
                        : "bg-[#151515] text-[#F5F5F5] mr-auto border border-[#252525] rounded-tl-xs"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {isAnswering && (
                  <div className="flex items-center gap-1.5 p-2 text-xs text-[#D9A441]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse [animation-delay:0.4s]" />
                    <span className="text-[12px] ml-1 text-[#9A9A9A]">
                      Sakha is contemplating...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ask Sakha Interactive Bar */}
          <div className="border-t border-[#252525] px-4 py-3 flex items-center gap-2.5 bg-[#0A0A0A] shrink-0">
            <input
              type="text"
              value={articleQuery}
              onChange={(e) => setArticleQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendArticleQuestion();
              }}
              placeholder="Ask Sakha about this chapter…"
              className="flex-1 bg-[#151515] border border-[#252525] focus:border-[#D9A441]/50 rounded-full px-4 py-2.5 text-xs text-[#F5F5F5] placeholder:text-[#9A9A9A]/60 outline-none"
            />
            <button
              onClick={handleSendArticleQuestion}
              disabled={!articleQuery.trim() || isAnswering}
              type="button"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0 ${
                articleQuery.trim() && !isAnswering
                  ? "bg-[#D9A441] hover:bg-[#C29235] text-[#0A0A0A] shadow-sm cursor-pointer active:scale-95"
                  : "bg-[#1C1C1C] text-[#9A9A9A]/30 border border-[#252525] cursor-not-allowed opacity-50"
              }`}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
