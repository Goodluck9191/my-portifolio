"use client";

import { useState } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";

const categories = ["All", "Client Websites", "Web Apps", "Automation"];

const projects = [
  {
    image: "/images/placeholder.svg",
    category: "Client Websites",
    title: "Coastal Dental Clinic",
    description: "Professional website for a dental clinic with online booking, service pages, and patient resources.",
    techStack: ["Next.js", "Tailwind CSS", "Node.js", "PostgreSQL"],
    caseStudyUrl: "/projects/coastal-dental",
    demoUrl: "https://coastaldental.example.com",
  },
  {
    image: "/images/placeholder.svg",
    category: "Client Websites",
    title: "Brew & Bean Café",
    description: "Brand website for a local café featuring menu display, location info, and a photo gallery.",
    techStack: ["React", "Tailwind CSS", "Express"],
    caseStudyUrl: "/projects/brew-bean",
    demoUrl: "https://brewbean.example.com",
  },
  {
    image: "/images/placeholder.svg",
    category: "Web Apps",
    title: "TaskFlow",
    description: "Project management dashboard with real-time collaboration, drag-and-drop boards, and team features.",
    techStack: ["Next.js", "Tailwind CSS", "Node.js", "WebSocket"],
    caseStudyUrl: "/projects/taskflow",
    githubUrl: "https://github.com",
    demoUrl: "https://taskflow.example.com",
  },
  {
    image: "/images/placeholder.svg",
    category: "Web Apps",
    title: "InvoicePro",
    description: "Invoice generation and tracking app for freelancers. Create, send, and manage invoices with payment tracking.",
    techStack: ["React", "Express", "MongoDB", "Stripe"],
    caseStudyUrl: "/projects/invoicepro",
    githubUrl: "https://github.com",
    demoUrl: "https://invoicepro.example.com",
  },
  {
    image: "/images/placeholder.svg",
    category: "Client Websites",
    title: "FitZone Gym",
    description: "Modern landing page and membership system for a local gym with class schedules and online signups.",
    techStack: ["Next.js", "Tailwind CSS", "Node.js"],
    caseStudyUrl: "/projects/fitzone",
    demoUrl: "https://fitzone.example.com",
  },
  {
    image: "/images/placeholder.svg",
    category: "Automation",
    title: "Social Scheduler",
    description: "Automated social media posting tool that schedules, publishes, and analyzes posts across platforms.",
    techStack: ["Python", "React", "PostgreSQL", "Celery"],
    caseStudyUrl: "/projects/social-scheduler",
    githubUrl: "https://github.com",
    demoUrl: "https://socsched.example.com",
  },
  {
    image: "/images/placeholder.svg",
    category: "Automation",
    title: "DataSync",
    description: "Automated ETL pipeline that syncs client data between CRM, email marketing, and analytics platforms.",
    techStack: ["Python", "Docker", "PostgreSQL", "Airflow"],
    caseStudyUrl: "/projects/datasync",
    githubUrl: "https://github.com",
  },
];

const featured = {
  image: "/images/placeholder.svg",
  category: "Client Websites",
  title: "BrightPath Academy",
  description:
    "A full-featured school website built from scratch — course catalog, enrollment portal, event calendar, and faculty directory. Designed to serve 500+ daily users with fast load times and a clean, accessible interface.",
  techStack: ["Next.js", "Tailwind CSS", "Node.js", "PostgreSQL", "Prisma"],
  caseStudyUrl: "/projects/brightpath",
  demoUrl: "https://brightpath.example.com",
};

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

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
              key={project.title}
              {...project}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-12 text-center font-sans text-base text-[#7A7A9A]">
            No projects found in this category.
          </p>
        )}
      </Section>

      <Section>
        <div className="flex flex-col gap-10">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Featured Project
          </h2>
          <div className="flex flex-col overflow-hidden rounded-xl border border-[#2A2A38] bg-[#0F0F1A] md:flex-row">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20 md:w-1/2">
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-5xl text-[#EEEEFF]/20">
                  BrightPath
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
                {featured.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-[#2A2A38] bg-[#1A1A2E] px-2.5 py-1 font-mono text-[11px] text-[#7A7A9A]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-4">
                <Link href={featured.caseStudyUrl}>
                  <Button size="sm">View Case Study</Button>
                </Link>
                <a
                  href={featured.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
                >
                  Live Demo &nearr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

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
