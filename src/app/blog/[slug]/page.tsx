import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getPostBySlug, getPosts } from "@/lib/data";

export const revalidate = 3600;

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

  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-3xl px-4">
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
          <div className="flex items-center gap-4 font-mono text-sm text-[#7A7A9A]">
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

          <div className="mt-8 font-sans text-base leading-relaxed text-[#EEEEFF] whitespace-pre-wrap">
            {post.content}
          </div>
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
    </div>
  );
}
