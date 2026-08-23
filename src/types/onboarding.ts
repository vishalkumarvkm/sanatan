export interface UserProfile {
  name: string;
  language: string;
  age: string;
  email: string;
  gender: string;
  genderCustom: string;
  lifeChapter: string;
  dailyRhythm: string;
  relationshipStatus: string;
  livingSituation: string;
  profession: string;
  workRhythm: string;
  ishtDevta: string;
  practiceFrequency: string;
  innerSeason: string;
  feelingText: string;
  seekingQuestion1: string;
  seekingQuestion2: string;
  seekingQuestion3: string;
  whatLiftsYou: string;
  whatWeighsOnYou: string;
  meditationPractice: string;
  groundingTime: string;
  completedOnboarding: boolean;
  phone?: string;
  faithLevel?: string;
  tradition?: string;
  deities?: string[];
  rashi?: string;
  persona?: any;
}

export const initialProfile: UserProfile = {
  name: "",
  language: "Hindi",
  age: "",
  email: "",
  gender: "Man",
  genderCustom: "",
  lifeChapter: "Student",
  dailyRhythm: "Early riser",
  relationshipStatus: "Single",
  livingSituation: "Living alone",
  profession: "Software Engineer",
  workRhythm: "Fixed office hours",
  ishtDevta: "Shiva",
  practiceFrequency: "A few times a week",
  innerSeason: "Peaceful",
  feelingText: "",
  seekingQuestion1: "",
  seekingQuestion2: "",
  seekingQuestion3: "",
  whatLiftsYou: "",
  whatWeighsOnYou: "",
  meditationPractice: "Sometimes",
  groundingTime: "Sunrise",
  completedOnboarding: false,
  phone: "+91 98765 43210",
  faithLevel: "Devoted",
  tradition: "Sanatan Dharma",
  deities: ["shiva", "hanuman"],
  rashi: "Karka (Cancer)",
};

export interface PanchangData {
  date: string;
  day: string;
  tithi: {
    name: string;
    deity: string;
    endTime: string;
  };
  nakshatra: {
    name: string;
    ruler: string;
    endTime: string;
  };
  yoga: string;
  karana: string;
  rahuKaal: {
    start: string;
    end: string;
  };
  sunrise: string;
  sunset: string;
  moonrise: string;
  festivals: string[];
  interpretation: string;
}

export interface AstroBriefData {
  rashi: string;
  rashiName: string;
  rashiNameHi: string;
  rulingPlanet: string;
  brief: string;
  luckyColor: string;
  luckyNumber: number;
  advice: string;
}

export interface WisdomQuoteData {
  text: string;
  source: string;
  context: string;
}

export interface BhajanTrack {
  id: string;
  title: string;
  deity: string;
  duration: string;
  audioUrl?: string;
}
