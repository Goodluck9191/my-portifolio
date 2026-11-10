// =============================================================
// Goodluck Prosper — Personal Knowledge Base
// Update this file with verified information about Goodluck.
// The AI assistant uses ONLY this data + its training to answer questions.
// Do NOT invent achievements, employers, or certifications.
// =============================================================

export const knowledgeBase = {
  profile: {
    name: "Goodluck Prosper Masawe",
    alsoKnownAs: "Goodluck Prosper",
    location: "Tanzania",
    role: "Software Developer",
    identity:
      "Software developer focused on modern web application development — building fast, clean and professional websites and web applications.",
    professionalInterests: [
      "Full-stack development",
      "Frontend engineering",
      "Backend systems",
      "Artificial intelligence integration",
      "Scalable software architecture",
      "Solving real-world problems through technology",
    ],
  },

  skills: {
    frontend: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML",
      "CSS",
    ],
    backendAndDatabases: [
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "REST APIs",
    ],
    tools: ["Git", "GitHub", "Vercel"],
    // Only describe actual, documented proficiency — do not exaggerate.
    notes:
      "Goodluck works across the full stack with focus on React/Next.js on the frontend and Node.js/Supabase/PostgreSQL on the backend. He has practical, hands-on experience built through shipped projects.",
  },

  projects: [
    {
      name: "Visual Lab Chemistry",
      summary:
        "A virtual chemistry practical simulation designed to help students understand and practice chemistry experiments where access to physical laboratory facilities is limited.",
      problem:
        "Many students in Tanzania (and similar regions) lack sufficient physical chemistry laboratory facilities for practical experiments. Visual Lab Chemistry brings the lab to students digitally.",
      targetUsers: "Secondary school and university students, educators",
      technologies: ["Next.js", "TypeScript", "Supabase"],
      features: [
        "Interactive virtual chemistry experiments",
        "Digital lab environment for practicing practical work",
        "Readings, calculations and results for experiments",
        "A learning experience designed for students without reliable lab access",
      ],
      technicalNotes:
        "Built with Next.js for the frontend and Supabase for backend services and data management. Exact implementation details beyond the above are not publicly documented.",
      status: "In development / active",
      url: null,
    },
    {
      name: "Students Project Matcher",
      summary:
        "A platform that helps students find and match with projects — connecting student developers with project opportunities.",
      problem:
        "Helping students discover practical development projects to build skills and portfolios.",
      targetUsers: "Students and developers looking for project experience",
      technologies: ["Next.js", "Supabase"],
      features: [
        "Students can discover projects to work on",
        "Connects learners with real opportunities to practice",
      ],
      technicalNotes:
        "Built as a full-stack web application. Further details (exact matching logic, auth model, data schema) are not publicly documented.",
      status: "Active",
      url: null,
    },
    {
      name: "Goodluck Prosper — Personal Portfolio",
      summary:
        "The portfolio website at https://goodluckprosper.vercel.app — showcases selected projects, blog articles, a contact form and this AI assistant.",
      problem:
        "Create a professional, high-performance home for Goodluck's work, writing and contact channels.",
      targetUsers:
        "Recruiters, potential clients, collaborators, developers and readers",
      technologies: [
        "Next.js (App Router)",
        "TypeScript",
        "Tailwind CSS",
        "Supabase",
        "Vercel",
        "React Markdown",
      ],
      features: [
        "Project case studies",
        "Technical blog on web development, system design and AI",
        "Category/tag browsing for blog articles",
        "Contact form with email notification",
        "Admin dashboard for content management",
        "This AI portfolio assistant",
      ],
      technicalNotes:
        "Uses the Next.js App Router with static generation and Supabase as the backing database and auth provider.",
      status: "Live and actively maintained",
      url: "https://goodluckprosper.vercel.app",
    },
    {
      name: "Bottega Verde",
      summary: "A website built for the Bottega Verde brand.",
      problem:
        "Give the brand a professional web presence.",
      targetUsers: "Bottega Verde's customers and visitors",
      technologies: ["Next.js", "Tailwind CSS"],
      features: ["Brand website / web presence"],
      technicalNotes:
        "Details about this project are not publicly documented beyond it being a client website.",
      status: "Live",
      url: null,
    },
    {
      name: "E-Commerce Platform",
      summary:
        "A full-featured e-commerce platform with real-time inventory management, payment processing and an admin dashboard.",
      problem:
        "Enable a retailer to sell online with proper inventory and admin tooling.",
      targetUsers: "Retail customers and store administrators",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Redis", "Docker"],
      features: [
        "Real-time inventory management",
        "Payment processing",
        "Admin dashboard",
      ],
      status: "In development (in-progress)",
      url: null,
    },
    {
      name: "Marketing Website",
      summary:
        "Modern marketing website with CMS integration, blog and lead-generation forms.",
      problem: "Help a client grow online with a conversion-focused site.",
      targetUsers: "GrowWave's marketing visitors and leads",
      technologies: ["Next.js", "Tailwind CSS", "Sanity CMS", "Vercel"],
      features: ["CMS-driven content", "Blog", "Lead generation forms"],
      status: "Completed",
      url: null,
    },
    {
      name: "Deployment Automation",
      summary:
        "Automated CI/CD pipeline reducing deployment time from hours to minutes.",
      problem: "Slow, manual deployment process.",
      targetUsers: "Development teams",
      technologies: ["Docker", "GitHub Actions", "Terraform", "AWS", "Bash"],
      features: [
        "Fully automated CI/CD pipeline",
        "Reduced deployment time by 85%",
      ],
      status: "In progress",
      url: null,
    },
  ],

  services: [
    "Business websites",
    "Web applications",
    "Landing pages",
    "E-commerce stores",
    "CMS-driven content sites",
    "Automation and CI/CD tooling",
    "Artificial intelligence integration into web applications",
  ],

  hiring: {
    availability:
      "Open to freelance and full-time opportunities.",
    howToHire:
      "Best via the contact form on his portfolio website, or by email.",
    contact: {
      github: "https://github.com/Goodluck9191",
      linkedin: "https://linkedin.com/in/goodluckprosper",
      email: "hello@goodluckprosper.dev",
      twitter: "https://twitter.com/goodluckprosper",
      portfolio: "https://goodluckprosper.vercel.app",
      contactPage: "https://goodluckprosper.vercel.app/contact",
    },
  },

  honestNotes: [
    "Employment history is not publicly documented; do not invent employers.",
    "Years of professional experience: approximately 3 years of experience building websites and web applications (per his bio).",
    "No public information about degrees, certifications, employers or awards is available — do not invent them.",
    "Visual Lab Chemistry is in development; do not claim it as 100% production-ready or overstate its features.",
    "Bottega Verde details are limited.",
  ],
};

