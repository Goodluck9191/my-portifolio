"use client";

import { AlertCircle, RotateCcw, Sparkles, User } from "lucide-react";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export default function ChatMessage({
  message,
  isError,
  onRetry,
}: {
  message: ChatMessageData;
  isError?: boolean;
  onRetry?: () => void;
}) {
  const isUser = message.role === "user";
  const time = message.createdAt > 0
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] text-white"
            : isError
              ? "bg-red-500/10 text-red-400"
              : "bg-[#16162A] text-[#00D4FF]"
        }`}
      >
        {isUser ? (
          <User size={14} />
        ) : isError ? (
          <AlertCircle size={14} />
        ) : (
          <Sparkles size={14} />
        )}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "rounded-br-md bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] text-white"
            : isError
              ? "rounded-bl-md border border-red-500/20 bg-red-500/10 text-red-300"
              : "rounded-bl-md border border-[#2A2A38] bg-[#16162A] text-[#EEEEFF]"
        }`}
      >
        <p className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
          {message.content}
        </p>
        <div className="mt-1 flex items-center justify-between gap-3">
          {time ? (
            <span
              className={`font-mono text-[10px] ${
                isUser ? "text-white/60" : "text-[#7A7A9A]"
              }`}
            >
              {time}
            </span>
          ) : (
            <span />
          )}
          {isError && onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1 font-sans text-[11px] font-medium text-red-400 transition-colors hover:text-red-300"
              aria-label="Retry message"
            >
              <RotateCcw size={11} /> Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
