"use client"

import { useState } from "react"
import { Apple, Droplet, Pill, Zap, Moon, Dumbbell, Flame, Battery, Heart } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ChatbotWidget } from "@/components/chatbot-widget"
import { ProductCategoryNav } from "@/components/product-category-nav"
import { WorkoutNutritionCards } from "@/components/workout-nutrition-cards"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

// Mock data for supplements
const mockSupplements = {
  essential: [
    {
      id: 1,
      supplementName: "Whey Protein Isolate",
      tier: "essential",
      priority: 10,
      productCategory: "protein_powder",
      reasoning: "Essential for muscle recovery and growth after intense training sessions.",
      dailyDosageG: 30,
      estimatedCostMonthly: 45.99,
      affiliateLink: "https://example.com/protein",
    },
    {
      id: 2,
      supplementName: "Creatine Monohydrate - Creapure",
      tier: "essential",
      priority: 9,
      productCategory: "creatine",
      reasoning:
        "Proven to improve strength, power output, and recovery between high-intensity efforts. 100% Creapure quality.",
      dailyDosageG: 5,
      estimatedCostMonthly: 15.99,
      affiliateLink: null, // No link, usaremos iframe
      affiliateIframe:
        "https://www.hsnstore.com/hsnaffiliate/iframe/product/?border=0&typeline=dotted&colorline=%23ff6000&colortext=%23000000&colorlink=%23ff6000&showprice=1&showbtnbuy=1&targetblankiframe=0&linkid=cHJvZHVjdHx8SFJTLUNSRUF8fEpPUkNBTk98fGh0dHBzOi8vd3d3LmhzbnN0b3JlLmNvbS9tYXJjYXMvcmF3LXNlcmllcy9jcmVhdGluYS1leGNlbGwtMTAwLWNyZWFwdXJlLWVuLXBvbHZv",
    },
  ],
  performance: [
    {
      id: 3,
      supplementName: "Beta-Alanine",
      tier: "performance",
      priority: 8,
      productCategory: "pre_workout",
      reasoning: "Helps buffer lactic acid during high-intensity intervals.",
      dailyDosageG: 3.2,
      estimatedCostMonthly: 22.99,
      affiliateLink: "https://example.com/beta-alanine",
    },
    {
      id: 4,
      supplementName: "Electrolyte Mix",
      tier: "performance",
      priority: 7,
      productCategory: "electrolytes",
      reasoning: "Maintain hydration and prevent cramping during long training sessions.",
      dailyDosageG: 10,
      estimatedCostMonthly: 28.99,
      affiliateLink: "https://example.com/electrolytes",
    },
  ],
  elite: [
    {
      id: 5,
      supplementName: "ZMA Complex",
      tier: "elite",
      priority: 6,
      productCategory: "sleep_supplement",
      reasoning: "Optimize sleep quality and recovery with zinc, magnesium, and B6.",
      dailyDosageG: 2,
      estimatedCostMonthly: 24.99,
      affiliateLink: "https://example.com/zma",
    },
  ],
}

const mockWorkoutNutrition = {
  preWorkout: {
    timing: "2-3 hours before",
    carbsPerKg: "1-2g per kg",
    proteinGuidance: "15-20g",
    fatGuidance: "Low (<10g)",
    hydration: "500-750ml water",
    specificAdvice: "Focus on easily digestible carbs to fuel your workout without digestive issues.",
    exampleFoods: "Oatmeal with banana, toast with honey, rice cakes",
  },
  duringWorkout: {
    applicability: "For sessions >90 min",
    carbsPerHour: "30-60g per hour",
    hydration: "500-1000ml per hour",
    specificAdvice: "Use sports drinks or gels for quick energy during long training sessions.",
    exampleFoods: "Energy gels, sports drinks, dates",
  },
  postWorkout: {
    timing: "Within 30-60 minutes",
    carbsPerKg: "1-1.2g per kg",
    proteinAmount: "20-40g",
    carbToProteinRatio: "3:1 to 4:1",
    hydration: "150% of fluid lost",
    specificAdvice: "Prioritize fast-acting carbs and protein to kickstart recovery.",
    exampleFoods: "Protein shake with banana, chicken and rice, chocolate milk",
  },
}

