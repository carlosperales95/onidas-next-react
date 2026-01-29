"use client"

import { useState } from "react"
import { Clock, TrendingUp, CheckCircle, Bike, Dumbbell, Footprints, Waves } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

const mockTrainingPlan = {
  id: 1,
  name: "Marathon 16-Week Plan",
  description: "Progressive training plan to run a marathon in under 4 hours",
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 112 * 24 * 60 * 60 * 1000).toISOString(),
  sessions: [
    {
      id: 1,
      title: "Easy Run",
      description: "Recovery pace run to build aerobic base",
      date: new Date().toISOString(),
      type: "easy",
      targetDurationMinutes: 45,
      targetDistanceKm: 8,
      targetZone: "Zone 2",
      targetPace: "5:30/km",
      completed: true,
    },
    {
      id: 2,
      title: "Interval Training",
      description: "6x800m at 5K pace with 2min recovery",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      type: "interval",
      targetDurationMinutes: 60,
      targetDistanceKm: 10,
      targetZone: "Zone 4-5",
      targetPace: "4:00/km",
      completed: false,
    },
    {
      id: 3,
      title: "Rest Day",
      description: "Active recovery - light stretching or yoga",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: "rest",
      completed: false,
    },
    {
      id: 4,
      title: "Tempo Run",
      description: "Sustained effort at lactate threshold",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "long",
      targetDurationMinutes: 70,
      targetDistanceKm: 13,
      targetZone: "Zone 3",
      targetPace: "5:00/km",
      completed: false,
    },
    {
      id: 5,
      title: "Easy Run",
      description: "Recovery pace run",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: "easy",
      targetDurationMinutes: 40,
      targetDistanceKm: 7,
      targetZone: "Zone 2",
      targetPace: "5:40/km",
      completed: false,
    },
    {
      id: 6,
      title: "Long Run",
      description: "Build endurance with progressive pace",
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      type: "long",
      targetDurationMinutes: 120,
      targetDistanceKm: 20,
      targetZone: "Zone 2-3",
      targetPace: "5:30/km",
      completed: false,
    },
    {
      id: 7,
      title: "Strength Training",
      description: "Lower body strength and core work",
      date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      type: "strength",
      targetDurationMinutes: 45,
      completed: false,
    },
    {
      id: 8,
      title: "Recovery Run",
      description: "Very easy pace for active recovery",
      date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      type: "recovery",
      targetDurationMinutes: 30,
      targetDistanceKm: 5,
      targetZone: "Zone 1-2",
      targetPace: "6:00/km",
      completed: false,
    },
  ],
}

