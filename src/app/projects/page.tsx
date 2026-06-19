"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import type { Project } from "@/lib/types";

const categories = ["All", "Client Websites", "Web Apps", "Automation"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featured, setFeatured] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, featuredRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/projects?featured=true"),
        ]);
        const projectsData = await projectsRes.json();
        const featuredData = await featuredRes.json();
        setProjects(projectsData.data ?? []);
        if (featuredData.data?.length) {
          setFeatured(featuredData.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  if (loading) {
    return (
      <Section padding="sm">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6C63FF] border-t-transparent" />
        </div>
      </Section>
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
            Selected Work
          </h1>
          <p className="font-sans text-base text-[#7A7A9A]">
            A selection of recent projects I&apos;ve built for clients.
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
                      className="rounded-md border border-[#2A2A38] bg-[#1A1A2E] px-2.5 py-1 font-mono text-[11px] text-[#7A7A9A]"
                    >
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
                      Live Demo &nearr;
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
          <div className="mt-2">
            <Link href="/resume.pdf" target="_blank">
              <Button variant="secondary" size="md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                View Full Resum&eacute;
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
