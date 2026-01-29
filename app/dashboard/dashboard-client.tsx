"use client"

import { Activity, Clock, TrendingUp, Heart, Zap, Info, AlertCircle, AlertTriangle, Download } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { Navigation } from "@/components/navigation"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { EmptyState } from "@/components/empty-state"
import { useTranslation } from "@/lib/hooks/use-translation"
import { useRouter } from "next/navigation"

interface DashboardClientProps {
  userName: string
  hasData: boolean
  weeklyStats: {
    totalDistance: number
    totalTime: number
    totalActivities: number
    avgHeartRate: number
  }
  previousWeekStats: {
    totalDistance: number
    totalTime: number
    totalActivities: number
    avgHeartRate: number
  } | null
  latestMetrics: {
    fitnessScore: number | null
    fatigueScore: number | null
    formScore: number | null
    acuteLoad: number | null
    chronicLoad: number | null
  } | null
  benchmarks: {
    cohortSize: number
    gender?: string
    ageRange?: { min: number; max: number }
    weeklyStats: {
      totalDistance: number
      totalTime: number
      totalActivities: number
      avgHeartRate: number
    }
    trainingLoad: {
      fitnessScore: number
      fatigueScore: number
      formScore: number
    }
  } | null
  stravaConnection: {
    status: string
    historicalSyncCompleted: boolean
    lastSyncAt: string | null
  }
}

