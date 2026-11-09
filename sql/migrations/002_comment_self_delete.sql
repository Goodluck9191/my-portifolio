-- =============================================================
-- Goodluck Portfolio — Comment Self-Delete + Instant Publish
-- Run this AFTER 001_blog_engagement.sql.
-- Adds: visitor_id (anon) + delete_token (one-time secret used
-- for visitor-owned comment deletion).
-- =============================================================

ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS visitor_id text;
ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS delete_token text;

-- Fast lookups of a visitor's own comments
CREATE INDEX IF NOT EXISTS idx_blog_comments_visitor_id
  ON blog_comments(visitor_id);

-- Tokens must be unique so they can authorize deletion
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_comments_delete_token
  ON blog_comments(delete_token)
  WHERE delete_token IS NOT NULL;
