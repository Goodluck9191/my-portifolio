"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlogCard } from "@/components/ui/BlogCard";

const categories = ["All", "AI", "Architecture", "Backend", "Cloud"];

const allArticles = [
  {
    image: "/images/placeholder.svg",
    category: "AI",
    title: "Building AI-Powered Features with LLM APIs",
    excerpt: "A practical walkthrough on integrating GPT and other LLMs into your web application — from prompt engineering to cost optimization.",
    date: "Mar 2026",
    readTime: "7 min read",
    slug: "ai-powered-features-llm",
  },
  {
    image: "/images/placeholder.svg",
    category: "Architecture",
    title: "Scaling Web Apps with Microservices",
    excerpt: "Breaking monoliths into manageable services, handling service discovery, and managing inter-service communication at scale.",
    date: "Feb 2026",
    readTime: "8 min read",
    slug: "scaling-microservices",
  },
  {
    image: "/images/placeholder.svg",
    category: "Backend",
    title: "Database Optimization at Scale",
    excerpt: "Indexing strategies, query optimization, and connection pooling for handling millions of requests per day.",
    date: "Jan 2026",
    readTime: "6 min read",
    slug: "database-optimization",
  },
  {
    image: "/images/placeholder.svg",
    category: "Cloud",
    title: "CI/CD Pipelines for Solo Devs",
    excerpt: "How to set up production-grade CI/CD pipelines even when you're a team of one. Automate testing, building, and deployment.",
    date: "Dec 2025",
    readTime: "5 min read",
    slug: "cicd-solo-devs",
  },
  {
    image: "/images/placeholder.svg",
    category: "Architecture",
    title: "API Gateway Patterns Compared",
    excerpt: "A comparison of gateway strategies — reverse proxy, BFF, and GraphQL federation — and when to use each.",
    date: "Nov 2025",
    readTime: "7 min read",
    slug: "api-gateway-patterns",
  },
  {
    image: "/images/placeholder.svg",
    category: "Backend",
    title: "Message Queues vs Event Streams",
    excerpt: "Understanding the difference between RabbitMQ-style queues and Kafka-style event streams for async architecture.",
    date: "Oct 2025",
    readTime: "6 min read",
    slug: "queues-vs-streams",
  },
  {
    image: "/images/placeholder.svg",
    category: "Cloud",
    title: "Securing Your Web Application",
    excerpt: "Essential security practices — rate limiting, input validation, CORS policies, and authentication best practices.",
    date: "Sep 2025",
    readTime: "9 min read",
    slug: "web-security-essentials",
  },
  {
    image: "/images/placeholder.svg",
    category: "AI",
    title: "Prompt Engineering for Developers",
    excerpt: "How to write effective prompts that produce reliable, production-ready outputs from large language models.",
    date: "Aug 2025",
    readTime: "5 min read",
    slug: "prompt-engineering-devs",
  },
  {
    image: "/images/placeholder.svg",
    category: "Backend",
    title: "Building Resilient REST APIs",
    excerpt: "Error handling, retry logic, rate limiting, and idempotency — patterns that make APIs robust in production.",
    date: "Jul 2025",
    readTime: "6 min read",
    slug: "resilient-rest-apis",
  },
  {
    image: "/images/placeholder.svg",
    category: "Architecture",
    title: "State Management in Modern Web Apps",
    excerpt: "When to use Context, Zustand, Redux, or server state — a decision framework for frontend state management.",
    date: "Jun 2025",
    readTime: "7 min read",
    slug: "state-management-modern-web",
  },
  {
    image: "/images/placeholder.svg",
    category: "AI",
    title: "Automating Workflows with Python",
    excerpt: "Building automation scripts that save hours each week — file processing, data extraction, and API orchestration.",
    date: "May 2025",
    readTime: "4 min read",
    slug: "automating-workflows-python",
  },
  {
    image: "/images/placeholder.svg",
    category: "Cloud",
    title: "Zero-Downtime Deployments on a Budget",
    excerpt: "How to achieve zero-downtime deployments using free-tier services and smart CI/CD orchestration.",
    date: "Apr 2025",
    readTime: "5 min read",
    slug: "zero-downtime-deployments",
  },
];

const ITEMS_PER_PAGE = 6;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [subscribed, setSubscribed] = useState(false);

  const featured = allArticles[0];
  const restArticles = allArticles.slice(1);

  const filtered = useMemo(() => {
    return restArticles.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);

  function handleCategory(cat: string) {
    setActiveCategory(cat);
    setPage(1);
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
            From the Blog
          </h1>
          <p className="font-sans text-base text-[#7A7A9A]">
            Thoughts on web development, system design, and AI.
          </p>
        </div>
      </Section>

      <Section padding="sm">
        <div className="flex flex-col overflow-hidden rounded-xl border border-[#2A2A38] bg-[#0F0F1A] md:flex-row">
          <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20 md:w-1/2">
            <span className="font-display text-4xl text-[#EEEEFF]/20 md:text-5xl">
              Featured
            </span>
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
              {featured.date} &middot; {featured.readTime}
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
                key={article.slug}
                href={`/blog/${article.slug}`}
                {...article}
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
            Stay in the Loop
          </h2>
          <p className="font-sans text-base text-[#7A7A9A]">
            Get notified when I publish new articles on web development, system design, and AI.
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
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="flex-1 rounded-lg border border-[#2A2A38] bg-[#16162A] px-4 py-3 font-sans text-sm text-[#EEEEFF] placeholder-[#7A7A9A] outline-none transition-all duration-200 focus:border-[#6C63FF] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.2)]"
              />
              <Button type="submit" size="md">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
