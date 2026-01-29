import { currentUser } from "@clerk/nextjs/server"
import { 
  getOrCreateAthleteProfile, 
  getCurrentWeekMetrics, 
  getPreviousWeekMetrics,
  getLatestDailyMetrics,
  getStravaConnectionStatus 
} from "@/lib/data/athlete-data"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const user = await currentUser()
  const userName = user?.firstName || user?.username || "Athlete"

  // Get or create athlete profile first (ensures profile exists)
  const profile = await getOrCreateAthleteProfile()

  // Fetch all data in parallel
  const [
    weeklyMetrics,
    previousWeekMetrics,
    dailyMetrics,
    stravaStatus
  ] = await Promise.all([
    getCurrentWeekMetrics(),
    getPreviousWeekMetrics(),
    getLatestDailyMetrics(),
    getStravaConnectionStatus()
  ])

  // Check if data exists
  const hasData = !!(weeklyMetrics || dailyMetrics)

  // Prepare data for the client component - map database columns to component props
  const weeklyStats = {
    totalDistance: weeklyMetrics?.total_distance_meters ? weeklyMetrics.total_distance_meters / 1000 : 0, // Convert meters to km
    totalTime: weeklyMetrics?.total_duration_seconds ? weeklyMetrics.total_duration_seconds / 3600 : 0, // Convert seconds to hours
    totalActivities: weeklyMetrics?.activity_count || 0,
    avgHeartRate: weeklyMetrics?.average_heart_rate || 0,
  }

  const previousWeekStats = previousWeekMetrics ? {
    totalDistance: previousWeekMetrics.total_distance_meters ? previousWeekMetrics.total_distance_meters / 1000 : 0,
    totalTime: previousWeekMetrics.total_duration_seconds ? previousWeekMetrics.total_duration_seconds / 3600 : 0,
    totalActivities: previousWeekMetrics.activity_count || 0,
    avgHeartRate: previousWeekMetrics.average_heart_rate || 0,
  } : null

  const latestMetrics = dailyMetrics ? {
    fitnessScore: dailyMetrics.fitness_score,
    fatigueScore: dailyMetrics.fatigue_score,
    formScore: dailyMetrics.form_score,
    acuteLoad: dailyMetrics.training_load, // training_load is the column in daily_metrics
    chronicLoad: null, // No chronic_training_load column exists
  } : null

  // Mock benchmarks - would come from cohort analysis in production
  const benchmarks = profile ? {
    cohortSize: 1247,
    gender: profile.gender || undefined,
    ageRange: profile.age ? { min: Math.floor(profile.age / 10) * 10, max: Math.floor(profile.age / 10) * 10 + 9 } : undefined,
    weeklyStats: {
      totalDistance: 70,
      totalTime: 65,
      totalActivities: 55,
      avgHeartRate: 60,
    },
    trainingLoad: {
      fitnessScore: 72,
      fatigueScore: 58,
      formScore: 68,
    },
  } : null

  const stravaConnection = {
    status: stravaStatus.connected ? "connected" : "disconnected",
    historicalSyncCompleted: stravaStatus.connected,
    lastSyncAt: stravaStatus.lastSyncAt,
  }

  return (
    <DashboardClient
      userName={userName}
      hasData={hasData}
      weeklyStats={weeklyStats}
      previousWeekStats={previousWeekStats}
      latestMetrics={latestMetrics}
      benchmarks={benchmarks}
      stravaConnection={stravaConnection}
    />
  )
}
