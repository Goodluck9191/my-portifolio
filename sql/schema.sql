-- =============================================================
-- Goodluck Portfolio — Supabase Schema + Seed
-- Run this in the Supabase SQL Editor.
-- =============================================================

-- 1. TABLES ----------------------------------------------------

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  long_description text,
  category text NOT NULL,
  image_url text,
  demo_url text,
  github_url text,
  case_study_url text,
  tech_stack text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'in-progress', 'archived')),
  client_name text,
  duration text,
  role text,
  results text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  meta_description text,
  read_time integer NOT NULL DEFAULT 1,
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Migration: Add meta_description column for SEO support
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description text;

-- Migration: Add advanced SEO columns
ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS canonical_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS focus_keyword text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_title text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_description text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS og_image text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS twitter_image text;

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  project_type text,
  budget text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. INDEXES ---------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);

CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- 3. AUTO-UPDATE updated_at ------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_posts_updated_at ON posts;
CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_settings_updated_at ON settings;
CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. VIEW COUNTER FUNCTION -------------------------------------

CREATE OR REPLACE FUNCTION increment_post_views(slug_param text)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET views = views + 1
  WHERE slug = slug_param;
END;
$$ LANGUAGE plpgsql;

-- 5. RLS POLICIES ----------------------------------------------

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read projects"
  ON projects FOR SELECT USING (true);

CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (published = true);

CREATE POLICY "Public can create contacts"
  ON contacts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read settings"
  ON settings FOR SELECT USING (true);

-- Admin full access (authenticated users with service_role)
CREATE POLICY "Admin full access on projects"
  ON projects FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access on posts"
  ON posts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access on contacts"
  ON contacts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin full access on settings"
  ON settings FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 6. SEED DATA -------------------------------------------------

INSERT INTO settings (key, value) VALUES
  ('site_title', 'Goodluck Prosper — Full Stack Developer'),
  ('site_description', 'Full stack developer specializing in React, Next.js & Node.js. I build clean, fast websites that help businesses grow online.'),
  ('contact_email', 'hello@goodluckprosper.dev'),
  ('social_github', 'https://github.com/Goodluck9191'),
  ('social_linkedin', 'https://linkedin.com/in/goodluckprosper'),
  ('social_twitter', 'https://twitter.com/goodluckprosper'),
  ('author_name', 'Goodluck Prosper'),
  ('profile_image_url', '/images/profile.jpg'),
  ('brand_logo_text', 'GP'),
  ('copyright_name', 'Goodluck Prosper'),
  ('nav_cta_label', 'Hire Me'),
  ('availability_text', 'Available for Freelance & Full-Time'),
  ('hero_heading', 'I Build Web Applications That'),
  ('hero_heading_muted', 'Clients Are Proud Of.'),
  ('hero_subtitle', 'Full stack developer specializing in React, Next.js & Node.js. I turn your ideas into fast, modern, professional websites.'),
  ('hero_cta_primary_label', 'See My Work'),
  ('hero_cta_secondary_label', 'Let\'s Talk'),
  ('about_bio', 'I\'m a full stack developer from Tanzania with 3 years of experience building websites and web applications for clients. I specialize in React and Next.js on the frontend, Node.js with Express on the backend, and I use Python for automation and scripting.\n\nWhat I love most is the problem-solving process — taking a vague idea and shaping it into a clear, functional product that people actually enjoy using. Every project teaches me something new, and I bring that growth into the next one.\n\nI\'m currently open to freelance and full-time opportunities where I can contribute meaningfully, work with great people, and continue building things that matter.'),
  ('about_page_title', 'About Me'),
  ('resume_url', '/resume.pdf'),
  ('projects_page_title', 'Selected Work'),
  ('projects_page_subtitle', 'A selection of recent projects I\'ve built for clients.'),
  ('blog_page_title', 'From the Blog'),
  ('blog_page_subtitle', 'Thoughts on web development, system design, and AI.'),
  ('newsletter_heading', 'Stay in the Loop'),
  ('newsletter_subtitle', 'Get notified when I publish new articles on web development, system design, and AI.'),
  ('architecture_heading', 'How I Build'),
  ('architecture_heading_accent', 'Scalable Systems'),
  ('architecture_subtitle', 'Architecture patterns, design decisions, and systems thinking — the engineering principles behind every project I deliver.'),
  ('architecture_quote', 'Good architecture isn\'t about building for scale you\'ll never reach — it\'s about building so you can scale when the time comes.'),
  ('contact_page_title', 'Let\'s Work Together'),
  ('contact_subtitle', 'I\'d love to hear about your project. Send me a message and I\'ll get back to you within 24 hours.'),
  ('contact_location', 'Tanzania, East Africa'),
  ('contact_timezone', 'EAT (UTC+3)'),
  ('contact_response_time', 'I typically respond within 24 hours.'),
  ('cta_heading', 'Have a project in mind?'),
  ('cta_subtitle', 'Let\'s build something great together. Get in touch and let\'s discuss your idea.'),
  ('cta_button_label', 'Get In Touch'),
  ('cta_secondary_label', 'View Resume')
