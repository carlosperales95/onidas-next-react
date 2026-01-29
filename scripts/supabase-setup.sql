-- AthleteHub - Supabase Database Schema
-- Migración inicial para almacenar datos de Strava

-- =====================================================
-- 1. TABLA DE USUARIOS (PERFILES)
-- =====================================================
-- Almacena información del atleta vinculada con Clerk ID
CREATE TABLE IF NOT EXISTS athlete_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- ID de Clerk para vincular autenticación
  strava_athlete_id BIGINT UNIQUE, -- ID del atleta en Strava
  
  -- Información personal
  username TEXT,
  firstname TEXT,
  lastname TEXT,
  sex TEXT CHECK (sex IN ('M', 'F', 'Other')),
  
  -- Información física
  weight DECIMAL(5,2), -- en kg
  height DECIMAL(5,2), -- en cm
  age INTEGER,
  ftp INTEGER, -- Functional Threshold Power
  max_heart_rate INTEGER,
  resting_heart_rate INTEGER,
  
  -- Ubicación
  country TEXT,
  city TEXT,
  state TEXT,
  
  -- Preferencias
  measurement_preference TEXT DEFAULT 'metric' CHECK (measurement_preference IN ('metric', 'imperial')),
  timezone TEXT,
  
  -- Perfil de Strava
  profile_medium TEXT, -- URL imagen perfil
  profile TEXT, -- URL imagen grande
  premium BOOLEAN DEFAULT false,
  summit BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  strava_created_at TIMESTAMPTZ,
  strava_updated_at TIMESTAMPTZ
);

-- Índices para athlete_profiles
CREATE INDEX IF NOT EXISTS idx_athlete_clerk_id ON athlete_profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_athlete_strava_id ON athlete_profiles(strava_athlete_id);

-- =====================================================
-- 2. TABLA DE TOKENS DE STRAVA (SEGURA)
-- =====================================================
CREATE TABLE IF NOT EXISTS strava_tokens (
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

-- Índice para strava_tokens
CREATE INDEX IF NOT EXISTS idx_tokens_athlete ON strava_tokens(athlete_id);
CREATE INDEX IF NOT EXISTS idx_tokens_clerk_user_id ON strava_tokens(clerk_user_id);

-- =====================================================
-- 3. TABLA DE ACTIVIDADES (CORE)
-- =====================================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  
  -- IDs de Strava
  strava_activity_id BIGINT UNIQUE NOT NULL,
  upload_id BIGINT,
  external_id TEXT,
  
  -- Metadata básica
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- Run, Ride, Swim, etc.
  sport_type TEXT,
  description TEXT,
  
  -- Fechas y ubicación
  start_date TIMESTAMPTZ NOT NULL,
  start_date_local TIMESTAMPTZ NOT NULL,
  timezone TEXT,
  utc_offset DECIMAL,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT,
  
  -- Flags
  trainer BOOLEAN DEFAULT false,
  commute BOOLEAN DEFAULT false,
  manual BOOLEAN DEFAULT false,
  private BOOLEAN DEFAULT false,
  flagged BOOLEAN DEFAULT false,
  
  -- Distancia y tiempo
  distance DECIMAL(10,2), -- metros
  moving_time INTEGER, -- segundos
  elapsed_time INTEGER, -- segundos
  total_elevation_gain DECIMAL(8,2), -- metros
  
  -- Velocidad
  average_speed DECIMAL(8,4), -- m/s
  max_speed DECIMAL(8,4), -- m/s
  
  -- Frecuencia cardíaca
  average_heartrate DECIMAL(6,2),
  max_heartrate INTEGER,
  has_heartrate BOOLEAN DEFAULT false,
  
  -- Potencia
  average_watts DECIMAL(8,2),
  max_watts DECIMAL(8,2),
  weighted_average_watts DECIMAL(8,2),
  kilojoules DECIMAL(10,2),
  device_watts BOOLEAN DEFAULT false,
  has_power BOOLEAN DEFAULT false,
  
  -- Otras métricas
  average_cadence DECIMAL(6,2),
  average_temp DECIMAL(5,2),
  calories DECIMAL(8,2),
  
  -- Métricas de esfuerzo
  suffer_score INTEGER,
  perceived_exertion INTEGER,
  
  -- Social
  achievement_count INTEGER DEFAULT 0,
  kudos_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  athlete_count INTEGER DEFAULT 0,
  photo_count INTEGER DEFAULT 0,
  total_photo_count INTEGER DEFAULT 0,
  
  -- Mapa
  map_summary_polyline TEXT,
  map_polyline TEXT,
  
  -- Equipment
  gear_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Métricas calculadas (para optimización)
  calculated_load DECIMAL(10,2),
  calculated_intensity DECIMAL(5,2),
  calculated_trimp DECIMAL(10,2)
);

