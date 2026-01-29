"use server"

import { createServerClient } from "@/lib/supabase/server"
import { auth } from "@clerk/nextjs/server"
import type { AthleteProfile, Activity, DailyMetrics, WeeklyMetrics } from "@/lib/types/database"

export async function getAthleteProfile(userId?: string): Promise<AthleteProfile | null> {
  const authResult = await auth()
  const userIdToUse = userId || authResult.userId
  if (!userIdToUse) return null

  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from("athlete_profiles")
    .select("*")
    .eq("clerk_user_id", userIdToUse)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error fetching athlete profile:", error)
    return null
  }

  return data
}

// Get or create athlete profile - useful for fallback when webhook hasn't run
export async function getOrCreateAthleteProfile(userId?: string): Promise<AthleteProfile | null> {
  const authResult = await auth()
  const userIdToUse = userId || authResult.userId
  if (!userIdToUse) return null

  const supabase = await createServerClient()
  
  // First try to get existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from("athlete_profiles")
    .select("*")
    .eq("clerk_user_id", userIdToUse)
    .maybeSingle()

  if (fetchError) {
    console.error("[v0] Error fetching athlete profile:", fetchError)
    return null
  }

  if (existingProfile) {
    return existingProfile
  }

  // Profile doesn't exist, create one
  const { data: newProfile, error: insertError } = await supabase
    .from("athlete_profiles")
    .insert({
      clerk_user_id: userIdToUse,
      onboarding_completed: false,
    })
    .select()
    .single()

  if (insertError) {
    console.error("[v0] Error creating athlete profile:", insertError)
    return null
  }

  return newProfile
}

export async function getActivities(userId?: string, limit = 50): Promise<Activity[]> {
  const authResult = await auth()
  const userIdToUse = userId || authResult.userId
  if (!userIdToUse) return []

  const supabase = await createServerClient()
  
  // First get athlete profile to get athlete_id
  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("id")
    .eq("clerk_user_id", userIdToUse)
    .single()
  
  if (!profile) return []
  
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("athlete_id", profile.id)
    .order("start_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching activities:", error)
    return []
  }

  return data || []
}

export async function getRecentActivities(limit = 10): Promise<Activity[]> {
  const { userId } = await auth()
  if (!userId) return []

  const supabase = await createServerClient()
  
  // First get athlete profile to get athlete_id
  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single()
  
  if (!profile) return []
  
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("athlete_id", profile.id)
    .order("start_date", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[v0] Error fetching activities:", error)
    return []
  }

  return data || []
}

export async function getLatestDailyMetrics(): Promise<DailyMetrics | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = await createServerClient()
  
  // First get athlete profile to get athlete_id
  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single()
  
  if (!profile) return null
  
  const { data, error } = await supabase
    .from("daily_metrics")
    .select("*")
    .eq("athlete_id", profile.id)
    .order("metric_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error fetching daily metrics:", error)
    return null
  }

  return data
}

export async function getCurrentWeekMetrics(): Promise<WeeklyMetrics | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = await createServerClient()
  
  // First get athlete profile to get athlete_id
  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single()
  
  if (!profile) return null
  
  // Get current week's metrics
  const today = new Date()
  const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()))
  
  const { data, error } = await supabase
    .from("weekly_metrics")
    .select("*")
    .eq("athlete_id", profile.id)
    .gte("week_start_date", currentWeekStart.toISOString().split('T')[0])
    .order("week_start_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error fetching weekly metrics:", error)
    return null
  }

  return data
}

export async function getPreviousWeekMetrics(): Promise<WeeklyMetrics | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = await createServerClient()
  
  // First get athlete profile to get athlete_id
  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .single()
  
  if (!profile) return null
  
  // Get previous week's metrics
  const today = new Date()
  const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()))
  const previousWeekStart = new Date(currentWeekStart)
  previousWeekStart.setDate(currentWeekStart.getDate() - 7)
  
  const { data, error } = await supabase
    .from("weekly_metrics")
    .select("*")
    .eq("athlete_id", profile.id)
    .gte("week_start_date", previousWeekStart.toISOString().split('T')[0])
    .lt("week_start_date", currentWeekStart.toISOString().split('T')[0])
    .order("week_start_date", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error fetching previous week metrics:", error)
    return null
  }

  return data
}

export async function getActivitiesByDateRange(startDate: string, endDate: string): Promise<Activity[]> {
  const { userId } = await auth()
  if (!userId) return []

  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("clerk_user_id", userId)
    .gte("start_date", startDate)
    .lte("start_date", endDate)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching activities by date range:", error)
    return []
  }

  return data || []
}

export async function updateAthleteProfile(profileData: Partial<AthleteProfile>): Promise<boolean> {
  const { userId } = await auth()
  if (!userId) return false

  const supabase = await createServerClient()
  
  const { error } = await supabase
    .from("athlete_profiles")
    .upsert({
      clerk_user_id: userId,
      ...profileData,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error("[v0] Error updating athlete profile:", error)
    return false
  }

  return true
}

export async function getStravaConnectionStatus(userId?: string): Promise<{ connected: boolean; lastSyncAt: string | null }> {
  try {
    // If userId is not provided, try to get it from auth
    let userIdToUse = userId
    if (!userIdToUse) {
      const authResult = await auth()
      userIdToUse = authResult.userId ?? undefined
    }
    
    if (!userIdToUse) return { connected: false, lastSyncAt: null }

    const supabase = await createServerClient()
    
    // First get athlete profile to get athlete_id
    const { data: profile } = await supabase
      .from("athlete_profiles")
      .select("id")
      .eq("clerk_user_id", userIdToUse)
      .single()
    
    if (!profile) return { connected: false, lastSyncAt: null }
    
    const { data: tokenData, error: tokenError } = await supabase
      .from("strava_tokens")
      .select("access_token")
      .eq("athlete_id", profile.id)
      .maybeSingle()

    if (tokenError) {
      console.error("Error fetching Strava status:", tokenError)
      return { connected: false, lastSyncAt: null }
    }

    if (!tokenData?.access_token) {
      return { connected: false, lastSyncAt: null }
    }
    
    // Get sync state for last sync time
    const { data: syncState } = await supabase
      .from("strava_sync_state")
      .select("last_synced_at")
      .eq("athlete_id", profile.id)
      .single()

    return { 
      connected: true, 
      lastSyncAt: syncState?.last_synced_at || null
    }
  } catch (error) {
    console.error("Unexpected error in getStravaConnectionStatus:", error)
    return { connected: false, lastSyncAt: null }
  }
}
