"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useAdmin } from "../layout";
import type { Post } from "@/lib/types";

export default function AdminPostsPage() {
  const { token } = useAdmin();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Posts</h1>
          <p className="font-sans text-sm text-[#7A7A9A]">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-4 py-2 font-sans text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#2A2A38]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A38] bg-[#0F0F1A]">
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Title</th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Category</th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Published</th>
              <th className="px-4 py-3 text-left font-mono text-xs font-medium text-[#7A7A9A]">Views</th>
              <th className="px-4 py-3 text-right font-mono text-xs font-medium text-[#7A7A9A]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-[#22223A] transition-colors hover:bg-[#0F0F1A]/50"
              >
                <td className="px-4 py-3 font-sans text-sm text-[#EEEEFF]">
                  {post.title}
                </td>
                <td className="px-4 py-3 font-sans text-sm text-[#7A7A9A]">
                  {post.category}
                </td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-green-500">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-yellow-500">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-[#7A7A9A]">
                  {post.views}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center font-sans text-sm text-[#7A7A9A]"
                >
                  No posts yet. Create your first post.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
