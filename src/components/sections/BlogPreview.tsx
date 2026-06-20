import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";

const fallbackArticles = [
  {
    category: "Architecture",
    title: "Building a RAG Pipeline with LangChain",
    excerpt:
      "Complete guide to implementing retrieval-augmented generation from scratch.",
    date: "Jun 15",
    readTime: "8",
    href: "/blog/rag-pipeline-langchain",
  },
  {
    category: "System Design",
    title: "How to Design a URL Shortener",
    excerpt:
      "Handling 10M requests/day with proper scaling strategies.",
    date: "Jun 10",
    readTime: "6",
    href: "/blog/design-url-shortener",
  },
  {
    category: "Backend",
    title: "From Monolith to Microservices",
    excerpt:
      "Practical migration guide based on real-world experience.",
    date: "Jun 5",
    readTime: "10",
    href: "/blog/monolith-to-microservices",
  },
];

function BlogCard({
  category,
  title,
  excerpt,
  date,
  readTime,
  href,
  image,
}: {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  href: string;
  image?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-[#22223A] bg-[#0F0F1A] transition-all duration-300 ease-out hover:border-[#6C63FF] hover:shadow-md"
    >
      {image ? (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover brightness-100 transition-all duration-300 group-hover:brightness-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20">
          <span className="font-display text-lg text-[#EEEEFF]/20">{title.charAt(0)}</span>
        </div>
      )}
      <div className="flex flex-col gap-1.5 p-4">
        <span className="font-mono text-[10px] font-medium uppercase text-[#6C63FF]">
          {category}
        </span>
        <h3 className="font-display text-[16px] font-bold leading-snug text-white line-clamp-2">
          {title}
        </h3>
        <p className="font-sans text-[13px] leading-relaxed text-[#7A7A9A] line-clamp-3">
          {excerpt}
        </p>
        <div className="mt-1 border-t border-[#22223A] pt-2">
          <span className="font-mono text-[11px] text-[#7A7A9A]">
            {date} &middot; {readTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BlogPreview({ posts }: { posts?: Post[] }) {
  const items = posts?.length
    ? posts.map((p) => ({
        category: p.category,
        title: p.title,
        excerpt: p.excerpt,
        date: new Date(p.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        readTime: String(p.read_time),
        href: `/blog/${p.slug}`,
        image: p.image_url || undefined,
      }))
    : fallbackArticles;

  return (
    <section className="border-b border-[#22223A] bg-[#08080E] py-16 md:py-20">
      <div className="mx-auto max-w-[1100px] px-4">
        <div className="mb-[60px] flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
            From the Blog
          </h2>
          <p className="font-sans text-base text-[#7A7A9A]">
            Sharing what I&apos;ve learned.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <BlogCard key={article.title} {...article} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="group flex items-center gap-1.5 font-sans text-sm font-medium text-[#6C63FF] transition-colors hover:text-[#00D4FF]"
          >
            Read All Articles{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
