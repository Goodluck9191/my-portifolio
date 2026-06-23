import { cache } from "react";
import type { Project, Post } from "@/lib/types";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const db = () => getSupabaseAdmin();

export const getProjects = cache(async (): Promise<Project[]> => {
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
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
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
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
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
});

export const getProjectsByCategory = cache(async (category: string): Promise<Project[]> => {
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
});

export const getPosts = cache(async (): Promise<Post[]> => {
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
});

export const getFeaturedPost = cache(async (): Promise<Post | null> => {
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
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
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
});

export const getPostsByCategory = cache(async (category: string): Promise<Post[]> => {
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
});

export const incrementPostViews = cache(async (slug: string): Promise<void> => {
  try {
    await db().rpc("increment_post_views", { slug_param: slug });
  } catch (err) {
    console.error("Error incrementing post views:", err);
  }
});

export const searchPosts = cache(async (query: string): Promise<Post[]> => {
  try {
    const { data, error } = await db()
      .from("posts")
      .select("*")
      .eq("published", true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("Error searching posts:", err);
    return [];
  }
});

export const getAllTags = cache(async (): Promise<string[]> => {
  try {
    const { data, error } = await db()
      .from("posts")
      .select("tags")
      .eq("published", true);

    if (error) throw error;
    const allTags = [...new Set((data ?? []).flatMap((p) => p.tags).filter(Boolean))];
    return allTags.sort();
  } catch (err) {
    console.error("Error fetching tags:", err);
    return [];
  }
});

export const getRelatedPosts = cache(async (
  slug: string,
  tags: string[],
  category: string,
  limit = 3
): Promise<Post[]> => {
  try {
    const { data, error } = await db()
      .from("posts")
      .select("*")
      .eq("published", true)
      .neq("slug", slug)
      .order("created_at", { ascending: false });

    if (error) throw error;
    const posts = data ?? [];
    if (posts.length === 0) return [];

    const scored = posts.map((p) => {
      const sharedTags = p.tags.filter((t: string) => tags.includes(t)).length;
      const sameCategory = p.category === category ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sameCategory };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.post);
  } catch (err) {
    console.error("Error fetching related posts:", err);
    return [];
  }
});

export const getSetting = cache(async (key: string): Promise<string | null> => {
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
});

export const getAllSettings = cache(async (): Promise<Record<string, string>> => {
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
});
