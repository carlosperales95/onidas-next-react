-- AthleteHub Database Schema
-- This migration creates the core tables needed for the application
-- All tables use clerk_user_id as the primary user identifier
-- Soft delete support via deleted_at column

-- =============================================================================
-- 1. ATHLETE PROFILES TABLE (Core user table linked to Clerk)
-- =============================================================================
DROP TABLE IF EXISTS athlete_profiles CASCADE;

CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  
  -- Basic info (optional, filled during onboarding/settings)
  display_name TEXT,
  email TEXT,
  
  -- Physical attributes (optional)
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  
  -- Training preferences (optional)
  preferred_sport TEXT DEFAULT 'running',
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  weekly_training_hours NUMERIC(4,1),
  
  -- Fitness metrics (optional, can be synced from Strava)
  resting_heart_rate INTEGER,
  max_heart_rate INTEGER,
  ftp_watts INTEGER,
  lactate_threshold_hr INTEGER,
  
  -- Status
  onboarding_completed BOOLEAN DEFAULT false,
  
  -- Soft delete support
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by clerk_user_id
CREATE INDEX idx_athlete_profiles_clerk_user_id ON athlete_profiles(clerk_user_id);
CREATE INDEX idx_athlete_profiles_deleted_at ON athlete_profiles(deleted_at);

-- =============================================================================
-- 2. STRAVA TOKENS TABLE (OAuth tokens for Strava integration)
-- =============================================================================
DROP TABLE IF EXISTS strava_tokens CASCADE;

CREATE TABLE strava_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL REFERENCES athlete_profiles(clerk_user_id) ON DELETE CASCADE,
  
  -- Strava OAuth tokens
  strava_athlete_id BIGINT UNIQUE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Sync tracking
  last_sync_at TIMESTAMPTZ,
  historical_sync_completed BOOLEAN DEFAULT false,
  
  -- Soft delete support
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_strava_tokens_clerk_user_id ON strava_tokens(clerk_user_id);

-- =============================================================================
-- 3. ACTIVITIES TABLE (Training activities from Strava or manual entry)
-- =============================================================================
DROP TABLE IF EXISTS activities CASCADE;

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL REFERENCES athlete_profiles(clerk_user_id) ON DELETE CASCADE,
  
  -- Strava reference (null if manual entry)
  strava_activity_id BIGINT UNIQUE,
  
  -- Basic activity info
  name TEXT NOT NULL,
  activity_type TEXT NOT NULL DEFAULT 'Run',
  sport_type TEXT,
  description TEXT,
  
  -- Timing
  start_date TIMESTAMPTZ NOT NULL,
  start_date_local TIMESTAMPTZ,
  timezone TEXT,
  elapsed_time_seconds INTEGER,
  moving_time_seconds INTEGER,
  
  -- Distance and elevation
  distance_meters NUMERIC(12,2),
  total_elevation_gain_meters NUMERIC(8,2),
  elev_high_meters NUMERIC(8,2),
  elev_low_meters NUMERIC(8,2),
  
  -- Performance metrics
  average_speed_mps NUMERIC(8,4),
  max_speed_mps NUMERIC(8,4),
  average_cadence NUMERIC(6,2),
  average_watts NUMERIC(8,2),
  weighted_average_watts NUMERIC(8,2),
  max_watts INTEGER,
  kilojoules NUMERIC(8,2),
  
  -- Heart rate
  average_heartrate NUMERIC(5,2),
  max_heartrate INTEGER,
  
  -- Training metrics
  suffer_score INTEGER,
  calories INTEGER,
  
  -- Location
  start_latitude NUMERIC(10,7),
  start_longitude NUMERIC(10,7),
  end_latitude NUMERIC(10,7),
  end_longitude NUMERIC(10,7),
  
  -- Gear
  gear_id TEXT,
  
  -- Status flags
  is_manual BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  
  -- Soft delete support
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_clerk_user_id ON activities(clerk_user_id);
CREATE INDEX idx_activities_start_date ON activities(start_date DESC);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_strava_id ON activities(strava_activity_id);

