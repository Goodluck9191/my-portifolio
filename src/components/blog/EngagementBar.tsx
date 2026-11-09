"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, HeartOff, MessageSquare, Share2 } from "lucide-react";
import { useVisitorId } from "./use-visitor-id";

interface EngagementBarProps {
  postId: string;
  postSlug: string;
  postTitle: string;
}

export default function EngagementBar({
  postId,
  postSlug,
  postTitle,
}: EngagementBarProps) {
  const visitorId = useVisitorId();
  const [likeCount, setLikeCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch like count and visitor's like state
  const fetchLikeState = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/blog/likes?post_id=${encodeURIComponent(postId)}&visitor_id=${encodeURIComponent(visitorId)}`,
        { headers: { "x-visitor-id": visitorId } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setLikeCount(data.data?.like_count ?? 0);
      setHasLiked(data.data?.has_liked ?? false);
    } catch {
      setLikeCount(0);
      setHasLiked(false);
    }
  }, [postId, visitorId]);

  // Fetch approved comment count
  const fetchCommentCount = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/blog/comments?post_id=${encodeURIComponent(postId)}`
      );
      if (!res.ok) return;
      const data = await res.json();
      setCommentCount(data.count ?? 0);
    } catch {
      setCommentCount(0);
    }
  }, [postId]);

  useEffect(() => {
    fetchLikeState();
    fetchCommentCount();
    setLoading(false);
  }, [fetchLikeState, fetchCommentCount]);

  const toggleLike = useCallback(async () => {
    const prevLikeCount = likeCount;
    const prevHasLiked = hasLiked;

    // Optimistic update
    setLikeCount(prevHasLiked ? likeCount - 1 : likeCount + 1);
    setHasLiked(!prevHasLiked);

    try {
      const res = await fetch("/api/blog/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, visitor_id: visitorId }),
      });

      if (!res.ok) {
        // Rollback on error
        setLikeCount(prevLikeCount);
        setHasLiked(prevHasLiked);
        return;
      }

      const data = await res.json();
      setLikeCount(data.data?.like_count ?? prevHasLiked ? likeCount - 1 : likeCount + 1);
      setHasLiked(data.data?.liked ?? !prevHasLiked);
    } catch {
      // Rollback on network error
      setLikeCount(prevLikeCount);
      setHasLiked(prevHasLiked);
    }
  }, [postId, visitorId, likeCount, hasLiked]);

  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-[#22223A] pt-8 mt-12"
    >
      {/* Like + comment engagement */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleLike}
          disabled={loading}
          aria-label={hasLiked ? "Unlike this post" : "Like this post"}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-sm font-medium transition-all duration-200 ${
            hasLiked
              ? "bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/30"
              : "border border-[#2A2A38] bg-transparent text-[#7A7A9A] hover:text-[#EEEEFF] hover:border-[#6C63FF]/40"
          }`}
        >
          {hasLiked ? (
            <Heart size={16} className="fill-[#6C63FF]" />
          ) : (
            <HeartOff size={16} className="text-[#7A7A9A]" />
          )}
          <span>{likeCount}</span>
        </button>

        <button
          aria-label="View comments"
          className="flex items-center gap-2 rounded-lg px-4 py-2 font-sans text-sm font-medium border border-[#2A2A38] bg-transparent text-[#7A7A9A] transition-colors hover:text-[#EEEEFF] hover:border-[#6C63FF]/40"
        >
          <MessageSquare size={16} />
          <span>{commentCount}</span>
        </button>
      </div>

      {/* Share */}
      <div className="flex items-center gap-2">
        <span className="font-sans text-xs text-[#7A7A9A]">Share:</span>
        <div className="flex items-center gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(`https://goodluckprosper.vercel.app/blog/${postSlug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16162A] text-[#7A7A9A] transition-all hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://goodluckprosper.vercel.app/blog/${postSlug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16162A] text-[#7A7A9A] transition-all hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: postTitle,
                  url: `https://goodluckprosper.vercel.app/blog/${postSlug}`,
                });
              } else {
                navigator.clipboard.writeText(`https://goodluckprosper.vercel.app/blog/${postSlug}`);
              }
            }}
            aria-label="Copy link"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16162A] text-[#7A7A9A] transition-all hover:bg-[#1A1A2E] hover:text-[#EEEEFF]"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