-- Índices para activities
CREATE INDEX IF NOT EXISTS idx_activities_athlete ON activities(athlete_id);
CREATE INDEX IF NOT EXISTS idx_activities_strava_id ON activities(strava_activity_id);
CREATE INDEX IF NOT EXISTS idx_activities_start_date ON activities(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_athlete_date ON activities(athlete_id, start_date DESC);

-- =====================================================
-- 4. TABLA DE STREAMS (DATOS DE ALTA RESOLUCIÓN)
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  
  stream_type TEXT NOT NULL, -- time, distance, latlng, altitude, heartrate, cadence, watts, temp, velocity_smooth
  data JSONB NOT NULL, -- Array de datos
  original_size INTEGER,
  resolution TEXT, -- low, medium, high
  series_type TEXT, -- distance, time
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(activity_id, stream_type)
);

-- Índices para activity_streams
CREATE INDEX IF NOT EXISTS idx_streams_activity ON activity_streams(activity_id);
CREATE INDEX IF NOT EXISTS idx_streams_type ON activity_streams(stream_type);

-- =====================================================
-- 5. TABLA DE LAPS/SPLITS
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_laps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  
  lap_index INTEGER NOT NULL,
  name TEXT,
  
  -- Distancia y tiempo
  distance DECIMAL(10,2),
  moving_time INTEGER,
  elapsed_time INTEGER,
  
  -- Velocidad
  average_speed DECIMAL(8,4),
  max_speed DECIMAL(8,4),
  
  -- Frecuencia cardíaca
  average_heartrate DECIMAL(6,2),
  max_heartrate INTEGER,
  
  -- Potencia
  average_watts DECIMAL(8,2),
  max_watts DECIMAL(8,2),
  
  -- Elevación
  total_elevation_gain DECIMAL(8,2),
  
  -- Otras
  average_cadence DECIMAL(6,2),
  
  -- Split type
  split INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(activity_id, lap_index)
);

-- Índices para activity_laps
CREATE INDEX IF NOT EXISTS idx_laps_activity ON activity_laps(activity_id);

-- =====================================================
-- 6. TABLA DE BEST EFFORTS
-- =====================================================
CREATE TABLE IF NOT EXISTS best_efforts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL, -- "400m", "1/2 mile", "1k", "1 mile", "2 mile", "5k", "10k", "15k", "10 mile", "20k", "Half-Marathon", "Marathon"
  
  -- Tiempo y distancia
  elapsed_time INTEGER NOT NULL, -- segundos
  moving_time INTEGER,
  distance DECIMAL(10,2),
  
  -- Fechas
  start_date TIMESTAMPTZ,
  start_date_local TIMESTAMPTZ,
  
  -- PR flag
  pr_rank INTEGER, -- 1 = PR, 2 = 2nd best, etc.
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(activity_id, name)
);

-- Índices para best_efforts
CREATE INDEX IF NOT EXISTS idx_best_efforts_activity ON best_efforts(activity_id);
CREATE INDEX IF NOT EXISTS idx_best_efforts_athlete ON best_efforts(athlete_id);
CREATE INDEX IF NOT EXISTS idx_best_efforts_name ON best_efforts(name);

-- =====================================================
-- 7. TABLA DE ZONAS DEL ATLETA
-- =====================================================
CREATE TABLE IF NOT EXISTS athlete_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  
  zone_type TEXT NOT NULL CHECK (zone_type IN ('heartrate', 'power')),
  
  -- Zonas (JSON con límites)
  zones JSONB NOT NULL, -- [{min: 0, max: 142}, {min: 142, max: 155}, ...]
  
  -- Valor base
  base_value INTEGER, -- FTP para power, max HR para heartrate
  
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(athlete_id, zone_type, valid_from)
);

