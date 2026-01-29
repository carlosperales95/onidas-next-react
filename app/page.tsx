"use client"
import Link from "next/link"
import Image from "next/image"
import { Activity, BarChart3, Brain, Heart, Check, TrendingUp, Zap } from "lucide-react"
import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { useTranslation } from "@/lib/hooks/use-translation"
import { LanguageSelector } from "@/components/language-selector"

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-black via-slate-900 to-blue-950"></div>
        <div className="absolute inset-0 bg-linear-to-tr from-orange-500/10 via-transparent to-blue-500/10 animate-pulse"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative">
        <div className="absolute top-4 right-4 z-50">
          <LanguageSelector variant="dark" />
        </div>

        {/* Animated banner with text */}
        <div className="relative overflow-hidden border-b border-white/10 backdrop-blur-md bg-linear-to-r from-orange-600/80 via-red-600/80 to-blue-600/80">
          <div className="flex animate-marquee whitespace-nowrap py-3">
            <span className="mx-8 text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> TRAIN SMARTER
            </span>
            <span className="mx-8 text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4" /> PERFORM BETTER
            </span>
            <span className="mx-8 text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Heart className="h-4 w-4" /> RECOVER FASTER
            </span>
            <span className="mx-8 text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Brain className="h-4 w-4" /> AI-POWERED INSIGHTS
            </span>
            <span className="mx-8 text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> TRAIN SMARTER
            </span>
            <span className="mx-8 text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4" /> PERFORM BETTER
            </span>
            <span className="mx-8 text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Heart className="h-4 w-4" /> RECOVER FASTER
            </span>
            <span className="mx-8 text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <Brain className="h-4 w-4" /> AI-POWERED INSIGHTS
            </span>
          </div>
        </div>

        {/* Hero Section with sports image */}
        <div className="relative overflow-hidden min-h-[90vh]">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/hero-athlete.jpg"
              alt="Athlete in action"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/90"></div>
            <div className="absolute inset-0 bg-linear-to-r from-orange-600/20 via-transparent to-blue-600/20"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <Activity className="h-20 w-20 text-orange-500 drop-shadow-2xl animate-pulse" />
                  <div className="absolute inset-0 h-20 w-20 bg-orange-500/20 blur-2xl rounded-full"></div>
                </div>
              </div>
              <h1 className="text-5xl font-bebas tracking-wider text-white sm:text-7xl md:text-8xl drop-shadow-2xl uppercase">
                <span className="block bg-linear-to-r from-white via-blue-100 to-orange-200 bg-clip-text text-transparent">{t.landing.hero.title}</span>
                <span className="block text-transparent bg-linear-to-r from-orange-500 via-red-500 to-blue-500 bg-clip-text drop-shadow-2xl animate-pulse">{t.landing.hero.titleHighlight}</span>
              </h1>
              <p className="mx-auto mt-8 max-w-3xl text-2xl drop-shadow-xl text-slate-100 font-oswald tracking-wide leading-relaxed">{t.landing.hero.description}</p>
              <div className="mt-12 flex flex-wrap justify-center gap-6">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <button className="group relative rounded-xl backdrop-blur-xl bg-linear-to-r from-orange-600 to-red-600 px-10 py-5 text-lg font-bebas tracking-widest text-white shadow-2xl hover:shadow-orange-500/50 border-2 border-orange-400/50 transition-all hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative">{t.landing.hero.startTrial}</span>
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="rounded-xl backdrop-blur-xl bg-white/10 border-2 border-white/40 px-10 py-5 text-lg font-bebas tracking-widest text-white hover:bg-white/20 shadow-xl transition-all hover:scale-105">
                      {t.landing.hero.signIn}
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <button className="group relative rounded-xl backdrop-blur-xl bg-linear-to-r from-orange-600 to-red-600 px-10 py-5 text-lg font-bebas tracking-widest text-white shadow-2xl hover:shadow-orange-500/50 border-2 border-orange-400/50 transition-all hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative">Go to Dashboard</span>
                    </button>
                  </Link>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="relative py-24 bg-linear-to-b from-black/80 to-slate-900/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bebas tracking-wider text-white sm:text-6xl drop-shadow-2xl uppercase bg-linear-to-r from-white to-orange-200 bg-clip-text text-transparent">
                {t.landing.benefits.title}
              </h2>
              <p className="mt-6 text-2xl text-white/90 drop-shadow-lg font-oswald">{t.landing.benefits.subtitle}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group relative rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/30 to-blue-900/30 group-hover:from-blue-600/40 group-hover:to-blue-900/40 transition-all"></div>
                <div className="relative backdrop-blur-md bg-black/30 p-10 border-2 border-blue-400/30 h-full">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-blue-400 to-blue-600 border-2 border-white/30 shadow-2xl mb-6">
                    <Brain className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="border-b-2 border-blue-400/40 pb-4 mb-4">
                    <h3 className="text-2xl font-bebas tracking-wider text-blue-300 drop-shadow-lg uppercase font-bold">
                      {t.landing.benefits.smartTraining.title}
                    </h3>
                  </div>
                  <p className="text-base text-white/90 drop-shadow font-oswald leading-relaxed">{t.landing.benefits.smartTraining.description}</p>
                </div>
              </div>

              <div className="group relative rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-green-600/30 to-emerald-900/30 group-hover:from-green-600/40 group-hover:to-emerald-900/40 transition-all"></div>
                <div className="relative backdrop-blur-md bg-black/30 p-10 border-2 border-green-400/30 h-full">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-green-400 to-emerald-600 border-2 border-white/30 shadow-2xl mb-6">
                    <BarChart3 className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="border-b-2 border-green-400/40 pb-4 mb-4">
                    <h3 className="text-2xl font-bebas tracking-wider text-green-300 drop-shadow-lg uppercase font-bold">
                      {t.landing.benefits.dataInsights.title}
                    </h3>
                  </div>
                  <p className="text-base text-white/90 drop-shadow font-oswald leading-relaxed">{t.landing.benefits.dataInsights.description}</p>
                </div>
              </div>

              <div className="group relative rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-orange-600/30 to-red-800/30 group-hover:from-orange-600/40 group-hover:to-red-800/40 transition-all"></div>
                <div className="relative backdrop-blur-md bg-black/30 p-10 border-2 border-orange-400/30 h-full">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-orange-400 to-red-600 border-2 border-white/30 shadow-2xl mb-6">
                    <Heart className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <div className="border-b-2 border-orange-400/40 pb-4 mb-4">
                    <h3 className="text-2xl font-bebas tracking-wider text-orange-300 drop-shadow-lg uppercase font-bold">
                      {t.landing.benefits.nutrition.title}
                    </h3>
                  </div>
                  <p className="text-base text-white/90 drop-shadow font-oswald leading-relaxed">{t.landing.benefits.nutrition.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="relative py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bebas tracking-wider text-white sm:text-6xl drop-shadow-2xl uppercase bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                {t.landing.howItWorks.title}
              </h2>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              <div className="relative text-center group">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-red-500/20 blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-red-600 border-4 border-orange-300/50 shadow-2xl transform group-hover:scale-110 transition-transform">
                  <span className="text-5xl font-bebas text-white drop-shadow-2xl">1</span>
                </div>
                <h3 className="mt-6 text-2xl font-bebas tracking-wider text-white drop-shadow-lg uppercase">
                  {t.landing.howItWorks.step1.title}
                </h3>
                <p className="mt-3 text-lg text-white/90 drop-shadow font-oswald">{t.landing.howItWorks.step1.description}</p>
              </div>

              <div className="relative text-center group">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-indigo-500/20 blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 border-4 border-blue-300/50 shadow-2xl transform group-hover:scale-110 transition-transform">
                  <span className="text-5xl font-bebas text-white drop-shadow-2xl">2</span>
                </div>
                <h3 className="mt-6 text-2xl font-bebas tracking-wider text-white drop-shadow-lg uppercase">
                  {t.landing.howItWorks.step2.title}
                </h3>
                <p className="mt-3 text-lg text-white/90 drop-shadow font-oswald">{t.landing.howItWorks.step2.description}</p>
              </div>

              <div className="relative text-center group">
                <div className="absolute inset-0 bg-linear-to-br from-green-500/20 to-emerald-500/20 blur-2xl group-hover:blur-3xl transition-all"></div>
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 border-4 border-green-300/50 shadow-2xl transform group-hover:scale-110 transition-transform">
                  <span className="text-5xl font-bebas text-white drop-shadow-2xl">3</span>
                </div>
                <h3 className="mt-6 text-2xl font-bebas tracking-wider text-white drop-shadow-lg uppercase">
                  {t.landing.howItWorks.step3.title}
                </h3>
                <p className="mt-3 text-lg text-white/90 drop-shadow font-oswald">{t.landing.howItWorks.step3.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="relative py-24 bg-linear-to-b from-slate-900/80 to-black/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bebas tracking-wider text-white sm:text-6xl drop-shadow-2xl uppercase bg-linear-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t.landing.pricing.title}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:mx-auto lg:max-w-5xl">
              <div className="group relative rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-slate-700/30 to-slate-900/30 group-hover:from-slate-700/40 group-hover:to-slate-900/40 transition-all"></div>
                <div className="relative backdrop-blur-md bg-black/30 border-2 border-slate-400/30 p-10 h-full">
                  <div className="border-b-2 border-slate-400/40 pb-6 mb-6">
                    <h3 className="text-3xl font-bebas tracking-wider text-slate-200 drop-shadow-lg uppercase font-bold">{t.landing.pricing.free.title}</h3>
                    <p className="mt-2 text-white/80 drop-shadow font-oswald">{t.landing.pricing.free.subtitle}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-5xl font-bebas text-white drop-shadow-2xl">
                      {t.landing.pricing.free.price}
                    </span>
                    <span className="text-xl text-white/70 drop-shadow font-oswald">{t.landing.pricing.free.perMonth}</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="h-6 w-6 shrink-0 text-green-400 drop-shadow-lg mt-1" />
                      <span className="ml-3 text-white/90 drop-shadow font-oswald text-base">{t.landing.pricing.free.feature1}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-6 w-6 shrink-0 text-green-400 drop-shadow-lg mt-1" />
                      <span className="ml-3 text-white/90 drop-shadow font-oswald text-base">{t.landing.pricing.free.feature2}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-6 w-6 shrink-0 text-green-400 drop-shadow-lg mt-1" />
                      <span className="ml-3 text-white/90 drop-shadow font-oswald text-base">{t.landing.pricing.free.feature3}</span>
                    </li>
                  </ul>
                  <Link href="/dashboard">
                    <button className="w-full rounded-xl backdrop-blur-md bg-white/20 border-2 border-white/40 px-6 py-4 text-center font-bebas tracking-wider text-white hover:bg-white/30 shadow-xl transition-all text-lg">
                      {t.landing.pricing.free.cta}
                    </button>
                  </Link>
                </div>
              </div>

              <div className="group relative rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/30 to-indigo-800/30 group-hover:from-blue-600/40 group-hover:to-indigo-800/40 transition-all"></div>
                <div className="relative backdrop-blur-md bg-black/30 border-2 border-blue-400/40 p-10 h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 px-6 py-2 text-sm font-bebas tracking-wider text-white border-2 border-blue-300/50 shadow-2xl">
                    {t.landing.pricing.pro.badge}
                  </div>
                  <div className="border-b-2 border-blue-400/40 pb-6 mb-6">
                    <h3 className="text-3xl font-bebas tracking-wider text-blue-300 drop-shadow-lg uppercase font-bold">{t.landing.pricing.pro.title}</h3>
                    <p className="mt-2 text-white/80 drop-shadow font-oswald">{t.landing.pricing.pro.subtitle}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-5xl font-bebas text-white drop-shadow-2xl">
                      {t.landing.pricing.pro.price}
                    </span>
                    <span className="text-xl text-white/70 drop-shadow font-oswald">{t.landing.pricing.pro.perMonth}</span>
                  </div>
                  <p className="mb-6 text-sm text-blue-300/90 drop-shadow font-bebas tracking-wide">{t.landing.pricing.pro.trial}</p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="h-6 w-6 shrink-0 text-green-400 drop-shadow-lg mt-1" />
                      <span className="ml-3 text-white/90 drop-shadow font-oswald text-base">{t.landing.pricing.pro.feature1}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-6 w-6 shrink-0 text-green-400 drop-shadow-lg mt-1" />
                      <span className="ml-3 text-white/90 drop-shadow font-oswald text-base">{t.landing.pricing.pro.feature2}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-6 w-6 shrink-0 text-green-400 drop-shadow-lg mt-1" />
                      <span className="ml-3 text-white/90 drop-shadow font-oswald text-base">{t.landing.pricing.pro.feature3}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-6 w-6 shrink-0 text-green-400 drop-shadow-lg mt-1" />
                      <span className="ml-3 text-white/90 drop-shadow font-oswald text-base">{t.landing.pricing.pro.feature4}</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-6 w-6 shrink-0 text-green-400 drop-shadow-lg mt-1" />
                      <span className="ml-3 text-white/90 drop-shadow font-oswald text-base">{t.landing.pricing.pro.feature5}</span>
                    </li>
                  </ul>
                  <Link href="/dashboard">
                    <button className="w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 border-2 border-blue-400/50 px-6 py-4 text-center font-bebas tracking-wider text-white hover:from-blue-700 hover:to-indigo-700 shadow-2xl hover:shadow-blue-500/50 transition-all text-lg">
                      {t.landing.pricing.pro.cta}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-orange-600/40 via-red-600/40 to-blue-600/40"></div>
              <div className="relative backdrop-blur-xl bg-black/40 p-16 text-center shadow-2xl border-2 border-orange-400/40">
                <h2 className="text-5xl font-bebas tracking-wider text-white sm:text-6xl drop-shadow-2xl uppercase bg-linear-to-r from-orange-400 via-red-400 to-blue-400 bg-clip-text text-transparent">{t.landing.cta.title}</h2>
                <p className="mt-6 text-2xl text-white/90 drop-shadow-lg font-oswald leading-relaxed max-w-3xl mx-auto">{t.landing.cta.subtitle}</p>
                <div className="mt-10">
                  <Link href="/dashboard">
                    <button className="group relative inline-block rounded-xl backdrop-blur-xl bg-linear-to-r from-orange-600 to-red-600 px-12 py-5 text-xl font-bebas tracking-widest text-white shadow-2xl hover:shadow-orange-500/50 border-2 border-orange-400/50 transition-all hover:scale-105 overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <span className="relative">{t.landing.cta.button}</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="backdrop-blur-lg bg-white/10 border-t border-white/20">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center">
              <Activity className="h-8 w-8 text-white drop-shadow-lg" />
              <span className="ml-2 text-xl font-bold text-white drop-shadow">AthleteHub</span>
            </div>
            <p className="mt-4 text-center text-white/80 drop-shadow">{t.landing.footer.copyright}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
