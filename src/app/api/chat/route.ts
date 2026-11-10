import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { chatRequestSchema, trimHistory } from "@/lib/ai/validation";
import { generateChatResponse, GeminiError } from "@/lib/ai/gemini";
import { checkRateLimit } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: Request) {
  try {
    // Basic abuse protection (in-memory; not a production-grade limiter on serverless).
    const ip = getClientIp(request);
    if (!checkRateLimit(ip, 10, 60_000)) {
      return NextResponse.json(
        { error: "You're sending messages too fast. Please wait a minute." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = chatRequestSchema.parse(body);
    const history = trimHistory(parsed.history);

    const reply = await generateChatResponse(parsed.message, history);

    return NextResponse.json({
      data: { reply },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: err.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    if (err instanceof GeminiError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    console.error("POST /api/chat error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
