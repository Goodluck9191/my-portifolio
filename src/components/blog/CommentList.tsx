"use client";

import { useMemo } from "react";
import CommentItem from "./CommentItem";
import type { BlogComment } from "@/lib/types";

interface CommentListProps {
  comments: BlogComment[];
  postId: string;
  myTokens?: Record<string, string>;
  onDelete?: (commentId: string, deleteToken: string) => void;
  onCommentCreated?: (created: { id: string; delete_token: string }) => void;
}

export default function CommentList({
  comments,
  postId,
  myTokens = {},
  onDelete,
  onCommentCreated,
}: CommentListProps) {
  // Build a map of parent_id -> children replies
  const childrenMap = useMemo(() => {
    const map = new Map<string | null, BlogComment[]>();
    for (const c of comments) {
      const kids = map.get(c.parent_id) ?? [];
      kids.push(c);
      map.set(c.parent_id, kids);
    }
    return map;
  }, [comments]);

  const topLevelComments = useMemo(
    () => comments.filter((c) => c.parent_id === null),
    [comments]
  );

  return (
    <div className="flex flex-col gap-4">
      {topLevelComments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="font-sans text-sm text-[#7A7A9A]">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        topLevelComments.map((comment) => {
          const replies = childrenMap.get(comment.id) ?? [];
          return (
            <CommentItem
              key={comment.id}
              comment={{
                id: comment.id,
                post_id: comment.post_id,
                parent_id: comment.parent_id,
                name: comment.name,
                email: comment.email,
                content: comment.content,
                status: comment.status,
                created_at: comment.created_at,
                updated_at: comment.updated_at,
              }}
              replies={replies.map((r) => ({
                id: r.id,
                post_id: r.post_id,
                parent_id: r.parent_id,
                name: r.name,
                email: r.email,
                content: r.content,
                status: r.status,
                created_at: r.created_at,
                updated_at: r.updated_at,
              }))}
              myTokens={myTokens}
              onDelete={onDelete}
              onCommentCreated={onCommentCreated}
            />
          );
        })
      )}
    </div>
  );
}
