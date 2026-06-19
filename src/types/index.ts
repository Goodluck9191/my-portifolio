export interface Project {
  slug: string;
  title: string;
  type: string;
  stack: string[];
  summary: string;
  result: string;
  links: {
    live?: string;
    github?: string;
  };
}

export interface Skill {
  name: string;
  level: number;
  category: "frontend" | "backend" | "tools";
}
