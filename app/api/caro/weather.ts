import type { CaroResponse } from "./types";

const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

// naive location extraction: everything after "in"
function extractLocation(prompt: string): string | null {
  const match = prompt.toLowerCase().split(" in ");
  if (match.length < 2) return null;
  return match[1].replace(/[?.!]/g, "").trim();
}

export async function answerWeather(prompt: string): Promise<CaroResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return {
      text:
        "I am not configured with a weather key yet, so I cannot fetch live weather.",
      source: "weather-missing-key",
      intent: "weather",
    };
  }

  const location = extractLocation(prompt) || "Superior,CO,US";
  const url = `${OPENWEATHER_API_URL}?q=${encodeURIComponent(
    location
  )}&units=imperial&appid=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    return {
      text: `I could not fetch live weather for ${location}. Please check a weather app for exact details.`,
      source: "weather-error",
      intent: "weather",
    };
  }

  const data = await res.json();
  const temp = data.main?.temp;
  const desc = data.weather?.[0]?.description;

  if (temp === undefined || !desc) {
    return {
      text: `I had trouble reading the weather data for ${location}. Please check a weather app for precise info.`,
      source: "weather-error",
      intent: "weather",
    };
  }

  return {
    text: `Right now in ${location}, it is about ${Math.round(
      temp
    )}°F with ${desc}. For precise details, check your favourite weather app.`,
    source: "weather",
    intent: "weather",
  };
}