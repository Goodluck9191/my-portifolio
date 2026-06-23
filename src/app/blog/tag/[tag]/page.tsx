import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { getPosts } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { BlogCard } from "@/components/ui/BlogCard";

export const revalidate = 3600;

const ITEMS_PER_PAGE = 9;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = tag.replace(/\b\w/g, (c) => c.toUpperCase());
  const tagLower = tag.toLowerCase();
  return {
    title: `${name} Articles | Goodluck Prosper`,
    description: `Explore ${name.toLowerCase()} articles covering architecture, system design, programming, and modern development practices.`,
    alternates: {
      canonical: `https://goodluckprosper.vercel.app/blog/tag/${tagLower}`,
    },
    openGraph: {
      title: `${name} Articles | Goodluck Prosper`,
      description: `Explore ${name.toLowerCase()} articles covering architecture, system design, programming, and modern development practices.`,
      url: `https://goodluckprosper.vercel.app/blog/tag/${tagLower}`,
      type: "website",
    },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ tag }, { page }] = await Promise.all([params, searchParams]);
  const allPosts = await getPosts();
  const decodedTag = tag.toLowerCase();
  const posts = allPosts.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === decodedTag)
  );

  const name = decodedTag.replace(/\b\w/g, (c) => c.toUpperCase());
  const currentPage = Math.max(1, Number(page) || 1);
  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${name} Articles`,
            description: `Articles tagged with ${name}`,
            url: `https://goodluckprosper.vercel.app/blog/tag/${tag}`,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Blog", item: "https://goodluckprosper.vercel.app/blog" },
                { "@type": "ListItem", position: 2, name: name, item: `https://goodluckprosper.vercel.app/blog/tag/${tag}` },
              ],
            },
          }),
        }}
      />
      <Section padding="sm">
        <div className="flex flex-col gap-4 pt-4">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
              #{name}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6C63FF]/20 bg-[#6C63FF]/10 px-3 py-1 font-sans text-sm text-[#6C63FF]">
              <BookOpen size={14} />
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>
          <p className="font-sans text-base text-[#7A7A9A]">
            Browse all articles tagged with {name}.
          </p>
        </div>
        {posts.length > 0 ? (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  image={post.image_url ?? ""}
                  category={post.category}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                  readTime={`${post.read_time} min read`}
                  slug={post.slug}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                {currentPage > 1 && (
                  <Link
                    href={`/blog/tag/${tag}?page=${currentPage - 1}`}
                    className="rounded-lg border border-[#2A2A38] px-4 py-2 font-sans text-sm text-[#7A7A9A] transition-colors hover:border-[#6C63FF]/50 hover:text-[#EEEEFF]"
                  >
                    Previous
                  </Link>
                )}
                <span className="font-sans text-sm text-[#7A7A9A]">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/blog/tag/${tag}?page=${currentPage + 1}`}
                    className="rounded-lg border border-[#2A2A38] px-4 py-2 font-sans text-sm text-[#7A7A9A] transition-colors hover:border-[#6C63FF]/50 hover:text-[#EEEEFF]"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6C63FF]/10">
              <Search size={28} className="text-[#6C63FF]" />
            </div>
            <div>
              <p className="font-sans text-lg text-[#EEEEFF]">
                No articles have been published under this tag yet.
              </p>
              <p className="mt-1 font-sans text-sm text-[#7A7A9A]">
                Check back later or browse all articles.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-6 py-3 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Browse All Articles
            </Link>
          </div>
        )}
      </Section>
    </>
  );
}
