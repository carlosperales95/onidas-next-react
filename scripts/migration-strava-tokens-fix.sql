-- Migration: Fix Strava Tokens Table Structure
-- This migration updates the strava_tokens table to include the missing columns

BEGIN;

-- Drop existing strava_tokens table and related objects
DROP TRIGGER IF EXISTS update_strava_tokens_updated_at ON strava_tokens;
DROP TABLE IF EXISTS strava_tokens CASCADE;

-- Recreate strava_tokens with correct schema
CREATE TABLE strava_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  scope TEXT,
  strava_athlete_id BIGINT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(athlete_id)
);

-- Create indexes
CREATE INDEX idx_tokens_athlete ON strava_tokens(athlete_id);
CREATE INDEX idx_tokens_clerk_user_id ON strava_tokens(clerk_user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_strava_tokens_updated_at BEFORE UPDATE ON strava_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own tokens" ON strava_tokens;
DROP POLICY IF EXISTS "Users can update own tokens" ON strava_tokens;
DROP POLICY IF EXISTS "Users can insert own tokens" ON strava_tokens;

CREATE POLICY "Users can view own tokens" ON strava_tokens
  FOR SELECT USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own tokens" ON strava_tokens
  FOR UPDATE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can insert own tokens" ON strava_tokens
  FOR INSERT WITH CHECK (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

COMMIT;
