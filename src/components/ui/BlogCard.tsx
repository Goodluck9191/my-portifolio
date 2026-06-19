import Link from "next/link";

interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  slug: string;
  href?: string;
}

export function BlogCard({
  image,
  category,
  title,
  excerpt,
  date,
  readTime,
  slug,
  href,
}: BlogCardProps) {
  const linkHref = href ?? `/blog/${slug}`;

  return (
    <Link
      href={linkHref}
      className="group block overflow-hidden rounded-lg border border-[#2A2A38] bg-[#0F0F1A] transition-all duration-300 ease-out hover:translate-y-[-4px] hover:border-[#6C63FF] hover:shadow-md hover:shadow-[#6C63FF]/10"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={title}
          className="aspect-video w-full object-cover brightness-100 transition-all duration-300 group-hover:brightness-110"
        />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <span className="w-fit rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-3 py-0.5 font-mono text-[11px] font-medium text-[#6C63FF]">
          {category}
        </span>

        <h3 className="font-display text-[20px] font-semibold leading-snug text-white line-clamp-2">
          {title}
        </h3>

        <p className="font-sans text-sm leading-relaxed text-[#7A7A9A] line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-1 border-t border-[#2A2A38] pt-3">
          <p className="font-mono text-sm text-[#7A7A9A]">
            {date} &middot; {readTime}
          </p>
        </div>
      </div>
    </Link>
  );
}
