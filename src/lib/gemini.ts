import { UserProfile } from "@/types/onboarding";
import { sendSakhaBackendQuery } from "@/lib/api";

export interface ChatHistoryItem {
  sender?: "sakha" | "user";
  role?: "user" | "model" | "sakha";
  text: string;
}

export const generateSakhaResponse = async (
  userMessage: string,
  profile?: Partial<UserProfile>,
  history?: ChatHistoryItem[]
): Promise<string> => {
  const p = profile || {};
  const hasName = Boolean(p.name && p.name.trim().length > 0);
  const userNameStr = hasName ? p.name!.trim() : "";

  // 1. Try Python FastAPI Backend /api/v1/sakha/query first
  try {
    const backendRes = await sendSakhaBackendQuery(userMessage, p, history, p.userId);
    if (backendRes.success && backendRes.response) {
      return backendRes.response;
    }
  } catch (backendErr) {
    console.warn("[Sakha Client] Backend FastAPI call bypassed, using Next.js route fallback", backendErr);
  }

  // 2. Fallback to Next.js API route /api/sakha/chat
  try {
    const chatEndpoint = process.env.NEXT_PUBLIC_SAKHA_CHAT_API_URL || "/api/sakha/chat";
    const res = await fetch(chatEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userMessage,
        profile: p,
        history: history || []
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.response) {
        return data.response;
      }
    } else {
      console.warn(`[Sakha Client] API route returned status ${res.status}`);
    }
  } catch (err) {
    console.error("[Sakha Client] Failed to fetch from /api/sakha/chat:", err);
  }

  return `Om Namah Shivaya. ${hasName ? userNameStr + ", " : ""}trust in the divine flow. Peace and strength remain within your heart.`;
};

