"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/posts/view?slug=${slug}`, { method: "POST" }).catch(() => {});
  }, [slug]);
  return null;
}
