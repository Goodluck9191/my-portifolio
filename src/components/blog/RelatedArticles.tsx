import Link from "next/link";
import type { Post } from "@/lib/types";

export default function RelatedArticles({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#22223A] pt-10">
      <h2 className="font-display text-2xl font-bold text-white">Related Articles</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-lg border border-[#22223A] bg-[#0F0F1A] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#6C63FF]/50 hover:shadow-lg hover:shadow-[#6C63FF]/5"
          >
            <span className="inline-block rounded-full bg-[#6C63FF]/10 px-3 py-0.5 font-sans text-xs text-[#6C63FF]">
              {post.category}
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-[#EEEEFF] transition-colors group-hover:text-[#6C63FF]">
              {post.title}
            </h3>
            <p className="mt-2 font-sans text-sm text-[#7A7A9A] line-clamp-2">
              {post.excerpt}
            </p>
            <div className="mt-3 flex items-center gap-3 font-mono text-xs text-[#7A7A9A]">
              <span>{new Date(post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
              <span>&middot;</span>
              <span>{post.read_time} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
