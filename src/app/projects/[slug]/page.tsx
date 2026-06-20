import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { TechStackIcon } from "@/components/ui/TechStackIcon";
import { getProjectBySlug, getProjects } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          href="/projects"
          className="mb-8 flex items-center gap-1.5 font-sans text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div className="flex flex-col gap-2 mb-8">
          <span className="w-fit rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-3 py-0.5 font-mono text-[11px] font-medium text-[#6C63FF]">
            {project.category}
          </span>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            {project.title}
          </h1>
        </div>

        {project.image_url && (
          <div className="relative mb-10 aspect-video overflow-hidden rounded-xl border border-[#2A2A38]">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
          <div className="flex-1">
            <p className="font-sans text-base leading-relaxed text-[#EEEEFF]">
              {project.description}
            </p>

            {project.long_description && (
              <div className="mt-6 font-sans text-base leading-relaxed text-[#7A7A9A] whitespace-pre-wrap">
                {project.long_description}
              </div>
            )}

            {project.results && (
              <div className="mt-8 rounded-lg border border-green-500/20 bg-green-500/10 p-5">
                <p className="font-display text-sm font-semibold text-green-500">
                  Results
                </p>
                <p className="mt-1 font-sans text-sm text-[#EEEEFF]">
                  {project.results}
                </p>
              </div>
            )}
          </div>

          <aside className="md:w-72 md:shrink-0">
            <div className="sticky top-24 flex flex-col gap-5 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] p-5">
              {project.client_name && (
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase text-[#7A7A9A]">
                    Client
                  </p>
                  <p className="mt-0.5 font-sans text-sm text-[#EEEEFF]">
                    {project.client_name}
                  </p>
                </div>
              )}

              {project.role && (
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase text-[#7A7A9A]">
                    Role
                  </p>
                  <p className="mt-0.5 font-sans text-sm text-[#EEEEFF]">
                    {project.role}
                  </p>
                </div>
              )}

              {project.duration && (
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase text-[#7A7A9A]">
                    Duration
                  </p>
                  <p className="mt-0.5 font-sans text-sm text-[#EEEEFF]">
                    {project.duration}
                  </p>
                </div>
              )}

              <div>
                <p className="font-mono text-[11px] font-medium uppercase text-[#7A7A9A]">
                  Status
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                    project.status === "completed"
                      ? "bg-green-500/10 text-green-500"
                      : project.status === "in-progress"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <hr className="border-[#2A2A38]" />

              <div className="flex flex-col gap-2">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] px-4 py-2 font-sans text-xs font-medium text-white shadow-lg shadow-[#6C63FF]/25 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#22223A] bg-transparent px-4 py-2 font-sans text-xs font-medium text-white transition-all duration-150 hover:bg-[rgba(108,99,255,0.06)] hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    View Code
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <p className="mb-3 font-mono text-[11px] font-medium uppercase text-[#7A7A9A]">
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#2A2A38] bg-[#1A1A2E] px-3 py-1.5 font-mono text-xs text-[#7A7A9A] transition-all duration-200 hover:border-[#6C63FF]"
              >
                <TechStackIcon name={tech} size={14} />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
