import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const db = () => getSupabaseAdmin();

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }
    await db().rpc("increment_post_views", { slug_param: slug });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/posts/view error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
