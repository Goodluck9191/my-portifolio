import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/auth";

const db = () => getSupabaseAdmin();

// GET: engagement statistics for admin dashboard
export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Totals
    const [{ data: totals }, { data: mostLiked }, { data: mostCommented }] =
      await Promise.all([
        db().from("blog_engagement_totals").select("*").limit(1).single(),
        db().from("blog_most_liked_posts").select("*"),
        db().from("blog_most_commented_posts").select("*"),
      ]);

    const response = NextResponse.json({
      data: {
        totals: totals ?? {
          total_likes: 0,
          total_approved_comments: 0,
          total_pending_comments: 0,
          total_rejected_comments: 0,
        },
        most_liked: mostLiked ?? [],
        most_commented: mostCommented ?? [],
      },
    });
    response.headers.set("Cache-Control", "private, no-cache");
    return response;
  } catch (err) {
    console.error("GET /api/admin/engagement error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
