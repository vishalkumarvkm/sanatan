import { UserProfile } from "@/types/onboarding";

const ONBOARDING_ENDPOINT =
  process.env.NEXT_PUBLIC_ONBOARDING_API_URL ||
  "https://upswing-bonsai-supermom.ngrok-free.dev/api/v1/onboarding";

export interface OnboardingPayload {
  phone: string;
  name: string;
  preferred_language: string;
  age: number;
  email: string;
  gender: string;
  gender_custom: string;
  life_chapter: string;
  daily_rhythm: string;
  relationship_status: string;
  living_with: string;
  profession: string;
  work_rhythm: string;
  isht_devta: string;
  practice_frequency: string;
  heart_feeling: string;
  feeling_custom_text: string;
  guidance_questions: string[];
  joy_strength_source: string;
  harder_lately: string;
  meditation_practice: string;
  grounding_time: string;
}

export const submitOnboardingData = async (profile: UserProfile): Promise<{ success: boolean; user_id?: string; message?: string }> => {
  const guidanceQuestions: string[] = [
    profile.seekingQuestion1,
    profile.seekingQuestion2,
    profile.seekingQuestion3,
  ].filter((q): q is string => Boolean(q && q.trim()));

  const payload: OnboardingPayload = {
    phone: profile.phone || "+919876543210",
    name: profile.name || "Seeker",
    preferred_language: profile.language || "English",
    age: parseInt(profile.age) || 25,
    email: profile.email || "user@example.com",
    gender: profile.gender || "Prefer not to say",
    gender_custom: profile.genderCustom || "",
    life_chapter: profile.lifeChapter || "Student",
    daily_rhythm: profile.dailyRhythm || "Morning",
    relationship_status: profile.relationshipStatus || "Single",
    living_with: profile.livingSituation || "Family",
    profession: profile.profession || "Software Developer",
    work_rhythm: profile.workRhythm || "Fixed office hours",
    isht_devta: profile.ishtDevta || "Shiva",
    practice_frequency: profile.practiceFrequency || "Daily puja",
    heart_feeling: profile.innerSeason || "Hopeful",
    feeling_custom_text: profile.feelingText || "",
    guidance_questions: guidanceQuestions.length > 0 ? guidanceQuestions : ["How do I find peace in my daily routine?"],
    joy_strength_source: profile.whatLiftsYou || "Daily prayer and family",
    harder_lately: profile.whatWeighsOnYou || "Work deadlines",
    meditation_practice: profile.meditationPractice || "Daily 15 mins",
    grounding_time: profile.groundingTime || "Morning 7 AM",
  };

  try {
    const response = await fetch(ONBOARDING_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok || response.status === 201) {
      const data = await response.json();
      console.log("Onboarding API Success:", data);
      return { success: true, user_id: data.user_id, message: data.message };
    } else {
      console.warn("Onboarding API Response Warning:", response.status, await response.text());
      return { success: false, message: `Server error: ${response.status}` };
    }
  } catch (error: any) {
    console.error("Onboarding API Network Error:", error);
    return { success: false, message: error.message || "Network request failed" };
  }
};

const PERSONA_ENDPOINT =
  process.env.NEXT_PUBLIC_PERSONA_API_URL ||
  "https://upswing-bonsai-supermom.ngrok-free.dev/api/v1/persona/generate";

export const fetchGeneratedPersona = async (
  userId: string
): Promise<{ success: boolean; persona?: any; message?: string }> => {
  try {
    const endpoint = `${PERSONA_ENDPOINT}?user_id=${encodeURIComponent(userId)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: "",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Generated Persona API Success:", data);
      if (data.success && data.persona) {
        return { success: true, persona: data.persona };
      }
    }
    console.warn("Persona API response warning:", response.status);
    return { success: false, message: `Status: ${response.status}` };
  } catch (error: any) {
    console.error("Persona API Error:", error);
    return { success: false, message: error.message || "Network request failed" };
  }
};
