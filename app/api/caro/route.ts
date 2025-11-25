/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import { detectIntent } from "./intent";
import type { CaroResponse } from "./types";

import { answerWeather } from "./weather";
import { answerDateTime } from "./datetime";
import { answerFact } from "./facts";
import { answerMath } from "./math";
import { answerTimer } from "./timer";
import { answerSystemCommand } from "./system";
import { answerMediaCommand } from "./media";
import { answerJoke } from "./joke";
import { answerRag } from "./rag";
import { answerWithGroq } from "./llm";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const intent = detectIntent(prompt);
    let resp: CaroResponse;

    switch (intent) {
      case "weather":
        resp = await answerWeather(prompt);
        break;

      case "datetime":
        resp = await answerDateTime(prompt);
        break;

      case "fact": {
        const fact = await answerFact(prompt);
        resp =
          fact ??
          (await answerWithGroq(
            prompt + " (If you are unsure, say you are unsure.)"
          ));
        break;
      }

      case "math":
        resp = answerMath(prompt);
        break;

      case "system":
        resp = answerSystemCommand(prompt);
        break;

      case "media":
        resp = answerMediaCommand(prompt);
        break;

      case "timer":
        resp = answerTimer(prompt);
        break;

      case "joke":
        resp = await answerJoke();
        break;

      case "rag":
        resp = await answerRag(prompt);
        break;

      case "chit_chat":
      default:
        resp = await answerWithGroq(prompt);
        break;
    }

    return NextResponse.json({
      text: resp.text,
      source: resp.source,
      intent: resp.intent,
      action: resp.action ?? { type: "none" },
    });
  } catch (err: any) {
    console.error("Caro Brain error:", err);
    return NextResponse.json({ error: "Caro AI failed" }, { status: 500 });
  }
}