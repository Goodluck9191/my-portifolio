-- =============================================================
-- Goodluck Portfolio — Blog Engagement Migration
-- Phase: Likes, Comments, Replies, Moderation, Statistics
-- Run this in the Supabase SQL Editor.
-- Preserves all existing tables and data.
-- Idempotent: safe to re-run (uses IF NOT EXISTS / DROP IF EXISTS).
-- =============================================================

-- 1. TABLE: blog_likes -----------------------------------------
-- Anonymous visitor likes per post. One like per (post_id, visitor_id).
CREATE TABLE IF NOT EXISTS blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. TABLE: blog_comments --------------------------------------
-- Threaded comments via self-referencing parent_id.
-- New comments default to 'pending' (moderation required).
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_id uuid NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. INDEXES ---------------------------------------------------
-- Like lookups + duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_likes_post_visitor
  ON blog_likes(post_id, visitor_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_visitor_id ON blog_likes(visitor_id);

-- Comment lookups (approved comments per post, threaded)
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_status
  ON blog_comments(post_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created ON blog_comments(created_at DESC);

-- 4. AUTO-UPDATE updated_at ------------------------------------
DROP TRIGGER IF EXISTS trg_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER trg_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. ROW LEVEL SECURITY ----------------------------------------
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- NOTE: CREATE POLICY has no IF NOT EXISTS in Postgres, so we
-- DROP IF EXISTS first to keep this migration idempotent.

-- Public: read likes (count) for any post
DROP POLICY IF EXISTS "Public can read blog likes" ON blog_likes;
CREATE POLICY "Public can read blog likes"
  ON blog_likes FOR SELECT
  USING (true);

-- Public: insert own like (anon visitor) — validated server-side too
DROP POLICY IF EXISTS "Public can insert blog likes" ON blog_likes;
CREATE POLICY "Public can insert blog likes"
  ON blog_likes FOR INSERT
  WITH CHECK (true);

-- Public: delete own like (anon visitor, by visitor_id)
DROP POLICY IF EXISTS "Public can delete own blog likes" ON blog_likes;
CREATE POLICY "Public can delete own blog likes"
  ON blog_likes FOR DELETE
  USING (true);

-- Public: read approved comments only
DROP POLICY IF EXISTS "Public can read approved comments" ON blog_comments;
CREATE POLICY "Public can read approved comments"
  ON blog_comments FOR SELECT
  USING (status = 'approved');

-- Public: insert new comment (defaults to pending)
DROP POLICY IF EXISTS "Public can insert blog comments" ON blog_comments;
CREATE POLICY "Public can insert blog comments"
  ON blog_comments FOR INSERT
  WITH CHECK (true);

-- Admin (service_role): full access to likes and comments
DROP POLICY IF EXISTS "Admin full access on blog_likes" ON blog_likes;
CREATE POLICY "Admin full access on blog_likes"
  ON blog_likes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin full access on blog_comments" ON blog_comments;
CREATE POLICY "Admin full access on blog_comments"
  ON blog_comments FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 6. ENGAGEMENT STATISTICS VIEW --------------------------------
-- Efficient aggregation for admin dashboard stats.
CREATE OR REPLACE VIEW blog_engagement_stats AS
SELECT
  p.id AS post_id,
  p.title AS post_title,
  p.slug AS post_slug,
  COALESCE(l.like_count, 0) AS like_count,
  COALESCE(c.approved_comment_count, 0) AS approved_comment_count,
  COALESCE(c.pending_comment_count, 0) AS pending_comment_count
FROM posts p
LEFT JOIN (
  SELECT post_id, count(*) AS like_count
  FROM blog_likes
  GROUP BY post_id
) l ON l.post_id = p.id
LEFT JOIN (
  SELECT post_id,
    count(*) FILTER (WHERE status = 'approved') AS approved_comment_count,
    count(*) FILTER (WHERE status = 'pending') AS pending_comment_count
  FROM blog_comments
  GROUP BY post_id
) c ON c.post_id = p.id;

-- Totals across all posts
CREATE OR REPLACE VIEW blog_engagement_totals AS
SELECT
  (SELECT count(*) FROM blog_likes) AS total_likes,
  (SELECT count(*) FROM blog_comments WHERE status = 'approved') AS total_approved_comments,
  (SELECT count(*) FROM blog_comments WHERE status = 'pending') AS total_pending_comments,
  (SELECT count(*) FROM blog_comments WHERE status = 'rejected') AS total_rejected_comments;

-- Most-liked posts
CREATE OR REPLACE VIEW blog_most_liked_posts AS
SELECT
  p.id, p.title, p.slug, count(l.id) AS like_count
FROM posts p
LEFT JOIN blog_likes l ON l.post_id = p.id
GROUP BY p.id, p.title, p.slug
ORDER BY like_count DESC, p.created_at DESC
LIMIT 10;

-- Most-commented posts (approved comments)
CREATE OR REPLACE VIEW blog_most_commented_posts AS
SELECT
  p.id, p.title, p.slug,
  count(c.id) FILTER (WHERE c.status = 'approved') AS approved_comment_count
FROM posts p
LEFT JOIN blog_comments c ON c.post_id = p.id
GROUP BY p.id, p.title, p.slug
ORDER BY approved_comment_count DESC, p.created_at DESC
LIMIT 10;

-- 7. COMMENTS --------------------------------------------------
-- No seed data required; tables start empty.