-- =============================================================================
-- 4. DAILY METRICS TABLE (Aggregated daily training metrics)
-- =============================================================================
DROP TABLE IF EXISTS daily_metrics CASCADE;

CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL REFERENCES athlete_profiles(clerk_user_id) ON DELETE CASCADE,
  
  metric_date DATE NOT NULL,
  
  -- Training load metrics
  fitness_score NUMERIC(8,2),
  fatigue_score NUMERIC(8,2),
  form_score NUMERIC(8,2),
  training_load NUMERIC(8,2),
  
  -- Activity summaries
  total_distance_meters NUMERIC(12,2),
  total_duration_seconds INTEGER,
  total_elevation_meters NUMERIC(8,2),
  total_calories INTEGER,
  activity_count INTEGER DEFAULT 0,
  
  -- Heart rate zones (time in seconds)
  hr_zone_1_seconds INTEGER DEFAULT 0,
  hr_zone_2_seconds INTEGER DEFAULT 0,
  hr_zone_3_seconds INTEGER DEFAULT 0,
  hr_zone_4_seconds INTEGER DEFAULT 0,
  hr_zone_5_seconds INTEGER DEFAULT 0,
  
  -- Soft delete support
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(clerk_user_id, metric_date)
);

CREATE INDEX idx_daily_metrics_clerk_user_id ON daily_metrics(clerk_user_id);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(metric_date DESC);

-- =============================================================================
-- 5. WEEKLY METRICS TABLE (Aggregated weekly training metrics)
-- =============================================================================
DROP TABLE IF EXISTS weekly_metrics CASCADE;

CREATE TABLE weekly_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL REFERENCES athlete_profiles(clerk_user_id) ON DELETE CASCADE,
  
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  
  -- Volume metrics
  total_distance_meters NUMERIC(12,2),
  total_duration_seconds INTEGER,
  total_elevation_meters NUMERIC(8,2),
  total_calories INTEGER,
  activity_count INTEGER DEFAULT 0,
  
  -- Intensity metrics
  average_heart_rate NUMERIC(5,2),
  max_heart_rate INTEGER,
  average_pace_seconds_per_km NUMERIC(8,2),
  
  -- Training load
  weekly_training_load NUMERIC(8,2),
  intensity_factor NUMERIC(4,2),
  
  -- Soft delete support
  deleted_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(clerk_user_id, week_start_date)
);

CREATE INDEX idx_weekly_metrics_clerk_user_id ON weekly_metrics(clerk_user_id);
CREATE INDEX idx_weekly_metrics_week_start ON weekly_metrics(week_start_date DESC);

-- =============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for athlete_profiles (users can only access their own profile)
CREATE POLICY "Users can view own profile" ON athlete_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON athlete_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON athlete_profiles
  FOR UPDATE USING (true);

-- Policies for strava_tokens
CREATE POLICY "Users can view own tokens" ON strava_tokens
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own tokens" ON strava_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own tokens" ON strava_tokens
  FOR UPDATE USING (true);

-- Policies for activities
CREATE POLICY "Users can view own activities" ON activities
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own activities" ON activities
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own activities" ON activities
  FOR UPDATE USING (true);

-- Policies for daily_metrics
CREATE POLICY "Users can view own daily metrics" ON daily_metrics
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own daily metrics" ON daily_metrics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own daily metrics" ON daily_metrics
  FOR UPDATE USING (true);

-- Policies for weekly_metrics
CREATE POLICY "Users can view own weekly metrics" ON weekly_metrics
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own weekly metrics" ON weekly_metrics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own weekly metrics" ON weekly_metrics
  FOR UPDATE USING (true);

-- =============================================================================
-- 7. AUTO-UPDATE TIMESTAMPS TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_athlete_profiles_updated_at
  BEFORE UPDATE ON athlete_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strava_tokens_updated_at
  BEFORE UPDATE ON strava_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_metrics_updated_at
  BEFORE UPDATE ON daily_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_metrics_updated_at
  BEFORE UPDATE ON weekly_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
