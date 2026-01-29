"use client"

import { useEffect, useState } from "react"
import { useLanguageStore } from "@/lib/stores/language-store"
import { translations } from "@/lib/i18n/translations"

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Use "en" as default during hydration
  const currentLanguage = isHydrated ? language : "en"
  const t = translations[currentLanguage] || translations.en

  return { t, language: currentLanguage, isHydrated }
}
