"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlogCard } from "@/components/ui/BlogCard";
import { SkeletonCard, SkeletonFeatured } from "@/components/ui/SkeletonCard";
import { useSettings } from "@/components/providers/SettingsProvider";
import type { Post } from "@/lib/types";

const ITEMS_PER_PAGE = 6;

export default function BlogPage() {
  const pageTitle = useSettings("blog_page_title", "From the Blog");
  const pageSubtitle = useSettings("blog_page_subtitle", "Thoughts on web development, system design, and AI.");
  const newsletterHeading = useSettings("newsletter_heading", "Stay in the Loop");
  const newsletterSubtitle = useSettings("newsletter_subtitle", "Get notified when I publish new articles on web development, system design, and AI.");

  const [posts, setPosts] = useState<Post[]>([]);
  const [featured, setFeatured] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subEmail, setSubEmail] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/posts");
        const { data } = await res.json();
        const allPosts: Post[] = data ?? [];
        const featuredPost = allPosts.find((p) => p.featured) ?? allPosts[0] ?? null;
        setPosts(allPosts);
        setFeatured(featuredPost);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, posts]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);

  function handleCategory(cat: string) {
    setActiveCategory(cat);
    setPage(1);
  }

  if (loading) {
    return (
      <>
        <Section padding="sm">
          <div className="flex flex-col gap-2 pt-4">
            <nav className="flex items-center gap-2 font-mono text-xs text-[#7A7A9A]">
              <span>Home</span>
              <span>&gt;</span>
              <span className="text-[#EEEEFF]">Blog</span>
            </nav>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
              From the Blog
            </h1>
            <p className="font-sans text-base text-[#7A7A9A]">
              Thoughts on web development, system design, and AI.
            </p>
          </div>
        </Section>
        <Section padding="sm">
          <SkeletonFeatured />
        </Section>
        <Section padding="sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="blog" />
            ))}
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section padding="sm">
        <div className="flex flex-col gap-2 pt-4">
          <nav className="flex items-center gap-2 font-mono text-xs text-[#7A7A9A]">
            <Link href="/" className="transition-colors hover:text-[#EEEEFF]">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-[#EEEEFF]">Blog</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            {pageTitle}
          </h1>
          <p className="font-sans text-base text-[#7A7A9A]">
            {pageSubtitle}
          </p>
        </div>
      </Section>

      {featured && (
        <Section padding="sm">
          <div className="flex flex-col overflow-hidden rounded-xl border border-[#2A2A38] bg-[#0F0F1A] md:flex-row">
            <div className="relative aspect-video md:w-1/2">
              {featured.image_url ? (
                <>
                  <Image
                    src={featured.image_url}
                    alt={featured.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="absolute left-3 top-3 z-10 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/90 px-3 py-0.5 font-mono text-[11px] font-medium text-white shadow-lg">
                    Featured
                  </span>
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20">
                  <span className="font-display text-4xl text-[#EEEEFF]/20 md:text-5xl">
                    Featured
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 p-6 md:w-1/2 md:p-8">
              <span className="w-fit rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-3 py-0.5 font-mono text-[11px] font-medium text-[#6C63FF]">
                {featured.category}
              </span>
              <h2 className="font-display text-2xl font-bold text-white">
                {featured.title}
              </h2>
              <p className="font-sans text-sm leading-relaxed text-[#7A7A9A]">
                {featured.excerpt}
              </p>
              <p className="font-mono text-sm text-[#7A7A9A]">
                {new Date(featured.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })} &middot; {featured.read_time} min read
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="flex items-center gap-1.5 font-sans text-sm font-medium text-[#6C63FF] transition-colors hover:text-[#00D4FF]"
              >
                Read Article <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Section>
      )}

      <Section padding="sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`rounded-lg px-4 py-2 font-sans text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-white"
                      : "border border-[#22223A] bg-transparent text-[#7A7A9A] hover:text-[#EEEEFF]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-auto">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A9A]"
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-[#2A2A38] bg-[#16162A] py-2 pl-10 pr-4 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none transition-all duration-200 focus:border-[#6C63FF] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.2)] md:w-64"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((article) => (
              <BlogCard
                key={article.id}
                image={article.image_url ?? "/images/placeholder.svg"}
                category={article.category}
                title={article.title}
                excerpt={article.excerpt}
                date={new Date(article.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                readTime={`${article.read_time} min read`}
                slug={article.slug}
              />
            ))}
          </div>

          {paginated.length === 0 && (
            <p className="py-12 text-center font-sans text-base text-[#7A7A9A]">
              No articles found.
            </p>
          )}

          {paginated.length < filtered.length && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-[#22223A] px-6 py-2 font-sans text-sm font-medium text-[#EEEEFF] transition-all duration-200 hover:bg-[rgba(108,99,255,0.06)]"
              >
                Load More Articles
              </button>
            </div>
          )}

          {paginated.length > 0 && filtered.length > 0 && (
            <p className="text-center font-mono text-xs text-[#7A7A9A]">
              Showing {paginated.length} of {filtered.length} articles
            </p>
          )}
        </div>
      </Section>

      <Section id="newsletter" darkBg>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            {newsletterHeading}
          </h2>
          <p className="font-sans text-base text-[#7A7A9A]">
            {newsletterSubtitle}
          </p>
          {subscribed ? (
            <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#6C63FF] to-[#00D4FF]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-sans text-sm font-medium text-green-500">
                You&apos;re subscribed! Check your inbox.
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubscribing(true);
                try {
                  const res = await fetch("/api/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: subEmail }),
                  });
                  const data = await res.json();
                  if (res.ok || res.status === 409) {
                    setSubscribed(true);
                  }
                } catch {
                  console.error("Subscribe failed");
                } finally {
                  setSubscribing(false);
                }
              }}
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none transition-all duration-200 focus:border-[#6C63FF] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.2)]"
              />
              <Button type="submit" size="md" disabled={subscribing}>
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
