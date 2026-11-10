"use client";

import { Sparkles, X } from "lucide-react";

export default function FloatingChatButton({
  open,
  minimized,
  onToggle,
  onOpenFromMinimized,
}: {
  open: boolean;
  minimized: boolean;
  onToggle: () => void;
  onOpenFromMinimized: () => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3">
      {/* Tooltip — desktop only */}
      <span
        className="pointer-events-none hidden whitespace-nowrap rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-3 py-1.5 font-sans text-xs text-[#EEEEFF] shadow-lg opacity-0 transition-opacity duration-200 md:block"
        aria-hidden="true"
      >
        Ask me anything about Goodluck
      </span>

      <button
        onClick={minimized ? onOpenFromMinimized : onToggle}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={open}
        className={`group/btn relative flex h-14 w-14 items-center justify-center rounded-full border border-[#2A2A38] bg-[#050505] shadow-[0_0_24px_rgba(255,255,255,0.08)] outline-none transition-all duration-200 hover:shadow-[0_0_32px_rgba(255,255,255,0.16)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 sm:h-[60px] sm:w-[60px] ${
          open ? "scale-95" : ""
        }`}
      >
        {/* Rotating dashed ring (decorative) */}
        <span
          aria-hidden="true"
          className="assistant-ring pointer-events-none absolute -inset-1 rounded-full border border-dashed border-white/20"
        />
        {/* Inner glow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 rounded-full bg-gradient-to-br from-white/[0.08] to-transparent"
        />

        <span className="relative flex items-center justify-center text-white">
          {open ? <X size={22} strokeWidth={2} /> : <Sparkles size={22} strokeWidth={1.75} />}
        </span>
      </button>
    </div>
  );
}