-- Índices para athlete_zones
CREATE INDEX IF NOT EXISTS idx_zones_athlete ON athlete_zones(athlete_id);
CREATE INDEX IF NOT EXISTS idx_zones_type ON athlete_zones(zone_type);

-- =====================================================
-- 8. TABLA DE MÉTRICAS DIARIAS (AGREGADOS)
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  
  metric_date DATE NOT NULL,
  
  -- Totales del día
  total_distance DECIMAL(10,2) DEFAULT 0,
  total_moving_time INTEGER DEFAULT 0,
  total_elapsed_time INTEGER DEFAULT 0,
  total_elevation_gain DECIMAL(10,2) DEFAULT 0,
  total_calories DECIMAL(10,2) DEFAULT 0,
  
  -- Conteos
  activities_count INTEGER DEFAULT 0,
  
  -- Intensidad
  average_heartrate DECIMAL(6,2),
  average_watts DECIMAL(8,2),
  
  -- Métricas calculadas
  training_load DECIMAL(10,2), -- Carga de entrenamiento
  training_stress_score DECIMAL(10,2), -- TSS
  trimp DECIMAL(10,2), -- Training Impulse
  
  -- Ventanas móviles
  load_7d DECIMAL(10,2), -- Carga últimos 7 días
  load_28d DECIMAL(10,2), -- Carga últimos 28 días
  acwr DECIMAL(5,2), -- Acute:Chronic Workload Ratio
  
  -- Tiempo en zonas (minutos)
  time_zone1 INTEGER DEFAULT 0,
  time_zone2 INTEGER DEFAULT 0,
  time_zone3 INTEGER DEFAULT 0,
  time_zone4 INTEGER DEFAULT 0,
  time_zone5 INTEGER DEFAULT 0,
  
  -- Semáforo de forma
  fitness_score DECIMAL(6,2),
  fatigue_score DECIMAL(6,2),
  form_score DECIMAL(6,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(athlete_id, metric_date)
);

-- Índices para daily_metrics
CREATE INDEX IF NOT EXISTS idx_daily_athlete ON daily_metrics(athlete_id);
CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_athlete_date ON daily_metrics(athlete_id, metric_date DESC);

-- =====================================================
-- 9. TABLA DE MÉTRICAS SEMANALES
-- =====================================================
CREATE TABLE IF NOT EXISTS weekly_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  
  week_start_date DATE NOT NULL, -- Lunes de esa semana
  year INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  
  -- Totales de la semana
  total_distance DECIMAL(10,2) DEFAULT 0,
  total_moving_time INTEGER DEFAULT 0,
  total_elevation_gain DECIMAL(10,2) DEFAULT 0,
  total_calories DECIMAL(10,2) DEFAULT 0,
  activities_count INTEGER DEFAULT 0,
  
  -- Intensidad promedio
  average_heartrate DECIMAL(6,2),
  average_watts DECIMAL(8,2),
  
  -- Métricas calculadas
  training_load DECIMAL(10,2),
  training_stress_score DECIMAL(10,2),
  
  -- Comparación con semana anterior
  distance_change_pct DECIMAL(5,2),
  load_change_pct DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(athlete_id, week_start_date)
);

-- Índices para weekly_metrics
CREATE INDEX IF NOT EXISTS idx_weekly_athlete ON weekly_metrics(athlete_id);
CREATE INDEX IF NOT EXISTS idx_weekly_date ON weekly_metrics(week_start_date DESC);

-- =====================================================
-- 10. TABLA DE TRAINING LOGS (REGISTRO DE ENTRENAMIENTOS DEL USUARIO)
-- =====================================================
CREATE TABLE IF NOT EXISTS training_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  
  -- Información básica
  log_date TIMESTAMPTZ NOT NULL,
  activity_name TEXT,
  activity_type TEXT, -- Run, Ride, Swim, etc.
  
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
  perceived_exertion INTEGER, -- 1-10 RPE scale
  notes TEXT,
  
  -- Sincronización de Strava
  synced_from_strava BOOLEAN DEFAULT false,
  strava_activity_id BIGINT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para training_logs
