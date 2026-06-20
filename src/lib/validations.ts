import { z } from "zod";

export const contactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  email: z.string()
    .email("Please enter a valid email address"),
  project_type: z.enum([
    "Business Website",
    "Web App",
    "Landing Page",
    "E-Commerce",
    "Other"
  ]).optional(),
  budget: z.enum([
    "Under $500",
    "$500 - $1500",
    "$1500 - $5000",
    "$5000+",
    "Let's discuss"
  ]).optional(),
  message: z.string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message too long"),
});

export const projectSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  long_description: z.string().optional(),
  category: z.string().min(2),
  image_url: z.string().url().optional().or(z.literal("")),
  demo_url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  case_study_url: z.string().url().optional().or(z.literal("")),
  tech_stack: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "archived"]),
  client_name: z.string().optional(),
  duration: z.string().optional(),
  role: z.string().optional(),
  results: z.string().optional(),
});

export const postSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(5).max(200),
  excerpt: z.string().min(10).max(500),
  content: z.string().min(20),
  category: z.string().min(2),
  image_url: z.string().url().optional().or(z.literal("")),
  meta_description: z.string().min(50).max(160).optional().or(z.literal("")),
  read_time: z.number().min(1).max(60),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type PostFormData = z.infer<typeof postSchema>;
