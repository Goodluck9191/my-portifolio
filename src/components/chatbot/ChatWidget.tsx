"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import FloatingChatButton from "./FloatingChatButton";
import type { ChatMessageData } from "./ChatMessage";

// Lazy-load the chat window so it doesn't affect initial page load
const ChatWindow = dynamic(() => import("./ChatWindow"), {
  ssr: false,
  loading: () => null,
});

const WELCOME_MESSAGE =
  "Hey! I'm Goodluck's AI assistant. I can help you explore his background, technical skills, projects and the problems he's passionate about solving.\n\nWhat would you like to know?";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([
    { id: "welcome", role: "assistant", content: WELCOME_MESSAGE, createdAt: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFailedMessageRef = useRef<string | null>(null);

  const conversationStarted =
    messages.length > 1 || messages[0]?.id !== "welcome";

  // Escape closes the chat
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        setMinimized(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const send = useCallback(
    async (messageText: string) => {
      const text = messageText.trim();
      if (!text || loading) return;

      const userMessage: ChatMessageData = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "user",
        content: text,
        createdAt: Date.now(),
      };

      // Build the history sent to the server (exclude welcome + error placeholders)
      const history = [...messages, userMessage]
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to get a response.");
        }

        const reply = data?.data?.reply?.trim();
        if (!reply) {
          throw new Error("The assistant returned an empty response.");
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: reply,
            createdAt: Date.now(),
          },
        ]);
        lastFailedMessageRef.current = null;
      } catch (err) {
        lastFailedMessageRef.current = text;
        const message =
          err instanceof Error ? err.message : "Something went wrong.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  const handleRetry = useCallback(() => {
    if (lastFailedMessageRef.current) {
      // Remove the failed user message so it doesn't send twice
      setMessages((prev) =>
        prev.length > 0 && prev[prev.length - 1].role === "user"
          ? prev.slice(0, -1)
          : prev
      );
      send(lastFailedMessageRef.current);
    }
  }, [send]);

  const handleClear = useCallback(() => {
    setMessages([
      { id: "welcome", role: "assistant", content: WELCOME_MESSAGE, createdAt: 0 },
    ]);
    setError(null);
    lastFailedMessageRef.current = null;
  }, []);

  const handleSuggestion = useCallback((question: string) => {
    send(question);
  }, [send]);

  return (
    <>
      {open && (
        <div
          className="fixed bottom-[5.5rem] right-4 z-[55] h-[65vh] w-[calc(100vw-2rem)] max-h-[640px] sm:bottom-24 sm:right-6 sm:h-[min(620px,calc(100vh-7rem))] sm:w-[400px]"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <ChatWindow
            messages={messages}
            loading={loading}
            error={error}
            onClose={() => { setOpen(false); setMinimized(false); }}
            onMinimize={() => { setOpen(false); setMinimized(true); }}
            onSend={send}
            onSuggestion={handleSuggestion}
            onRetry={handleRetry}
            onClear={handleClear}
            conversationStarted={conversationStarted}
          />
        </div>
      )}

      <FloatingChatButton
        open={open}
        minimized={minimized}
        onToggle={() => { setOpen((v) => !v); setMinimized(false); }}
        onOpenFromMinimized={() => { setOpen(true); setMinimized(false); }}
      />
    </>
  );
}