ON CONFLICT (key) DO NOTHING;

INSERT INTO projects (title, slug, description, category, image_url, demo_url, github_url, tech_stack, featured, status, client_name, duration, role, results, order_index) VALUES
(
  'E-Commerce Platform',
  'ecommerce-platform',
  'A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.',
  'Web Apps',
  NULL,
  'https://demo.example.com/ecommerce',
  'https://github.com/goodluckjohnson/ecommerce',
  ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
  true,
  'completed',
  'TechRetail Inc.',
  '3 months',
  'Lead Developer',
  '50% increase in online sales within first month',
  1
),
(
  'Marketing Website',
  'marketing-website',
  'Modern marketing website with CMS integration, blog, and lead generation forms.',
  'Client Websites',
  NULL,
  'https://demo.example.com/marketing',
  NULL,
  ARRAY['Next.js', 'Tailwind CSS', 'Sanity CMS', 'Vercel'],
  true,
  'completed',
  'GrowthWave',
  '6 weeks',
  'Full-Stack Developer',
  '40% increase in conversion rate',
  2
),
(
  'Deployment Automation',
  'deployment-automation',
  'Automated CI/CD pipeline reducing deployment time from hours to minutes.',
  'Automation',
  NULL,
  NULL,
  'https://github.com/goodluckjohnson/deploy-automation',
  ARRAY['Docker', 'GitHub Actions', 'Terraform', 'AWS', 'Bash'],
  true,
  'in-progress',
  NULL,
  'Ongoing',
  'DevOps Engineer',
  'Deployment time reduced by 85%',
  3
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (title, slug, excerpt, content, category, read_time, published, featured, tags) VALUES
(
  'Building Scalable Microservices with Node.js',
  'scalable-microservices-nodejs',
  'Learn how to design and implement a production-ready microservices architecture using Node.js, Docker, and message queues.',
  E'# Building Scalable Microservices\n\nThis is a comprehensive guide to building microservices...\n\n## Getting Started\n\n...',
  'Backend',
  8,
  true,
  true,
  ARRAY['Node.js', 'Microservices', 'Docker', 'Architecture']
),
(
  'The Complete Guide to TypeScript Generics',
  'typescript-generics-guide',
  'Master TypeScript generics from basics to advanced patterns. Includes practical examples and real-world use cases.',
  E'# TypeScript Generics\n\nA deep dive into generics...',
  'TypeScript',
  12,
  true,
  false,
  ARRAY['TypeScript', 'JavaScript', 'Programming']
),
(
  'Modern CSS Techniques in 2026',
  'modern-css-techniques-2026',
  'Explore the latest CSS features including container queries, cascade layers, and the new color functions.',
  E'# Modern CSS\n\nContainer queries, cascade layers...',
  'Frontend',
  6,
  true,
  false,
  ARRAY['CSS', 'Frontend', 'Web Development']
)
ON CONFLICT (slug) DO NOTHING;