import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Gemini is not connected yet. Add GEMINI_API_KEY to Vercel Environment Variables." },
      { status: 503 },
    );
  }

  try {
    const { prompt } = await request.json();
    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    }

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are CabinReady AI, a flight-attendant training study assistant. Explain concepts clearly and step by step. Never invent Breeze-specific procedures, equipment locations, seat assignments, or policies. If the user asks for airline-specific information that is not supplied, say it must be confirmed in the official training package. User question: ${prompt.trim()}`,
                },
              ],
            },
          ],
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Gemini returned an error." },
        { status: response.status },
      );
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim();

    return NextResponse.json({ text: text || "No response returned." });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gemini request failed." },
      { status: 500 },
    );
  }
}
