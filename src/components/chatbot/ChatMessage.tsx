"use client";

import { AlertCircle, RotateCcw, Sparkles, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

// Assistant messages render real Markdown (bold, lists, links, code, tables).
// Raw HTML is NOT enabled (no rehype-raw) — AI output is sanitized by the parser.
const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="my-1 font-sans text-sm leading-relaxed text-[#EEEEFF]">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-[#EEEEFF]">{children}</em>,
  h1: ({ children }) => (
    <h1 className="mt-2 mb-1 font-display text-base font-bold text-white">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-2 mb-1 font-display text-sm font-bold text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-2 mb-1 font-display text-sm font-semibold text-white">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-1.5 mb-1 font-display text-xs font-semibold uppercase tracking-wide text-white">
      {children}
    </h4>
  ),
  ul: ({ children }) => (
    <ul className="my-1 list-disc space-y-1 pl-5 font-sans text-sm leading-relaxed text-[#EEEEFF]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1 list-decimal space-y-1 pl-5 font-sans text-sm leading-relaxed text-[#EEEEFF]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="text-[#EEEEFF]">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-words font-medium text-[#6C63FF] underline decoration-[#6C63FF]/30 transition-colors hover:text-[#00D4FF]"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-[#6C63FF] pl-3 font-sans text-sm italic leading-relaxed text-[#7A7A9A]">
      {children}
    </blockquote>
  ),
  pre: ({ children }) => (
    <pre className="my-2 overflow-x-auto rounded-lg border border-[#22223A] bg-[#0F0F1A] p-3 font-mono text-xs leading-relaxed text-[#00D4FF]">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.startsWith("language-")) || String(children).includes("\n");
    if (isBlock) {
      return (
        <code className={`font-mono text-[11px] text-[#00D4FF] ${className ?? ""}`}>
          {children}
        </code>
      );
    }
    return (
      <code className="rounded border border-[#2A2A38] bg-[#0F0F1A] px-1.5 py-0.5 font-mono text-[0.8em] text-[#00D4FF]">
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-lg border border-[#2A2A38]">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-[#1A1A2E]">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-[#2A2A38] px-3 py-1.5 text-left font-sans text-[11px] font-semibold text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-t border-[#2A2A38] px-3 py-1.5 font-sans text-[11px] text-[#EEEEFF]">
      {children}
    </td>
  ),
  hr: () => <hr className="my-2 border-[#2A2A38]" />,
};

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
        {isUser || isError ? (
          <p className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div className="break-words">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
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
