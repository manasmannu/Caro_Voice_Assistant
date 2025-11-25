import type { CaroResponse } from "./types";

function normalizeMathExpression(prompt: string): string | null {
  let p = prompt
    .toLowerCase()
    .replace("what is", "")
    .replace("calculate", "")
    .replace("?", "")
    .trim();

  p = p
    .replace(/plus/g, "+")
    .replace(/minus/g, "-")
    .replace(/times/g, "*")
    .replace(/x/g, "*")
    .replace(/divided by/g, "/");

  if (!/^[0-9+\-*/().\s]+$/.test(p)) return null;
  return p;
}

export function answerMath(prompt: string): CaroResponse {
  const expr = normalizeMathExpression(prompt);
  if (!expr) {
    return {
      text: "I can only do simple calculations like 2 + 2 or 45 divided by 8.",
      source: "math-unsupported",
      intent: "math",
    };
  }

  let result: number;
  try {
    // eslint-disable-next-line no-eval
    result = eval(expr);
  } catch {
    return {
      text: "I could not evaluate that expression safely.",
      source: "math-error",
      intent: "math",
    };
  }

  if (!isFinite(result)) {
    return {
      text: "That calculation did not produce a finite number.",
      source: "math-error",
      intent: "math",
    };
  }

  return {
    text: `${expr} = ${result}`,
    source: "math",
    intent: "math",
  };
}