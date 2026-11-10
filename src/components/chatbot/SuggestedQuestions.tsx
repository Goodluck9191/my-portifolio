"use client";

import { Sparkles } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Who is Goodluck Prosper?",
  "What technologies does he use?",
  "Tell me about his projects.",
  "Explain Visual Lab Chemistry.",
  "What makes his projects interesting?",
  "How can I contact him?",
];
export default function SuggestedQuestions({
  onSelect,
  disabled,
}: {
  onSelect: (q: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <p className="flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-wider text-[#7A7A9A]">
        <Sparkles size={12} className="text-[#00D4FF]" />
        Suggested
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            disabled={disabled}
            onClick={() => onSelect(q)}
            className="rounded-full border border-[#2A2A38] bg-[#16162A] px-3 py-1.5 font-sans text-xs text-[#EEEEFF] transition-all duration-150 hover:border-[#6C63FF] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
