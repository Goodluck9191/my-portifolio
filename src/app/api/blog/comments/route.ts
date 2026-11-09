import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { commentSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/utils";

const db = () => getSupabaseAdmin();

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// GET: approved comments for a post (public). Emails and tokens are never exposed.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id");
    const status = searchParams.get("status"); // admin override
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (!postId) {
      return NextResponse.json(
        { error: "post_id is required" },
        { status: 400 }
      );
    }

    let query = db()
      .from("blog_comments")
      .select(
        "id, post_id, parent_id, name, content, status, created_at, updated_at",
        { count: "exact" }
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    // Public only sees approved
    if (status) {
      query = query.eq("status", status);
    } else {
      query = query.eq("status", "approved");
    }

    if (limit) query = query.limit(parseInt(limit));
    if (offset) query = query.range(parseInt(offset), parseInt(offset) + (parseInt(limit ?? "50") - 1));

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        data: data ?? [],
        count: count ?? 0,
        post_id: postId,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/blog/comments error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: submit a new comment (approved instantly, no moderation)
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limiting: 5 comments per minute per IP
    if (!checkRateLimit(ip, 5, 60_000)) {
      return NextResponse.json(
        { error: "Too many comments. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = commentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error?.issues ?? [] },
        { status: 400 }
      );
    }

    const { name, email, content, parent_id } = result.data;
    const post_id = body.post_id as string | undefined;
    const visitor_id = (body.visitor_id as string | undefined) ?? null;

    if (!post_id || typeof post_id !== "string") {
      return NextResponse.json(
        { error: "post_id is required" },
        { status: 400 }
      );
    }

    // If this is a reply, verify the parent comment exists and belongs to the same post
    if (parent_id) {
      const { data: parent, error: parentError } = await db()
        .from("blog_comments")
        .select("post_id")
        .eq("id", parent_id)
        .single();

      if (parentError || !parent) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 400 }
        );
      }
      if (parent.post_id !== post_id) {
        return NextResponse.json(
          { error: "Parent comment does not belong to this post" },
          { status: 400 }
        );
      }
    }

    // Server-generated one-time secret authorizing the commenter to delete this comment.
    const deleteToken = crypto.randomUUID();

    const { data, error } = await db()
      .from("blog_comments")
      .insert([
        {
          post_id,
          parent_id: parent_id ?? null,
          name,
          email,
          content,
          status: "approved", // published instantly
          visitor_id,
          delete_token: deleteToken,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // delete_token is only returned here — the client must store it to delete later.
    return NextResponse.json(
      {
        data: {
          id: data.id,
          post_id: data.post_id,
          parent_id: data.parent_id,
          name: data.name,
          content: data.content,
          created_at: data.created_at,
          delete_token: deleteToken,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/blog/comments error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: delete your own comment (requires the delete_token issued at creation)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    if (!id || !token) {
      return NextResponse.json(
        { error: "id and token are required" },
        { status: 400 }
      );
    }

    // Verify token against the stored one-time secret before deleting
    const { data: comment, error: fetchError } = await db()
      .from("blog_comments")
      .select("delete_token")
      .eq("id", id)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (!comment.delete_token || comment.delete_token !== token) {
      return NextResponse.json({ error: "Invalid delete token" }, { status: 403 });
    }

    // Delete cascades to replies (parent_id ON DELETE CASCADE)
    const { error } = await db()
      .from("blog_comments")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("DELETE /api/blog/comments error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
