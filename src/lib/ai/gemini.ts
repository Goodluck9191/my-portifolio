// =============================================================
// Server-side Gemini client — SERVER ONLY (never import in client code)
// Uses the official @google/genai SDK with the Interactions API.
// =============================================================
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./system-prompt";
import { buildKnowledgeContext } from "./knowledge-base";

// Free-tier candidates, tried in order. Google's free-tier availability
// fluctuates, so if the preferred model is busy or unavailable the request
// automatically falls through to the next one.
const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL ?? "gemini-flash-lite-latest",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
].filter((m, i, arr) => arr.indexOf(m) === i);

export const GEMINI_MODEL = FALLBACK_MODELS[0];

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

export class GeminiError extends Error {
  status: number;
  code: "NOT_CONFIGURED" | "RATE_LIMITED" | "MODEL_UNAVAILABLE" | "PROVIDER_ERROR";

  constructor(code: GeminiError["code"], status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY?.trim();
}

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new GeminiError(
      "NOT_CONFIGURED",
      503,
      "AI assistant is not configured. The site owner needs to set GEMINI_API_KEY."
    );
  }
  return new GoogleGenAI({ apiKey });
}

function buildInput(history: ChatMessage[], message: string): string {
  const lines: string[] = [];

  if (history.length > 0) {
    lines.push("Conversation so far (user-to-assistant turns):");
    for (const msg of history) {
      const speaker = msg.role === "user" ? "Visitor" : "Goodluck's Assistant";
      lines.push(`${speaker}: ${msg.content}`);
    }
    lines.push("");
  }

  lines.push(`Visitor: ${message}`);
  lines.push("Goodluck's Assistant:");
  return lines.join("\n");
}

function isRetryableProviderError(err: unknown): boolean {
  const anyErr = err as { status?: number; message?: string; code?: string };
  const msg = String(anyErr?.message ?? "").toLowerCase();
  const status = anyErr?.status;
  return (
    status === 429 ||
    status === 503 ||
    status === 404 ||
    /(rate.?limit|resource.?exhausted|quota|high demand|service_unavailable|unavailable|no longer available|not.?found|not.?supported)/i.test(msg)
  );
}

export async function generateChatResponse(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const ai = getClient();
  const systemInstruction = `${SYSTEM_PROMPT}\n\n${buildKnowledgeContext()}`;
  const input = buildInput(history, message);

  const providerErrors: string[] = [];

  for (const model of FALLBACK_MODELS) {
    try {
      const interaction = await ai.interactions.create({
        model,
        input,
        system_instruction: systemInstruction,
      });

      const reply = interaction.output_text?.trim();

      if (!reply) {
        throw new GeminiError(
          "PROVIDER_ERROR",
          502,
          "The AI assistant returned an empty response. Please try again."
        );
      }

      return reply;
    } catch (err) {
      if (err instanceof GeminiError) throw err;

      const anyErr = err as { status?: number; message?: string };
      const msg = String(anyErr?.message ?? err ?? "Unknown provider error");

      if (isRetryableProviderError(err)) {
        providerErrors.push(`[${model}] ${msg}`);
        continue; // try the next free model
      }

      // Non-retryable (network failure etc.) — stop immediately
      throw new GeminiError(
        "PROVIDER_ERROR",
        502,
        `The AI assistant failed to respond: ${msg.slice(0, 200)}`
      );
    }
  }

  const combined = providerErrors.slice(-2).join(" | ").slice(0, 300);
  throw new GeminiError(
    "MODEL_UNAVAILABLE",
    502,
    `The AI assistant could not reach a free model right now. (${combined}) Please try again later.`
  );
}
