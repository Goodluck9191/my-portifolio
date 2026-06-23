import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPosts, getPostsByCategory } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { BlogCard } from "@/components/ui/BlogCard";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} Articles — Goodluck Prosper`,
    description: `Browse all articles about ${name}. Tutorials, guides, and insights on ${name.toLowerCase()}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = category.replace(/-/g, " ");
  const posts = await getPostsByCategory(decodedCategory);

  if (posts.length === 0) notFound();

  const name = decodedCategory.replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Section padding="sm">
      <div className="flex flex-col gap-4 pt-4">
        <Link
          href="/blog"
          className="flex items-center gap-1.5 font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
          {name}
        </h1>
        <p className="font-sans text-base text-[#7A7A9A]">
          Browse all articles about {name.toLowerCase()}.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
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
    </Section>
  );
}
