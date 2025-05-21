import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

  const data = JSON.parse(text);

  // Misal response Gemini API punya struktur seperti ini:
  const feedback = data.candidates?.[0]?.content || "No feedback";

  return NextResponse.json({ feedback });
}
