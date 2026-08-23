import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return handleMintToken(request);
}

export async function GET(request: NextRequest) {
  return handleMintToken(request);
}

async function handleMintToken(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { doctorId } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[Gemini Ephemeral Token Route] Server misconfiguration: GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server misconfiguration: GEMINI_API_KEY is missing' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const now = Date.now();
    const expireTime = new Date(now + 5 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(now + 60 * 1000).toISOString();

    // Mint short-lived single-use ephemeral token using @google/genai SDK (v1alpha authTokens API)
    const tokenResponse = await (ai as any).authTokens.create({
      config: {
        uses: 1,
        expireTime,
        newSessionExpireTime
      }
    });

    if (!tokenResponse || !tokenResponse.name) {
      console.error('[Gemini Ephemeral Token Route] Google returned empty token response:', tokenResponse);
      return NextResponse.json(
        { error: 'Failed to mint Gemini ephemeral token' },
        { status: 502 }
      );
    }

    console.log('[Gemini Ephemeral Token Route] Successfully minted ephemeral token:', tokenResponse.name);

    return NextResponse.json({
      token: tokenResponse.name,
      accessToken: tokenResponse.name,
      success: true,
      model: process.env.GEMINI_LIVE_MODEL || "gemini-3.1-flash-live-preview"
    });
  } catch (error: any) {
    console.error('[Gemini Ephemeral Token Route] Error minting token:', error);
    return NextResponse.json(
      { error: 'Failed to mint Gemini token', detail: error?.message || String(error) },
      { status: 502 }
    );
  }
}
