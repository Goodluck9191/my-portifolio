"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { MessageSquare, Reply } from "lucide-react";
import { useVisitorId } from "./use-visitor-id";
import type { CommentFormData } from "@/lib/types";

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onSuccess?: (created: { id: string; delete_token: string }) => void;
  isReply?: boolean;
}

export default function CommentForm({
  postId,
  parentId = null,
  onSuccess,
  isReply = false,
}: CommentFormProps) {
  const visitorId = useVisitorId();
  const [formData, setFormData] = useState<CommentFormData>({
    name: "",
    email: "",
    content: "",
    parent_id: parentId ?? null,
  });
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<{ id: string; delete_token: string } | null>(null);

  const updateField = useCallback(
    (key: keyof CommentFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const res = await fetch("/api/blog/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            post_id: postId,
            visitor_id: visitorId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to submit comment");
        }

        if (data.data?.id && data.data?.delete_token) {
          const createdComment = {
            id: data.data.id,
            delete_token: data.data.delete_token,
          };
          setCreated(createdComment);
          setFormData({ name: "", email: "", content: "", parent_id: null });
          onSuccess?.(createdComment);
        } else {
          setCreated({ id: "", delete_token: "" });
          onSuccess?.({ id: "", delete_token: "" });
        }
        toast.success("Comment posted.");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to submit comment"
        );
      } finally {
        setLoading(false);
      }
    },
    [postId, formData, onSuccess, visitorId]
  );

  if (created) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#2A2A38] bg-[#0F0F1A]/50 text-center">
        <MessageSquare size={24} className="text-[#6C63FF]" />
        <p className="font-sans text-sm text-[#EEEEFF]">
          Your comment has been posted.
        </p>
        <button
          onClick={() => setCreated(null)}
          className="mt-1 font-sans text-xs text-[#6C63FF] transition-colors hover:text-[#00D4FF]"
        >
          Post another comment
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-5 md:p-6"
    >
      <div className="flex flex-col gap-2">
        <label className="font-sans text-xs font-medium text-[#7A7A9A]">
          {isReply ? "Your name" : "Name"}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="e.g. Jane Doe"
          required
          maxLength={100}
          className="rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-xs font-medium text-[#7A7A9A]">
          Email <span className="text-[#6C63FF]">(private)</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="you@example.com"
          required
          maxLength={255}
          className="rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-sans text-xs font-medium text-[#7A7A9A]">
          Comment
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => updateField("content", e.target.value)}
          placeholder="Write your comment here..."
          required
          minLength={5}
          maxLength={2000}
          rows={4}
          className="rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none focus:border-[#6C63FF] resize-none"
        />
        <p className="font-mono text-[11px] text-[#7A7A9A]">
          {formData.content.length}/2000 characters
        </p>
      </div>

      {parentId && (
        <div className="flex items-center gap-2 rounded-lg border border-[#2A2A38] bg-[#16162A]/50 px-4 py-2">
          <Reply size={14} className="text-[#6C63FF]" />
          <span className="font-sans text-xs text-[#7A7A9A]">
            Replying to this comment
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 font-sans text-sm font-semibold transition-all duration-200 disabled:opacity-40 ${
          loading
            ? "bg-[#2A2A38] text-[#7A7A9A]"
            : "bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-white hover:opacity-90"
        }`}
      >
        {loading ? "Posting..." : isReply ? "Post Reply" : "Post Comment"}
      </button>
    </form>
  );
}
