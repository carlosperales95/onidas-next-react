"use client"

import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  unit?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  iconColor?: string
  benchmark?: number | null
}

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  iconColor = "text-blue-600",
  benchmark,
}: StatCardProps) {
  return (
    <div className="rounded-2xl">
      <div className="group overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm h-full">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex-shrink-0 ${iconColor}`}>
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </div>
                <dt className="text-sm font-semibold text-slate-700 tracking-wide uppercase">{label}</dt>
              </div>
              <dd className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
                {unit && <span className="text-base font-medium text-slate-600">{unit}</span>}
                {trend && (
                  <div
                    className={`flex items-baseline text-sm font-bold ${
                      trend.isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {trend.isPositive ? "+" : ""}
                    {trend.value}%
                  </div>
                )}
              </dd>
            </div>
          </div>

          {benchmark !== null && benchmark !== undefined && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="relative h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-rose-400 shadow-lg">
                <div
                  className="absolute top-0 h-full w-1 bg-slate-900 shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                  style={{ left: `${benchmark}%` }}
                  title={`Percentile: ${benchmark}`}
                />
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-slate-600">
                <span className="font-medium">Low</span>
                <span className="font-bold text-slate-900 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                  P{benchmark}
                </span>
                <span className="font-medium">High</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
