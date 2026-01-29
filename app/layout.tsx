import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Bebas_Neue, Oswald } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import { Providers } from "@/components/providers"
import { ResizeObserverFix } from "@/components/resize-observer-fix"
import { ThemeProvider } from "@/components/theme-provider"
import { ProfileInitializer } from "@/components/profile-initializer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AthleteHub - AI-Powered Training Platform",
  description: "Personalized training plans, nutrition guidance, and performance analytics for athletes",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} ${oswald.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ResizeObserverFix />
          <ProfileInitializer />
          <Providers>
            {/* Content */}
            <div className="relative z-10">{children}</div>
          </Providers>
          <Analytics />
        </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
