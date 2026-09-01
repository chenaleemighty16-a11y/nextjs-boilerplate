import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "Gemini is not connected yet. Add GEMINI_API_KEY to Vercel Environment Variables." }, { status: 503 });
  try {
    const { prompt } = await request.json();
    if (!prompt?.trim()) return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `You are CabinReady AI, a flight-attendant training study assistant. Explain concepts clearly and step by step. Never invent Breeze-specific procedures, equipment locations, seat assignments, or policies. If the user asks for airline-specific information that is not supplied, say it must be confirmed in the official training package. User question: ${prompt}` }] }],
    });
    return NextResponse.json({ text: response.text || "No response returned." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gemini request failed." }, { status: 500 });
  }
}
