import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ error: "AI is not connected yet. Add OPENAI_API_KEY to the Vercel project environment variables." }, { status: 503 });
  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        input: [
          { role: "developer", content: "You are CabinReady AI, a study assistant for flight-attendant training. Be concise, explain answers step by step when useful, and never invent airline-specific procedures. If the user asks about Breeze-specific policy and the source material is not provided, clearly say it must be confirmed against the official training package." },
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "OpenAI returned an error." }, { status: response.status });
    return NextResponse.json({ text: data?.output_text || "No text response returned." });
  } catch {
    return NextResponse.json({ error: "The AI request could not be completed." }, { status: 500 });
  }
}
