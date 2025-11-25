"use client";

import { ChatMessage } from "./types";
import { ThemePalette } from "@/lib/colors";

interface MessageBubbleProps {
  message: ChatMessage;
  colors: ThemePalette;
}

export function MessageBubble({ message, colors }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 max-w-[85%] rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 ${
          isUser
            ? `${colors.userMsgBg} text-white rounded-br-lg`
            : `${colors.assistantMsgBg} ${colors.textColor} rounded-tl-lg border ${colors.borderColor}`
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}