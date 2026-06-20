import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { postSchema } from "@/lib/validations";
import { verifyAdmin } from "@/lib/auth";

const db = () => getSupabaseAdmin();

export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request).catch(() => false);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    let query = db()
      .from("posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Admins see all posts; public only sees published
    if (!isAdmin) {
      query = query.eq("published", true);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (featured === "true") {
      query = query.eq("featured", true);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    if (offset) {
      query = query.range(
        parseInt(offset),
        parseInt(offset) + (parseInt(limit ?? "6")) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const cacheControl = isAdmin
      ? "private, no-cache"
      : "public, max-age=60, s-maxage=300";

    return NextResponse.json({ data, count }, {
      headers: { "Cache-Control": cacheControl },
    });
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error?.issues ?? [] },
        { status: 400 }
      );
    }

    const { data, error } = await db()
      .from("posts")
      .insert([result.data])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
