import Link from "next/link"
import { ShieldAlert, Lock, Home } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-red-950 px-4">
      <div className="text-center max-w-2xl">
        {/* Icon and illustration */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative">
            <ShieldAlert className="h-32 w-32 text-red-500 drop-shadow-2xl animate-pulse" />
            <div className="absolute inset-0 h-32 w-32 bg-red-500/20 blur-3xl rounded-full"></div>
          </div>
        </div>

        {/* Error code */}
        <h1 className="text-9xl font-bebas tracking-wider text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text drop-shadow-2xl">
          401
        </h1>

        {/* Message */}
        <h2 className="mt-4 text-4xl font-bebas tracking-wider text-white uppercase drop-shadow-lg">
          Unauthorized Access
        </h2>
        <p className="mt-4 text-xl text-white/80 font-oswald">
          You need to be logged in to access this page. Please sign in to continue.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/">
            <button className="rounded-xl backdrop-blur-xl bg-white/10 border-2 border-white/40 px-8 py-4 text-lg font-bebas tracking-widest text-white hover:bg-white/20 shadow-xl transition-all hover:scale-105 flex items-center gap-2">
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
