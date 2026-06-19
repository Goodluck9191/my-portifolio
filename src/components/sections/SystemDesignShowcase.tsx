import Link from "next/link";
import { Code, Zap, Shield, Workflow } from "lucide-react";

const cards = [
  {
    icon: Code,
    title: "Database Design",
    description: "PostgreSQL with proper indexing and optimization.",
  },
  {
    icon: Zap,
    title: "API Optimization",
    description: "Fast, scalable REST APIs with caching strategies.",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Authentication, authorization, and data protection.",
  },
  {
    icon: Workflow,
    title: "CI/CD Pipeline",
    description: "Automated testing and deployment workflows.",
  },
];

export function SystemDesignShowcase() {
  return (
    <section className="border-y border-[#22223A] bg-[#16162A] py-20 md:py-24">
      <div className="mx-auto max-w-[1100px] px-4">
        <div className="mb-[60px] flex flex-col items-center gap-2 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
            How I Build Systems That Scale
          </h2>
          <p className="font-sans text-base text-[#7A7A9A]">
            Architecture thinking behind every project.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-xl border border-[#22223A] bg-[#0F0F1A] p-7 text-center transition-all duration-300 ease-out hover:border-[#00D4FF] hover:shadow-[0_0_24px_rgba(0,212,255,0.15)]"
            >
              <Icon size={32} className="text-[#6C63FF]" />
              <h3 className="mt-4 font-sans text-[18px] font-semibold text-white">
                {title}
              </h3>
              <p className="mt-4 font-sans text-[13px] leading-relaxed text-[#7A7A9A]">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/architecture"
            className="group flex items-center gap-1.5 font-sans text-sm font-medium text-[#6C63FF] transition-colors hover:text-[#00D4FF]"
          >
            Explore Architecture{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
