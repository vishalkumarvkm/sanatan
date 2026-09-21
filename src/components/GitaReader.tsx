"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Sparkles, 
  Languages, 
  Bookmark, 
  Volume2, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  X
} from "lucide-react";
import { UserProfile } from "@/types/onboarding";
import { fetchSlokFromApi } from "@/lib/api";
import { InlineSakhaChatModal } from "@/components/InlineSakhaChatModal";

interface GitaReaderProps {
  initialChapter?: number;
  onBack: () => void;
  onAskSakha: (prompt: string) => void;
  profile?: UserProfile;
}

export interface GitaChapterData {
  chapterNumber: number;
  sanskritName: string;
  englishTitle: string;
  theme: string;
  verseCount: number;
  summary: string;
}

export interface GitaWordMeaning {
  word: string;
  meaning: string;
}

export interface GitaVerseData {
  chapterNumber: number;
  verseNumber: number;
  sanskritText: string;
  romanText: string;
  wordByWord: GitaWordMeaning[];
  englishTranslation: string;
  hindiTranslation: string;
  purport: string;
}

export const GITA_CHAPTERS: GitaChapterData[] = [
  {
    chapterNumber: 1,
    sanskritName: "अर्जुनविषादयोग",
    englishTitle: "Arjuna's Dilemma & Grief",
    theme: "Despondency & The Human Condition",
    verseCount: 47,
    summary: "Arjuna sees his kinsmen on the battlefield of Kurukshetra and is overcome by sorrow, laying down his bow in confusion.",
  },
  {
    chapterNumber: 2,
    sanskritName: "साङ्ख्ययोग",
    englishTitle: "Transcendental Knowledge (Sankhya Yoga)",
    theme: "Immortal Soul & Duty without Attachment",
    verseCount: 72,
    summary: "Lord Krishna imparts supreme wisdom regarding the eternal nature of the soul (Atman), duty (Dharma), and Nishkama Karma.",
  },
  {
    chapterNumber: 3,
    sanskritName: "कर्मयोग",
    englishTitle: "The Path of Selfless Action",
    theme: "Karma Yoga & Sacrificial Duty",
    verseCount: 43,
    summary: "Krishna explains why action is necessary in the physical world and how performing work without selfish desire liberates the mind.",
  },
  {
    chapterNumber: 4,
    sanskritName: "ज्ञानकर्मसंन्यासयोग",
    englishTitle: "Wisdom in Action & Divine Incarnation",
    theme: "Avatarhood & Spiritual Sacrifice",
    verseCount: 42,
    summary: "The divine origin of yoga, the incarnation of the Divine to protect righteousness, and how knowledge burns all karmic bondage.",
  },
  {
    chapterNumber: 5,
    sanskritName: "कर्मसंन्यासयोग",
    englishTitle: "Renunciation of Action",
    theme: "True Sanyasa & Inner Stillness",
    verseCount: 29,
    summary: "Comparing outer renunciation with selfless action, Krishna shows that both lead to liberation when performed with mental purity.",
  },
  {
    chapterNumber: 6,
    sanskritName: "आत्मसंयमयोग",
    englishTitle: "The Path of Meditation (Dhyana Yoga)",
    theme: "Mind Control & Spiritual Equanimity",
    verseCount: 47,
    summary: "Practical guidance on meditation, mastering the restless mind, and achieving equanimity through steady self-realization.",
  },
  {
    chapterNumber: 7,
    sanskritName: "ज्ञानविज्ञानयोग",
    englishTitle: "Knowledge of the Ultimate Reality",
    theme: "Divine Nature & Maya Illusion",
    verseCount: 30,
    summary: "Krishna reveals His material and spiritual energies, explaining how Maya veils the divine consciousness from human perception.",
  },
  {
    chapterNumber: 8,
    sanskritName: "अक्षरब्रह्मयोग",
    englishTitle: "Attaining the Supreme Eternal Being",
    theme: "Final Remembrance & Cosmic Cycles",
    verseCount: 28,
    summary: "The science of dying with divine awareness, the nature of Brahma's day and night, and the eternal unmanifest realm.",
  },
  {
    chapterNumber: 9,
    sanskritName: "राजविद्याराजगुह्ययोग",
    englishTitle: "The Sovereign Knowledge & Royal Secret",
    theme: "Universal Presence & Pure Devotion",
    verseCount: 34,
    summary: "The most sacred spiritual mystery: how the Divine sustains all creation while remaining unattached, accessible through love.",
  },
  {
    chapterNumber: 10,
    sanskritName: "विभूतियोग",
    englishTitle: "The Divine Glories & Manifestations",
    theme: "Infinite Opulences of the Absolute",
    verseCount: 42,
    summary: "Krishna describes His infinite cosmic splendors present as the sun among lights, Shiva among Rudras, and Om among words.",
  },
  {
    chapterNumber: 11,
    sanskritName: "विश्वरूपदर्शनयोग",
    englishTitle: "The Vision of the Cosmic Form",
    theme: "Vishvarupa Darshan",
    verseCount: 55,
    summary: "Arjuna is granted divine eyes to behold Krishna's awe-inspiring Vishvarupa, displaying all universes, gods, and time itself.",
  },
  {
    chapterNumber: 12,
    sanskritName: "भक्तियोग",
    englishTitle: "The Path of Devotion (Bhakti Yoga)",
    theme: "Loving Devotion & Qualities of a Bhakta",
    verseCount: 20,
    summary: "Krishna details the direct path of loving surrender, listing the sublime qualities of a true devotee beloved by God.",
  },
  {
    chapterNumber: 13,
    sanskritName: "क्षेत्रक्षेत्रज्ञविभागयोग",
    englishTitle: "The Field & The Knower of the Field",
    theme: "Body, Soul, & Universal Consciousness",
    verseCount: 35,
    summary: "Discerning the physical field (Kshetra - body/mind) from the eternal knower of the field (Kshetrajna - Atman/Paramatman).",
  },
  {
    chapterNumber: 14,
    sanskritName: "गुणत्रयविभागयोग",
    englishTitle: "The Three Gunas of Material Nature",
    theme: "Sattva, Rajas, and Tamas",
    verseCount: 27,
    summary: "How Sattva (purity), Rajas (passion), and Tamas (ignorance) bind the soul, and how transcending all three brings liberation.",
  },
  {
    chapterNumber: 15,
    sanskritName: "पुरुषोत्तमयोग",
    englishTitle: "The Supreme Supreme Person",
    theme: "The Inverted Cosmic Tree & Purushottama",
    verseCount: 20,
    summary: "The allegory of the inverted Ashvattha tree, cutting roots with non-attachment, and understanding the Supreme Cosmic Spirit.",
  },
  {
    chapterNumber: 16,
    sanskritName: "दैवासुरसम्पद्विभागयोग",
    englishTitle: "Divine & Demonic Natures",
    theme: "Virtue vs. Delusion & The Three Gates",
    verseCount: 24,
    summary: "Contrasting divine virtues (fearlessness, truth, compassion) with demonic traits (pride, anger, greed—the gates to darkness).",
  },
  {
    chapterNumber: 17,
    sanskritName: "श्रद्धात्रयविभागयोग",
    englishTitle: "The Three Types of Faith",
    theme: "Faith, Food, & Sacrifices in 3 Gunas",
    verseCount: 28,
    summary: "How faith, food, austerity, and charity reflect Sattva, Rajas, or Tamas, and the sacred formula 'Om Tat Sat'.",
  },
  {
    chapterNumber: 18,
    sanskritName: "मोक्षसंन्यासयोग",
    englishTitle: "Perfection of Renunciation & Liberation",
    theme: "Ultimate Victory & Divine Surrender",
    verseCount: 78,
    summary: "The grand synthesis of Karma, Jnana, and Bhakti, ending with Krishna's supreme promise: 'Surrender all unto Me, fear not.'",
  },
];