export default function NutritionPage() {
  const { user } = useUser()
  const [selectedTab, setSelectedTab] = useState<"essential" | "performance" | "elite">("essential")
  const [clickingAffiliateId, setClickingAffiliateId] = useState<number | null>(null)

  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
      protein_powder: {
        label: "Protein Powder",
        icon: Dumbbell,
        color: "text-sky-600",
        bgColor: "bg-sky-50",
      },
      protein_bar: {
        label: "Protein Bars",
        icon: Apple,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
      sleep_supplement: {
        label: "Sleep Supplements",
        icon: Moon,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
      },
      sports_drink: {
        label: "Sports Drinks",
        icon: Droplet,
        color: "text-cyan-600",
        bgColor: "bg-cyan-50",
      },
      creatine: {
        label: "Creatine",
        icon: Zap,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
      pre_workout: {
        label: "Pre-Workout",
        icon: Flame,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      recovery: {
        label: "Recovery",
        icon: Heart,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
      },
      energy_gel: {
        label: "Energy Gels",
        icon: Battery,
        color: "text-lime-600",
        bgColor: "bg-lime-50",
      },
      electrolytes: {
        label: "Electrolytes",
        icon: Droplet,
        color: "text-teal-600",
        bgColor: "bg-teal-50",
      },
      vitamin: {
        label: "Vitamins",
        icon: Pill,
        color: "text-violet-600",
        bgColor: "bg-violet-50",
      },
      other: {
        label: "Other Supplements",
        icon: Pill,
        color: "text-slate-600",
        bgColor: "bg-slate-50",
      },
    }

    return categoryMap[category] || categoryMap.other
  }

  // Group all supplements by category
  const allSupplements = [
    ...(mockSupplements.essential || []),
    ...(mockSupplements.performance || []),
    ...(mockSupplements.elite || []),
  ]

  const supplementsByCategory: Record<string, any[]> = {}
  allSupplements.forEach((supplement) => {
    const category = supplement.productCategory || "other"
    if (!supplementsByCategory[category]) {
      supplementsByCategory[category] = []
    }
    supplementsByCategory[category].push(supplement)
  })

  // Sort supplements within each category by priority
  Object.keys(supplementsByCategory).forEach((category) => {
    supplementsByCategory[category].sort((a, b) => b.priority - a.priority)
  })

  const availableCategories = Object.keys(supplementsByCategory)

  // Filter supplements based on selected category
  const selectedCategory = "all" // Assuming selectedCategory is always "all" based on the context
  const filteredSupplementsByCategory =
    selectedCategory === "all"
      ? supplementsByCategory
      : selectedCategory in supplementsByCategory
        ? { [selectedCategory]: supplementsByCategory[selectedCategory] }
        : {}

  const handleAffiliateClick = async (recommendationId: number, affiliateLink: string) => {
    setClickingAffiliateId(recommendationId)
    // Simulate API call
    setTimeout(() => {
      window.open(affiliateLink, "_blank", "noopener,noreferrer")
      toast.success("Link registered! Redirecting...")
      setClickingAffiliateId(null)
    }, 500)
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
              Nutrition & Supplements
            </h1>
            <p className="mt-4 text-xl text-white/90 drop-shadow-lg font-oswald">Personalized supplement recommendations and nutrition guidance</p>
          </div>

          <div className="space-y-6">
            {/* Product Categories (Marketplace Grid) */}
            <div className="rounded-2xl">
              <div className="rounded-2xl glass-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Recommended Products</h2>
                    <p className="mt-1 text-xs text-slate-600">Based on your training plan and goals</p>
                  </div>
                  <button className="rounded-lg glass-interactive px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg transition-all">
                    Regenerate
                  </button>
                </div>

                <div className="mb-4 rounded-xl bg-amber-50 p-3 border border-amber-200">
                  <p className="text-xs text-slate-700">
                    <strong>Notice:</strong> These are AI-generated recommendations based on your profile. Consult with a
                    healthcare professional before starting any supplementation regimen.
                  </p>
                </div>

                {/* Category Navigation */}
                {availableCategories.length > 0 && (
                  <ProductCategoryNav
                    activeCategory={selectedCategory}
                    onCategoryChange={setSelectedTab}
                    categories={availableCategories}
                  />
                )}

                {Object.keys(filteredSupplementsByCategory).length === 0 ? (
                  <div className="rounded-2xl glass-card p-8 text-center shadow-xl">
                    <Pill className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-3 text-sm text-slate-700">
                      {selectedCategory === "all"
                        ? 'No recommendations available. Click "Regenerate" to get personalized recommendations.'
                        : "No products in this category. Try selecting a different category."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(filteredSupplementsByCategory).map(([category, supplements]) => {
                      const categoryInfo = getCategoryInfo(category)
                      const CategoryIcon = categoryInfo.icon

                      return (
                        <div key={category}>
                          {/* Category Header - Only show when "All" is selected */}
                          {selectedCategory === "all" && (
                            <div
                              className={`mb-4 flex items-center gap-3 rounded-xl p-4 border-2 ${categoryInfo.bgColor} shadow-md`}
                            >
                              <div className={`rounded-lg bg-white/80 p-2.5 shadow-sm`}>
                                <CategoryIcon className={`h-6 w-6 ${categoryInfo.color}`} />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base font-bold text-slate-900">{categoryInfo.label}</h3>
                                <p className="text-xs text-slate-600">
                                  {supplements.length} product{supplements.length !== 1 ? "s" : ""} available
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Products Grid - Marketplace style */}
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {supplements.map((supplement) => (
                              <div key={supplement.id} className="rounded-xl">
                                {supplement.affiliateIframe ? (
                                  <div className="group rounded-xl bg-white border border-slate-200 p-4 transition-all hover:shadow-xl h-full flex flex-col">
                                    {/* Tier Badge */}
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                      <span
                                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                                          supplement.tier === "essential"
                                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                            : supplement.tier === "performance"
                                              ? "bg-sky-100 text-sky-700 border border-sky-200"
                                              : "bg-violet-100 text-violet-700 border border-violet-200"
                                        }`}
                                      >
                                        {supplement.tier === "essential"
                                          ? "Essential"
                                          : supplement.tier === "performance"
                                            ? "Performance"
                                            : "Elite"}
                                      </span>
                                      <span className="text-xs font-medium text-slate-500">P{supplement.priority}</span>
                                    </div>

                                    {/* HSN Store Affiliate Iframe */}
                                    <div className="flex-grow flex items-center justify-center">
                                      <iframe
                                        src={supplement.affiliateIframe}
                                        style={{ width: "265px", height: "490px" }}
                                        scrolling="no"
                                        frameBorder="0"
                                        className="rounded-lg"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="group rounded-xl bg-white border border-slate-200 p-4 transition-all hover:shadow-xl hover:scale-[1.03] hover:border-slate-300 h-full flex flex-col">
                                    {/* Tier Badge */}
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                      <span
                                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                                          supplement.tier === "essential"
                                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                            : supplement.tier === "performance"
                                              ? "bg-sky-100 text-sky-700 border border-sky-200"
                                              : "bg-violet-100 text-violet-700 border border-violet-200"
                                        }`}
                                      >
                                        {supplement.tier === "essential"
                                          ? "Essential"
                                          : supplement.tier === "performance"
                                            ? "Performance"
                                            : "Elite"}
                                      </span>
                                      <span className="text-xs font-medium text-slate-500">P{supplement.priority}</span>
                                    </div>

                                    {/* Product Name */}
                                    <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                                      {supplement.supplementName}
                                    </h4>

                                    {/* Description */}
                                    <p
                                      className="text-xs text-slate-600 mb-3 line-clamp-3 min-h-[3rem] flex-grow"
                                      title={supplement.reasoning}
                                    >
                                      {supplement.reasoning}
                                    </p>

                                    {/* Product Details */}
                                    <div className="mb-3 space-y-1.5 text-xs">
                                      <div className="flex items-center justify-between py-1 border-t border-slate-100">
                                        <span className="text-slate-500">Daily dosage:</span>
                                        <span className="font-semibold text-slate-700">{supplement.dailyDosageG}g</span>
                                      </div>
                                      <div className="flex items-center justify-between py-1 border-t border-slate-100">
                                        <span className="text-slate-500">Monthly cost:</span>
                                        <span className="font-semibold text-slate-700">
                                          ${supplement.estimatedCostMonthly?.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Buy Button */}
                                    {supplement.affiliateLink ? (
                                      <button
                                        onClick={() => handleAffiliateClick(supplement.id, supplement.affiliateLink!)}
                                        disabled={clickingAffiliateId === supplement.id}
                                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 shadow-md hover:shadow-lg transition-all"
                                      >
                                        {clickingAffiliateId === supplement.id ? "Registering..." : "Buy Now"}
                                      </button>
                                    ) : (
                                      <button
                                        disabled
                                        className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed border border-slate-200"
                                      >
                                        Not available
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Workout Nutrition */}
            <WorkoutNutritionCards advice={mockWorkoutNutrition} isLoading={false} />
          </div>
        </div>

        <ChatbotWidget />
      </div>
    </div>
  )
}
