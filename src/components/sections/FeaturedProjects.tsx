import Link from "next/link";

const projects = [
  {
    category: "Client Website",
    title: "Restaurant Ordering Platform",
    description:
      "Full-featured ordering system with menu management, real-time order tracking, and payment integration.",
    techs: ["React", "Node.js", "MongoDB"],
    href: "/projects/restaurant-ordering",
  },
  {
    category: "E-Commerce",
    title: "Fashion Store Website",
    description:
      "Modern storefront with advanced filtering, cart management, and seamless checkout experience.",
    techs: ["Next.js", "PostgreSQL", "Stripe"],
    href: "/projects/fashion-store",
  },
  {
    category: "Business Site",
    title: "Agency Portfolio",
    description:
      "Creative agency showcase featuring project galleries, team profiles, and a dynamic blog.",
    techs: ["Next.js", "Tailwind", "Vercel"],
    href: "/projects/agency-portfolio",
  },
];

function ProjectCard({
  category,
  title,
  description,
  techs,
  href,
}: {
  category: string;
  title: string;
  description: string;
  techs: string[];
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-xl border border-[#22223A] bg-[#0F0F1A] p-5 transition-all duration-300 ease-out hover:translate-y-[-4px] hover:border-[#6C63FF] hover:shadow-lg"
    >
      <div className="flex aspect-video items-center justify-center rounded-lg bg-[#16162A]">
        <span className="font-mono text-xs text-[#7A7A9A]">[Project Image]</span>
      </div>
      <span className="font-mono text-[11px] font-medium uppercase text-[#6C63FF]">
        {category}
      </span>
      <h3 className="font-display text-[20px] font-bold text-white">
        {title}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-[#7A7A9A]">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {techs.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-[#2A2A38] bg-[#1A1A2E] px-2.5 py-1 font-mono text-[11px] text-[#7A7A9A]"
          >
            {tech}
          </span>
        ))}
      </div>
      <span className="mt-1 font-sans text-[13px] font-semibold text-[#6C63FF] transition-colors group-hover:text-[#00D4FF]">
        Case Study &rarr;
      </span>
    </Link>
  );
}

export function FeaturedProjects() {
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
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="group flex items-center gap-1.5 font-sans text-sm font-medium text-[#6C63FF] transition-colors hover:text-[#00D4FF]"
          >
            View All Projects{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