export const GITA_SAMPLE_VERSES: GitaVerseData[] = [
  {
    chapterNumber: 2,
    verseNumber: 47,
    sanskritText: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    romanText: "karmaṇy-evādhikāras te mā phaleṣu kadāchana\nmā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi",
    wordByWord: [
      { word: "karmaṇi", meaning: "in prescribed duties" },
      { word: "eva", meaning: "certainly / only" },
      { word: "adhikāraḥ", meaning: "right / entitlement" },
      { word: "te", meaning: "your" },
      { word: "mā", meaning: "never" },
      { word: "phaleṣu", meaning: "in the fruits / results" },
      { word: "kadāchana", meaning: "at any time" },
      { word: "mā karma-phala-hetuḥ", meaning: "do not consider yourself the cause of results" },
      { word: "mā te saṅgaḥ astu", meaning: "let there be no attachment" },
      { word: "akarmaṇi", meaning: "to inaction" },
    ],
    englishTranslation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, nor be attached to inaction.",
    hindiTranslation: "तुम्हारा अधिकार केवल कर्म करने में ही है, उसके फलों में कभी नहीं। इसलिए तुम कर्मों के फल का कारण मत बनो और न ही तुम्हारी आसक्ति अकर्म (कर्म न करने) में हो।",
    purport: "This iconic verse encapsulates Karma Yoga. Action performed purely out of duty, free from anxiety about outcomes or selfish desires, purifies the mind and leads to spiritual liberation.",
  },
  {
    chapterNumber: 2,
    verseNumber: 14,
    sanskritText: "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः ।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥",
    romanText: "mātrā-sparśās tu kaunteya śītoṣṇa-sukha-duḥkha-dāḥ\nāgamāpāyino ’nityās tāṁs titikṣasva bhārata",
    wordByWord: [
      { word: "mātrā-sparśāḥ", meaning: "sensory contact with matter" },
      { word: "tu", meaning: "indeed" },
      { word: "kaunteya", meaning: "O son of Kunti (Arjuna)" },
      { word: "śīta-uṣṇa", meaning: "winter and summer / cold and heat" },
      { word: "sukha-duḥkha-dāḥ", meaning: "givers of pleasure and pain" },
      { word: "āgama-apāyinaḥ", meaning: "appearing and disappearing" },
      { word: "anityāḥ", meaning: "transient / non-permanent" },
      { word: "tān", meaning: "them" },
      { word: "titikṣasva", meaning: "endure patiently" },
      { word: "bhārata", meaning: "O descendant of Bharat" },
    ],
    englishTranslation: "O son of Kunti, the contact of the senses with their objects gives rise to cold and heat, pleasure and pain. They come and go, being temporary. Endure them patiently, O descendant of Bharat.",
    hindiTranslation: "हे कौन्तेय! सर्दी-गर्मी और सुख-दुःख देने वाले इन्द्रिय और विषयों के संयोग तो उत्पत्ति-विनाशशील और अनित्य हैं, इसलिए हे भारत! तुम उनको सहन करो।",
    purport: "Dualities like happiness and sorrow are impermanent states caused by sensory contact. Equanimity (Titiksha) allows a seeker to remain steady regardless of external dualities.",
  },
  {
    chapterNumber: 2,
    verseNumber: 20,
    sanskritText: "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥",
    romanText: "na jāyate mriyate vā kadāchin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ\najo nityaḥ śāśvato ’yaṁ purāṇo na hanyate hanyamāne śarīre",
    wordByWord: [
      { word: "na", meaning: "never" },
      { word: "jāyate", meaning: "is born" },
      { word: "mriyate", meaning: "dies" },
      { word: "vā", meaning: "or" },
      { word: "kadāchit", meaning: "at any time" },
      { word: "ajaḥ", meaning: "unborn" },
      { word: "nityaḥ", meaning: "eternal" },
      { word: "śāśvataḥ", meaning: "everlasting" },
      { word: "purāṇaḥ", meaning: "ancient" },
      { word: "na hanyate", meaning: "is not slain" },
      { word: "hanyamāne śarīre", meaning: "when the body is destroyed" },
    ],
    englishTranslation: "The soul is neither born, nor does it ever die; nor having once been, does it cease to be. Unborn, eternal, ever-existing and primeval, it is not slain when the body is slain.",
    hindiTranslation: "यह आत्मा किसी काल में भी न तो जन्म लेता है और न मरता ही है तथा न यह उत्पन्न होकर फिर होने वाला ही है; क्योंकि यह अजन्मा, नित्य, सनातन और पुरातन है, शरीर के मारे जाने पर भी यह नहीं मारा जाता।",
    purport: "The immortal nature of consciousness (Atman). The physical body decays and changes, but the true inner self remains untouched by death or destruction.",
  },
  {
    chapterNumber: 3,
    verseNumber: 19,
    sanskritText: "तस्मादसक्तः सतत कार्य कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ॥",
    romanText: "tasmād asaktaḥ satataṁ kāryaṁ karma samāchara\nasakto hy ācharan karma param āpnoti pūruṣaḥ",
    wordByWord: [
      { word: "tasmāt", meaning: "therefore" },
      { word: "asaktaḥ", meaning: "without attachment" },
      { word: "satatam", meaning: "constantly" },
      { word: "kāryam", meaning: "duty" },
      { word: "karma", meaning: "action" },
      { word: "samāchara", meaning: "perform efficiently" },
      { word: "param", meaning: "the Supreme Goal" },
      { word: "āpnoti", meaning: "attains" },
    ],
    englishTranslation: "Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.",
    hindiTranslation: "इसलिए तुम निरंतर आसक्ति से रहित होकर कर्तव्य कर्म का भलीभांति आचरण करो, क्योंकि आसक्तिरहित होकर कर्म करता हुआ मनुष्य परमात्मा को प्राप्त हो जाता है।",
    purport: "Selfless service performed as an offering to the Divine leads straight to liberation (Moksha).",
  },
  {
    chapterNumber: 4,
    verseNumber: 7,
    sanskritText: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
    romanText: "yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṁ sṛijāmyaham",
    wordByWord: [
      { word: "yadā yadā", meaning: "whenever" },
      { word: "hi", meaning: "certainly" },
      { word: "dharmasya", meaning: "of righteousness / Dharma" },
      { word: "glāniḥ", meaning: "decline / decay" },
      { word: "bhavati", meaning: "takes place" },
      { word: "abhyutthānam", meaning: "rise / increase" },
      { word: "adharmasya", meaning: "of unrighteousness" },
      { word: "tadā", meaning: "at that time" },
      { word: "ātmānam", meaning: "Myself" },
      { word: "sṛijāmi aham", meaning: "I manifest / reincarnate" },
    ],
    englishTranslation: "Whenever there is a decline in righteousness and a rise in unrighteousness, O descendant of Bharat, at that time I manifest Myself on earth.",
    hindiTranslation: "हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब ही मैं अपने रूप को रचता हूँ अर्थात प्रकट होता हूँ।",
    purport: "The timeless law of divine incarnation (Avatarhood). Divine consciousness descends into the physical world whenever moral order needs re-establishment.",
  },
  {
    chapterNumber: 4,
    verseNumber: 8,
    sanskritText: "परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे ॥",
    romanText: "paritrāṇāya sādhūnāṁ vināśāya cha duṣkṛitām\ndharma-saṁsthāpanārthāya sambhavāmi yuge yuge",
    wordByWord: [
      { word: "paritrāṇāya", meaning: "for the protection" },
      { word: "sādhūnām", meaning: "of the virtuous" },
      { word: "vināśāya", meaning: "for the destruction" },
      { word: "cha", meaning: "and" },
      { word: "duṣkṛitām", meaning: "of evil-doers" },
      { word: "dharma-saṁsthāpana-arthāya", meaning: "for re-establishing Dharma" },
      { word: "sambhavāmi", meaning: "I appear / manifest" },
      { word: "yuge yuge", meaning: "age after age / in every epoch" },
    ],
    englishTranslation: "To protect the righteous, destroy evil-doers, and re-establish the principles of Dharma, I manifest age after age.",
    hindiTranslation: "साधु पुरुषों का उद्धार करने के लिए, पाप कर्म करने वालों का विनाश करने के लिए और धर्म की अच्छी तरह से स्थापना करने के लिए मैं युग-युग में प्रकट हुआ करता हूँ।",
    purport: "The threefold purpose of the Supreme Incarnation: protecting the good, ending tyranny, and restoring truth.",
  },
  {
    chapterNumber: 6,
    verseNumber: 5,
    sanskritText: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
    romanText: "uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    wordByWord: [
      { word: "uddharet", meaning: "elevate / uplift" },
      { word: "ātmanā", meaning: "by the higher self / mind" },
      { word: "ātmānam", meaning: "the lower self" },
      { word: "na", meaning: "never" },
      { word: "avasādayet", meaning: "debase / degrade" },
      { word: "ātma eva", meaning: "the mind alone" },
      { word: "bandhuḥ", meaning: "friend" },
      { word: "ripuḥ", meaning: "enemy" },
    ],
    englishTranslation: "Elevate yourself through the power of your own mind, and do not degrade yourself. For the mind alone is the friend of the self, and the mind alone is the enemy of the self.",
    hindiTranslation: "अपने द्वारा अपना उद्धार करे, अपना पतन न करे; क्योंकि यह आप ही अपना मित्र है और आप ही अपना शत्रु है।",
    purport: "Self-mastery and internal responsibility. You have the power within your mind to be your own greatest guide or your own worst hindrance.",
  },
  {
    chapterNumber: 9,
    verseNumber: 22,
    sanskritText: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥",
    romanText: "ananyāś chintayanto māṁ ye janāḥ paryupāsate\nteṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
    wordByWord: [
      { word: "ananyāḥ", meaning: "always absorbed with single-minded devotion" },
      { word: "chintayantaḥ", meaning: "contemplating / remembering" },
      { word: "mām", meaning: "Me" },
      { word: "paryupāsate", meaning: "worship sincerely" },
      { word: "teṣām", meaning: "for them" },
      { word: "nitya-abhiyuktānām", meaning: "always united with Me" },
      { word: "yoga-kṣemam", meaning: "provision and protection of needs" },
      { word: "vahāmi aham", meaning: "I carry / guarantee personally" },
    ],
    englishTranslation: "For those who always worship Me with unswerving devotion, meditating on My divine form, I personally carry what they lack and preserve what they have.",
    hindiTranslation: "जो अनन्यप्रेमी भक्त मेरा निरंतर चिंतन करते हुए मेरी उपासना करते हैं, उन नित्य-अभियुक्त पुरुषों का योगक्षेम (जो अप्राप्त है उसकी प्राप्ति और प्राप्त की रक्षा) मैं स्वयं वहन करता हूँ।",
    purport: "The sacred divine promise of total care. True single-minded surrender brings divine grace that attends to all physical and spiritual necessities.",
  },
  {
    chapterNumber: 11,
    verseNumber: 12,
    sanskritText: "दिवि सूर्यसहस्रस्य भवेद्युगपदुत्थिता ।\nयदि भाः सदृशी सा स्याद्भासस्तस्य महात्मनः ॥",
    romanText: "divi sūrya-sahasrasya bhavedyugapad utthitā\nyadi bhāḥ sadṛiśī sā syād bhāsas tasya mahātmanaḥ",
    wordByWord: [
      { word: "divi", meaning: "in the sky / heavens" },
      { word: "sūrya-sahasrasya", meaning: "of a thousand suns" },
      { word: "bhavet", meaning: "were" },
      { word: "yugapat", meaning: "simultaneously" },
      { word: "utthitā", meaning: "blazing forth" },
      { word: "bhāḥ", meaning: "brilliance / light" },
      { word: "sadṛiśī", meaning: "resembling" },
      { word: "mahātmanaḥ", meaning: "of the Supreme Lord" },
    ],
    englishTranslation: "If a thousand suns were to blaze forth simultaneously in the sky, their radiance might resemble the effulgence of that Supreme Cosmic Form.",
    hindiTranslation: "आकाश में हजार सूर्यों के एक साथ उदय होने से जो प्रकाश उत्पन्न हो, वह भी उस विश्वरूप महात्मा परमात्मा के प्रकाश के सदृश कदाचित ही हो।",
    purport: "Sanjaya describes the transcendent, awe-inspiring radiance of Lord Krishna's Vishvarupa (Cosmic Form) shown to Arjuna.",
  },
  {
    chapterNumber: 18,
    verseNumber: 66,
    sanskritText: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥",
    romanText: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo mokṣhayiṣhyāmi mā śuchaḥ",
    wordByWord: [
      { word: "sarva-dharmān", meaning: "all varieties of duties and designations" },
      { word: "parityajya", meaning: "surrendering / abandoning lower attachments" },
      { word: "mām ekam", meaning: "unto Me alone" },
      { word: "śaraṇam vraja", meaning: "take refuge / surrender" },
      { word: "aham", meaning: "I" },
      { word: "tvām", meaning: "you" },
      { word: "sarva-pāpebhyaḥ", meaning: "from all sins and fears" },
      { word: "mokṣhayiṣhyāmi", meaning: "shall deliver / liberate" },
      { word: "mā śuchaḥ", meaning: "do not grieve / fear not" },
    ],
    englishTranslation: "Abandon all varieties of dharmas and simply surrender unto Me alone. I shall liberate you from all sins and bondages. Do not fear or grieve.",
    hindiTranslation: "सब धर्मों को अर्थात सब कर्तव्य कर्मों को मुझमें त्यागकर तुम केवल एक मुझ सर्वशक्तिमान परमेश्वर की शरण में आ जाओ। मैं तुम्हें सब पापों से मुक्त कर दूंगा, तुम शोक मत करो।",
    purport: "The ultimate climax (Charama Shloka) of the Bhagavad Gita. Total surrender (Sharanagati) to the Divine dissolves all fear, sin, and spiritual confusion.",
  },
];

