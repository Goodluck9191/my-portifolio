"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import * as Lucide from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "../layout";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Post } from "@/lib/types";

interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  name: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  posts?: { title: string; slug: string } | null;
}

const ITEMS_PER_PAGE = 15;

export default function AdminCommentsPage() {
  const { token } = useAdmin();
  const [comments, setComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPost, setFilterPost] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Comment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const [commentsRes, postsRes] = await Promise.all([
        fetch("/api/admin/comments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/posts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (commentsRes.ok) {
        const data = await commentsRes.json();
        setComments(data.data ?? []);
      }

      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(data.data ?? []);
      }
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [token]);

  const filtered = useMemo(() => {
    return comments.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.posts?.title.toLowerCase().includes(q);
      const matchesPost =
        filterPost === "All" || c.post_id === filterPost;
      return matchesSearch && matchesPost;
    });
  }, [comments, search, filterPost]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget.id);
    try {
      const res = await fetch(
        `/api/admin/comments?id=${encodeURIComponent(deleteTarget.id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error();
      setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      if (selected?.id === deleteTarget.id) setSelected(null);
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
  }, [deleteTarget, token, selected]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Comments</h1>
          <p className="font-sans text-sm text-[#7A7A9A]">
            {filtered.length} comment{filtered.length !== 1 ? "s" : ""} — comments are posted instantly; delete any you don&apos;t want to keep.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Lucide.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A9A]" />
          <input
            type="text"
            placeholder="Search name, email, content, or post title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-[#2A2A38] bg-[#0F0F1A] py-2 pl-10 pr-4 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]"
          />
        </div>
        <select
          value={filterPost}
          onChange={(e) => { setFilterPost(e.target.value); setPage(1); }}
          className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-3 py-2 font-sans text-sm text-[#EEEEFF] outline-none focus:border-[#6C63FF]"
        >
          <option value="All">All Posts</option>
          {posts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* Empty state */}
      {comments.length === 0 ? (
        <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-8 text-center">
          <p className="font-sans text-sm text-[#7A7A9A]">
            No comments yet. They&apos;ll appear here once readers submit them.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-[#2A2A38]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#2A2A38] bg-[#0F0F1A]">
                  <th className="px-4 py-3 font-mono text-xs font-medium text-[#7A7A9A]">Comment</th>
                  <th className="px-4 py-3 font-mono text-xs font-medium text-[#7A7A9A]">Post</th>
                  <th className="px-4 py-3 font-mono text-xs font-medium text-[#7A7A9A]">Author</th>
                  <th className="px-4 py-3 font-mono text-xs font-medium text-[#7A7A9A]">Date</th>
                  <th className="px-4 py-3 text-right font-mono text-xs font-medium text-[#7A7A9A]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((comment) => (
                  <tr
                    key={comment.id}
                    className="border-b border-[#22223A] transition-colors hover:bg-[#0F0F1A]/50"
                  >
                    <td className="px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-sm text-[#EEEEFF] truncate">
                          {comment.content}
                        </p>
                        {comment.parent_id && (
                          <p className="font-mono text-[11px] text-[#7A7A9A]">Reply</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-[#7A7A9A]">
                      {comment.posts?.title ?? "Unknown post"}
                      <br />
                      <span className="font-mono text-[11px] text-[#7A7A9A]">
                        /blog/{comment.posts?.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-sm text-[#EEEEFF]">
                      {comment.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-[#7A7A9A]">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {selected?.id === comment.id ? (
                          <button
                            onClick={() => setSelected(null)}
                            className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
                            title="Close"
                          >
                            <Lucide.MessageSquare size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelected(comment)}
                            className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
                            title="View"
                          >
                            <Lucide.MessageSquare size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(comment)}
                          disabled={deleting === comment.id}
                          className="rounded-lg p-2 text-[#7A7A9A] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                          title="Delete"
                        >
                          <Lucide.Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center font-sans text-sm text-[#7A7A9A]">
                      No comments match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-sm text-[#EEEEFF] transition-colors hover:bg-[#1A1A2E] disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-lg px-3 py-1.5 font-sans text-sm transition-colors ${
                    p === currentPage
                      ? "bg-[#6C63FF] text-white"
                      : "border border-[#2A2A38] text-[#EEEEFF] hover:bg-[#1A1A2E]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-sm text-[#EEEEFF] transition-colors hover:bg-[#1A1A2E] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail view */}
      {selected && (
        <div className="flex flex-col gap-6">
          <button
            onClick={() => setSelected(null)}
            className="flex w-fit items-center gap-1 font-sans text-sm text-[#6C63FF] hover:text-[#00D4FF]"
          >
            <Lucide.ArrowLeft size={16} /> Back to all comments
          </button>
          <div className="rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  {selected.name}
                </h2>
                <span className="font-sans text-sm text-[#7A7A9A]">
                  {selected.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/blog/${selected.posts?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-xs text-[#00D4FF] transition-colors hover:bg-[#00D4FF]/10"
                >
                  <Lucide.ExternalLink size={14} className="inline-block mr-1" />
                  View Post
                </Link>
                <button
                  onClick={() => setDeleteTarget(selected)}
                  disabled={deleting === selected.id}
                  className="rounded-lg border border-[#2A2A38] px-3 py-1.5 font-sans text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-40"
                >
                  <Lucide.Trash2 size={14} className="inline-block mr-1" />
                  Delete
                </button>
              </div>
            </div>
            {selected.posts && (
              <p className="mt-1 mb-4 font-sans text-sm text-[#7A7A9A]">
                Post: {selected.posts.title}
              </p>
            )}
            <hr className="my-4 border-[#2A2A38]" />
            <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#EEEEFF]">
              {selected.content}
            </p>
            <p className="mt-4 font-mono text-xs text-[#7A7A9A]">
              {new Date(selected.created_at).toLocaleString()}
            </p>
          </div>
          <ConfirmDialog
            open={!!deleteTarget && deleteTarget.id === selected.id}
            title="Delete Comment"
            message={`Are you sure you want to delete this comment by "${deleteTarget?.name}"? This cannot be undone.`}
            confirmLabel={deleting === deleteTarget?.id ? "Deleting..." : "Delete"}
            variant="danger"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Comment"
        message={`Are you sure you want to delete the comment from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel={deleting === deleteTarget?.id ? "Deleting..." : "Delete"}
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