export default function TrainingPlanPage() {
  const { user } = useUser()
  const [completedSessions, setCompletedSessions] = useState<number[]>([])
  const [goalPrompt, setGoalPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePlan = async () => {
    if (!goalPrompt.trim() || goalPrompt.length < 10) {
      toast.error("Please describe your goal in more detail")
      return
    }

    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      toast.success("Training plan generated!")
      setGoalPrompt("")
      setIsGenerating(false)
    }, 2000)
  }

  const getSessionGlassColor = (type: string) => {
    switch (type) {
      case "interval":
        return "border-rose-400 bg-rose-50"
      case "long":
        return "border-sky-400 bg-sky-50"
      case "easy":
        return "border-emerald-400 bg-emerald-50"
      case "recovery":
        return "border-amber-400 bg-amber-50"
      case "strength":
        return "border-violet-400 bg-violet-50"
      case "rest":
        return "border-slate-400 bg-slate-50"
      default:
        return "border-slate-300 bg-white"
    }
  }

  // Group sessions by week
  const sessionsByWeek: Record<number, typeof mockTrainingPlan.sessions> = {}
  const startDate = new Date(mockTrainingPlan.startDate)

  mockTrainingPlan.sessions.forEach((session) => {
    const sessionDate = new Date(session.date)
    const diffTime = sessionDate.getTime() - startDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const weekNumber = Math.floor(diffDays / 7) + 1

    if (!sessionsByWeek[weekNumber]) {
      sessionsByWeek[weekNumber] = []
    }
    sessionsByWeek[weekNumber].push(session)
  })

  const weeks = Object.keys(sessionsByWeek)
    .map(Number)
    .sort((a, b) => a - b)

  const totalSessions = mockTrainingPlan.sessions.length
  const completedSessionsCount = mockTrainingPlan.sessions.filter((s) => s.completed).length
  const progressPercentage = totalSessions > 0 ? (completedSessionsCount / totalSessions) * 100 : 0

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
              Training Plan
            </h1>
            <p className="mt-4 text-xl text-white/90 drop-shadow-lg font-oswald">Your personalized 16-week marathon training program</p>
          </div>

          {/* Natural Language Goal Input */}
          <div className="mb-8 rounded-2xl glass-strong bg-gradient-to-r from-violet-100 to-indigo-100 p-8 shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Tell us your goal in your own words</h2>
            <p className="mb-6 text-sm text-slate-700">
              Example: "I want to run a marathon in under 4 hours in 16 weeks, training 4 days per week"
            </p>

            <div className="flex gap-4">
              <textarea
                value={goalPrompt}
                onChange={(e) => setGoalPrompt(e.target.value)}
                placeholder="Describe your training goal..."
                rows={3}
                disabled={isGenerating}
                className="flex-1 rounded-xl bg-white/90 border border-gray-300 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-50 transition-all shadow-sm"
              />
              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating || !goalPrompt.trim()}
                className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:bg-slate-300 disabled:text-slate-500 shadow-xl transition-all"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-violet-600"></div>
                    Generating...
                  </div>
                ) : (
                  "Generate Plan"
                )}
              </button>
            </div>

            {isGenerating && (
              <div className="mt-4 rounded-xl bg-white/80 p-4 border border-violet-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
                  <span className="text-sm text-slate-700">
                    AI is analyzing your goal and creating a personalized plan...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Training Progress Widget */}
          <div className="mb-8 rounded-2xl glass-strong p-6 shadow-2xl bg-white/70 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Progress: <span className="text-violet-600">{mockTrainingPlan.name}</span>
            </h2>

            {/* Icons Row */}
            <div className="flex items-center space-x-4 mb-4">
              <Bike className="h-8 w-8 text-sky-600" />
              <Dumbbell className="h-8 w-8 text-red-600" />
              <Footprints className="h-8 w-8 text-green-600" />
              <Waves className="h-8 w-8 text-blue-600" />
              <div className="flex-1"></div>
              <span className="text-lg font-bold text-slate-900">{Math.round(progressPercentage)}% Complete</span>
            </div>

            {/* Progress Bar and Goal */}
            <div className="space-y-2">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-violet-200 text-violet-600">
                      Goal: Sessions
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-violet-600">
                      {completedSessionsCount} / {totalSessions}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-violet-200 shadow-inner">
                  <div
                    style={{ width: `${Math.round(progressPercentage)}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-500 ease-out rounded-full"
                  ></div>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                Progress based on sessions marked as completed in your training log.
              </p>
            </div>
          </div>

          {/* Plan Header */}
          <div className="mb-6 rounded-xl glass-card p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">{mockTrainingPlan.name}</h2>
            {mockTrainingPlan.description && <p className="mt-2 text-slate-700">{mockTrainingPlan.description}</p>}
            <div className="mt-4 flex gap-6 text-sm text-slate-600">
              <div>
                <span className="font-medium">Start:</span> {new Date(mockTrainingPlan.startDate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">End:</span> {new Date(mockTrainingPlan.endDate).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-sky-100 p-4 border border-sky-200">
              <p className="text-sm text-slate-700">
                <strong>Adaptive Plan:</strong> This plan will automatically adjust based on your actual performance,
                missed sessions, and recovery metrics. If you skip a workout, the AI will recalculate the rest of your
                week.
              </p>
            </div>
          </div>

          {/* Sessions organized by weeks in columns */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Weekly Schedule</h3>

            {/* Horizontal scrollable container for weeks */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {weeks.map((weekNum) => (
                  <div key={weekNum} className="flex-shrink-0 w-80 rounded-xl glass-card p-5 shadow-xl">
                    {/* Week Header */}
                    <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100 p-3 border border-blue-200">
                      <h4 className="text-lg font-bold text-slate-900">Week {weekNum}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        {sessionsByWeek[weekNum].length} session{sessionsByWeek[weekNum].length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* Week Sessions */}
                    <div className="space-y-3">
                      {sessionsByWeek[weekNum].map((session) => (
                        <div
                          key={session.id}
                          className={`rounded-lg border-l-4 p-4 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] ${getSessionGlassColor(session.type)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-sm font-semibold text-slate-900">{session.title}</h5>
                                {session.completed && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {new Date(session.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          {session.description && (
                            <p className="text-xs text-slate-700 mb-3 line-clamp-2">{session.description}</p>
                          )}

                          <div className="flex flex-wrap gap-2 text-xs">
                            {session.targetDurationMinutes && (
                              <div className="flex items-center text-slate-600">
                                <Clock className="mr-1 h-3 w-3" />
                                {session.targetDurationMinutes}m
                              </div>
                            )}
                            {session.targetDistanceKm && (
                              <div className="flex items-center text-slate-600">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                {session.targetDistanceKm}km
                              </div>
                            )}
                            {session.targetZone && (
                              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-300">
                                {session.targetZone}
                              </span>
                            )}
                            {session.targetPace && (
                              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-300">
                                {session.targetPace}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="rounded-xl glass-card p-4 shadow-xl">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Session Types</h4>
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-l-4 border-rose-400 bg-rose-100"></div>
                  <span className="text-slate-700">Interval</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-l-4 border-sky-400 bg-sky-100"></div>
                  <span className="text-slate-700">Long</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-l-4 border-emerald-400 bg-emerald-100"></div>
                  <span className="text-slate-700">Easy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-l-4 border-amber-400 bg-amber-100"></div>
                  <span className="text-slate-700">Recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-l-4 border-violet-400 bg-violet-100"></div>
                  <span className="text-slate-700">Strength</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-l-4 border-slate-400 bg-slate-100"></div>
                  <span className="text-slate-700">Rest</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ChatbotWidget />
      </div>
    </div>
  )
}