CREATE INDEX IF NOT EXISTS idx_training_logs_athlete ON training_logs(athlete_id);
CREATE INDEX IF NOT EXISTS idx_training_logs_date ON training_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_training_logs_athlete_date ON training_logs(athlete_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_training_logs_strava_id ON training_logs(strava_activity_id);

-- Trigger para training_logs updated_at
CREATE TRIGGER update_training_logs_updated_at BEFORE UPDATE ON training_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 11. TABLA DE ESTADO DE SINCRONIZACIÓN
-- =====================================================
CREATE TABLE IF NOT EXISTS strava_sync_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  
  -- Estado de sincronización
  last_synced_at TIMESTAMPTZ,
  last_activity_date TIMESTAMPTZ,
  last_activity_id BIGINT,
  
  -- Control de paginación
  page_cursor TEXT,
  etag TEXT,
  
  -- Estado
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'completed', 'error')),
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Estadísticas
  total_activities_synced INTEGER DEFAULT 0,
  initial_backfill_completed BOOLEAN DEFAULT false,
  backfill_from_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(athlete_id)
);

-- Índices para strava_sync_state
CREATE INDEX IF NOT EXISTS idx_sync_athlete ON strava_sync_state(athlete_id);
CREATE INDEX IF NOT EXISTS idx_sync_status ON strava_sync_state(sync_status);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_athlete_profiles_updated_at BEFORE UPDATE ON athlete_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strava_tokens_updated_at BEFORE UPDATE ON strava_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_metrics_updated_at BEFORE UPDATE ON daily_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_metrics_updated_at BEFORE UPDATE ON weekly_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strava_sync_state_updated_at BEFORE UPDATE ON strava_sync_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_laps ENABLE ROW LEVEL SECURITY;
ALTER TABLE best_efforts ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE strava_sync_state ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Los usuarios solo pueden ver/modificar sus propios datos

-- athlete_profiles
CREATE POLICY "Users can view own profile" ON athlete_profiles
  FOR SELECT USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own profile" ON athlete_profiles
  FOR UPDATE USING (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own profile" ON athlete_profiles
  FOR INSERT WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

-- strava_tokens
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

-- activities
CREATE POLICY "Users can view own activities" ON activities
  FOR SELECT USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can insert own activities" ON activities
  FOR INSERT WITH CHECK (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own activities" ON activities
  FOR UPDATE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can delete own activities" ON activities
  FOR DELETE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- training_logs
CREATE POLICY "Users can view own training logs" ON training_logs
  FOR SELECT USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can insert own training logs" ON training_logs
  FOR INSERT WITH CHECK (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can update own training logs" ON training_logs
  FOR UPDATE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

CREATE POLICY "Users can delete own training logs" ON training_logs
  FOR DELETE USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- Similar policies for other tables (activity_streams, activity_laps, etc.)
-- Note: Estas se aplicarían automáticamente por las foreign keys con CASCADE

-- =====================================================
-- COMENTARIOS EN TABLAS
-- =====================================================

COMMENT ON TABLE athlete_profiles IS 'Perfiles de atletas vinculados con Clerk para autenticación';
COMMENT ON TABLE strava_tokens IS 'Tokens de OAuth de Strava (access/refresh) - tabla segura con RLS';
COMMENT ON TABLE activities IS 'Actividades importadas de Strava - tabla principal del producto';
COMMENT ON TABLE activity_streams IS 'Datos de alta resolución (time series) de actividades';
COMMENT ON TABLE activity_laps IS 'Vueltas/splits de cada actividad';
COMMENT ON TABLE best_efforts IS 'Mejores esfuerzos y PRs de los atletas';
COMMENT ON TABLE athlete_zones IS 'Zonas de entrenamiento (FC y potencia) del atleta';
COMMENT ON TABLE daily_metrics IS 'Métricas agregadas por día para análisis rápido';
COMMENT ON TABLE weekly_metrics IS 'Métricas agregadas por semana';
COMMENT ON TABLE strava_sync_state IS 'Estado de sincronización con Strava para cada atleta';
