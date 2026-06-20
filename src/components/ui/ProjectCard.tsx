import Image from "next/image";
import Link from "next/link";
import { TechStackIcon } from "@/components/ui/TechStackIcon";

interface ProjectCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  techStack: string[];
  caseStudyUrl: string;
  githubUrl?: string;
  demoUrl?: string;
}

function PlaceholderImage({ title }: { title: string }) {
  return (
    <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20">
      <span className="font-display text-2xl text-[#EEEEFF]/20">{title.charAt(0)}</span>
    </div>
  );
}

export function ProjectCard({
  image,
  category,
  title,
  description,
  techStack,
  caseStudyUrl,
  githubUrl,
  demoUrl,
}: ProjectCardProps) {
  return (
    <div className="group rounded-xl border border-[#2A2A38] bg-[#0F0F1A] transition-all duration-300 ease-out hover:translate-y-[-4px] hover:border-[#6C63FF] hover:shadow-lg hover:shadow-[#6C63FF]/10">
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <PlaceholderImage title={title} />
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <span className="font-mono text-xs font-medium text-[#6C63FF]">
          {category}
        </span>

        <h3 className="font-display text-lg font-semibold text-white">
          {title}
        </h3>

        <p className="truncate text-sm text-[#7A7A9A]">{description}</p>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#2A2A38] bg-[#1A1A2E] px-2.5 py-1 font-mono text-[11px] text-[#7A7A9A] transition-all duration-200 hover:border-[#6C63FF]"
            >
              <TechStackIcon name={tech} size={12} />
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-1 flex items-center gap-4">
          <Link
            href={caseStudyUrl}
            className="text-sm font-medium text-[#EEEEFF] transition-colors hover:text-[#6C63FF]"
          >
            Case Study &rarr;
          </Link>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
            >
              GitHub &nearr;
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#7A7A9A] transition-colors hover:text-[#EEEEFF]"
            >
              Demo &nearr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
