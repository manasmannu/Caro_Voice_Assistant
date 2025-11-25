import type { CaroResponse } from "./types";

export async function answerRag(prompt: string): Promise<CaroResponse> {
  return {
    text:
      "You asked about something in your documents. RAG is enabled in the design, but not yet wired to your files.",
    source: "rag-stub",
    intent: "rag",
  };
}