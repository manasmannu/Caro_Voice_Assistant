import type { CaroResponse } from "./types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function answerWithGroq(
  prompt: string
): Promise<CaroResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      text: "I am not configured with an AI key yet.",
      source: "groq-missing-key",
      intent: "chit_chat",
    };
  }

  const completion = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // non-deprecated general model
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `
You are Caro — a fast, concise voice assistant.

Rules:
1. Answer in 2–4 sentences maximum.
2. Be direct and practical.
3. No long disclaimers or filler.
4. If something needs real-time data you do NOT have, give your best educated answer and suggest checking an up-to-date source.`,
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await completion.json();

  if (data.error) {
    console.error(" GROQ MODEL ERROR:", data.error);
    return {
      text: `Groq error: ${data.error.message}`,
      source: "groq-error",
      intent: "chit_chat",
    };
  }

  const text =
    data?.choices?.[0]?.message?.content ||
    "Sorry, I could not generate a response.";

  return { text, source: "groq", intent: "chit_chat" };
}