export const GitaReader: React.FC<GitaReaderProps> = ({
  initialChapter = 2,
  onBack,
  onAskSakha,
  profile,
}) => {
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [showHindi, setShowHindi] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<string>>(new Set(["2.47", "18.66"]));
  const [expandedWordByWord, setExpandedWordByWord] = useState<Set<string>>(new Set(["2.47"]));
  const [expandedPurport, setExpandedPurport] = useState<Set<string>>(new Set());
  const [speakingVerseKey, setSpeakingVerseKey] = useState<string | null>(null);
  const [isInlineChatOpen, setIsInlineChatOpen] = useState(false);
  const [inlineChatPrompt, setInlineChatPrompt] = useState<string | undefined>(undefined);

  const handleSpeakVerse = (verse: GitaVerseData) => {
    const verseKey = `${verse.chapterNumber}.${verse.verseNumber}`;

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser environment.");
      return;
    }

    const synth = window.speechSynthesis;

    // If currently speaking this verse, stop speaking
    if (speakingVerseKey === verseKey && synth.speaking) {
      synth.cancel();
      setSpeakingVerseKey(null);
      return;
    }

    // Cancel any previous speech
    synth.cancel();

    // Prepare recitation text: sloka + translation
    const textToSpeak = showHindi && verse.hindiTranslation
      ? `${verse.sanskritText}. ${verse.hindiTranslation}`
      : `${verse.romanText || verse.sanskritText}. ${verse.englishTranslation}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.88; // Calm, respectful pace for sacred slokas
    utterance.pitch = 1.0;

    const voices = synth.getVoices();
    if (showHindi) {
      const hiVoice = voices.find((v) => v.lang.startsWith("hi") || v.lang.startsWith("sa"));
      if (hiVoice) utterance.voice = hiVoice;
    } else {
      const enVoice = voices.find((v) => v.lang.startsWith("en-IN") || v.lang.startsWith("en"));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => {
      setSpeakingVerseKey(null);
    };

    utterance.onerror = () => {
      setSpeakingVerseKey(null);
    };

    setSpeakingVerseKey(verseKey);
    synth.speak(utterance);
  };

  // Cleanup speech when component unmounts or chapter changes
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedChapter]);

  const [liveVerses, setLiveVerses] = useState<GitaVerseData[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);

  const currentChapterObj =
    GITA_CHAPTERS.find((c) => c.chapterNumber === selectedChapter) || GITA_CHAPTERS[1];

  // Fetch live verse data from vedicscriptures API when chapter changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingLive(true);

    const versesToFetch = [1, 2, 3]; // Fetch first few verses of the chapter
    if (selectedChapter === 2 && !versesToFetch.includes(47)) versesToFetch.push(47);

    Promise.all(
      versesToFetch.map(async (vNum) => {
        const res = await fetchSlokFromApi(selectedChapter, vNum);
        if (res.success && res.data) {
          const d = res.data;
          const engTrans =
            d.siva?.et || d.prabhu?.et || d.purohit?.et || d.adi?.et || "Translation unavailable";
          const hindiTrans =
            d.tej?.ht || "हिन्दी अनुवाद उपलब्ध";
          const purportText =
            d.prabhu?.ec || d.siva?.ec || d.chinmay?.hc || "Spiritual commentary from traditional Gita scholars.";

          return {
            chapterNumber: d.chapter || selectedChapter,
            verseNumber: d.verse || vNum,
            sanskritText: d.slok || "",
            romanText: d.transliteration || "",
            wordByWord: [
              { word: "Chapter", meaning: `${d.chapter}` },
              { word: "Verse", meaning: `${d.verse}` }
            ],
            englishTranslation: engTrans,
            hindiTranslation: hindiTrans,
            purport: purportText,
          } as GitaVerseData;
        }
        return null;
      })
    ).then((results) => {
      if (!isMounted) return;
      const valid = results.filter(Boolean) as GitaVerseData[];
      setLiveVerses(valid);
      setIsLoadingLive(false);
    }).catch(() => {
      if (isMounted) setIsLoadingLive(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedChapter]);

  // Combine sample verses with live API verses, removing duplicates
  const allVersesMap = new Map<string, GitaVerseData>();
  GITA_SAMPLE_VERSES.filter((v) => v.chapterNumber === selectedChapter).forEach((v) => {
    allVersesMap.set(`${v.chapterNumber}.${v.verseNumber}`, v);
  });
  liveVerses.forEach((v) => {
    allVersesMap.set(`${v.chapterNumber}.${v.verseNumber}`, v);
  });

  const allAvailableVerses = Array.from(allVersesMap.values()).sort(
    (a, b) => a.verseNumber - b.verseNumber
  );

  const displayedVerses = allAvailableVerses.filter((v) => {
    if (isSearching && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return (
        v.englishTranslation.toLowerCase().includes(q) ||
        v.hindiTranslation.toLowerCase().includes(q) ||
        v.sanskritText.toLowerCase().includes(q) ||
        v.romanText.toLowerCase().includes(q) ||
        v.purport.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleBookmark = (ch: number, v: number) => {
    const key = `${ch}.${v}`;
    setBookmarkedVerses((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleWordByWord = (key: string) => {
    setExpandedWordByWord((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const togglePurport = (key: string) => {
    setExpandedPurport((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex flex-col font-sans select-none pb-28 md:pb-12">
      {/* Sticky Header Bar */}
      <header className="sticky top-0 z-40 bg-[#141414] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#C9A55C] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {isSearching ? (
            <div className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-1.5 w-full max-w-xs">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Gita verses (Karma, Soul, Duty)..."
                className="bg-transparent text-xs text-white placeholder:text-white/40 outline-none w-full"
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-wider">
                BHAGAVAD GITA READERS
              </span>
              <h1 className="font-serif-fraunces text-sm sm:text-base font-bold text-white">
                Chapter {selectedChapter} • {currentChapterObj.sanskritName}
              </h1>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsSearching(!isSearching);
              if (isSearching) setSearchQuery("");
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
          >
            {isSearching ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowHindi(!showHindi)}
            className="flex items-center gap-1.5 bg-[#C9A55C]/15 border border-[#C9A55C]/40 text-[#C9A55C] px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-[#C9A55C]/25 transition-colors"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showHindi ? "Hindi (हिन्दी)" : "English"}</span>
          </button>
        </div>
      </header>

      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col p-4 sm:p-6 gap-5">
        {/* 18 Chapters Selector Chips Row */}
        {!isSearching && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {GITA_CHAPTERS.map((ch) => {
              const isSelected = ch.chapterNumber === selectedChapter;
              return (
                <button
                  key={ch.chapterNumber}
                  type="button"
                  onClick={() => setSelectedChapter(ch.chapterNumber)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#C9A55C] text-[#0A0A0A] shadow-md"
                      : "bg-[#141414] border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Ch {ch.chapterNumber} • {ch.sanskritName}
                </button>
              );
            })}
          </div>
        )}

        {/* Chapter Summary Card */}
        {!isSearching && (
          <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-2xl p-5 shadow-lg flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A55C]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#C9A55C] uppercase tracking-wider">
                CHAPTER {selectedChapter} SUMMARY
              </span>
              <span className="text-[10px] font-bold text-white/70 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                {currentChapterObj.verseCount} Verses
              </span>
            </div>

            <h2 className="font-serif-fraunces text-xl font-bold text-white">
              {currentChapterObj.englishTitle}
            </h2>
            <p className="text-xs font-bold text-[#C9A55C]">
              Theme: {currentChapterObj.theme}
            </p>
            <p className="text-xs text-white/70 leading-relaxed">
              {currentChapterObj.summary}
            </p>
          </div>
        )}

        {/* Verses Count & Title */}
        <div className="flex items-center justify-between pt-1">
          <h3 className="font-serif-fraunces text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C9A55C]" />
            <span>
              {isSearching
                ? `Search Results (${displayedVerses.length})`
                : `Verses in Chapter ${selectedChapter}`}
            </span>
          </h3>
          <span className="text-xs text-[#C9A55C] font-semibold">
            {showHindi ? "हिन्दी अनुवाद" : "English Translation"}
          </span>
        </div>

        {/* Empty State */}
        {displayedVerses.length === 0 && (
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
            <BookOpen className="w-10 h-10 text-white/30" />
            <p className="text-xs text-white/60">
              {isSearching
                ? `No verses matching "${searchQuery}" found.`
                : "Select another chapter to read sacred Gita verses."}
            </p>
          </div>
        )}

        {/* Verse Cards List */}
        {displayedVerses.map((verse) => {
          const verseKey = `${verse.chapterNumber}.${verse.verseNumber}`;
          const isBookmarked = bookmarkedVerses.has(verseKey);
          const isWordExpanded = expandedWordByWord.has(verseKey);
          const isPurportExp = expandedPurport.has(verseKey);

          return (
            <div
              key={verseKey}
              className={`bg-[#141414] border rounded-2xl p-5 shadow-md flex flex-col gap-4 transition-all ${
                isBookmarked ? "border-[#C9A55C]" : "border-white/10"
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span className="bg-[#C9A55C]/15 border border-[#C9A55C]/40 text-[#C9A55C] text-xs font-bold px-3 py-1 rounded-xl">
                  Verse {verseKey}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeakVerse(verse)}
                    className={`p-1.5 rounded-full transition-all cursor-pointer ${
                      speakingVerseKey === verseKey
                        ? "bg-[#C9A55C] text-[#0A0A0A] animate-pulse ring-2 ring-[#C9A55C]/50"
                        : "hover:bg-white/10 text-[#C9A55C]"
                    }`}
                    title={speakingVerseKey === verseKey ? "Stop Recitation" : "Listen Recitation"}
                  >
                    <Volume2 className={`w-4 h-4 ${speakingVerseKey === verseKey ? "animate-bounce" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleBookmark(verse.chapterNumber, verse.verseNumber)}
                    className={`p-1.5 rounded-full hover:bg-white/10 cursor-pointer ${
                      isBookmarked ? "text-[#C9A55C]" : "text-white/40"
                    }`}
                    title="Bookmark Verse"
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>

              {/* Sanskrit Devanagari */}
              <p className="devanagari-font text-lg sm:text-xl font-bold text-[#C9A55C] leading-relaxed">
                {verse.sanskritText}
              </p>

              {/* Romanized Text */}
              <p className="font-serif-fraunces italic text-xs text-white/70 leading-relaxed">
                {verse.romanText}
              </p>

              {/* Translation Card */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 flex flex-col gap-1.5">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                  {showHindi ? "अनुवाद (Hindi)" : "TRANSLATION (English)"}
                </span>
                <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                  {showHindi ? verse.hindiTranslation : verse.englishTranslation}
                </p>
              </div>

              {/* Word by Word Drawer */}
              <button
                type="button"
                onClick={() => toggleWordByWord(verseKey)}
                className="bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl p-2.5 flex items-center justify-between text-xs font-semibold text-white/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#C9A55C]" />
                  <span>Word-by-Word Vocabulary ({verse.wordByWord.length} terms)</span>
                </div>
                {isWordExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isWordExpanded && (
                <div className="bg-black/30 border border-white/10 rounded-xl p-3 flex flex-wrap gap-2 animate-fadein">
                  {verse.wordByWord.map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/8 rounded-lg px-2.5 py-1 text-xs"
                    >
                      <span className="devanagari-font font-bold text-[#C9A55C] mr-1">{w.word}:</span>
                      <span className="text-white/70">{w.meaning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Purport / Commentary Drawer */}
              <button
                type="button"
                onClick={() => togglePurport(verseKey)}
                className="bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl p-2.5 flex items-center justify-between text-xs font-semibold text-white/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#C9A55C]" />
                  <span>Spiritual Commentary & Purport</span>
                </div>
                {isPurportExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isPurportExp && (
                <div className="bg-black/30 border border-[#C9A55C]/20 rounded-xl p-3 text-xs text-white/80 leading-relaxed animate-fadein">
                  {verse.purport}
                </div>
              )}

              {/* Bottom Actions Row: Ask Sakha AI & Share */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    const prompt = `Explain Bhagavad Gita Verse ${verse.chapterNumber}.${verse.verseNumber} (${verse.romanText}) and how to apply its wisdom in modern life.`;
                    setInlineChatPrompt(prompt);
                    setIsInlineChatOpen(true);
                  }}
                  className="bg-[#C9A55C] hover:bg-[#B8944B] text-[#0A0A0A] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Sakha AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Verse ${verseKey} link copied!`)}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-[#C9A55C] cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-Page Inline Sakha AI Chat Modal */}
      <InlineSakhaChatModal
        isOpen={isInlineChatOpen}
        onClose={() => setIsInlineChatOpen(false)}
        initialPrompt={inlineChatPrompt}
        profile={profile}
      />
    </div>
  );
};
