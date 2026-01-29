import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getAthleteProfile } from "@/lib/data/athlete-data"
import { SettingsClient } from "./settings-client"

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  const profile = await getAthleteProfile(userId)

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10">
        <Navigation />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-5xl font-bebas tracking-wider text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-blue-400 bg-clip-text drop-shadow-2xl uppercase">
              Settings
            </h1>
            <p className="mt-4 text-xl text-white/90 drop-shadow-lg font-oswald">Customize your profile and preferences</p>
          </div>

          <SettingsClient initialProfile={profile} userId={userId} />
        </div>
      </div>
    </div>
  )
}
