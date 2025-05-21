import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Baca raw body dulu
  const rawBody = await request.text();
  console.log("Raw body received:", rawBody);

  let prompt: string;

  try {
    const json = JSON.parse(rawBody);
    prompt = json.prompt;
  } catch (err) {
    return NextResponse.json(
      {
        error: "Invalid JSON in request body",
        details: err instanceof Error ? err.message : String(err),
        rawBody,
      },
      { status: 400 }
    );
  }

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set in environment" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const text = await res.text();

  if (!res.ok) {
    return NextResponse.json(
      { error: "Gemini API error", details: text },
      { status: 500 }
    );
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON response from Gemini API", details: text },
      { status: 500 }
    );
  }

  const feedback =
    data.candidates?.[0]?.content || "No feedback received from Gemini API";

  return NextResponse.json({ feedback });
}
