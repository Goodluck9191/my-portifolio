"use client";

import { useState, useEffect } from "react";
import type { Post } from "@/lib/types";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featured, setFeatured] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, featuredRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/posts?featured=true&limit=1"),
        ]);
        const postsData = await postsRes.json();
        const featuredData = await featuredRes.json();
        setPosts(postsData.data ?? []);
        setFeatured(
          featuredData.data?.[0] ?? null
        );
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { posts, featured, loading };
}
