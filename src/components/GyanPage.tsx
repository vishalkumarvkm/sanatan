"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { UserProfile } from "@/types/onboarding";

export interface ArticleSentence {
  id: string; // e.g. "title", "p0-s0"
  paraIndex: number; // -1 for title
  sentenceIndex: number;
  text: string;
}

function parseArticleIntoSentences(article: GyanArticle): {
  titleSegment: ArticleSentence;
  paragraphs: ArticleSentence[][];
  flatSentences: ArticleSentence[];
} {
  const titleSegment: ArticleSentence = {
    id: "title",
    paraIndex: -1,
    sentenceIndex: 0,
    text: article.title,
  };

  const paragraphs: ArticleSentence[][] = [];
  const flatSentences: ArticleSentence[] = [titleSegment];

  article.body.forEach((paraText, pIdx) => {
    const rawLines = paraText.split(/\r?\n+/).filter((line) => line.trim().length > 0);
    const paraSentences: ArticleSentence[] = [];

    rawLines.forEach((line) => {
      // Split on sentence boundaries, keeping punctuation
      const sentenceRegex = /[^.!?\n]+(?:[.!?]+(?=["'\s]|$)|\s*$)/g;
      const matched = line.match(sentenceRegex);
      const parts = (matched && matched.length > 0 ? matched : [line])
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      parts.forEach((part) => {
        const item: ArticleSentence = {
          id: `p${pIdx}-s${paraSentences.length}`,
          paraIndex: pIdx,
          sentenceIndex: paraSentences.length,
          text: part,
        };
        paraSentences.push(item);
        flatSentences.push(item);
      });
    });

    paragraphs.push(paraSentences);
  });

  return { titleSegment, paragraphs, flatSentences };
}

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
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const currentSentenceIndexRef = useRef<number>(-1);
  const isSpeakingRef = useRef<boolean>(false);
  const speechRateRef = useRef<number>(0.95);

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

  useEffect(() => {
    currentSentenceIndexRef.current = currentSentenceIndex;
  }, [currentSentenceIndex]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const updateVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length) setAvailableVoices(v);
      } catch (e) {}
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Parse active article into structured reading segments
  const parsedSentences = useMemo(() => {
    if (!activeArticle) return { titleSegment: null, paragraphs: [], flatSentences: [] };
    return parseArticleIntoSentences(activeArticle);
  }, [activeArticle]);

  // Auto-scroll the currently reading sentence into view smoothly
  useEffect(() => {
    if (currentSentenceIndex < 0 || !parsedSentences.flatSentences[currentSentenceIndex]) return;
    const segment = parsedSentences.flatSentences[currentSentenceIndex];
    const elementId = segment.id === "title" ? "read-segment-title" : `read-segment-${segment.id}`;

    requestAnimationFrame(() => {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, [currentSentenceIndex, parsedSentences]);

  const stopNarration = useCallback(() => {
    isSpeakingRef.current = false;
    currentSentenceIndexRef.current = -1;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
  }, []);

  const speakSentence = useCallback(
    (index: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      const flat = parsedSentences.flatSentences;
      if (!flat || index >= flat.length || index < 0) {
        stopNarration();
        return;
      }

      try {
        window.speechSynthesis.cancel();
      } catch (e) {}

      currentSentenceIndexRef.current = index;
      setCurrentSentenceIndex(index);
      isSpeakingRef.current = true;
      setIsSpeaking(true);
      setIsPaused(false);

      const segment = flat[index];
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.rate = speechRateRef.current;
      utterance.pitch = 1.0;

      // Prioritize natural Indian English voice if present
      if (availableVoices.length > 0) {
        const preferred =
          availableVoices.find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN")) ||
          availableVoices.find((v) => v.name.includes("India") || v.name.includes("Hindi")) ||
          availableVoices.find(
            (v) =>
              v.lang.startsWith("en") &&
              (v.name.includes("Natural") || v.name.includes("Neural"))
          ) ||
          availableVoices.find((v) => v.lang.startsWith("en"));
        if (preferred) utterance.voice = preferred;
      }

      utterance.onend = () => {
        if (isSpeakingRef.current && currentSentenceIndexRef.current === index) {
          if (index + 1 < flat.length) {
            speakSentence(index + 1);
          } else {
            stopNarration();
          }
        }
      };

      utterance.onerror = (e: any) => {
        if (e.error === "canceled" || e.error === "interrupted") return;
        if (isSpeakingRef.current && currentSentenceIndexRef.current === index) {
          if (index + 1 < flat.length) {
            speakSentence(index + 1);
          } else {
            stopNarration();
          }
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [parsedSentences, availableVoices, stopNarration]
  );

  const pauseNarration = useCallback(() => {
    isSpeakingRef.current = false;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setIsSpeaking(false);
    setIsPaused(true);
  }, []);

  const resumeNarration = useCallback(() => {
    const target = currentSentenceIndexRef.current >= 0 ? currentSentenceIndexRef.current : 0;
    speakSentence(target);
  }, [speakSentence]);

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      pauseNarration();
    } else if (isPaused && currentSentenceIndex >= 0) {
      resumeNarration();
    } else {
      speakSentence(0);
    }
  }, [isSpeaking, isPaused, currentSentenceIndex, pauseNarration, resumeNarration, speakSentence]);

  const handleSentenceClick = useCallback(
    (flatIndex: number) => {
      if (currentSentenceIndex === flatIndex && isSpeaking) {
        pauseNarration();
      } else {
        speakSentence(flatIndex);
      }
    },
    [currentSentenceIndex, isSpeaking, pauseNarration, speakSentence]
  );

  const handleNextSentence = useCallback(() => {
    if (currentSentenceIndex < parsedSentences.flatSentences.length - 1) {
      speakSentence(currentSentenceIndex + 1);
    }
  }, [currentSentenceIndex, parsedSentences, speakSentence]);

  const handlePrevSentence = useCallback(() => {
    if (currentSentenceIndex > 0) {
      speakSentence(currentSentenceIndex - 1);
    }
  }, [currentSentenceIndex, speakSentence]);

  const cycleSpeechRate = useCallback(() => {
    const rates = [0.85, 0.95, 1.1, 1.25];
    const currentIdx = rates.indexOf(speechRate);
    const nextRate = rates[(currentIdx + 1) % rates.length];
    setSpeechRate(nextRate);
    speechRateRef.current = nextRate;
    if (isSpeakingRef.current && currentSentenceIndexRef.current >= 0) {
      speakSentence(currentSentenceIndexRef.current);
    }
  }, [speechRate, speakSentence]);

  useEffect(() => {
    stopNarration();
  }, [activeArticle, stopNarration]);

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
                stopNarration();
                setActiveArticle(null);
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
              title={
                isSpeaking
                  ? "Pause narration"
                  : isPaused && currentSentenceIndex >= 0
                  ? "Resume narration"
                  : "Listen to audio narration"
              }
              className={`h-9 px-3.5 rounded-full border flex items-center gap-2 cursor-pointer transition-all text-xs font-medium ${
                isSpeaking
                  ? "bg-[#D9A441] border-[#D9A441] text-[#0A0A0A] shadow-[0_0_15px_rgba(217,164,65,0.4)] font-semibold"
                  : isPaused && currentSentenceIndex >= 0
                  ? "bg-[#D9A441]/20 border-[#D9A441] text-[#D9A441]"
                  : "bg-[#151515] border-[#252525] text-[#D9A441] hover:border-[#D9A441]"
              }`}
            >
              {isSpeaking ? (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-[#0A0A0A] rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-0.5 h-2 bg-[#0A0A0A] rounded-full animate-bounce [animation-delay:0.3s]" />
                  <span className="w-0.5 h-3.5 bg-[#0A0A0A] rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              ) : (
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
              )}
              <span>
                {isSpeaking
                  ? "Pause"
                  : isPaused && currentSentenceIndex >= 0
                  ? "Resume"
                  : "Listen"}
              </span>
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
              <h1
                id="read-segment-title"
                onClick={() => handleSentenceClick(0)}
                title="Click to listen from title"
                className={`font-serif-fraunces text-2xl sm:text-3xl font-semibold leading-snug mb-3 cursor-pointer transition-all duration-300 rounded-lg p-1.5 -ml-1.5 ${
                  currentSentenceIndex === 0
                    ? "bg-[#D9A441]/25 text-[#FFF2B2] shadow-[0_0_24px_rgba(217,164,65,0.3)] border-l-4 border-[#D9A441] pl-3.5 ring-1 ring-[#D9A441]/40"
                    : isSpeaking
                    ? "text-[#B0B0B0] hover:text-[#FFFFFF]"
                    : "text-[#F5F5F5] hover:text-[#D9A441]/90"
                }`}
              >
                {currentSentenceIndex === 0 && (
                  <span className="inline-flex items-center mr-2 text-[#D9A441] align-middle animate-pulse">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path
                        d="M15.54 8.46a5 5 0 010 7.08"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                )}
                {activeArticle.title}
              </h1>
              <div className="flex items-center gap-2 text-[12px] text-[#7A7A7A]">
                <span>{activeArticle.readTime}</span>
                <span>·</span>
                <span>Sacred Wisdom Library</span>
              </div>
            </div>

            <div className="w-12 h-[2px] bg-[#D9A441]/40 rounded-full" />

            {/* Article Paragraphs with Real-Time Reading Highlight */}
            <div className="space-y-4 text-[15px] sm:text-[16px] leading-[1.8] font-normal">
              {parsedSentences.paragraphs.map((sentencesInPara, pIdx) => (
                <p key={pIdx} className="whitespace-pre-line text-left">
                  {sentencesInPara.map((sent) => {
                    const flatIndex = parsedSentences.flatSentences.findIndex(
                      (s) => s.id === sent.id
                    );
                    const isActive = currentSentenceIndex === flatIndex;
                    return (
                      <span
                        id={`read-segment-${sent.id}`}
                        key={sent.id}
                        onClick={() => handleSentenceClick(flatIndex)}
                        title="Click to listen from this line"
                        className={`inline cursor-pointer transition-all duration-300 rounded px-1.5 py-0.5 mx-0.5 select-text ${
                          isActive
                            ? "bg-[#D9A441]/25 text-[#FFF4C2] font-medium shadow-[0_0_18px_rgba(217,164,65,0.35)] border-b-2 border-[#D9A441] ring-1 ring-[#D9A441]/40"
                            : isSpeaking
                            ? "text-[#888888] hover:text-[#FFFFFF] hover:bg-white/5"
                            : "text-[#E0E0E0] hover:text-[#FFFFFF] hover:bg-white/5"
                        }`}
                      >
                        {isActive && (
                          <span className="inline-flex items-center mr-1 text-[#D9A441] align-baseline animate-pulse">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M11 5L6 9H2v6h4l5 4V5z" />
                              <path
                                d="M15.54 8.46a5 5 0 010 7.08"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        )}
                        {sent.text}{" "}
                      </span>
                    );
                  })}
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

          {/* Floating Audio Reading Controller */}
          {(isSpeaking || (isPaused && currentSentenceIndex >= 0)) && (
            <div className="border-t border-[#292929] bg-[#121212]/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 text-xs shrink-0 shadow-[0_-8px_20px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="w-2 h-2 rounded-full bg-[#D9A441] animate-ping shrink-0" />
                <span className="text-[#D9A441] font-medium truncate">
                  {isSpeaking ? "Reading" : "Paused"} · Line{" "}
                  {Math.max(1, currentSentenceIndex + 1)} of{" "}
                  {parsedSentences.flatSentences.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Prev line */}
                <button
                  onClick={handlePrevSentence}
                  disabled={currentSentenceIndex <= 0}
                  title="Previous sentence"
                  className="w-7 h-7 rounded-full bg-[#1C1C1C] border border-[#2B2B2B] text-[#D9D9D9] hover:text-[#D9A441] hover:border-[#D9A441] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>

                {/* Play / Pause toggle */}
                <button
                  onClick={toggleSpeech}
                  title={isSpeaking ? "Pause" : "Play"}
                  className="w-8 h-8 rounded-full bg-[#D9A441] text-[#0A0A0A] font-bold flex items-center justify-center hover:bg-[#C29235] transition-transform active:scale-95 shadow-sm"
                >
                  {isSpeaking ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="ml-0.5"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Next line */}
                <button
                  onClick={handleNextSentence}
                  disabled={currentSentenceIndex >= parsedSentences.flatSentences.length - 1}
                  title="Next sentence"
                  className="w-7 h-7 rounded-full bg-[#1C1C1C] border border-[#2B2B2B] text-[#D9D9D9] hover:text-[#D9A441] hover:border-[#D9A441] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>

                {/* Rate Selector */}
                <button
                  onClick={cycleSpeechRate}
                  title="Speed rate"
                  className="px-2 py-0.5 rounded-md bg-[#1C1C1C] border border-[#2B2B2B] text-[11px] font-mono text-[#D9A441] hover:border-[#D9A441] transition-colors"
                >
                  {speechRate}x
                </button>

                {/* Stop button */}
                <button
                  onClick={stopNarration}
                  title="Stop narration"
                  className="w-7 h-7 rounded-full bg-[#1C1C1C] border border-[#2B2B2B] text-[#9A9A9A] hover:text-[#FF6B6B] hover:border-[#FF6B6B] flex items-center justify-center transition-colors ml-0.5"
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}

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
