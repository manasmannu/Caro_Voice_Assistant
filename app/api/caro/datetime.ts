import type { CaroResponse } from "./types";
const TIMEAPI_URL = "https://timeapi.io/api/Time/current/zone";

async function answerDateTime(prompt: string): Promise<CaroResponse> {
  const tz = process.env.CARO_TIMEZONE || "America/Denver";

  try {
    const res = await fetch(`${TIMEAPI_URL}?timeZone=${encodeURIComponent(tz)}`);

    if (res.ok) {
      const data = await res.json();

      const dateStr = `${data.dayOfWeek}, ${data.month} ${data.day}, ${data.year}`;
      const timeStr = `${data.hour}:${String(data.minute).padStart(2, "0")}`;

      return {
        text: `It is ${dateStr}, and the time is ${timeStr} in ${tz.replace("_"," ")}.`,
        source: "timeapi.io",
        intent: "datetime",
      };
    }
  } catch (err) {
    console.error("TimeAPI error:", err);
  }

  // fallback to server time
  const now = new Date();
  return {
    text: `Right now it is ${now.toLocaleString()}.`,
    source: "server-datetime",
    intent: "datetime",
  };
}

export { answerDateTime };