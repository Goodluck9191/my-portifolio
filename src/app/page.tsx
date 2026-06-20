import { Suspense } from "react";
import Link from "next/link";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { TechStackIcon } from "@/components/ui/TechStackIcon";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { SystemDesignShowcase } from "@/components/sections/SystemDesignShowcase";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { getProjects, getPosts, getAllSettings } from "@/lib/data";

export const revalidate = 3600;

console.log("HOME RENDER");

const techStack = [
  "React", "Next.js", "Node.js", "Express", "Python",
  "Tailwind", "TypeScript", "PostgreSQL", "MongoDB",
  "Vercel", "Git", "REST APIs",
];

async function FeaturedProjectsWrapper() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  return <FeaturedProjects projects={featured} />;
}

async function BlogPreviewWrapper() {
  const posts = await getPosts();
  const published = posts.filter((p) => p.published).slice(0, 3);
  return <BlogPreview posts={published} />;
}

function FeaturedProjectsSkeleton() {
  return (
    <section className="border-b border-[#22223A] bg-[#08080E] py-16 md:py-20">
      <div className="mx-auto max-w-[1100px] px-4">
        <div className="mb-[60px] flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
            Selected Work
          </h2>
          <p className="font-sans text-base text-[#7A7A9A]">
            Projects I&apos;m proud to have shipped.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} variant="project" />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreviewSkeleton() {
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
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} variant="blog" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const settings = await getAllSettings().catch(() => ({} as Record<string, string>));

  const heroHeading = settings.hero_heading ?? "I Build Web Applications That";
  const heroHeadingMuted = settings.hero_heading_muted ?? "Clients Are Proud Of.";
  const heroSubtitle = settings.hero_subtitle ?? "Full stack developer specializing in React, Next.js & Node.js. I turn your ideas into fast, modern, professional websites.";
  const availabilityText = settings.availability_text ?? "Available for Freelance & Full-Time";
  const ctaPrimary = settings.hero_cta_primary_label ?? "See My Work";
  const ctaSecondary = settings.hero_cta_secondary_label ?? "Let's Talk";

  return (
    <>
      <section className="mx-auto flex min-h-screen max-w-[1100px] flex-col justify-center px-4 pt-16">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 font-sans text-sm text-green-500">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          {availabilityText}
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          {heroHeading}
          <br />
          <span className="text-[#7A7A9A]">{heroHeadingMuted}</span>
        </h1>

        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-[#7A7A9A] sm:text-lg">
          {heroSubtitle}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
          >
            {ctaPrimary}
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-[#22223A] bg-transparent px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:border-[#6C63FF] hover:bg-[rgba(108,99,255,0.06)]"
          >
            {ctaSecondary}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-[#22223A] pt-8">
          <div>
            <p className="font-display text-3xl font-bold text-white">
              <AnimatedCounter target={10} suffix="+" />
            </p>
            <p className="mt-1 font-sans text-sm text-[#7A7A9A]">Projects Delivered</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-white">
              <AnimatedCounter target={3} />
            </p>
            <p className="mt-1 font-sans text-sm text-[#7A7A9A]">Years Experience</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-white">
              <AnimatedCounter target={100} suffix="%" />
            </p>
            <p className="mt-1 font-sans text-sm text-[#7A7A9A]">Client Satisfaction</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#22223A] bg-[#0F0F1A] py-5">
        <div className="mx-auto max-w-[1100px] overflow-hidden">
          <div className="flex animate-[scroll_28s_linear_infinite] gap-12 whitespace-nowrap font-mono text-[13px] text-[#7A7A9A]">
            {[...techStack, ...techStack].map((tech, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <TechStackIcon name={tech} size={14} />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <AboutPreview />
      <Suspense fallback={<FeaturedProjectsSkeleton />}>
        <FeaturedProjectsWrapper />
      </Suspense>
      <SystemDesignShowcase />
      <Suspense fallback={<BlogPreviewSkeleton />}>
        <BlogPreviewWrapper />
      </Suspense>
      <ContactCTA />
    </>
  );
}
