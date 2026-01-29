"use client"

import type React from "react"
import { useState, useMemo, useEffect, useCallback } from "react"
import { User, UtensilsCrossed, Save, AlertTriangle, Link2, RefreshCw, Unlink, Activity, Clock, Mountain, TrendingUp, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import type { AthleteProfile } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"

interface SettingsClientProps {
  initialProfile: AthleteProfile | null
  userId: string
}

interface StravaSummary {
  totalActivities: number
  totalDistance: number
  totalTime: number
  totalElevation: number
  byType: Record<string, { count: number; distance: number; time: number }>
}

interface StravaStatus {
  connected: boolean
  athleteId: number | null
  lastSync: string | null
  connectedAt: string | null
  scope: string | null
  summary: StravaSummary | null
}

export function SettingsClient({ initialProfile, userId }: SettingsClientProps) {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Strava state
  const [stravaStatus, setStravaStatus] = useState<StravaStatus | null>(null)
  const [stravaLoading, setStravaLoading] = useState(true)
  const [stravaSyncing, setStravaSyncing] = useState(false)
  const [stravaConnecting, setStravaConnecting] = useState(false)
  const [stravaDisconnecting, setStravaDisconnecting] = useState(false)
  const [stravaSyncResult, setStravaSyncResult] = useState<{ synced: number; total: number } | null>(null)

  // Form state with default values or database values
  // Only include fields that exist in the athlete_profiles table
  const [formData, setFormData] = useState({
    gender: initialProfile?.gender || "male",
    heightCm: initialProfile?.height_cm || 175,
    weightKg: initialProfile?.weight_kg || 72,
    preferredSport: initialProfile?.preferred_sport || "running",
    experienceLevel: initialProfile?.experience_level || "intermediate",
    weeklyTrainingHours: initialProfile?.weekly_training_hours || 10,
    restingHeartRate: initialProfile?.resting_heart_rate || 60,
    maxHeartRate: initialProfile?.max_heart_rate || 190,
  })

  // Calculate BMI
  const bmi = useMemo(() => {
    if (formData.heightCm && formData.weightKg) {
      const heightM = formData.heightCm / 100
      return (formData.weightKg / (heightM * heightM)).toFixed(1)
    }
    return null
  }, [formData.heightCm, formData.weightKg])

  const getBMICategory = (bmi: string | null) => {
    if (!bmi) return ""
    const bmiNum = Number.parseFloat(bmi)
    if (bmiNum < 18.5) return "Underweight"
    if (bmiNum < 25) return "Normal weight"
    if (bmiNum < 30) return "Overweight"
    return "Obese"
  }

  const getBMIColor = (bmi: string | null) => {
    if (!bmi) return "text-gray-600"
    const bmiNum = Number.parseFloat(bmi)
    if (bmiNum < 18.5) return "text-blue-400"
    if (bmiNum < 25) return "text-emerald-400"
    if (bmiNum < 30) return "text-amber-400"
    return "text-red-400"
  }

  // Strava functions
  const fetchStravaStatus = useCallback(async () => {
    try {
      console.log('[v0] Fetching Strava status')
      const response = await fetch('/api/strava/status')
      console.log('[v0] Status response:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Strava status data:', data)
        setStravaStatus(data)
      } else {
        console.error('[v0] Failed to fetch status:', response.status)
      }
    } catch (err) {
      console.error('[v0] Failed to fetch Strava status:', err)
    } finally {
      setStravaLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStravaStatus()
    
    // Check URL params for callback results
    const params = new URLSearchParams(window.location.search)
    if (params.get('strava_connected') === 'true') {
      console.log('[v0] Strava connection successful, re-fetching status')
      toast.success('Successfully connected to Strava!')
      // Re-fetch status immediately after successful connection
      setTimeout(() => fetchStravaStatus(), 500)
      window.history.replaceState({}, '', window.location.pathname)
    }
    if (params.get('strava_error')) {
      const errorMsg = params.get('strava_error')
      console.error('[v0] Strava connection error:', errorMsg)
      toast.error(`Strava connection failed: ${errorMsg}`)
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [fetchStravaStatus])

  const handleStravaConnect = async () => {
    try {
      console.log('[v0] handleStravaConnect called')
      setStravaConnecting(true)
      
      console.log('[v0] Fetching /api/strava/auth')
      const response = await fetch('/api/strava/auth')
      console.log('[v0] Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('[v0] Response data:', data)
        
        if (data.url) {
          console.log('[v0] Redirecting to:', data.url)
          window.location.href = data.url
        } else {
          throw new Error('No URL in response')
        }
      } else {
        const errorData = await response.json()
        console.error('[v0] Error response:', errorData)
        throw new Error(errorData.error || 'Failed to get auth URL')
      }
    } catch (err) {
      console.error('[v0] handleStravaConnect error:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to connect to Strava')
      setStravaConnecting(false)
    }
  }

  const handleStravaSync = async () => {
    try {
      setStravaSyncing(true)
      setStravaSyncResult(null)
      const response = await fetch('/api/strava/sync', { method: 'POST' })
      if (response.ok) {
        const result = await response.json()
        setStravaSyncResult({ synced: result.synced, total: result.total })
        toast.success(result.synced > 0 
          ? `Synced ${result.synced} new activities!` 
          : 'Sync complete. No new activities.')
        await fetchStravaStatus()
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Sync failed')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sync with Strava')
    } finally {
      setStravaSyncing(false)
    }
  }

  const handleStravaDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect from Strava? Your synced activities will remain.')) {
      return
    }
    
    try {
      setStravaDisconnecting(true)
      const response = await fetch('/api/strava/disconnect', { method: 'POST' })
      if (response.ok) {
        setStravaStatus({ connected: false, athleteId: null, lastSync: null, connectedAt: null, scope: null, summary: null })
        setStravaSyncResult(null)
        toast.success('Disconnected from Strava')
      } else {
        throw new Error('Failed to disconnect')
      }
    } catch {
      toast.error('Failed to disconnect from Strava')
    } finally {
      setStravaDisconnecting(false)
    }
  }

  const formatDistance = (meters: number) => {
    const km = meters / 1000
    return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${km.toFixed(1)} km`
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours >= 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    return `${hours}h ${minutes}m`
  }

  const formatElevation = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}k m` : `${Math.round(meters)} m`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      // Only include fields that exist in the athlete_profiles table
      const profileData = {
        clerk_user_id: userId,
        gender: formData.gender,
        height_cm: formData.heightCm,
        weight_kg: formData.weightKg,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('athlete_profiles')
        .upsert(profileData)

      if (error) throw error

      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
      toast.error("Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user) return

    setIsDeleting(true)
    try {
      await user.delete()
      toast.success("Account deleted successfully")
      window.location.href = "/"
    } catch (error) {
      toast.error("Failed to delete account. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Strava Integration Section */}
      <div className="group relative rounded-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 to-red-800/30"></div>
        <div className="relative backdrop-blur-md bg-black/30 p-8 border-2 border-orange-400/40">
          <div className="border-b-2 border-orange-400/40 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FC4C02] shadow-lg">
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bebas tracking-wider text-orange-300 drop-shadow-lg uppercase">
                  Strava Integration
                </h2>
                <p className="text-white/60 font-oswald text-sm">
                  {stravaStatus?.connected
                    ? 'Connected to Strava'
                    : 'Connect your Strava account to sync activities'}
                </p>
              </div>
            </div>
          </div>

          {stravaLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
            </div>
          ) : stravaStatus?.connected ? (
            <div className="space-y-6">
              {/* Stats Summary */}
              {stravaStatus.summary && stravaStatus.summary.totalActivities > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                      <Activity className="h-4 w-4" />
                      <span className="text-xs font-bebas tracking-wider uppercase">Activities</span>
                    </div>
                    <p className="text-2xl font-bebas text-white">
                      {stravaStatus.summary.totalActivities}
                    </p>
                  </div>
                  <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-bebas tracking-wider uppercase">Distance</span>
                    </div>
                    <p className="text-2xl font-bebas text-white">
                      {formatDistance(stravaStatus.summary.totalDistance)}
                    </p>
                  </div>
                  <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-bebas tracking-wider uppercase">Time</span>
                    </div>
                    <p className="text-2xl font-bebas text-white">
                      {formatTime(stravaStatus.summary.totalTime)}
                    </p>
                  </div>
                  <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-4">
                    <div className="flex items-center gap-2 text-white/60 mb-2">
                      <Mountain className="h-4 w-4" />
                      <span className="text-xs font-bebas tracking-wider uppercase">Elevation</span>
                    </div>
                    <p className="text-2xl font-bebas text-white">
                      {formatElevation(stravaStatus.summary.totalElevation)}
                    </p>
                  </div>
                </div>
              )}

              {/* Activity breakdown by type */}
              {stravaStatus.summary && Object.keys(stravaStatus.summary.byType).length > 0 && (
                <div className="rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-4">
                  <p className="text-sm font-bebas tracking-wider text-white/60 uppercase mb-3">
                    Activity Breakdown
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stravaStatus.summary.byType)
                      .sort((a, b) => b[1].count - a[1].count)
                      .slice(0, 6)
                      .map(([type, data]) => (
                        <div
                          key={type}
                          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2"
                        >
                          <span className="text-sm font-bebas tracking-wider text-white">{type}</span>
                          <span className="text-xs text-white/60 font-oswald">
                            {data.count}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Last sync info */}
              {stravaStatus.lastSync && (
                <p className="text-sm text-white/50 font-oswald">
                  Last synced: {new Date(stravaStatus.lastSync).toLocaleString()}
                </p>
              )}

              {/* Sync result */}
              {stravaSyncResult && (
                <div className="rounded-xl backdrop-blur-md bg-emerald-500/10 border border-emerald-400/30 p-4">
                  <p className="text-emerald-300 font-oswald">
                    {stravaSyncResult.synced > 0
                      ? `Synced ${stravaSyncResult.synced} new activities. Total: ${stravaSyncResult.total}`
                      : 'Sync complete. No new activities found.'}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleStravaSync}
                  disabled={stravaSyncing}
                  className="flex items-center gap-2 rounded-xl bg-[#FC4C02] px-6 py-3 font-bebas tracking-wider text-white shadow-lg transition-all hover:bg-[#e34402] disabled:opacity-50 border-2 border-orange-400/50 uppercase"
                >
                  {stravaSyncing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      Import Latest Data
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleStravaDisconnect}
                  disabled={stravaDisconnecting}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-bebas tracking-wider text-white/80 transition-all hover:bg-white/20 disabled:opacity-50 border-2 border-white/20 uppercase"
                >
                  {stravaDisconnecting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Unlink className="h-5 w-5" />
                  )}
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleStravaConnect}
              disabled={stravaConnecting}
              className="flex items-center gap-3 rounded-xl bg-[#FC4C02] px-8 py-4 font-bebas tracking-wider text-lg text-white shadow-2xl transition-all hover:bg-[#e34402] disabled:opacity-50 border-2 border-orange-400/50 uppercase"
            >
              {stravaConnecting ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Link2 className="h-6 w-6" />
                  Connect to Strava
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="group relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-indigo-800/30"></div>
          <div className="relative backdrop-blur-md bg-black/30 p-8 border-2 border-blue-400/40">
            <div className="border-b-2 border-blue-400/40 pb-6 mb-6">
              <h2 className="text-3xl font-bebas tracking-wider text-blue-300 drop-shadow-lg uppercase flex items-center gap-3">
                <User className="h-8 w-8" />
                Personal Information
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bebas tracking-wider text-white/90 uppercase mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) })}
                  className="w-full rounded-lg backdrop-blur-md bg-white/10 border-2 border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-oswald"
                />
              </div>

              <div>
                <label className="block text-sm font-bebas tracking-wider text-white/90 uppercase mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-lg backdrop-blur-md bg-white/10 border-2 border-white/20 px-4 py-3 text-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-oswald"
                >
                  <option value="male" className="bg-slate-900">Male</option>
                  <option value="female" className="bg-slate-900">Female</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bebas tracking-wider text-white/90 uppercase mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number.parseInt(e.target.value) })}
                  className="w-full rounded-lg backdrop-blur-md bg-white/10 border-2 border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-oswald"
                />
              </div>

              <div>
                <label className="block text-sm font-bebas tracking-wider text-white/90 uppercase mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number.parseFloat(e.target.value) })}
                  step="0.1"
                  className="w-full rounded-lg backdrop-blur-md bg-white/10 border-2 border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-oswald"
                />
              </div>
            </div>

            {bmi && (
              <div className="mt-6 p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bebas tracking-wider text-white/70 uppercase">BMI</span>
                  <div className="text-right">
                    <span className={`text-2xl font-bebas ${getBMIColor(bmi)}`}>{bmi}</span>
                    <p className="text-xs text-white/60 font-oswald">{getBMICategory(bmi)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="group relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 to-green-800/30"></div>
          <div className="relative backdrop-blur-md bg-black/30 p-8 border-2 border-emerald-400/40">
            <div className="border-b-2 border-emerald-400/40 pb-6 mb-6">
              <h2 className="text-3xl font-bebas tracking-wider text-emerald-300 drop-shadow-lg uppercase flex items-center gap-3">
                <UtensilsCrossed className="h-8 w-8" />
                Nutrition Preferences
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bebas tracking-wider text-white/90 uppercase mb-2">
                  Dietary Preference
                </label>
                <select
                  value={formData.dietaryPreference}
                  onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                  className="w-full rounded-lg backdrop-blur-md bg-white/10 border-2 border-white/20 px-4 py-3 text-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-oswald"
                >
                  <option value="omnivore" className="bg-slate-900">Omnivore</option>
                  <option value="vegetarian" className="bg-slate-900">Vegetarian</option>
                  <option value="vegan" className="bg-slate-900">Vegan</option>
                  <option value="pescatarian" className="bg-slate-900">Pescatarian</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bebas tracking-wider text-white/90 uppercase mb-2">
                  Weight Goal
                </label>
                <select
                  value={formData.weightGoal}
                  onChange={(e) => setFormData({ ...formData, weightGoal: e.target.value })}
                  className="w-full rounded-lg backdrop-blur-md bg-white/10 border-2 border-white/20 px-4 py-3 text-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-oswald"
                >
                  <option value="lose" className="bg-slate-900">Lose Weight</option>
                  <option value="maintain" className="bg-slate-900">Maintain Weight</option>
                  <option value="gain" className="bg-slate-900">Gain Weight</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bebas tracking-wider text-white/90 uppercase mb-2">
                  Allergies
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  rows={3}
                  placeholder="List any food allergies..."
                  className="w-full rounded-lg backdrop-blur-md bg-white/10 border-2 border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-oswald"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bebas tracking-wider text-white/90 uppercase mb-2">
                  Intolerances
                </label>
                <textarea
                  value={formData.intolerances}
                  onChange={(e) => setFormData({ ...formData, intolerances: e.target.value })}
                  rows={3}
                  placeholder="List any food intolerances..."
                  className="w-full rounded-lg backdrop-blur-md bg-white/10 border-2 border-white/20 px-4 py-3 text-white placeholder-white/40 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-oswald"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 font-bebas tracking-wider text-lg text-white shadow-2xl transition-all hover:from-orange-700 hover:to-red-700 disabled:opacity-50 border-2 border-orange-400/50 uppercase"
          >
            <Save className="h-5 w-5" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-400 hover:text-red-300 text-sm font-bebas tracking-wider uppercase transition-colors"
          >
            Delete Account
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative rounded-2xl overflow-hidden max-w-md w-full mx-4">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-orange-800/30"></div>
            <div className="relative backdrop-blur-md bg-black/50 p-8 border-2 border-red-400/40">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <h3 className="text-2xl font-bebas tracking-wider text-red-300 uppercase">Delete Account</h3>
              </div>
              <p className="text-white/80 font-oswald mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-bebas tracking-wider uppercase text-white hover:bg-red-700 disabled:opacity-50 transition-colors border-2 border-red-400/50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 rounded-lg bg-white/10 px-4 py-3 font-bebas tracking-wider uppercase text-white hover:bg-white/20 transition-colors border-2 border-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
