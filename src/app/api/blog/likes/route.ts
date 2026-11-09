import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/auth";

const db = () => getSupabaseAdmin();

const VISITOR_ID_HEADER = "x-visitor-id";

function getVisitorId(request: Request): string | null {
  const header = request.headers.get(VISITOR_ID_HEADER);
  if (header) return header;
  // Fallback: derive from IP + user-agent for privacy-conscious anon identification
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  return `${ip}:${ua}`;
}

// GET: like count for a post (+ whether the visitor has liked it)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id");
    const visitorId = searchParams.get("visitor_id");

    if (!postId) {
      return NextResponse.json(
        { error: "post_id is required" },
        { status: 400 }
      );
    }

    const { data: likes, error } = await db()
      .from("blog_likes")
      .select("visitor_id")
      .eq("post_id", postId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const likeCount = likes?.length ?? 0;
    const hasLiked = visitorId
      ? likes?.some((l) => l.visitor_id === visitorId) ?? false
      : false;

    return NextResponse.json(
      { data: { post_id: postId, like_count: likeCount, has_liked: hasLiked } },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/blog/likes error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: toggle like (like or unlike) for a visitor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { post_id, visitor_id } = body as {
      post_id?: string;
      visitor_id?: string;
    };

    if (!post_id || !visitor_id) {
      return NextResponse.json(
        { error: "post_id and visitor_id are required" },
        { status: 400 }
      );
    }

    // Check existing like to decide toggle direction
    const { data: existing, error: fetchError } = await db()
      .from("blog_likes")
      .select("id")
      .eq("post_id", post_id)
      .eq("visitor_id", visitor_id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }

    if (existing) {
      // Unlike: remove the like
      const { error } = await db()
        .from("blog_likes")
        .delete()
        .eq("id", existing.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        data: { post_id, visitor_id, liked: false, action: "unliked" },
      });
    }

    // Like: insert (unique constraint prevents duplicates server-side)
    const { data, error } = await db()
      .from("blog_likes")
      .insert([{ post_id, visitor_id }])
      .select()
      .single();

    if (error) {
      // Unique violation = duplicate like
      return NextResponse.json(
        { error: "You have already liked this post" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { data: { ...data, liked: true, action: "liked" } },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/blog/likes error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
