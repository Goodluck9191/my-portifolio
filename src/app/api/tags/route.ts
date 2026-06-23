import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const db = () => getSupabaseAdmin();

export async function GET() {
  try {
    const { data, error } = await db()
      .from("posts")
      .select("tags")
      .eq("published", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const allTags = [...new Set((data ?? []).flatMap((p) => p.tags).filter(Boolean))].sort();

    return NextResponse.json({ data: allTags }, {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch (err) {
    console.error("GET /api/tags error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
