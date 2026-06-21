import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, List } from "lucide-react";
import { getPostBySlug, getPosts } from "@/lib/data";

export const revalidate = 3600;

function parseHeadings(content: string) {
  const lines = content.split("\n");
  const headings: { level: number; text: string; id: string }[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      headings.push({ level, text, id });
    }
  }
  return headings;
}

function renderContentWithIds(content: string) {
  return content.split("\n").map((line) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return `<h${level + 2} id="${id}">${text}</h${level + 2}>`;
    }
    return line;
  }).join("\n");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const metaDescription =
    post.meta_description ||
    post.excerpt ||
    post.content.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title: post.title,
    description: metaDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: metaDescription,
      type: "article",
      publishedTime: post.created_at,
      authors: ["Goodluck Prosper"],
      tags: post.tags,
      images: post.image_url ? [{ url: post.image_url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: metaDescription,
      images: post.image_url ? [post.image_url] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const headings = parseHeadings(post.content);
  const metaDescription =
    post.meta_description || post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: metaDescription,
    image: post.image_url,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: "Goodluck Prosper",
    },
    publisher: {
      "@type": "Person",
      name: "Goodluck Prosper",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://goodluckprosper.vercel.app/blog/${post.slug}`,
    },
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `${post.read_time}M`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <style>{`
        .blog-content h3 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; color: #EEEEFF; font-family: var(--font-display); }
        .blog-content h4 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #EEEEFF; font-family: var(--font-display); }
        .blog-content h5 { font-size: 1.125rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #EEEEFF; font-family: var(--font-display); }
        .blog-content h3:target, .blog-content h4:target, .blog-content h5:target { scroll-margin-top: 6rem; }
      `}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 lg:flex lg:gap-10">
          <article className="min-w-0 max-w-3xl flex-1">
            <Link
              href="/blog"
              className="mb-8 flex items-center gap-1.5 font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <div className="flex flex-col gap-3 mb-8">
              <span className="w-fit rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-3 py-0.5 font-mono text-[11px] font-medium text-[#6C63FF]">
                {post.category}
              </span>
              <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-[#7A7A9A]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {post.read_time} min read
                </span>
              </div>
            </div>

            {post.image_url && (
              <div className="relative mb-10 aspect-video overflow-hidden rounded-xl border border-[#2A2A38]">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <p className="font-sans text-lg leading-relaxed text-[#7A7A9A] border-l-4 border-[#6C63FF] pl-4 italic">
                {post.excerpt}
              </p>

              {headings.length > 0 && (
                <div className="mt-8 mb-8 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-4 lg:hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <List size={14} className="text-[#6C63FF]" />
                    <span className="font-mono text-[11px] font-medium uppercase text-[#6C63FF]">
                      Table of Contents
                    </span>
                  </div>
                  <nav className="flex flex-col gap-1.5">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF] ${
                          h.level === 2 ? "pl-0" : h.level === 3 ? "pl-4" : "pl-8"
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              <div
                className="mt-8 font-sans text-base leading-relaxed text-[#EEEEFF] whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: renderContentWithIds(post.content) }}
              />
            </div>

            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#22223A]">
                <p className="mb-3 font-mono text-[11px] font-medium uppercase text-[#7A7A9A]">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[#2A2A38] bg-[#1A1A2E] px-3 py-1.5 font-mono text-xs text-[#7A7A9A]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>

          {headings.length > 0 && (
            <aside className="hidden lg:block lg:w-64 lg:shrink-0">
              <div className="sticky top-24 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <List size={14} className="text-[#6C63FF]" />
                  <span className="font-mono text-[11px] font-medium uppercase text-[#6C63FF]">
                    On this page
                  </span>
                </div>
                <nav className="flex flex-col gap-1.5">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF] ${
                        h.level === 2 ? "pl-0" : h.level === 3 ? "pl-4" : "pl-8"
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