export function DashboardClient({
  userName,
  hasData,
  weeklyStats,
  previousWeekStats,
  latestMetrics,
  benchmarks,
  stravaConnection
}: DashboardClientProps) {
  const { t } = useTranslation()
  const router = useRouter()

  // Calculate training time comparison
  const trainingTimeComparison = (() => {
    if (!previousWeekStats?.totalTime || previousWeekStats.totalTime === 0) {
      return null
    }
    const currentTime = weeklyStats.totalTime
    const previousTime = previousWeekStats.totalTime
    const percentageChange = ((currentTime - previousTime) / previousTime) * 100

    return {
      currentTime,
      previousTime,
      percentageChange,
      isIncrease: percentageChange > 0,
      formattedChange: (percentageChange > 0 ? "+" : "") + percentageChange.toFixed(1),
    }
  })()

  // Analyze injury risk
  const getInjuryRisk = (acuteLoad: number | null | undefined, chronicLoad: number | null | undefined) => {
    if (!acuteLoad || !chronicLoad) return null
    const ratio = acuteLoad / chronicLoad

    if (ratio > 1.5) {
      return {
        level: "high",
        message: "You're training significantly harder than usual. High injury risk - consider reducing volume.",
        color: "text-rose-900",
        bgColor: "bg-rose-100",
        borderColor: "border-rose-300",
      }
    } else if (ratio > 1.3) {
      return {
        level: "moderate",
        message: "Training load is elevated. Monitor how you feel and prioritize recovery.",
        color: "text-amber-900",
        bgColor: "bg-amber-100",
        borderColor: "border-amber-300",
      }
    } else if (ratio < 0.8) {
      return {
        level: "low",
        message: "Training load is lower than usual. You may be ready to increase intensity.",
        color: "text-sky-900",
        bgColor: "bg-sky-100",
        borderColor: "border-sky-300",
      }
    }

    return {
      level: "optimal",
      message: "Training load is well balanced. Great job managing your workload!",
      color: "text-emerald-900",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-300",
    }
  }

  const injuryRisk = getInjuryRisk(latestMetrics?.acuteLoad, latestMetrics?.chronicLoad)

  // If no data exists, show empty state
  if (!hasData) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-blue-500/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative z-10">
          <Navigation />
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-5xl font-bebas tracking-wider text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-blue-400 bg-clip-text drop-shadow-2xl uppercase">
                Welcome, {userName}!
              </h1>
              <p className="mt-4 text-xl text-white/90 drop-shadow-lg font-oswald">Your training dashboard</p>
            </div>

            <EmptyState
              icon={Activity}
              title="No Training Data Yet"
              description="Connect your Strava account to start tracking your training progress and get personalized insights."
              action={{
                label: "Connect Strava",
                onClick: () => router.push("/settings")
              }}
            />
          </div>
          <ChatbotWidget />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-5xl font-bebas tracking-wider text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-blue-400 bg-clip-text drop-shadow-2xl uppercase">
              {t.dashboard.welcome}, {userName}!
            </h1>
            <p className="mt-4 text-xl text-white/90 drop-shadow-lg font-oswald">{t.dashboard.overview}</p>
          </div>

          {/* Strava Import Banner */}
          {stravaConnection?.status === "connected" && !stravaConnection?.historicalSyncCompleted && (
            <div className="mb-8 group relative rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-red-600/30"></div>
              <div className="relative backdrop-blur-md bg-black/30 p-6 border-2 border-orange-400/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Download className="h-6 w-6 flex-shrink-0 mt-1 text-orange-400 drop-shadow-lg" />
                    <div>
                      <h3 className="text-xl font-bebas tracking-wider text-orange-300 drop-shadow-lg uppercase">{t.dashboard.stravaSync.title}</h3>
                      <p className="mt-2 text-base text-white/90 drop-shadow font-oswald">{t.dashboard.stravaSync.description}</p>
                    </div>
                  </div>
                  <button className="flex-shrink-0 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 text-sm font-bebas tracking-wider text-white hover:from-orange-700 hover:to-red-700 shadow-2xl transition-all hover:scale-105 border-2 border-orange-400/50">
                    {t.dashboard.stravaSync.button}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Last Sync Status */}
          {stravaConnection?.status === "connected" &&
            stravaConnection?.historicalSyncCompleted &&
            stravaConnection?.lastSyncAt && (
              <div className="mb-6 rounded-xl backdrop-blur-md bg-white/10 p-4 text-sm text-white border-2 border-white/20 shadow-xl">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 flex-shrink-0 text-blue-400 drop-shadow-lg" />
                  <div className="font-oswald">
                    <span className="font-bold">{t.dashboard.lastSync}</span>{" "}
                    {new Date(stravaConnection.lastSyncAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>
            )}

          {/* Benchmark Info Banner */}
          {benchmarks && (
            <div className="mb-6 rounded-xl backdrop-blur-md bg-white/10 p-4 text-sm text-white border-2 border-blue-400/30 shadow-xl">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-400 drop-shadow-lg" />
                <div className="font-oswald">
                  <span className="font-bold">{t.dashboard.benchmarkInfo}</span> {benchmarks.cohortSize}{" "}
                  {t.dashboard.athletes}
                  {benchmarks.gender && ` (${benchmarks.gender})`}
                  {benchmarks.ageRange && ` ${t.dashboard.aged} ${benchmarks.ageRange.min}-${benchmarks.ageRange.max}`}.{" "}
                  {t.dashboard.benchmarkDescription}
                </div>
              </div>
            </div>
          )}

          {/* Weekly Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={Activity}
              label={t.dashboard.stats.totalDistance}
              value={weeklyStats.totalDistance.toFixed(1)}
              unit="km"
              iconColor="text-sky-400"
              benchmark={benchmarks?.weeklyStats?.totalDistance ?? null}
            />
            <StatCard
              icon={Clock}
              label={t.dashboard.stats.trainingTime}
              value={weeklyStats.totalTime.toFixed(1)}
              unit="hours"
              iconColor="text-emerald-400"
              benchmark={benchmarks?.weeklyStats?.totalTime ?? null}
            />
            {trainingTimeComparison && (
              <StatCard
                icon={trainingTimeComparison.isIncrease ? TrendingUp : TrendingUp}
                label={t.dashboard.stats.trainingVsLastWeek}
                value={trainingTimeComparison.formattedChange}
                unit="%"
                iconColor={
                  trainingTimeComparison.percentageChange > 0
                    ? "text-emerald-400"
                    : trainingTimeComparison.percentageChange < 0
                      ? "text-amber-400"
                      : "text-slate-400"
                }
              />
            )}
            <StatCard
              icon={Zap}
              label={t.dashboard.stats.activities}
              value={weeklyStats.totalActivities}
              iconColor="text-violet-400"
              benchmark={benchmarks?.weeklyStats?.totalActivities ?? null}
            />
            <StatCard
              icon={Heart}
              label={t.dashboard.stats.avgHeartRate}
              value={weeklyStats.avgHeartRate ? Math.round(weeklyStats.avgHeartRate) : "N/A"}
              unit={weeklyStats.avgHeartRate ? "bpm" : ""}
              iconColor="text-rose-400"
              benchmark={benchmarks?.weeklyStats?.avgHeartRate ?? null}
            />
          </div>

          {/* Enhanced Form Score */}
          {latestMetrics && (
            <div className="mb-8 group relative rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-indigo-800/30"></div>
              <div className="relative backdrop-blur-md bg-black/30 p-8 border-2 border-blue-400/40">
                <h2 className="mb-6 text-3xl font-bebas tracking-wider text-blue-300 drop-shadow-lg uppercase border-b-2 border-blue-400/40 pb-4">{t.dashboard.trainingStatus.title}</h2>

                <div className="mb-6 text-center">
                  <div className="text-base text-white/90 font-oswald font-bold">{t.dashboard.trainingStatus.formScore}</div>
                  <div className="mt-2 flex items-center justify-center gap-4">
                    <div className="text-7xl font-bebas text-white drop-shadow-2xl">
                      {latestMetrics.formScore?.toFixed(0) || "N/A"}
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-white/70 font-oswald">{t.dashboard.trainingStatus.outOf}</div>
                      {latestMetrics.formScore && (
                        <div className="flex items-center gap-1 text-sm">
                          {latestMetrics.formScore > 20 ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">
                                {t.dashboard.trainingStatus.readyToPerform}
                              </span>
                            </>
                          ) : latestMetrics.formScore > 0 ? (
                            <>
                              <Activity className="h-4 w-4 text-amber-600" />
                              <span className="text-amber-700 font-medium">
                                {t.dashboard.trainingStatus.moderateReadiness}
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-4 w-4 text-rose-600" />
                              <span className="text-rose-700 font-medium">
                                {t.dashboard.trainingStatus.needRecovery}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Load Analysis */}
                {injuryRisk && (
                  <div className={`rounded-xl ${injuryRisk.bgColor} p-4 mb-4 border-2 ${injuryRisk.borderColor}`}>
                    <div className={`flex items-start gap-3 ${injuryRisk.color}`}>
                      {injuryRisk.level === "high" && <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                      {injuryRisk.level === "moderate" && <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                      {injuryRisk.level === "optimal" && <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                      {injuryRisk.level === "low" && <TrendingUp className="h-5 w-5 flex-shrink-0 mt-0.5" />}
                      <div>
                        <div className="font-semibold">{t.dashboard.trainingStatus.trainingLoadAnalysis}</div>
                        <div className="text-sm mt-1">{injuryRisk.message}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Detailed Metrics */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="group relative rounded-xl overflow-hidden backdrop-blur-md bg-white/10 p-5 border-2 border-blue-400/30 shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10"></div>
                    <div className="relative">
                      <div className="text-sm text-blue-300 font-bebas tracking-wider uppercase border-b border-blue-400/40 pb-2 mb-2">{t.dashboard.trainingStatus.fitness}</div>
                      <div className="mt-2 text-3xl font-bebas text-white drop-shadow-lg">
                        {latestMetrics.fitnessScore?.toFixed(0) || "N/A"}
                      </div>
                      <div className="mt-2 text-xs text-white/80 font-oswald">{t.dashboard.trainingStatus.fitnessDesc}</div>
                      {benchmarks?.trainingLoad?.fitnessScore !== null &&
                        benchmarks?.trainingLoad?.fitnessScore !== undefined && (
                          <div className="mt-3">
                            <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="absolute top-0 left-0 h-full bg-sky-500 rounded-full"
                                style={{
                                  width: `${benchmarks.trainingLoad.fitnessScore}%`,
                                }}
                              />
                            </div>
                            <div className="mt-1.5 text-xs text-slate-700 font-medium">
                              P{benchmarks.trainingLoad.fitnessScore}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="group relative rounded-xl overflow-hidden backdrop-blur-md bg-white/10 p-5 border-2 border-amber-400/30 shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10"></div>
                    <div className="relative">
                      <div className="text-sm text-amber-300 font-bebas tracking-wider uppercase border-b border-amber-400/40 pb-2 mb-2">{t.dashboard.trainingStatus.fatigue}</div>
                      <div className="mt-2 text-3xl font-bebas text-white drop-shadow-lg">
                        {latestMetrics.fatigueScore?.toFixed(0) || "N/A"}
                      </div>
                      <div className="mt-2 text-xs text-white/80 font-oswald">{t.dashboard.trainingStatus.fatigueDesc}</div>
                      {benchmarks?.trainingLoad?.fatigueScore !== null &&
                        benchmarks?.trainingLoad?.fatigueScore !== undefined && (
                          <div className="mt-3">
                            <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="absolute top-0 left-0 h-full bg-amber-500 rounded-full"
                                style={{
                                  width: `${benchmarks.trainingLoad.fatigueScore}%`,
                                }}
                              />
                            </div>
                            <div className="mt-1.5 text-xs text-slate-700 font-medium">
                              P{benchmarks.trainingLoad.fatigueScore}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="group relative rounded-xl overflow-hidden backdrop-blur-md bg-white/10 p-5 border-2 border-emerald-400/30 shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-600/10"></div>
                    <div className="relative">
                      <div className="text-sm text-emerald-300 font-bebas tracking-wider uppercase border-b border-emerald-400/40 pb-2 mb-2">{t.dashboard.trainingStatus.form}</div>
                      <div className="mt-2 text-3xl font-bebas text-white drop-shadow-lg">
                        {latestMetrics.formScore?.toFixed(0) || "N/A"}
                      </div>
                      <div className="mt-2 text-xs text-white/80 font-oswald">{t.dashboard.trainingStatus.formDesc}</div>
                      {benchmarks?.trainingLoad?.formScore !== null &&
                        benchmarks?.trainingLoad?.formScore !== undefined && (
                          <div className="mt-3">
                            <div className="relative h-2 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                                style={{
                                  width: `${benchmarks.trainingLoad.formScore}%`,
                                }}
                              />
                            </div>
                            <div className="mt-1.5 text-xs text-slate-700 font-medium">
                              P{benchmarks.trainingLoad.formScore}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ChatbotWidget />
      </div>
    </div>
  )
}
