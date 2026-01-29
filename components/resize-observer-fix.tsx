"use client"

import { useEffect } from "react"

export function ResizeObserverFix() {
  useEffect(() => {
    // Suppress ResizeObserver loop error - this is a known browser issue
    // that doesn't affect functionality
    const resizeObserverErr = (e: ErrorEvent) => {
      if (
        e.message === "ResizeObserver loop completed with undelivered notifications." ||
        e.message.includes("ResizeObserver loop")
      ) {
        e.preventDefault()
      }
    }
    
    window.addEventListener("error", resizeObserverErr, true)
    
    return () => {
      window.removeEventListener("error", resizeObserverErr, true)
    }
  }, [])

  return null
}
