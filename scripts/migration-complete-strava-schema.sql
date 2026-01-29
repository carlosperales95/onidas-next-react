-- Migration: Add missing columns and tables for Strava integration

-- Step 1: Ensure athlete_profiles has strava_athlete_id column
ALTER TABLE athlete_profiles
ADD COLUMN IF NOT EXISTS strava_athlete_id BIGINT UNIQUE;

-- Step 2: Ensure strava_tokens table structure is correct
-- The migration script already recreated it, but let's ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_tokens_athlete ON strava_tokens(athlete_id);
CREATE INDEX IF NOT EXISTS idx_tokens_clerk_user_id ON strava_tokens(clerk_user_id);

-- Step 3: Create training_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS training_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  
  -- Información básica
  log_date TIMESTAMPTZ NOT NULL,
  activity_name TEXT,
  activity_type TEXT,
  
  -- Métricas de la sesión
  duration_minutes INTEGER,
  distance_km DECIMAL(10,2),
  elevation_gain_m DECIMAL(8,2),
  average_heart_rate INTEGER,
  max_heart_rate INTEGER,
  average_power_watts DECIMAL(8,2),
  max_power_watts DECIMAL(8,2),
  calories_burned DECIMAL(8,2),
  
  -- Datos percibidos/subjetivos
  perceived_exertion INTEGER,
  notes TEXT,
  
  -- Sincronización de Strava
  synced_from_strava BOOLEAN DEFAULT false,
  strava_activity_id BIGINT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create indexes for training_logs
CREATE INDEX IF NOT EXISTS idx_training_logs_athlete ON training_logs(athlete_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_date ON training_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_training_logs_athlete_date ON training_logs(athlete_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_training_logs_strava_id ON training_logs(strava_activity_id);

-- Step 5: Create or replace update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger for training_logs if it doesn't exist
DROP TRIGGER IF EXISTS update_training_logs_updated_at ON training_logs;
CREATE TRIGGER update_training_logs_updated_at BEFORE UPDATE ON training_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Ensure strava_sync_state table has correct structure
ALTER TABLE strava_sync_state
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sync_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS initial_backfill_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_error TEXT,
ADD COLUMN IF NOT EXISTS error_count INTEGER DEFAULT 0;

-- Step 8: Enable RLS on training_logs
ALTER TABLE training_logs ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies for training_logs
DROP POLICY IF EXISTS "Users can view own training logs" ON training_logs;
CREATE POLICY "Users can view own training logs" ON training_logs
  FOR SELECT USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

DROP POLICY IF EXISTS "Users can insert own training logs" ON training_logs;
CREATE POLICY "Users can insert own training logs" ON training_logs
  FOR INSERT WITH CHECK (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

DROP POLICY IF EXISTS "Users can update own training logs" ON training_logs;
CREATE POLICY "Users can update own training logs" ON training_logs
  FOR UPDATE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

DROP POLICY IF EXISTS "Users can delete own training logs" ON training_logs;
CREATE POLICY "Users can delete own training logs" ON training_logs
  FOR DELETE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );
