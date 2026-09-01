import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Gemini is not connected yet. Add GEMINI_API_KEY to Vercel Environment Variables." },
      { status: 503 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
    }

    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "For this Vercel build, keep the PDF under 4 MB. Larger training packages will use a direct cloud-file upload in the next storage/auth phase." },
        { status: 413 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const prompt = `You are organizing an official flight-attendant training package for CabinReady. Read the PDF and return ONLY valid JSON with this shape: {"summary":"short summary","courses":[{"course":1,"title":"Aviation Foundations","reason":"what material from the PDF belongs here"},{"course":2,"title":"Emergency Procedures","reason":"..."},{"course":3,"title":"Safety & Security","reason":"..."},{"course":4,"title":"Service & Hospitality","reason":"..."},{"course":5,"title":"Onboard Operations","reason":"..."},{"course":6,"title":"Medical & First Aid","reason":"..."},{"course":7,"title":"Breeze Knowledge","reason":"..."},{"course":8,"title":"Final Cabin Check","reason":"review material"}],"keyTopics":["topic 1","topic 2"],"sampleQuestions":[{"question":"...","answer":"...","explanation":"..."}]} Use only information actually present in the PDF. Do not invent missing Breeze procedures, equipment locations, seat rows, aircraft configurations, or policies. If a course has no relevant material, say so. Keep sampleQuestions concise.`;

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
                { text: prompt },
                {
                  inlineData: {
                    mimeType: "application/pdf",
                    data: bytes,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Gemini could not process the PDF." },
        { status: response.status },
      );
    }

    const raw = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim() || "{}";

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { summary: raw, courses: [], keyTopics: [], sampleQuestions: [] };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gemini could not process the PDF." },
      { status: 500 },
    );
  }
}
