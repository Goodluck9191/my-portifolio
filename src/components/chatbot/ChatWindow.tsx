"use client";

import { useEffect, useRef } from "react";
import { Minus, Sparkles, X, RotateCcw } from "lucide-react";
import ChatMessage, { type ChatMessageData } from "./ChatMessage";
import ChatInput, { type ChatInputHandle } from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";

export interface ChatWindowProps {
  messages: ChatMessageData[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onMinimize: () => void;
  onSend: (message: string) => void;
  onSuggestion: (question: string) => void;
  onRetry: () => void;
  onClear: () => void;
  conversationStarted: boolean;
}

export default function ChatWindow({
  messages,
  loading,
  error,
  onClose,
  onMinimize,
  onSend,
  onSuggestion,
  onRetry,
  onClear,
  conversationStarted,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ChatInputHandle>(null);

  // Auto-scroll to bottom whenever messages or loading change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focusInput();
  }, []);

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  return (
    <div
      role="dialog"
      aria-label="Goodluck's AI Assistant chat window"
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#2A2A38] bg-[#0F0F1A] shadow-2xl shadow-black/60 sm:rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[#22223A] bg-[#0F0F1A] px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
          <Sparkles size={18} className="text-black" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-sm font-bold text-white">
              Goodluck&apos;s AI Assistant
            </h2>
            <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              Ready
            </span>
          </div>
          <p className="truncate font-sans text-[11px] text-[#7A7A9A]">
            Your guide to Goodluck&apos;s work, skills and projects.
          </p>
        </div>

        <button
          onClick={onMinimize}
          aria-label="Minimize chat"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        aria-live="polite"
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex items-end gap-2" aria-label="Assistant is thinking">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#16162A] text-[#00D4FF]">
              <Sparkles size={14} />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-[#2A2A38] bg-[#16162A] px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#7A7A9A] [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#7A7A9A] [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#7A7A9A]" />
            </div>
          </div>
        )}

        {error && (
          <ChatMessage
            message={{
              id: "error-message",
              role: "assistant",
              content: error,
              createdAt: 0,
            }}
            isError
            onRetry={lastUserMessage ? onRetry : undefined}
          />
        )}

        {!conversationStarted && (
          <SuggestedQuestions onSelect={onSuggestion} disabled={loading} />
        )}
      </div>

      {/* Clear conversation */}
      {conversationStarted && (
        <div className="flex items-center justify-end border-t border-[#22223A] bg-[#0F0F1A] px-4 py-1.5">
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 font-sans text-[11px] text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
            aria-label="Start new conversation"
          >
            <RotateCcw size={11} /> New conversation
          </button>
        </div>
      )}

      {/* Input */}
      <ChatInput ref={inputRef} loading={loading} onSend={onSend} />

      {/* Footer */}
      <div className="border-t border-[#22223A] bg-[#0F0F1A] px-4 py-2 text-center">
        <p className="font-mono text-[10px] text-[#4A4A5A]">
          AI-powered assistant. Responses may occasionally be inaccurate.
        </p>
      </div>
    </div>
  );
}
