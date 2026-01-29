"use client"

import { useEffect, useState, useRef } from "react"

interface TrueFocusProps {
  sentence?: string
  separator?: string
  blurAmount?: number
  borderColor?: string
  glowColor?: string
  animationDuration?: number
  pauseBetweenAnimations?: number
}

export function TrueFocus({
  sentence = "True Focus",
  separator = " ",
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
}: TrueFocusProps) {
  const words = sentence.split(separator)
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentIndex((prev) => (prev + 1) % words.length)
      },
      (animationDuration + pauseBetweenAnimations) * 1000,
    )

    return () => clearInterval(interval)
  }, [animationDuration, pauseBetweenAnimations, words.length])

  useEffect(() => {
    if (!wordRefs.current[currentIndex] || !containerRef.current) return

    const parentRect = containerRef.current.getBoundingClientRect()
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect()

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height,
    })
  }, [currentIndex])

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div className="inline-flex gap-2">
        {words.map((word, index) => {
          const isActive = index === currentIndex
          return (
            <span
              key={index}
              ref={(el) => {
                wordRefs.current[index] = el
              }}
              style={{
                filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
                transition: `filter ${animationDuration}s ease`,
              }}
            >
              {word}
            </span>
          )
        })}
      </div>

      <div
        className="pointer-events-none absolute border-2 rounded-lg transition-all"
        style={{
          left: `${focusRect.x}px`,
          top: `${focusRect.y}px`,
          width: `${focusRect.width}px`,
          height: `${focusRect.height}px`,
          borderColor: borderColor,
          boxShadow: `0 0 20px ${glowColor}`,
          transitionDuration: `${animationDuration}s`,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
      />
    </div>
  )
}
