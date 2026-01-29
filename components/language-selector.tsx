"use client"

import { Languages } from "lucide-react"
import { useLanguageStore } from "@/lib/stores/language-store"

interface LanguageSelectorProps {
  variant?: "light" | "dark"
}

export function LanguageSelector({ variant = "light" }: LanguageSelectorProps) {
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  if (variant === "dark") {
    return (
      <div className="flex items-center gap-2">
        <Languages className="h-5 w-5 text-white drop-shadow-lg" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "es")}
          className="rounded-lg border-2 border-white/40 backdrop-blur-xl bg-white/10 px-3 py-1.5 text-sm font-bebas tracking-wider text-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 hover:bg-white/20 transition-all shadow-xl"
        >
          <option value="en" className="bg-slate-900 text-white">English</option>
          <option value="es" className="bg-slate-900 text-white">Español</option>
        </select>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-slate-700" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "es")}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  )
}
