export type Intent =
  | "weather"
  | "fact"
  | "math"
  | "datetime"
  | "system"
  | "media"
  | "timer"
  | "joke"
  | "rag"
  | "chit_chat";

export type AssistantAction =
  | { type: "open_url"; url: string }
  | { type: "timer"; seconds: number; label?: string }
  | { type: "system_command"; command: string }
  | { type: "none" };

export interface CaroResponse {
  text: string;
  source: string;
  intent: Intent;
  action?: AssistantAction;
}