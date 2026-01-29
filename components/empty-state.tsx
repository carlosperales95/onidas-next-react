'use client';

import { Type as type, LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden backdrop-blur-md bg-white/10 p-12 border-2 border-white/20 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-full bg-white/10 p-6 mb-6">
          <Icon className="h-12 w-12 text-white/60" />
        </div>
        <h3 className="text-2xl font-bebas tracking-wider text-white/90 mb-3 uppercase">
          {title}
        </h3>
        <p className="text-white/70 font-oswald mb-6 max-w-md">
          {description}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-6 py-3 font-bebas tracking-wider text-white shadow-2xl transition-all hover:scale-105 border-2 border-orange-400/50"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}
