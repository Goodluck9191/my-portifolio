import type { Project, Post } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const db = () => getSupabaseAdmin();

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await db()
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const { data, error } = await db()
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("order_index", { ascending: true })
      .limit(3);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error fetching featured projects:", err);
    return [];
  }
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  try {
    const { data, error } = await db()
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching project by slug:", err);
    return null;
  }
}

export async function getProjectsByCategory(
  category: string
): Promise<Project[]> {
  try {
    const { data, error } = await db()
      .from("projects")
      .select("*")
      .eq("category", category)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error fetching projects by category:", err);
    return [];
  }
}

export async function getPosts(): Promise<Post[]> {
  try {
    const { data, error } = await db()
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}

export async function getFeaturedPost(): Promise<Post | null> {
  try {
    const { data, error } = await db()
      .from("posts")
      .select("*")
      .eq("published", true)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) return null;
    return data;
  } catch (err) {
    console.error("Error fetching featured post:", err);
    return null;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data, error } = await db()
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) return null;
    return data;
  } catch (err) {
    console.error("Error fetching post by slug:", err);
    return null;
  }
}

export async function getPostsByCategory(
  category: string
): Promise<Post[]> {
  try {
    const { data, error } = await db()
      .from("posts")
      .select("*")
      .eq("published", true)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error fetching posts by category:", err);
    return [];
  }
}

export async function incrementPostViews(slug: string): Promise<void> {
  try {
    await db().rpc("increment_post_views", { slug_param: slug });
  } catch (err) {
    console.error("Error incrementing post views:", err);
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const { data, error } = await db()
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error) return null;
    return data?.value ?? null;
  } catch (err) {
    console.error("Error fetching setting:", err);
    return null;
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const { data, error } = await db()
      .from("settings")
      .select("key, value");

    if (error) throw error;

    const settings: Record<string, string> = {};
    for (const row of data ?? []) {
      settings[row.key] = row.value;
    }
    return settings;
  } catch (err) {
    console.error("Error fetching all settings:", err);
    return {};
  }
}
