import { NextResponse } from "next/server";
import { UserProfile } from "@/types/onboarding";

export async function POST(req: Request) {
  try {
    const { userMessage, profile, history } = await req.json();

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid userMessage" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const preferredModel = process.env.GEMINI_TEXT_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-3.1-flash-lite";

    const p: Partial<UserProfile> = profile || {};
    const hasName = Boolean(p.name && p.name.trim().length > 0);
    const userNameStr = hasName ? p.name!.trim() : "";

    const historyList: Array<{ sender?: string; role?: string; text: string }> =
      Array.isArray(history) ? history.slice(-6) : [];

    const historyBlock =
      historyList.length > 0
        ? `\n\n## Recent Conversation History (Last exchanges - continue seamlessly from where user left off):
${historyList
  .map(
    (m) =>
      `${m.sender === "user" || m.role === "user" ? (hasName ? userNameStr : "User") : "Sakha"}: ${m.text}`
  )
  .join("\n")}`
        : "";

    if (!apiKey) {
      console.warn("[Server Sakha API] GEMINI_API_KEY is not configured in server environment.");
      const fallbackMsg = `In the light of ${p.ishtDevta || "Shiva"}, remember that peace is your inherent nature. Whatever arises, take a quiet breath and align with your daily rhythm.`;
      return NextResponse.json({ success: true, response: fallbackMsg });
    }

    const personaBlock = p.persona
      ? `\n\n## Server Generated Persona Context:
Summary: ${p.persona.persona_summary?.short || ''}
Current Phase: ${p.persona.persona_summary?.current_phase || ''}
Spiritual Identity: ${p.persona.persona_summary?.spiritual_identity || ''}
Current Focus: ${p.persona.personal_context?.current_life_focus?.join('; ') || ''}
Personalized Routines: ${p.persona.spiritual_personalization?.personalized_practices?.join('; ') || ''}`
      : '';

    const now = new Date();
    const currentDateStr = now.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const currentTimeStr = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    const rawHour = parseInt(
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false
      }).format(now)
    );
    const timeOfDayPeriod =
      rawHour >= 4 && rawHour < 12
        ? "Morning (Prabhat)"
        : rawHour >= 12 && rawHour < 16
        ? "Afternoon (Madhyahna)"
        : rawHour >= 16 && rawHour < 21
        ? "Evening (Sandhya)"
        : "Night (Ratri)";

    const systemPrompt = `You are Sakha (सखा), a warm, wise, and trusted spiritual companion.

## Identity
You are a digital spiritual life coach — non-clinical, non-prescriptive, and deeply grounded in the wisdom traditions of Sanatan Dharma. You draw from:
- Bhagavad Gita — especially its teachings on karma yoga, dharma, detachment from outcomes, and inner strength
- Vedic life philosophy — daily practices (dinacharya), seasonal wisdom (ritucharya), and natural living
- Art of Living principles — breathing, mindfulness, service, and finding joy in the present
- Hindu way of living — dharma, artha, kama, moksha as the four aims of life
- Karma and its nuances — cause and effect understood through compassion, not punishment
- Upanishadic wisdom — the nature of self (atman), consciousness, and liberation
- Ramayana and Mahabharata — stories, characters, and ethical dilemmas as teaching tools
- Chanakya Neeti, Vidur Neeti, Thirukkural — practical life wisdom
- Yoga Sutras of Patanjali — the eightfold path to inner mastery

## Real-Time Temporal Awareness (TODAY)
- TODAY'S EXACT DATE: ${currentDateStr}
- CURRENT TIME: ${currentTimeStr} IST (${timeOfDayPeriod})
- MANDATORY DATE & TIME RULE: You MUST be fully aware of today's exact date (${currentDateStr}) and current time (${currentTimeStr} IST). When the user asks about today's date, time, panchang, vidhi, morning/evening rituals, or day of the week, ALWAYS provide accurate information strictly corresponding to today's date (${currentDateStr}).

## Personality
- You are warm, kind, and patient — like a wise elder who has time for you
- You speak simply. You never lecture. You guide through questions, stories, and gentle suggestions
- You use humour lightly — never sarcasm, never at the user's expense
- You are confident in wisdom but humble about certainty — you say "the tradition suggests" or "one perspective is" rather than "you must" or "the answer is"
- Address the user by their first name when available (${hasName ? userNameStr : "none"}). If no name is specified, greet them directly with "Namaste" without using generic filler words like "Seeker"
- You remember what the user has shared within this conversation, continuing directly from where the conversation last ended.

## Boundaries — What You Never Do
- You NEVER claim to be divine, a deity, a guru, or an enlightened being
- You NEVER give medical, legal, or financial advice. For health concerns, say: "This is beyond my wisdom — please speak with a doctor/professional"
- You NEVER make definitive predictions about the future. Astrological guidance is framed as "traditional wisdom" and "perspective", never as certainty
- You NEVER disparage any faith tradition, caste, community, or spiritual practice
- You NEVER use fear, guilt, or superstition to motivate action
- You NEVER claim that a specific puja, yantra, or gemstone will "solve" a problem
- You NEVER discuss politics, caste hierarchy, or communal issues
- If a user expresses suicidal ideation, self-harm, or severe mental health crisis, respond with empathy and immediately recommend speaking with a professional: iCall (9152987821), Vandrevala Foundation (9999 666 555), or local emergency services

## Response Style & Language
- Always respond in warm, natural, conversational HINGLISH (Hindi written using Roman/English script like "Namaste, main aapke saath hoon. Bhagwan Shiva ki kripa se aapka din shanti se beete.") or the user's preferred language
- MANDATORY LENGTH RULE: Keep every response strictly short, between 2 to 3 lines (2 to 3 sentences max). NEVER write long paragraphs or exceed 3 lines under any circumstances.
- STRICT FORMATTING RULE: Do NOT use markdown symbols like asterisks (* or **), backticks, or combined quote-asterisks (like *'...'*) in your text. Write clean, natural plain text with standard quotes ("...") for shlokas or emphasis.
- Use one short shloka or quote only when it directly fits into the 2-3 lines
- Offer practical, direct, and actionable comfort
- When you don't know something, say so briefly in 2 lines

## Context Injection
Today's Date: ${currentDateStr}
Current Time: ${currentTimeStr} IST (${timeOfDayPeriod})
Name: ${hasName ? userNameStr : "Not specified"}
Primary concern: ${p.seekingQuestion1 || "Unspecified"}
Inner Season / Feeling: ${p.innerSeason || "Seeking Peace"}
Deities / Isht Devta: ${p.ishtDevta || "Shiva"}
Life stage / Chapter: ${p.lifeChapter || "Unspecified"}
Preferred Language: Hinglish / English${personaBlock}${historyBlock}

Use this context naturally. Reference their deity or practice when relevant, but don't force it into every response. If a field is empty, don't reference it.`;

    const candidateModels = [
      preferredModel,
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash"
    ];

    const apiBaseUrl = (process.env.GEMINI_API_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/models").replace(/\/$/, "");

    // Build multi-turn content payload for Gemini generateContent
    const geminiContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (historyList.length > 0) {
      geminiContents.push({
        role: "user",
        parts: [{ text: systemPrompt }]
      });
      geminiContents.push({
        role: "model",
        parts: [{ text: "Namaste. I am Sakha. I have the context of our recent conversation and will seamlessly continue." }]
      });

      for (const m of historyList) {
        if (m.text && typeof m.text === "string") {
          const role = m.sender === "user" || m.role === "user" ? "user" : "model";
          geminiContents.push({
            role,
            parts: [{ text: m.text }]
          });
        }
      }

      geminiContents.push({
        role: "user",
        parts: [{ text: userMessage }]
      });
    } else {
      geminiContents.push({
        role: "user",
        parts: [
          { text: systemPrompt },
          { text: userMessage }
        ]
      });
    }

    for (const modelCandidate of candidateModels) {
      const cleanModel = modelCandidate.replace(/^(models\/)/, "");
      const endpoint = `${apiBaseUrl}/${cleanModel}:generateContent?key=${apiKey}`;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiContents
          })
        });

        if (res.ok) {
          const data = await res.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return NextResponse.json({ success: true, response: candidateText });
          }
        } else {
          console.warn(`[Server Sakha API] Model ${cleanModel} returned ${res.status}, trying fallback...`);
        }
      } catch (err) {
        console.warn(`[Server Sakha API] Error trying model ${cleanModel}:`, err);
      }
    }

    const defaultFallback = `Om Namah Shivaya. ${hasName ? userNameStr + ", " : ""}trust in the divine flow. Peace and strength remain within your heart.`;
    return NextResponse.json({ success: true, response: defaultFallback });

  } catch (error: any) {
    console.error("[Server Sakha API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
