/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { CornerDownLeft, Loader } from "lucide-react";

import { themes, ThemeName, ThemePalette } from "@/lib/colors";
import { createSpeechRecognizer } from "@/lib/speech";

import { ThemeToggle } from "./ThemeToggle";
import { MicButton } from "./MicButton";
import { MessageBubble } from "./MessageBubble";
import { VoiceWave } from "./VoiceWave";
import { ChatMessage } from "./types";

type SpeechStatus = "idle" | "recording" | "processing";

type BackendAction =
  | { type: "open_url"; url: string }
  | { type: "timer"; seconds: number; label?: string }
  | { type: "system_command"; command: string }
  | { type: "none" }
  | undefined;

export default function ChatUI() {
  const [theme, setTheme] = useState<ThemeName>("light");
  const colors: ThemePalette = useMemo(() => themes[theme], [theme]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [typingText, setTypingText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Fix #3 – keeps real mic state synced
  const isListeningRef = useRef(false);

  // Timer
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  /* -----------------------------------------
   * Scroll chat automatically
   * ----------------------------------------- */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, liveTranscript, typingText]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

  /* -----------------------------------------
   * Handle backend action (URL, timer)
   * ----------------------------------------- */
  function handleBackendAction(action: BackendAction) {
    if (!action) return;

    if (action.type === "open_url") {
      window.open(action.url, "_blank", "noopener,noreferrer");
    }

    if (action.type === "timer") {
      const { seconds, label } = action;

      if (seconds > 0) {
        setCountdown(seconds);

        if (countdownRef.current) clearInterval(countdownRef.current);

        countdownRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev === null) return null;
            if (prev <= 1) {
              clearInterval(countdownRef.current!);
              alert(label ? `Caro Reminder: ${label}` : "Caro says your timer is done!");
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  }

  /* -----------------------------------------
   * Assistant typing animation
   * ----------------------------------------- */
  function startTypingAnimation(reply: string, speakAfter = true) {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    setTypingText("");
    setSpeechStatus("processing");

    let index = 0;

    typingIntervalRef.current = setInterval(() => {
      index++;
      setTypingText(reply.slice(0, index));

      if (index >= reply.length) {
        clearInterval(typingIntervalRef.current!);
        setTypingText("");
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        setSpeechStatus("idle");

        if (speakAfter) speak(reply);
      }
    }, 18);
  }

  /* -----------------------------------------
   * Call backend
   * ----------------------------------------- */
  async function handleAssistantReply(userText: string) {
    setSpeechStatus("processing");

    const res = await fetch("/api/caro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userText }),
    });

    const data = await res.json();

    handleBackendAction(data.action);

    const reply =
      typeof data.text === "string"
        ? data.text
        : "Sorry, I couldn't understand that.";

    startTypingAnimation(reply);
  }

  /* -----------------------------------------
   * Text-to-speech
   * ----------------------------------------- */
  function speak(text: string) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 1;
    utter.pitch = 1;
    setIsSpeaking(true);

    utter.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utter);
  }

  /* -----------------------------------------
   * Speech Recognition Setup
   * ----------------------------------------- */
  useEffect(() => {
    const recognition = createSpeechRecognizer();
    if (!recognition) return;

    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;

      if (!result.isFinal) {
        setLiveTranscript(transcript);
        return;
      }

      const finalText = transcript.trim();
      if (!finalText) return;

      setLiveTranscript("");
      setIsListening(false);
      isListeningRef.current = false;
      setSpeechStatus("processing");

      setMessages((prev) => [...prev, { role: "user", content: finalText }]);
      handleAssistantReply(finalText);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") console.error("Speech error:", event.error);

      setIsListening(false);
      isListeningRef.current = false;
      setLiveTranscript("");
      setSpeechStatus("idle");
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {}
      } else {
        setSpeechStatus("idle");
      }
    };

    recognitionRef.current = recognition;

    return () => recognition.abort();
  }, []);

  /* -----------------------------------------
   * Toggle microphone
   * ----------------------------------------- */
  const handleMicToggle = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      alert("Speech Recognition not available.");
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      setIsListening(false);
      isListeningRef.current = false;
      setSpeechStatus("idle");
      recognition.stop();
      return;
    }

    try {
      setLiveTranscript("");
      setIsListening(true);
      isListeningRef.current = true;
      setSpeechStatus("recording");
      recognition.start();
    } catch {
      try {
        recognition.stop();
        recognition.start();
      } catch {}
    }
  };

  const handleSendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInputText("");
    handleAssistantReply(text);
  };

  const formatCountdown = (t: number) =>
    t >= 60
      ? `${Math.floor(t / 60)}m ${String(t % 60).padStart(2, "0")}s`
      : `${t}s`;

  /* -----------------------------------------
   * UI
   * ----------------------------------------- */
  return (
    <div
      className={`relative h-screen w-full ${colors.mainBg} ${colors.textColor}
      flex flex-col items-center justify-center overflow-hidden p-4`}
    >
      {/* Beautiful Glow Backgrounds */}
      <div
        className={`absolute w-[400px] h-[400px] ${colors.bg1}
        rounded-full blur-3xl -top-40 -right-20`}
      />
      <div
        className={`absolute w-[300px] h-[300px] ${colors.bg2}
        rounded-full blur-3xl -bottom-40 -left-10`}
      />

      <div
        className={`w-full max-w-lg h-[90vh] md:h-[80vh] 
        ${colors.cardBg} border ${colors.borderColor}
        rounded-3xl p-6 flex flex-col ${colors.shadow} relative z-10`}
      >
        {/* Header */}
        <header
          className={`flex items-center justify-between border-b ${colors.borderColor} pb-4 mb-4`}
        >
          <h1 className="text-2xl font-extrabold">Caro</h1>

          <div className="flex items-center space-x-4">
            <ThemeToggle
              theme={theme}
              onToggle={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
              }
              colors={colors}
            />

            <div className="text-sm flex items-center space-x-2 opacity-70">
              <span>{speechStatus === "processing" ? "Thinking…" : "Ready"}</span>
              {speechStatus === "processing" && (
                <Loader className="w-4 h-4 animate-spin" />
              )}
            </div>
          </div>
        </header>

        {/* Chat body */}
        <div
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto space-y-4 pr-2"
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} colors={colors} />
          ))}

          {liveTranscript && (
            <div className="flex justify-end">
              <div
                className={`p-3 max-w-[85%] rounded-2xl text-sm 
                ${colors.userMsgBg} text-white opacity-80`}
              >
                {liveTranscript}
              </div>
            </div>
          )}

          {typingText && (
            <div className="flex justify-start">
              <div
                className={`p-3 max-w-[85%] rounded-2xl text-sm 
                ${colors.assistantMsgBg} border ${colors.borderColor}`}
              >
                {typingText}
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        {countdown !== null && (
          <div className="flex justify-start mt-2">
            <div className="p-3 rounded-2xl text-sm bg-yellow-100 text-yellow-800 border border-yellow-300">
               Timer: {formatCountdown(countdown)}
            </div>
          </div>
        )}

        {/* Listening indicator */}
        {isListening && (
          <div className="flex items-center gap-3 mt-3 text-sm text-teal-400">
            <VoiceWave />
            <span>Listening… tap to stop</span>
          </div>
        )}

        {isSpeaking && (
          <button
            onClick={() => {
              speechSynthesis.cancel();
              setIsSpeaking(false);
            }}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-full shadow"
          >
            Stop Speaking
          </button>
        )}

        {/* Input row */}
        <div className={`pt-4 mt-4 border-t ${colors.borderColor} flex items-center space-x-3`}>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Ask Caro..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className={`w-full ${colors.inputBg} border ${colors.borderColor} ${colors.textColor}
              rounded-full py-3 pl-5 pr-12 text-sm`}
            />

            <button
              onClick={handleSendMessage}
              className={`absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10
              ${colors.accentColor} rounded-full flex items-center justify-center text-white`}
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          </div>

          <MicButton
            isListening={isListening}
            speechStatus={speechStatus}
            onClick={handleMicToggle}
            accentColorClass={colors.accentColor}
          />
        </div>
      </div>
    </div>
  );
}