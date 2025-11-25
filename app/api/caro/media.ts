import type { CaroResponse } from "./types";

export function answerMediaCommand(prompt: string): CaroResponse {
  const p = prompt.toLowerCase();

  if (p.includes("play") && p.includes("music")) {
    const genreMatch = p.match(/play\s+(.*)\s+music/);
    const genre = genreMatch?.[1]?.trim() || "lofi study";
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      `${genre} music`
    )}`;

    return {
      text: `Playing some ${genre} music on YouTube.`,
      source: "media",
      intent: "media",
      action: { type: "open_url", url },
    };
  }

  if (p.includes("stop music") || p.includes("pause music")) {
    return {
      text: "Okay, I will stop the music.",
      source: "media",
      intent: "media",
      action: { type: "system_command", command: "stop_music" },
    };
  }

  return {
    text:
      "I can play or stop music, for example: “play some music” or “stop music”.",
    source: "media-unknown",
    intent: "media",
  };
}