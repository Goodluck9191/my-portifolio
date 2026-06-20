import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiTypescript,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiFigma,
  SiVercel,
  SiExpress,
  SiPrisma,
  SiJavascript,
  SiHtml5,
  SiStripe,
  SiSupabase,
  SiGithub,
} from "react-icons/si";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  Python: SiPython,
  TypeScript: SiTypescript,
  "Tailwind CSS": SiTailwindcss,
  Tailwind: SiTailwindcss,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Docker: SiDocker,
  Git: SiGit,
  Figma: SiFigma,
  Vercel: SiVercel,
  Express: SiExpress,
  Prisma: SiPrisma,
  JavaScript: SiJavascript,
  "HTML/CSS": SiHtml5,
  Stripe: SiStripe,
  Supabase: SiSupabase,
  GitHub: SiGithub,
};

interface TechStackIconProps {
  name: string;
  size?: number;
}

export function TechStackIcon({ name, size = 16 }: TechStackIconProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} />;
}
