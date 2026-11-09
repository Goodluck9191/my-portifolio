"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import CommentForm from "./CommentForm";
import { Reply, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface CommentItemProps {
  comment: {
    id: string;
    post_id: string;
    parent_id: string | null;
    name: string;
    email: string;
    content: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  replies: CommentItemProps["comment"][];
  isNested?: boolean;
  myTokens?: Record<string, string>;
  onDelete?: (commentId: string, deleteToken: string) => void;
  onCommentCreated?: (created: { id: string; delete_token: string }) => void;
}

export default function CommentItem({
  comment,
  replies,
  isNested = false,
  myTokens = {},
  onDelete,
  onCommentCreated,
}: CommentItemProps) {
  const [replying, setReplying] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const deleteToken = myTokens[comment.id];
  const canDelete = !!deleteToken && !!onDelete;

  const handleDelete = () => {
    if (deleteToken && onDelete) {
      onDelete(comment.id, deleteToken);
    }
    setConfirmDelete(false);
  };

  return (
    <div
      className={`
        flex flex-col gap-3
        ${isNested ? "ml-8 pl-4 border-l border-[#22223A]" : "mb-6"}
      `}
    >
      <div className="flex flex-col gap-2 rounded-lg border border-[#22223A] bg-[#0F0F1A] p-4 md:p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-sans text-sm font-semibold text-[#EEEEFF]">
            {comment.name}
          </span>
          <span className="font-mono text-[11px] text-[#7A7A9A]">
            {formatDate(comment.created_at)}
          </span>
          {canDelete && (
            <span className="ml-auto font-mono text-[10px] text-[#6C63FF] border border-[#6C63FF]/30 rounded px-1.5 py-0.5">
              Your comment
            </span>
          )}
        </div>
        <p className="font-sans text-sm leading-relaxed text-[#EEEEFF] whitespace-pre-wrap">
          {comment.content}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReplying(!replying)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs text-[#6C63FF] transition-colors hover:bg-[#6C63FF]/10"
          >
            <Reply size={14} /> Reply
          </button>
          {canDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs text-red-400 transition-colors hover:bg-red-500/10"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>

      {replying && (
        <CommentForm
          postId={comment.post_id}
          parentId={comment.id}
          isReply
          onSuccess={(created) => {
            setReplying(false);
            onCommentCreated?.(created);
          }}
        />
      )}

      {replies.length > 0 && (
        <div className="mt-3">
          {replies.map((reply) => {
            const childReplies: CommentItemProps["comment"][] = [];
            return (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={childReplies}
                isNested
                myTokens={myTokens}
                onDelete={onDelete}
                onCommentCreated={onCommentCreated}
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Comment"
        message="Are you sure you want to delete your comment? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
