import { z } from "zod";

// Hard limits — prevent abuse and leaking excessive context to the AI.
export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_HISTORY_MESSAGES = 20;
export const MAX_HISTORY_CHARS = 6000;

export const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(MAX_MESSAGE_LENGTH, `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z
          .string()
          .trim()
          .min(1, "Empty history message")
          .max(MAX_MESSAGE_LENGTH, "History message too long"),
      })
    )
    .max(MAX_HISTORY_MESSAGES, "Conversation is too long. Please start a new chat.")
    .default([]),
});

// Keep only the most recent messages within the char budget.
export function trimHistory(history: { role: "user" | "assistant"; content: string }[]) {
  let total = 0;
  const reversed: { role: "user" | "assistant"; content: string }[] = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    if (total + msg.content.length > MAX_HISTORY_CHARS) break;
    reversed.push(msg);
    total += msg.content.length;
  }
  return reversed.reverse();
}
