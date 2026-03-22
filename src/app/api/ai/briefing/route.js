import { NextResponse } from "next/server";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1";
const GEMINI_MODEL = "gemini-2.0-flash-lite";

function buildPrompt({ centerName, role, userName, kpisToday, kpisYesterday }) {
  const greeting =
    role === "admin"
      ? `You are briefing ${userName || "an Admin"} who oversees multiple TPCAP centers.`
      : `You are briefing ${userName || "the Center Owner"}, who manages ${centerName}.`;

  const kpiLines = kpisToday.map((k) => {
    const prev = kpisYesterday?.find((p) => p.title === k.title);
    const prevVal = prev ? prev.rawValue : null;
    const change =
      prevVal !== null
        ? k.rawValue > prevVal
          ? `↑ up from ${prevVal}`
          : k.rawValue < prevVal
          ? `↓ down from ${prevVal}`
          : "unchanged"
        : "no prior data";
    return `- ${k.title}: ${k.value} (${change})`;
  });

  return `You are an expert business analyst for TPCAP, a Filipino tutoring center network.
${greeting}
Today's KPIs for "${centerName}":
${kpiLines.join("\n")}

Write a SINGLE paragraph of exactly 3 sentences in a professional but friendly tone.
Rules:
1. Start with a time-of-day greeting (Good morning / Good afternoon / Good evening).
2. Highlight the biggest positive trend (or confirm overall health).
3. Flag the single most important concern and suggest ONE concrete action (e.g., "Consider contacting the center owner to review Teacher Share.").
Do NOT use bullet points, headers, or numbered lists. Plain prose only. Keep it under 80 words.`;
}

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI briefing is not configured." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { centerName, role, userName, kpisToday, kpisYesterday } = body;

    if (!centerName || !Array.isArray(kpisToday) || kpisToday.length === 0) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const prompt = buildPrompt({ centerName, role, userName, kpisToday, kpisYesterday });

    // Direct REST call to Gemini v1 stable endpoint — bypasses SDK v1beta limitation
    const url = `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.json().catch(() => ({}));
      console.error("[AI Briefing] Gemini API error:", geminiRes.status, JSON.stringify(errBody));

      if (geminiRes.status === 429) {
        return NextResponse.json(
          { error: "AI quota limit reached. Please try again later." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "Gemini API returned an error." },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const briefing = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!briefing) {
      return NextResponse.json(
        { error: "Empty response from AI." },
        { status: 502 }
      );
    }

    return NextResponse.json({ briefing });
  } catch (err) {
    console.error("[AI Briefing] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate briefing. Please try again later." },
      { status: 500 }
    );
  }
}
