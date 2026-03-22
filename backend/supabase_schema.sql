-- Run this in your Supabase SQL editor
-- Project: AlgoLens

CREATE TABLE IF NOT EXISTS visualizations (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  algorithm   text        NOT NULL,
  category    text        NOT NULL,
  language    text        NOT NULL DEFAULT 'unknown',
  confidence  float       NOT NULL,
  source      text        NOT NULL DEFAULT 'pattern',  -- 'pattern' or 'gemini'
  created_at  timestamptz DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_viz_created_at ON visualizations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_viz_algorithm  ON visualizations (algorithm);
CREATE INDEX IF NOT EXISTS idx_viz_language   ON visualizations (language);

-- Optional: enable Row Level Security (RLS) with public insert, no read
ALTER TABLE visualizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
  ON visualizations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Backend reads via service role key if you want stats protected
-- Or allow public reads for the admin (since admin auth is frontend-only):
CREATE POLICY "Allow public reads"
  ON visualizations FOR SELECT
  TO anon
  USING (true);
