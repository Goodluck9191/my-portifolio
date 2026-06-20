"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SkeletonCard, SkeletonFeatured } from "@/components/ui/SkeletonCard";
import { TechStackIcon } from "@/components/ui/TechStackIcon";
import { useSettings } from "@/components/providers/SettingsProvider";
import type { Project } from "@/lib/types";



export default function ProjectsPage() {
  const pageTitle = useSettings("projects_page_title", "Selected Work");
  const pageSubtitle = useSettings("projects_page_subtitle", "A selection of recent projects I've built for clients.");

  const [projects, setProjects] = useState<Project[]>([]);
  const [featured, setFeatured] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/projects");
        const { data } = await res.json();
        const allProjects: Project[] = data ?? [];
        const featuredProject = allProjects.find((p) => p.featured) ?? null;
        setProjects(allProjects);
        setFeatured(featuredProject);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  if (loading) {
    return (
      <>
        <Section padding="sm">
          <div className="flex flex-col gap-2 pt-4">
            <nav className="flex items-center gap-2 font-mono text-xs text-[#7A7A9A]">
              <span>Home</span>
              <span>&gt;</span>
              <span className="text-[#EEEEFF]">Projects</span>
            </nav>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
              Projects
            </h1>
            <p className="font-sans text-base text-[#7A7A9A]">
              Real-world applications and architectural work.
            </p>
          </div>
        </Section>
        <Section padding="sm">
          <SkeletonFeatured />
        </Section>
        <Section padding="sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="project" />
            ))}
          </div>
        </Section>
      </>
    );
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
            <span className="text-[#EEEEFF]">Projects</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            {pageTitle}
          </h1>
          <p className="font-sans text-base text-[#7A7A9A]">
            {pageSubtitle}
          </p>
        </div>
      </Section>

      <Section padding="sm">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`rounded-lg px-4 py-2 font-sans text-sm font-medium transition-all duration-200 ${
                activeFilter === cat
                  ? "bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] text-white"
                  : "border border-[#22223A] bg-transparent text-[#7A7A9A] hover:text-[#EEEEFF]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </Section>

      <Section padding="sm">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              image={project.image_url ?? "/images/placeholder.svg"}
              category={project.category}
              title={project.title}
              description={project.description}
              techStack={project.tech_stack}
              caseStudyUrl={`/projects/${project.slug}`}
              githubUrl={project.github_url ?? undefined}
              demoUrl={project.demo_url ?? undefined}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center font-sans text-base text-[#7A7A9A]">
            No projects found in this category.
          </p>
        )}
      </Section>

      {featured && (
        <Section>
          <div className="flex flex-col gap-10">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Featured Project
            </h2>
            <div className="flex flex-col overflow-hidden rounded-xl border border-[#2A2A38] bg-[#0F0F1A] md:flex-row">
              <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20 md:w-1/2">
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-5xl text-[#EEEEFF]/20">
                    {featured.title.slice(0, 9)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 md:w-1/2 md:p-8">
                <span className="w-fit rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-3 py-0.5 font-mono text-[11px] font-medium text-[#6C63FF]">
                  {featured.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  {featured.title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-[#7A7A9A]">
                  {featured.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {featured.tech_stack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#2A2A38] bg-[#1A1A2E] px-2.5 py-1 font-mono text-[11px] text-[#7A7A9A] transition-all duration-200 hover:border-[#6C63FF]"
                    >
                      <TechStackIcon name={tech} size={12} />
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <Link href={`/projects/${featured.slug}`}>
                    <Button size="sm">View Case Study</Button>
                  </Link>
                  {featured.demo_url && (
                    <a
                      href={featured.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
                    >
                      Live Demo ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section darkBg>
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Have more questions about a project?
          </h2>
          <p className="font-sans text-base text-[#7A7A9A]">
            I&apos;m happy to walk you through the details, share more screenshots, or discuss a similar project for you.
          </p>
        </div>
      </Section>
    </>
  );
}
