import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/auth";

const db = () => getSupabaseAdmin();

const ITEMS_PER_PAGE = 20;

// GET: list comments with search, post filter, status filter, pagination
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? "";
    const postId = searchParams.get("post_id") ?? "";
    const status = searchParams.get("status") ?? "All"; // All | pending | approved | rejected
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? ITEMS_PER_PAGE.toString(), 10)));

    let query = db()
      .from("blog_comments")
      .select(
        "id, post_id, parent_id, name, email, content, status, created_at, updated_at, posts(title, slug)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
      // Supabase doesn't easily OR across different columns with ilike in one call;
      // we'll also filter content client-side after fetch if needed. Keep server-side simple.
    }

    if (postId) {
      query = query.eq("post_id", postId);
    }

    if (status !== "All") {
      query = query.eq("status", status);
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Client-side content search fallback (since server-side OR on name only)
    const comments = (data ?? []).filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q)
      );
    });

    return NextResponse.json({
      data: comments,
      count: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    });
  } catch (err) {
    console.error("GET /api/admin/comments error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH: approve or reject a comment (update status)
export async function PATCH(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body as { id?: string; status?: string };

    if (!id) {
      return NextResponse.json({ error: "Comment id is required" }, { status: 400 });
    }
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Valid status (pending, approved, rejected) is required" },
        { status: 400 }
      );
    }

    const { data, error } = await db()
      .from("blog_comments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("PATCH /api/admin/comments error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: delete a comment
export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Comment id is required" }, { status: 400 });
    }

    const { error } = await db().from("blog_comments").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("DELETE /api/admin/comments error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
