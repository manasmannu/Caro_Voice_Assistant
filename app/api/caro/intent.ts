import type { Intent } from "./types";

export function detectIntent(prompt: string): Intent {
  const p = prompt.toLowerCase().trim();

  // Weather
  if (
    p.includes("weather") ||
    p.includes("temperature") ||
    p.includes("hot outside") ||
    p.includes("cold outside")
  ) {
    return "weather";
  }

  // Date / time
  if (
    p.includes("what is the date") ||
    p.includes("what's the date") ||
    p.includes("todays date") ||
    p.includes("today's date") ||
    p.includes("current date") ||
    p.includes("what is the time") ||
    p.includes("what's the time") ||
    (p.includes("time") && p.includes("now"))
  ) {
    return "datetime";
  }

  // Timer / reminders
  if (
    p.startsWith("set a timer") ||
    p.includes("remind me in") ||
    p.includes("remind me after") ||
    p.includes("set a reminder") ||
    p.match(/\b\d+\s*(second|seconds|minute|minutes|hour|hours)\b/)
  ) {
    return "timer";
  }

  // System commands (browser / device actions) - will be wired in future.
  if (
    p.startsWith("open ") ||
    p.startsWith("launch ") ||
    p.startsWith("go to ") ||
    p.startsWith("search google for") ||
    p.includes("search google for ") ||
    p.includes("scroll down") ||
    p.includes("scroll up") ||
    p.includes("mute the audio") ||
    p.includes("unmute the audio")
  ) {
    return "system";
  }

  // Media / music
  if (
    p.startsWith("play ") ||
    p.includes("play some music") ||
    p.includes("play music") ||
    p.includes("stop music") ||
    p.includes("pause music")
  ) {
    return "media";
  }

  // Math – rough heuristic
  if (
    /[0-9]/.test(p) &&
    (p.includes("+") ||
      p.includes("-") ||
      p.includes("*") ||
      p.includes(" x ") ||
      p.includes("/") ||
      p.includes("plus") ||
      p.includes("minus") ||
      p.includes("times") ||
      p.includes("divided by"))
  ) {
    return "math";
  }

  // Facts / knowledge
  if (
    p.startsWith("who is") ||
    p.startsWith("what is") ||
    p.includes("president of") ||
    p.includes("prime minister") ||
    p.includes("tell me about")
  ) {
    return "fact";
  }

  // RAG trigger – later can be wired to your docs
  if (
    p.includes("in my files") ||
    p.includes("in my documents") ||
    p.includes("in my notes")
  ) {
    return "rag";
  }

  // Jokes
  if (
    p.includes("joke") ||
    p.includes("make me laugh") ||
    p.includes("something funny")
  ) {
    return "joke";
  }

  return "chit_chat";
}