"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import type { BlogComment } from "@/lib/types";

const MY_COMMENTS_KEY = "glp_my_comments";

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myTokens, setMyTokens] = useState<Record<string, string>>({});

  // Load the visitor's own comment tokens from localStorage (id -> delete_token)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MY_COMMENTS_KEY);
      setMyTokens(raw ? JSON.parse(raw) : {});
    } catch {
      setMyTokens({});
    }
  }, []);

  const persistTokens = useCallback((tokens: Record<string, string>) => {
    setMyTokens(tokens);
    try {
      localStorage.setItem(MY_COMMENTS_KEY, JSON.stringify(tokens));
    } catch {
      // localStorage unavailable — deletion just won't persist across sessions
    }
  }, []);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blog/comments?post_id=${encodeURIComponent(postId)}`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentCreated = useCallback(
    (created: { id: string; delete_token: string }) => {
      if (created.id && created.delete_token) {
        persistTokens({ ...myTokens, [created.id]: created.delete_token });
      }
      fetchComments();
    },
    [myTokens, persistTokens, fetchComments]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string, deleteToken: string) => {
      try {
        const res = await fetch(
          `/api/blog/comments?id=${encodeURIComponent(commentId)}&token=${encodeURIComponent(deleteToken)}`,
          { method: "DELETE" }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to delete comment");
        }

        const updated = { ...myTokens };
        delete updated[commentId];
        persistTokens(updated);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Your comment was deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete comment");
      }
    },
    [myTokens, persistTokens]
  );

  const approvedCount = comments.filter((c) => c.status === "approved").length;

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#7A7A9A]" />
          <h2 className="font-display text-lg font-bold text-white">Comments</h2>
        </div>
        <div className="flex h-32 items-center justify-center rounded-lg border border-[#22223A] bg-[#0F0F1A] text-[#7A7A9A]">
          Loading comments…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#7A7A9A]" />
          <h2 className="font-display text-lg font-bold text-white">Comments</h2>
        </div>
        <div className="rounded-lg border border-[#22223A] bg-[#0F0F1A] p-4 text-center">
          <p className="font-sans text-sm text-red-400">{error}</p>
          <button
            onClick={fetchComments}
            className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-xs text-[#6C63FF] hover:text-[#00D4FF]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} className="text-[#6C63FF]" />
        <h2 className="font-display text-lg font-bold text-white">
          Comments ({approvedCount})
        </h2>
      </div>

      <CommentForm postId={postId} onSuccess={handleCommentCreated} />

      <div className="border-t border-[#22223A] pt-6">
        <CommentList
          comments={comments}
          postId={postId}
          myTokens={myTokens}
          onDelete={handleDeleteComment}
          onCommentCreated={handleCommentCreated}
        />
      </div>
    </div>
  );
}
