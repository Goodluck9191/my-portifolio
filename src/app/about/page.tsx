import Link from "next/link";
import { Code2, Palette, Rocket, Shield, Zap, Globe } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Timeline } from "@/components/ui/Timeline";
import { SkillsMatrix } from "@/components/ui/SkillsMatrix";

const timelineEntries = [
  {
    year: "2025",
    title: "Full Stack Developer",
    company: "Freelance & Client Work",
    description: "Building professional websites and web apps for small businesses and startups using React, Next.js, and Node.js.",
    tech: ["React", "Next.js", "Node.js", "Tailwind CSS"],
  },
  {
    year: "2024",
    title: "Junior Developer",
    company: "Digital Agency",
    description: "Collaborated on client projects, built landing pages and integrated REST APIs for web applications.",
    tech: ["JavaScript", "Express", "MongoDB", "Git"],
  },
  {
    year: "2023",
    title: "Started Freelancing",
    company: "Self-Employed",
    description: "Began taking on independent web development projects, building custom websites for local businesses.",
    tech: ["HTML/CSS", "JavaScript", "React"],
  },
  {
    year: "2022",
    title: "Web Development Certificate",
    company: "Online Program",
    description: "Completed an intensive web development program covering frontend and backend fundamentals.",
    tech: ["HTML/CSS", "JavaScript", "Node.js"],
  },
];

const frontendSkills = [
  { label: "React.js", percentage: 85 },
  { label: "Next.js", percentage: 80 },
  { label: "Tailwind CSS", percentage: 90 },
  { label: "JavaScript", percentage: 85 },
];

const backendSkills = [
  { label: "Node.js", percentage: 75 },
  { label: "Python", percentage: 65 },
  { label: "REST APIs", percentage: 80 },
  { label: "PostgreSQL", percentage: 65 },
];

const toolSkills = [
  { label: "Git & GitHub", percentage: 80 },
  { label: "Vercel", percentage: 80 },
  { label: "MongoDB", percentage: 65 },
  { label: "Docker", percentage: 50 },
];

const aiSkills = [
  { label: "LLM APIs", percentage: 60 },
  { label: "Prompt Eng.", percentage: 70 },
  { label: "Automation", percentage: 65 },
  { label: "Data Analysis", percentage: 55 },
];

const techStack = [
  { name: "React", emoji: "⚛️" },
  { name: "Next.js", emoji: "▲" },
  { name: "Node.js", emoji: "🟢" },
  { name: "Python", emoji: "🐍" },
  { name: "TypeScript", emoji: "📘" },
  { name: "Tailwind", emoji: "🌊" },
  { name: "PostgreSQL", emoji: "🐘" },
  { name: "MongoDB", emoji: "🍃" },
  { name: "Docker", emoji: "🐳" },
  { name: "Git", emoji: "🔀" },
  { name: "Figma", emoji: "🎨" },
  { name: "Vercel", emoji: "▲" },
  { name: "Express", emoji: "⚡" },
  { name: "Prisma", emoji: "📦" },
];

const values = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "I write maintainable, readable code that others can understand and build upon.",
  },
  {
    icon: Rocket,
    title: "Fast Delivery",
    description: "I ship on time and communicate progress clearly throughout every project.",
  },
  {
    icon: Shield,
    title: "Quality First",
    description: "I never cut corners on performance, accessibility, or user experience.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section padding="sm">
        <div className="flex flex-col gap-2 pt-4">
          <nav className="flex items-center gap-2 font-mono text-xs text-[#7A7A9A]">
            <Link href="/" className="transition-colors hover:text-[#EEEEFF]">Home</Link>
            <span>&gt;</span>
            <span className="text-[#EEEEFF]">About</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            About Me
          </h1>
        </div>
      </Section>

      <Section id="story">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12">
          <div className="mx-auto w-64 shrink-0 md:mx-0 md:w-72">
            <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF] p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0F0F1A]">
                <span className="font-display text-6xl text-[#EEEEFF]/20">GP</span>
              </div>
            </div>
          </div>

          <div className="flex max-w-xl flex-col gap-5">
            <div className="mb-1 inline-flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5 text-sm text-green-500">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Available for freelance &amp; full-time
            </div>

            <p className="font-sans text-base leading-relaxed text-[#7A7A9A]">
              Hi, I&apos;m Goodluck Prosper &mdash; a full stack developer from Tanzania who loves building things for the web. I started coding 3 years ago and quickly fell in love with the process of turning an idea into something real that people can use.
            </p>

            <p className="font-sans text-base leading-relaxed text-[#7A7A9A]">
              My stack of choice is React and Next.js for the frontend, Node.js with Express for the backend, Python for scripting and automation, and Tailwind CSS to make everything look sharp without the bloat.
            </p>

            <p className="font-sans text-base leading-relaxed text-[#7A7A9A]">
              I enjoy working directly with clients &mdash; understanding what they need, translating that into clean code, and delivering something they&apos;re genuinely proud to show the world.
            </p>

            <div className="mt-2">
              <Button variant="secondary" size="md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section id="journey">
        <div className="flex flex-col gap-10">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            My Journey
          </h2>
          <Timeline entries={timelineEntries} />
        </div>
      </Section>

      <Section id="skills" darkBg>
        <div className="flex flex-col gap-12">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Technical Skills
          </h2>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-[#6C63FF]">
                Frontend
              </h3>
              <SkillsMatrix skills={frontendSkills} />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-[#6C63FF]">
                Backend
              </h3>
              <SkillsMatrix skills={backendSkills} />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-[#6C63FF]">
                Tools &amp; DevOps
              </h3>
              <SkillsMatrix skills={toolSkills} />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-[#6C63FF]">
                AI / ML
              </h3>
              <SkillsMatrix skills={aiSkills} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="tech-stack">
        <div className="flex flex-col gap-10">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Tools I Use Daily
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
            {techStack.map(({ name, emoji }) => (
              <div
                key={name}
                className="group relative flex cursor-default flex-col items-center gap-2 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-3 py-5 transition-all duration-200 hover:scale-110 hover:border-[#6C63FF]"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="font-mono text-[11px] text-[#7A7A9A]">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="values" darkBg>
        <div className="flex flex-col gap-10">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            My Values
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-lg border border-[#2A2A38] bg-[#0F0F1A] px-6 py-8 transition-all duration-200 hover:border-[#6C63FF] hover:translate-y-[-2px]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#6C63FF]/20 to-[#00D4FF]/20">
                  <Icon size={20} className="text-[#6C63FF]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {title}
                </h3>
                <p className="font-sans text-sm leading-relaxed text-[#7A7A9A]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
