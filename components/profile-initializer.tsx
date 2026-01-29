"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useRef } from "react"

export function ProfileInitializer() {
  const { isLoaded, isSignedIn, user } = useUser()
  const hasInitialized = useRef(false)

  useEffect(() => {
    async function ensureProfile() {
      if (!isLoaded || !isSignedIn || !user || hasInitialized.current) return

      hasInitialized.current = true

      try {
        console.log('[v0] Ensuring profile for user:', user.id)
        
        const response = await fetch("/api/profile/ensure", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          const data = await response.json()
          console.error("[v0] Failed to ensure profile:", data.error)
          // Reset flag to allow retry
          hasInitialized.current = false
          return
        }

        const data = await response.json()
        console.log('[v0] Profile initialization result:', data)
      } catch (error) {
        console.error("[v0] Error ensuring profile:", error)
        // Reset flag to allow retry
        hasInitialized.current = false
      }
    }

    ensureProfile()
  }, [isLoaded, isSignedIn, user])

  return null
}