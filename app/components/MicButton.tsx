"use client";

import { Mic, Loader } from "lucide-react";

interface MicButtonProps {
  isListening: boolean;
  speechStatus: "idle" | "recording" | "processing";
  onClick: () => void;
  accentColorClass: string;
}

export function MicButton({
  isListening,
  speechStatus,
  onClick,
  accentColorClass,
}: MicButtonProps) {
  const disabled = speechStatus === "processing";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
        ${
          isListening
            ? "bg-red-600 text-white animate-pulse ring-4 ring-red-300"
            : disabled
            ? "bg-gray-400 text-gray-100 cursor-not-allowed"
            : `${accentColorClass} text-white hover:scale-110`
        }
      `}
      title={isListening ? "Tap to stop recording" : "Tap to start recording"}
    >
      {speechStatus === "processing" ? (
        <Loader className="w-6 h-6 animate-spin" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  );
}