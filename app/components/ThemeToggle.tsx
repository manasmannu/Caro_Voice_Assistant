"use client";

import { Sun, Moon } from "lucide-react";
import { ThemeName, ThemePalette } from "@/lib/colors";

interface ThemeToggleProps {
  theme: ThemeName;
  onToggle: () => void;
  colors: ThemePalette;
}

export function ThemeToggle({ theme, onToggle, colors }: ThemeToggleProps) {
  return (
    <div
      className={`flex items-center rounded-full ${colors.inputBg} border ${colors.borderColor} p-1 transition-colors duration-300`}
    >
      <button
        onClick={onToggle}
        className="py-1 px-3 flex items-center space-x-2 rounded-full font-medium text-sm transition-all duration-300 shadow-md"
        style={{
          backgroundColor: theme === "light" ? "#14b8a6" : "transparent",
          color: theme === "light" ? "white" : undefined,
        }}
        title={`Click to switch to ${
          theme === "light" ? "Dark Mode" : "Light Mode"
        }`}
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-300" />
        )}
        <span className="hidden sm:inline">
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </span>
      </button>
    </div>
  );
}