export type KnowledgeBase = typeof knowledgeBase;

export function buildKnowledgeContext(): string {
  const kb = knowledgeBase;
  const lines: string[] = [];

  lines.push("=== GOODLUCK PROSPER — VERIFIED KNOWLEDGE BASE ===");

  lines.push("\n## Personal Profile");
  lines.push(`Name: ${kb.profile.name} (${kb.profile.alsoKnownAs})`);
  lines.push(`Location: ${kb.profile.location}`);
  lines.push(`Role: ${kb.profile.role}`);
  lines.push(`Identity: ${kb.profile.identity}`);
  lines.push(`Professional interests: ${kb.profile.professionalInterests.join(", ")}`);

  lines.push("\n## Technical Skills");
  lines.push(`Frontend: ${kb.skills.frontend.join(", ")}`);
  lines.push(`Backend & Databases: ${kb.skills.backendAndDatabases.join(", ")}`);
  lines.push(`Tools: ${kb.skills.tools.join(", ")}`);
  lines.push(`Notes: ${kb.skills.notes}`);

  lines.push("\n## Projects");
  kb.projects.forEach((p, i) => {
    lines.push(`\n### Project ${i + 1}: ${p.name}`);
    lines.push(`Summary: ${p.summary}`);
    lines.push(`Problem solved: ${p.problem}`);
    lines.push(`Target users: ${p.targetUsers}`);
    lines.push(`Technologies: ${p.technologies.join(", ")}`);
    lines.push(`Main features: ${p.features.join("; ")}`);
    if (p.technicalNotes) lines.push(`Technical notes: ${p.technicalNotes}`);
    lines.push(`Status: ${p.status}`);
    if (p.url) lines.push(`URL: ${p.url}`);
  });

  lines.push("\n## Services Goodluck Offers");
  lines.push(kb.services.join(", "));

  lines.push("\n## Availability & Hiring");
  lines.push(`Availability: ${kb.hiring.availability}`);
  lines.push(`How to hire: ${kb.hiring.howToHire}`);
  lines.push(`GitHub: ${kb.hiring.contact.github}`);
  lines.push(`LinkedIn: ${kb.hiring.contact.linkedin}`);
  lines.push(`Email: ${kb.hiring.contact.email}`);
  lines.push(`Twitter: ${kb.hiring.contact.twitter}`);
  lines.push(`Portfolio: ${kb.hiring.contact.portfolio}`);
  lines.push(`Contact page: ${kb.hiring.contact.contactPage}`);

  lines.push("\n## Honest Notes (DO NOT INVENT / DO NOT EXAGGERATE)");
  kb.honestNotes.forEach((n) => lines.push(`- ${n}`));

  lines.push("\n=== END OF KNOWLEDGE BASE ===");
  return lines.join("\n");
}
