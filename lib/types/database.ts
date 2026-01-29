export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      athlete_profiles: {
        Row: {
          id: string
          clerk_user_id: string
          display_name: string | null
          email: string | null
          date_of_birth: string | null
          gender: string | null
          height_cm: number | null
          weight_kg: number | null
          preferred_sport: string | null
          experience_level: string | null
          weekly_training_hours: number | null
          resting_heart_rate: number | null
          max_heart_rate: number | null
          ftp_watts: number | null
          lactate_threshold_hr: number | null
          onboarding_completed: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          display_name?: string | null
          email?: string | null
          date_of_birth?: string | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          preferred_sport?: string | null
          experience_level?: string | null
          weekly_training_hours?: number | null
          resting_heart_rate?: number | null
          max_heart_rate?: number | null
          ftp_watts?: number | null
          lactate_threshold_hr?: number | null
          onboarding_completed?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          display_name?: string | null
          email?: string | null
          date_of_birth?: string | null
          gender?: string | null
          height_cm?: number | null
          weight_kg?: number | null
          preferred_sport?: string | null
          experience_level?: string | null
          weekly_training_hours?: number | null
          resting_heart_rate?: number | null
          max_heart_rate?: number | null
          ftp_watts?: number | null
          lactate_threshold_hr?: number | null
          onboarding_completed?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      strava_tokens: {
        Row: {
          id: string
          clerk_user_id: string
          strava_athlete_id: number | null
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          last_sync_at: string | null
          historical_sync_completed: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          strava_athlete_id?: number | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          last_sync_at?: string | null
          historical_sync_completed?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          strava_athlete_id?: number | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          last_sync_at?: string | null
          historical_sync_completed?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          clerk_user_id: string
          strava_activity_id: number | null
          name: string
          activity_type: string
          sport_type: string | null
          description: string | null
          start_date: string
          start_date_local: string | null
          timezone: string | null
          elapsed_time_seconds: number | null
          moving_time_seconds: number | null
          distance_meters: number | null
          total_elevation_gain_meters: number | null
          elev_high_meters: number | null
          elev_low_meters: number | null
          average_speed_mps: number | null
          max_speed_mps: number | null
          average_cadence: number | null
          average_watts: number | null
          weighted_average_watts: number | null
          max_watts: number | null
          kilojoules: number | null
          average_heartrate: number | null
          max_heartrate: number | null
          suffer_score: number | null
          calories: number | null
          start_latitude: number | null
          start_longitude: number | null
          end_latitude: number | null
          end_longitude: number | null
          gear_id: string | null
          is_manual: boolean
          is_private: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          strava_activity_id?: number | null
          name: string
          activity_type?: string
          sport_type?: string | null
          description?: string | null
          start_date: string
          start_date_local?: string | null
          timezone?: string | null
          elapsed_time_seconds?: number | null
          moving_time_seconds?: number | null
          distance_meters?: number | null
          total_elevation_gain_meters?: number | null
          elev_high_meters?: number | null
          elev_low_meters?: number | null
          average_speed_mps?: number | null
          max_speed_mps?: number | null
          average_cadence?: number | null
          average_watts?: number | null
          weighted_average_watts?: number | null
          max_watts?: number | null
          kilojoules?: number | null
          average_heartrate?: number | null
          max_heartrate?: number | null
          suffer_score?: number | null
          calories?: number | null
          start_latitude?: number | null
          start_longitude?: number | null
          end_latitude?: number | null
          end_longitude?: number | null
          gear_id?: string | null
          is_manual?: boolean
          is_private?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          strava_activity_id?: number | null
          name?: string
          activity_type?: string
          sport_type?: string | null
          description?: string | null
          start_date?: string
          start_date_local?: string | null
          timezone?: string | null
          elapsed_time_seconds?: number | null
          moving_time_seconds?: number | null
          distance_meters?: number | null
          total_elevation_gain_meters?: number | null
          elev_high_meters?: number | null
          elev_low_meters?: number | null
          average_speed_mps?: number | null
          max_speed_mps?: number | null
          average_cadence?: number | null
          average_watts?: number | null
          weighted_average_watts?: number | null
          max_watts?: number | null
          kilojoules?: number | null
          average_heartrate?: number | null
          max_heartrate?: number | null
          suffer_score?: number | null
          calories?: number | null
          start_latitude?: number | null
          start_longitude?: number | null
          end_latitude?: number | null
          end_longitude?: number | null
          gear_id?: string | null
          is_manual?: boolean
          is_private?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_metrics: {
        Row: {
          id: string
          clerk_user_id: string
          metric_date: string
          fitness_score: number | null
          fatigue_score: number | null
          form_score: number | null
          training_load: number | null
          resting_heart_rate: number | null
          hrv: number | null
          sleep_hours: number | null
          sleep_quality: number | null
          calories_consumed: number | null
          calories_burned: number | null
          hydration_ml: number | null
          notes: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          metric_date: string
          fitness_score?: number | null
          fatigue_score?: number | null
          form_score?: number | null
          training_load?: number | null
          resting_heart_rate?: number | null
          hrv?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          calories_consumed?: number | null
          calories_burned?: number | null
          hydration_ml?: number | null
          notes?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          metric_date?: string
          fitness_score?: number | null
          fatigue_score?: number | null
          form_score?: number | null
          training_load?: number | null
          resting_heart_rate?: number | null
          hrv?: number | null
          sleep_hours?: number | null
          sleep_quality?: number | null
          calories_consumed?: number | null
          calories_burned?: number | null
          hydration_ml?: number | null
          notes?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      weekly_metrics: {
        Row: {
          id: string
          clerk_user_id: string
          week_start_date: string
          total_distance_meters: number | null
          total_duration_seconds: number | null
          total_elevation_meters: number | null
          activity_count: number | null
          average_pace_per_km: number | null
          average_heart_rate: number | null
          total_calories: number | null
          longest_activity_meters: number | null
          training_load_sum: number | null
          fitness_trend: number | null
          fatigue_trend: number | null
          notes: string | null
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          week_start_date: string
          total_distance_meters?: number | null
          total_duration_seconds?: number | null
          total_elevation_meters?: number | null
          activity_count?: number | null
          average_pace_per_km?: number | null
          average_heart_rate?: number | null
          total_calories?: number | null
          longest_activity_meters?: number | null
          training_load_sum?: number | null
          fitness_trend?: number | null
          fatigue_trend?: number | null
          notes?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          week_start_date?: string
          total_distance_meters?: number | null
          total_duration_seconds?: number | null
          total_elevation_meters?: number | null
          activity_count?: number | null
          average_pace_per_km?: number | null
          average_heart_rate?: number | null
          total_calories?: number | null
          longest_activity_meters?: number | null
          training_load_sum?: number | null
          fitness_trend?: number | null
          fatigue_trend?: number | null
          notes?: string | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

// Helper types for easier usage
export type AthleteProfile = Database["public"]["Tables"]["athlete_profiles"]["Row"]
export type AthleteProfileInsert = Database["public"]["Tables"]["athlete_profiles"]["Insert"]
export type AthleteProfileUpdate = Database["public"]["Tables"]["athlete_profiles"]["Update"]

export type StravaToken = Database["public"]["Tables"]["strava_tokens"]["Row"]
export type StravaTokenInsert = Database["public"]["Tables"]["strava_tokens"]["Insert"]
export type StravaTokenUpdate = Database["public"]["Tables"]["strava_tokens"]["Update"]

export type Activity = Database["public"]["Tables"]["activities"]["Row"]
export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"]
export type ActivityUpdate = Database["public"]["Tables"]["activities"]["Update"]

export type DailyMetrics = Database["public"]["Tables"]["daily_metrics"]["Row"]
export type DailyMetricsInsert = Database["public"]["Tables"]["daily_metrics"]["Insert"]
export type DailyMetricsUpdate = Database["public"]["Tables"]["daily_metrics"]["Update"]

export type WeeklyMetrics = Database["public"]["Tables"]["weekly_metrics"]["Row"]
export type WeeklyMetricsInsert = Database["public"]["Tables"]["weekly_metrics"]["Insert"]
export type WeeklyMetricsUpdate = Database["public"]["Tables"]["weekly_metrics"]["Update"]
