"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

export interface ChatInputHandle {
  focusInput(): void;
}

const MAX_LENGTH = 1000;

const ChatInput = forwardRef<
  ChatInputHandle,
  {
    loading: boolean;
    onSend: (message: string) => void;
  }
>(function ChatInput({ loading, onSend }, ref) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focusInput() {
      textareaRef.current?.focus();
    },
  }));

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const canSend = !loading && value.trim().length > 0;

  function submit() {
    const text = value.trim();
    if (!text || loading) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="border-t border-[#22223A] p-3"
    >
      <div className="flex items-end gap-2 rounded-xl border border-[#2A2A38] bg-[#16162A] px-3 py-2 transition-colors focus-within:border-[#6C63FF]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          maxLength={MAX_LENGTH}
          placeholder="Ask about Goodluck's skills, projects, contact…"
          aria-label="Message Goodluck's AI assistant"
          disabled={loading}
          className="max-h-[120px] min-w-0 flex-1 resize-none bg-transparent font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-all duration-150 hover:bg-[#EEEEFF] disabled:cursor-not-allowed disabled:opacity-30"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowUp size={16} strokeWidth={2.5} />
          )}
        </button>
      </div>
      <div className="mt-1.5 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] text-[#4A4A5A]">
          {value.length}/{MAX_LENGTH}
        </span>
        <span className="font-mono text-[10px] text-[#4A4A5A]">
          Enter to send · Shift+Enter for new line
        </span>
      </div>
    </form>
  );
});

export default ChatInput;
