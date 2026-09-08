import { UserProfile } from "@/types/onboarding";

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
