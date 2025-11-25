export type ThemeName = "light" | "dark";

export type ThemePalette = {
  mainBg: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  accentIcon: string;
  borderColor: string;
  placeholderColor: string;
  inputBg: string;
  userMsgBg: string;
  assistantMsgBg: string;
  shadow: string;
  bg1?: string;
  bg2?: string;
};

export const lightTheme: ThemePalette = {
  mainBg: "bg-gray-100",
  cardBg: "bg-white",
  textColor: "text-gray-800",
  accentColor: "bg-teal-500",
  accentIcon: "text-teal-600",
  borderColor: "border-gray-200",
  placeholderColor: "placeholder-gray-400",
  inputBg: "bg-gray-100",
  userMsgBg: "bg-teal-500",
  assistantMsgBg: "bg-gray-50",
  shadow: "shadow-2xl",
  bg1: "bg-teal-100/70",
  bg2: "bg-amber-100/70",
};

export const darkTheme: ThemePalette = {
  mainBg: "bg-slate-900",
  cardBg: "bg-slate-800/90 backdrop-blur-sm",
  textColor: "text-gray-100",
  accentColor: "bg-cyan-500",
  accentIcon: "text-cyan-400",
  borderColor: "border-slate-700",
  placeholderColor: "placeholder-gray-500",
  inputBg: "bg-slate-700",
  userMsgBg: "bg-cyan-600/70",
  assistantMsgBg: "bg-slate-700/50",
  shadow: "shadow-xl shadow-slate-900/50",
  bg1: "bg-cyan-500/20",
  bg2: "bg-fuchsia-500/20",
};

export const themes: Record<ThemeName, ThemePalette> = {
  light: lightTheme,
  dark: darkTheme,
};