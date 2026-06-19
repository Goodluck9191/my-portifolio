import Link from "next/link";

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
      <div className="overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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
              className="rounded-md border border-[#2A2A38] bg-[#1A1A2E] px-2.5 py-1 font-mono text-[11px] text-[#7A7A9A]"
            >
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
