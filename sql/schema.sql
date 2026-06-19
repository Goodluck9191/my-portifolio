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
  read_time integer NOT NULL DEFAULT 1,
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  tags text[] NOT NULL DEFAULT '{}',
  views integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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
  ('site_title', 'Goodluck Johnson — Full-Stack Developer & System Architect'),
  ('site_description', 'Full-stack developer and system architect building modern, scalable web applications.'),
  ('contact_email', 'hello@goodluckjohnson.com'),
  ('social_github', 'https://github.com/goodluckjohnson'),
  ('social_linkedin', 'https://linkedin.com/in/goodluckjohnson'),
  ('social_twitter', 'https://twitter.com/goodluckjohnson')
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