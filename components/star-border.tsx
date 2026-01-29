"use client"

import type { ReactNode, ElementType } from "react"

interface StarBorderProps {
  as?: ElementType
  className?: string
  color?: string
  speed?: string
  thickness?: number
  children: ReactNode
  [key: string]: any
}

export function StarBorder({
  as: Comp = "button",
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  ...rest
}: StarBorderProps) {
  return (
    <Comp
      className={`relative ${className}`}
      style={{
        padding: `${thickness}px 0`,
        ...rest.style,
      }}
      {...rest}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${color}, transparent 50%)`,
          animation: `star-border ${speed} linear infinite`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-50"
        style={{
          background: `radial-gradient(circle at 100% 100%, ${color}, transparent 50%)`,
          animation: `star-border-reverse ${speed} linear infinite`,
        }}
      />
      <div className="relative z-10">{children}</div>
      <style jsx>{`
        @keyframes star-border {
          0% {
            transform: translate(0%, 0%) rotate(0deg);
          }
          100% {
            transform: translate(100%, 100%) rotate(360deg);
          }
        }
        @keyframes star-border-reverse {
          0% {
            transform: translate(0%, 0%) rotate(0deg);
          }
          100% {
            transform: translate(-100%, -100%) rotate(-360deg);
          }
        }
      `}</style>
    </Comp>
  )
}
