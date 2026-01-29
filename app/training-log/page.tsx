import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { EmptyState } from "@/components/empty-state"
import { getActivities, getStravaConnectionStatus } from "@/lib/data/athlete-data"
import { Activity, Calendar, Link2 } from "lucide-react"
import Link from "next/link"

export default async function TrainingLogPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const [activities, stravaStatus] = await Promise.all([
    getActivities(userId),
    getStravaConnectionStatus(userId)
  ])

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
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bebas tracking-wider text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-blue-400 bg-clip-text drop-shadow-2xl uppercase">
                Training Log
              </h1>
              <p className="mt-4 text-xl text-white/90 drop-shadow-lg font-oswald">Track and analyze your workouts</p>
            </div>
            
            {/* Strava connection status */}
            {stravaStatus.connected ? (
              <div className="flex items-center gap-3 rounded-xl backdrop-blur-md bg-emerald-500/10 border border-emerald-400/30 px-4 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FC4C02]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                    <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bebas tracking-wider text-emerald-300 uppercase">Connected</p>
                  {stravaStatus.lastSyncAt && (
                    <p className="text-xs text-white/50 font-oswald">
                      Last sync: {new Date(stravaStatus.lastSyncAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-xl bg-[#FC4C02] px-6 py-3 font-bebas tracking-wider text-white shadow-lg transition-all hover:bg-[#e34402] border-2 border-orange-400/50 uppercase"
              >
                <Link2 className="h-5 w-5" />
                Connect Strava
              </Link>
            )}
          </div>

          {activities.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No activities yet"
              description={stravaStatus.connected 
                ? "Your Strava is connected! Go to Settings and click 'Import Latest Data' to sync your activities."
                : "Connect your Strava account to start tracking your training activities automatically."}
              actionLabel={stravaStatus.connected ? "Go to Settings" : "Connect Strava"}
              actionHref="/settings"
            />
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="group relative rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-800/20"></div>
                  <div className="relative backdrop-blur-md bg-black/30 p-6 border-2 border-blue-400/30 shadow-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-blue-400 drop-shadow-lg" />
                        <div>
                          <h3 className="text-xl font-bebas tracking-wider text-blue-300 drop-shadow-lg uppercase">
                            {activity.name}
                          </h3>
                          <p className="text-sm text-white/70 font-oswald">
                            {new Date(activity.start_date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-xs font-bebas tracking-wider uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {activity.activity_type}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                      <div>
                        <div className="text-sm text-emerald-300 font-bebas tracking-wider uppercase border-b border-emerald-400/40 pb-2 mb-2">
                          Distance
                        </div>
                        <p className="text-lg font-bebas text-white drop-shadow-lg">
                          {activity.distance_meters ? (activity.distance_meters / 1000).toFixed(2) : '0'} km
                        </p>
                      </div>

                      <div>
                        <div className="text-sm text-amber-300 font-bebas tracking-wider uppercase border-b border-amber-400/40 pb-2 mb-2">
                          Duration
                        </div>
                        <p className="text-lg font-bebas text-white drop-shadow-lg">
                          {activity.moving_time_seconds ? Math.floor(activity.moving_time_seconds / 60) : '0'} min
                        </p>
                      </div>

                      <div>
                        <div className="text-sm text-red-300 font-bebas tracking-wider uppercase border-b border-red-400/40 pb-2 mb-2">
                          Avg Heart Rate
                        </div>
                        <p className="text-lg font-bebas text-white drop-shadow-lg">
                          {activity.average_heartrate ? Math.round(activity.average_heartrate) : 'N/A'} bpm
                        </p>
                      </div>

                      <div>
                        <div className="text-sm text-orange-300 font-bebas tracking-wider uppercase border-b border-orange-400/40 pb-2 mb-2">
                          Elevation
                        </div>
                        <p className="text-lg font-bebas text-white drop-shadow-lg">
                          {activity.total_elevation_gain_meters ? Math.round(activity.total_elevation_gain_meters) : '0'}m
                        </p>
                      </div>
                    </div>

                    {(activity.average_speed_mps || activity.max_speed_mps) && (
                      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                        {activity.average_speed_mps && (
                          <div>
                            <span className="text-xs text-white/60 font-bebas tracking-wider uppercase">Avg Speed</span>
                            <p className="text-sm text-white/90 font-oswald">
                              {((activity.average_speed_mps || 0) * 3.6).toFixed(1)} km/h
                            </p>
                          </div>
                        )}
                        {activity.max_speed_mps && (
                          <div>
                            <span className="text-xs text-white/60 font-bebas tracking-wider uppercase">Max Speed</span>
                            <p className="text-sm text-white/90 font-oswald">
                              {((activity.max_speed_mps || 0) * 3.6).toFixed(1)} km/h
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
