import type { CaroResponse } from "./types";

export function answerSystemCommand(prompt: string): CaroResponse {
  const p = prompt.toLowerCase();

  // open youtube directly
  if (p.startsWith("open youtube")) {
    return {
      text: "Opening YouTube.",
      source: "system",
      intent: "system",
      action: { type: "open_url", url: "https://youtube.com" },
    };
  }

  // google search
  const googleMatch = p.match(/(search google for|google)\s+(.*)/);
  if (googleMatch) {
    const query = googleMatch[2];
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return {
      text: `Searching Google for ${query}.`,
      source: "system",
      intent: "system",
      action: { type: "open_url", url },
    };
  }

  // "launch X" → treat like open
  if (p.startsWith("launch ")) {
    const site = prompt.slice(7).trim();
    const url = site.startsWith("http")
      ? site
      : `https://${site.replace(/\s+/g, "")}`;
    return {
      text: `Launching ${site}.`,
      source: "system",
      intent: "system",
      action: { type: "open_url", url },
    };
  }

  // generic open url
  if (p.startsWith("open ")) {
    const site = prompt.slice(5).trim();
    const url = site.startsWith("http")
      ? site
      : `https://${site.replace(/\s+/g, "")}`;
    return {
      text: `Opening ${site}.`,
      source: "system",
      intent: "system",
      action: { type: "open_url", url },
    };
  }

  return {
    text:
      "I recognised a system command, but I am not yet wired to control that action directly.",
    source: "system-unknown",
    intent: "system",
    action: { type: "system_command", command: prompt },
  };
}