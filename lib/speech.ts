// Types for browser speech APIs
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export function createSpeechRecognizer() {
  if (typeof window === "undefined") return null;

  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SR) return null;

  const recognition = new SR();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  return recognition;
}    