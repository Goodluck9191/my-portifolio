"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { SystemDesignShowcase } from "@/components/sections/SystemDesignShowcase";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { ContactCTA } from "@/components/sections/ContactCTA";

const techStack = [
  "React", "Next.js", "Node.js", "Express", "Python",
  "Tailwind", "TypeScript", "PostgreSQL", "MongoDB",
  "Vercel", "Git", "REST APIs",
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = performance.now();
          const duration = 1400;

          function animate(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <section className="mx-auto flex min-h-screen max-w-[1100px] flex-col justify-center px-4 pt-16">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 font-sans text-sm text-green-500">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Available for Freelance &amp; Full-Time
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
          I Build Websites
          <br />
          <span className="text-[#7A7A9A]">Clients Are Proud Of.</span>
        </h1>

        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-[#7A7A9A] sm:text-lg">
          Full stack developer specializing in React, Next.js &amp; Node.js.
          I turn your ideas into fast, modern, professional websites.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
          >
            See My Work
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-[#22223A] bg-transparent px-6 py-3 font-sans text-sm font-semibold text-white transition-all duration-200 hover:border-[#6C63FF] hover:bg-[rgba(108,99,255,0.06)]"
          >
            Let&apos;s Talk
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
              <span key={i} className="inline-flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6C63FF]" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <AboutPreview />
      <FeaturedProjects />
      <SystemDesignShowcase />
      <BlogPreview />
      <ContactCTA />
    </>
  );
}
