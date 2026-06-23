import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { getPostBySlug, getPosts, getRelatedPosts } from "@/lib/data";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedArticles from "@/components/blog/RelatedArticles";
import AuthorCard from "@/components/blog/AuthorCard";
import ShareButtons from "@/components/blog/ShareButtons";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BackToTop from "@/components/blog/BackToTop";
import ViewTracker from "./ViewTracker";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = "https://goodluckprosper.vercel.app";
  const metaTitle = post.meta_title || post.title;
  const metaDescription =
    post.meta_description || post.og_description || post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160);
  const canonical = post.canonical_url || `/blog/${post.slug}`;
  const ogImage = post.og_image || post.image_url || "/api/og?title=" + encodeURIComponent(post.title) + "&category=" + encodeURIComponent(post.category);
  const twImage = post.twitter_image || post.og_image || post.image_url || "/logo.svg";

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical },
    openGraph: {
      title: post.og_title || metaTitle,
      description: post.og_description || metaDescription,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: ["Goodluck Prosper"],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.og_title || metaTitle,
      description: post.og_description || metaDescription,
      images: [twImage],
    },
    keywords: post.focus_keyword || post.tags.join(", "),
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

  const relatedPosts = await getRelatedPosts(slug, post.tags, post.category, 3);

  const headings = parseHeadings(post.content);
  const metaDescription =
    post.meta_description || post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 160);

  const siteUrl = "https://goodluckprosper.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Blog", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 2, name: post.title, item: `${siteUrl}/blog/${post.slug}` },
        ],
      },
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: metaDescription,
        image: post.image_url,
        datePublished: post.created_at,
        dateModified: post.updated_at,
        author: { "@type": "Person", name: "Goodluck Prosper", url: siteUrl },
        publisher: { "@type": "Person", name: "Goodluck Prosper" },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
        wordCount: post.content.split(/\s+/).length,
        timeRequired: `${post.read_time}M`,
        keywords: post.tags.join(", "),
      },
    ],
  };

  function CodeBlock({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) {
    const match = /language-(\w+)/.exec(className ?? "");
    const code = String(children).replace(/\n$/, "");
    return (
      <div className="group relative my-6 overflow-hidden rounded-lg border border-[#22223A] bg-[#0F0F1A]">
        {match && (
          <div className="flex items-center justify-between border-b border-[#22223A] px-4 py-1.5">
            <span className="font-mono text-[11px] text-[#7A7A9A]">{match[1]}</span>
          </div>
        )}
        <div className="overflow-x-auto">
          <div className="relative">
            <pre className="!m-0 !rounded-none !border-0 !bg-transparent !p-4">
              <code className={`${className ?? ""} !bg-transparent !p-0 text-sm leading-relaxed`} {...props}>
                {code}
              </code>
            </pre>
            <CopyButton code={code} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ViewTracker slug={slug} />
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 lg:flex lg:gap-10">
          <article className="min-w-0 flex-1 lg:max-w-[780px]">
            <Link
              href="/blog"
              className="mb-8 flex items-center gap-1.5 font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            <div className="mb-8 flex flex-col gap-3">
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
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {post.read_time} min read
                </span>
              </div>
              <ShareButtons title={post.title} slug={post.slug} />
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

            <p className="border-l-4 border-[#6C63FF] pl-4 font-sans text-lg italic leading-relaxed text-[#7A7A9A]">
              {post.excerpt}
            </p>

            <div className="mt-6 lg:hidden">
              <TableOfContents headings={headings} />
            </div>

            <div className="blog-content mt-10">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug]}
                components={{
                  a: ({ href, children, ...props }) => {
                    const isExternal = href?.startsWith("http") && !href?.includes("goodluckprosper.vercel.app");
                    return (
                      <a
                        href={href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="text-[#6C63FF] underline decoration-[#6C63FF]/30 transition-colors hover:decoration-[#6C63FF]"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  img: ({ src, alt, ...props }) => (
                    <figure className="my-8">
                      <img
                        src={src}
                        alt={alt ?? ""}
                        loading="lazy"
                        className="w-full rounded-lg border border-[#22223A] object-cover"
                        {...props}
                      />
                      {alt && (
                        <figcaption className="mt-2 text-center font-sans text-sm text-[#7A7A9A]">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  ),
                  code: CodeBlock,
                  p: ({ children }) => (
                    <p className="my-5 font-sans text-base leading-[1.8] text-[#EEEEFF]">
                      {children}
                    </p>
                  ),
                  h2: ({ children, id }) => (
                    <h2 id={id} className="mt-10 mb-4 scroll-mt-24 font-display text-2xl font-bold text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children, id }) => (
                    <h3 id={id} className="mt-8 mb-3 scroll-mt-24 font-display text-xl font-semibold text-white">
                      {children}
                    </h3>
                  ),
                  h4: ({ children, id }) => (
                    <h4 id={id} className="mt-6 mb-2 scroll-mt-24 font-display text-lg font-semibold text-white">
                      {children}
                    </h4>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 list-disc space-y-1.5 pl-6 font-sans text-base leading-relaxed text-[#EEEEFF]">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-4 list-decimal space-y-1.5 pl-6 font-sans text-base leading-relaxed text-[#EEEEFF]">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[#EEEEFF]">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-6 border-l-4 border-[#6C63FF] bg-[#0F0F1A] py-3 pl-4 font-sans text-base italic leading-relaxed text-[#7A7A9A]">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-10 border-[#22223A]" />,
                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                  em: ({ children }) => <em className="italic text-[#EEEEFF]">{children}</em>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {post.tags.length > 0 && (
              <div className="mt-12 border-t border-[#22223A] pt-8">
                <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-wider text-[#7A7A9A]">Tags</p>
                <div className="flex flex-wrap gap-2.5">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${encodeURIComponent(tag.toLowerCase())}`}
                      className="group relative rounded-full border border-[#2A2A38] bg-[#0F0F1A] px-4 py-1.5 font-sans text-xs font-medium text-[#7A7A9A] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6C63FF]/40 hover:text-[#EEEEFF] hover:shadow-[0_0_12px_rgba(108,99,255,0.15)]"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <AuthorCard />
            <RelatedArticles posts={relatedPosts} />
          </article>

          {headings.length > 0 && (
            <aside className="hidden lg:block lg:w-64 lg:shrink-0">
              <div className="sticky top-24">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>
      </div>
      <BackToTop />
    </>
  );
}

function CopyButton({ code }: { code: string }) {
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          const el = document.createElement("textarea");
          el.value = code;
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          document.body.removeChild(el);
        }
      }}
      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-[#22223A] text-[#7A7A9A] opacity-0 transition-all hover:bg-[#2A2A38] hover:text-[#EEEEFF] group-hover:opacity-100"
      aria-label="Copy code"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  );
}
