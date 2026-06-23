import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyAdmin } from "@/lib/auth";

const db = () => getSupabaseAdmin();

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
    const fileName = `${Date.now()}-${sanitizedName}`;

    let filePath: string;
    if (folder === "blog") {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      filePath = `blog-images/${year}/${month}/${fileName}`;
    } else {
      filePath = `uploads/${fileName}`;
    }

    const { data, error } = await db()
      .storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    const { data: urlData } = db()
      .storage
      .from("images")
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await db()
      .storage
      .from("images")
      .list("uploads", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const files = (data ?? []).map((file) => {
      const { data: urlData } = db().storage.from("images").getPublicUrl(`uploads/${file.name}`);
      return {
        name: file.name,
        url: urlData.publicUrl,
        created_at: file.created_at,
        size: file.metadata?.size ?? 0,
      };
    });

    return NextResponse.json({ data: files });
  } catch (err) {
    console.error("GET /api/upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { path } = await request.json();
    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    const { error } = await db()
      .storage
      .from("images")
      .remove([path]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "File deleted" });
  } catch (err) {
    console.error("DELETE /api/upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
