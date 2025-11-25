import type { CaroResponse } from "./types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function answerJoke(): Promise<CaroResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      text: "I am not configured with an AI key yet.",
      source: "joke-missing-key",
      intent: "joke",
    };
  }

  const completion = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You tell very short, clean, one-line jokes. Answer in 1–2 sentences max.",
        },
        { role: "user", content: "Tell me a joke." },
      ],
    }),
  });

  const data = await completion.json();
  const text =
    data?.choices?.[0]?.message?.content ||
    "I tried to think of a joke but my circuits froze.";

  return { text, source: "joke", intent: "joke" };
}