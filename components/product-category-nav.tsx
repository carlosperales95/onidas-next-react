"use client"

import { Dumbbell, Apple, Moon, Droplet, Zap, Flame, Heart, Battery, Pill } from "lucide-react"

interface ProductCategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  categories: string[]
}

const getCategoryInfo = (category: string) => {
  const categoryMap: Record<string, { label: string; icon: any; color: string }> = {
    all: {
      label: "All Products",
      icon: Pill,
      color: "text-slate-600",
    },
    protein_powder: {
      label: "Protein Powder",
      icon: Dumbbell,
      color: "text-sky-600",
    },
    protein_bar: {
      label: "Protein Bars",
      icon: Apple,
      color: "text-emerald-600",
    },
    sleep_supplement: {
      label: "Sleep",
      icon: Moon,
      color: "text-indigo-600",
    },
    sports_drink: {
      label: "Sports Drinks",
      icon: Droplet,
      color: "text-cyan-600",
    },
    creatine: {
      label: "Creatine",
      icon: Zap,
      color: "text-amber-600",
    },
    pre_workout: {
      label: "Pre-Workout",
      icon: Flame,
      color: "text-orange-600",
    },
    recovery: {
      label: "Recovery",
      icon: Heart,
      color: "text-rose-600",
    },
    energy_gel: {
      label: "Energy Gels",
      icon: Battery,
      color: "text-lime-600",
    },
    electrolytes: {
      label: "Electrolytes",
      icon: Droplet,
      color: "text-teal-600",
    },
    vitamin: {
      label: "Vitamins",
      icon: Pill,
      color: "text-violet-600",
    },
    other: {
      label: "Other",
      icon: Pill,
      color: "text-slate-600",
    },
  }

  return categoryMap[category] || categoryMap.other
}

export function ProductCategoryNav({ activeCategory, onCategoryChange, categories }: ProductCategoryNavProps) {
  const allCategories = ["all", ...categories]

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex gap-2 pb-2 min-w-max">
        {allCategories.map((category) => {
          const categoryInfo = getCategoryInfo(category)
          const CategoryIcon = categoryInfo.icon
          const isActive = activeCategory === category

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm
                transition-all duration-200 whitespace-nowrap
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-105 shadow-sm"
                }
              `}
            >
              <CategoryIcon className={`h-4 w-4 ${isActive ? "text-white" : categoryInfo.color}`} />
              <span>{categoryInfo.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
