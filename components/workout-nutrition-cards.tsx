import { Apple, Droplet, TrendingUp } from "lucide-react"

interface WorkoutNutritionAdvice {
  preWorkout: {
    timing: string
    carbsPerKg: string
    proteinGuidance: string
    fatGuidance: string
    hydration: string
    specificAdvice: string
    exampleFoods: string
  }
  duringWorkout: {
    applicability: string
    carbsPerHour: string
    hydration: string
    specificAdvice: string
    exampleFoods: string
  }
  postWorkout: {
    timing: string
    carbsPerKg: string
    proteinAmount: string
    carbToProteinRatio: string
    hydration: string
    specificAdvice: string
    exampleFoods: string
  }
}

interface WorkoutNutritionCardsProps {
  advice: WorkoutNutritionAdvice | null | undefined
  isLoading?: boolean
}

export function WorkoutNutritionCards({ advice, isLoading }: WorkoutNutritionCardsProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl">
        <div className="rounded-2xl glass-card p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Workout Nutrition Strategy</h2>
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
              <p className="text-sm text-slate-700">Personalizing your nutrition advice...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!advice) {
    return (
      <div className="rounded-2xl">
        <div className="rounded-2xl glass-card p-6">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Workout Nutrition Strategy</h2>
          <p className="text-sm text-slate-700">
            Complete your profile and add training activities to get personalized nutrition advice.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl">
      <div className="rounded-2xl glass-card p-6">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Workout Nutrition Strategy</h2>
        <p className="mb-6 text-sm text-slate-700">
          Personalized nutrition timing and composition based on your training plan
        </p>

        {/* Horizontal Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Pre-Workout Card */}
          <div className="rounded-xl">
            <div className="rounded-xl bg-sky-50 border-2 border-sky-200 p-4 hover:scale-[1.02] transition-transform h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-lg bg-sky-100 p-2">
                  <Apple className="h-5 w-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Pre-Workout</h3>
                  <p className="text-xs text-slate-600">{advice.preWorkout.timing}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Carbs:</span>{" "}
                  <span className="text-slate-700">{advice.preWorkout.carbsPerKg}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Protein:</span>{" "}
                  <span className="text-slate-700">{advice.preWorkout.proteinGuidance}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Fats:</span>{" "}
                  <span className="text-slate-700">{advice.preWorkout.fatGuidance}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Hydration:</span>{" "}
                  <span className="text-slate-700">{advice.preWorkout.hydration}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 mb-2">{advice.preWorkout.specificAdvice}</p>

              <p className="text-xs text-slate-600 italic">{advice.preWorkout.exampleFoods}</p>
            </div>
          </div>

          {/* During Workout Card */}
          <div className="rounded-xl">
            <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 p-4 hover:scale-[1.02] transition-transform h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-lg bg-emerald-100 p-2">
                  <Droplet className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">During Workout</h3>
                  <p className="text-xs text-slate-600">{advice.duringWorkout.applicability}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Carbs:</span>{" "}
                  <span className="text-slate-700">{advice.duringWorkout.carbsPerHour}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Hydration:</span>{" "}
                  <span className="text-slate-700">{advice.duringWorkout.hydration}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 mb-2">{advice.duringWorkout.specificAdvice}</p>

              <p className="text-xs text-slate-600 italic">{advice.duringWorkout.exampleFoods}</p>
            </div>
          </div>

          {/* Post-Workout Card */}
          <div className="rounded-xl">
            <div className="rounded-xl bg-orange-50 border-2 border-orange-200 p-4 hover:scale-[1.02] transition-transform h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Post-Workout</h3>
                  <p className="text-xs text-slate-600">{advice.postWorkout.timing}</p>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Carbs:</span>{" "}
                  <span className="text-slate-700">{advice.postWorkout.carbsPerKg}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Protein:</span>{" "}
                  <span className="text-slate-700">{advice.postWorkout.proteinAmount}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Ratio:</span>{" "}
                  <span className="text-slate-700">{advice.postWorkout.carbToProteinRatio}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-900">Hydration:</span>{" "}
                  <span className="text-slate-700">{advice.postWorkout.hydration}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 mb-2">{advice.postWorkout.specificAdvice}</p>

              <p className="text-xs text-slate-600 italic">{advice.postWorkout.exampleFoods}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
