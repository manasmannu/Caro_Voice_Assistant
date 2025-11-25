"use client";

export function VoiceWave() {
  return (
    <div className="flex items-end gap-[3px] h-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="wave-bar bg-teal-400 rounded-full w-[3px]"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}