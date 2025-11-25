import type { CaroResponse } from "./types";

function parseTimer(prompt: string): { seconds: number; label: string } | null {
  const p = prompt.toLowerCase();
  const match = p.match(/(\d+)\s*(seconds?|minutes?|hours?)/);
  if (!match) return null;

  const amount = parseInt(match[1], 10);
  const unit = match[2];

  let seconds = amount;
  if (unit.startsWith("minute")) seconds = amount * 60;
  if (unit.startsWith("hour")) seconds = amount * 3600;

  const label = prompt
    .replace(/set a timer|set a reminder|remind me in|remind me after/i, "")
    .trim();

  return { seconds, label };
}

export function answerTimer(prompt: string): CaroResponse {
  const parsed = parseTimer(prompt);
  if (!parsed) {
    return {
      text:
        "I can set timers like “set a timer for 10 minutes” or “remind me in 2 hours”.",
      source: "timer-parse-failed",
      intent: "timer",
      // no action if we couldn't parse
    };
  }

  const { seconds, label } = parsed;

  return {
    text: `Reminder set for ${seconds} seconds. I'll alert you when the time is up.`,
    source: "timer",
    intent: "timer",
    // THIS is what drives the UI timer + alert
    action: {
      type: "timer",
      seconds,
      label,
    },
  };
}