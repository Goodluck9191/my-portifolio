"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface TagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions: string[];
  max?: number;
}

export default function TagSelector({
  value,
  onChange,
  suggestions,
  max = 8,
}: TagSelectorProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !value.some((v) => v.toLowerCase() === s.toLowerCase())
  );

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed || value.length >= max) return;
      if (value.some((t) => t.toLowerCase() === trimmed.toLowerCase())) return;
      onChange([...value, trimmed]);
      setInput("");
      setShowSuggestions(false);
      setHighlightIdx(-1);
    },
    [value, onChange, max]
  );

  const removeTag = useCallback(
    (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    },
    [value, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (highlightIdx >= 0 && filtered[highlightIdx]) {
        addTag(filtered[highlightIdx]);
      } else if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-2.5 py-1 font-sans text-xs text-[#6C63FF]"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="transition-colors hover:text-red-400"
                aria-label={`Remove tag ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
          setHighlightIdx(-1);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder={value.length >= max ? "Max tags reached" : "Type to add tags…"}
        disabled={value.length >= max}
        className="w-full rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF] disabled:opacity-40"
      />
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-[#2A2A38] bg-[#16162A] shadow-xl">
          {filtered.map((s, i) => (
            <button
              type="button"
              key={s}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(s);
              }}
              onMouseEnter={() => setHighlightIdx(i)}
              className={`w-full px-4 py-2 text-left font-sans text-sm transition-colors ${
                i === highlightIdx
                  ? "bg-[#6C63FF]/20 text-[#EEEEFF]"
                  : "text-[#7A7A9A] hover:bg-[#1A1A2E]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <p className="mt-1.5 font-sans text-xs text-[#7A7A9A]">
        {value.length}/{max} tags &middot; Press Enter or comma to add
      </p>
    </div>
  );
}
