import Link from "next/link"
import { Activity, Home } from "lucide-react"

function TiredWeightsSVG() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
    >
      {/* Floor/Ground */}
      <ellipse cx="200" cy="270" rx="180" ry="15" fill="#E2E8F0" />
      
      {/* Left Weight Plate */}
      <g>
        {/* Outer plate */}
        <rect x="40" y="180" width="30" height="80" rx="4" fill="#1E3A8A" />
        <rect x="45" y="185" width="20" height="70" rx="2" fill="#3B82F6" />
        {/* Weight text */}
        <text x="55" y="225" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">20</text>
        {/* Tired face on left weight */}
        <circle cx="55" cy="200" r="2" fill="white" /> {/* Left eye closed - line */}
        <line x1="50" y1="200" x2="55" y2="203" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="55" y1="203" x2="60" y2="200" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Sweat drop */}
        <path d="M65 195 Q68 200 65 205 Q62 200 65 195" fill="#60A5FA" />
      </g>
      
      {/* Right Weight Plate */}
      <g>
        <rect x="330" y="180" width="30" height="80" rx="4" fill="#1E3A8A" />
        <rect x="335" y="185" width="20" height="70" rx="2" fill="#3B82F6" />
        <text x="345" y="225" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">20</text>
        {/* Tired face on right weight */}
        <line x1="340" y1="200" x2="345" y2="203" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="345" y1="203" x2="350" y2="200" stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Sweat drop */}
        <path d="M355 195 Q358 200 355 205 Q352 200 355 195" fill="#60A5FA" />
      </g>
      
      {/* Barbell Bar - slightly bent/sagging to show tiredness */}
      <path d="M70 220 Q200 235 330 220" stroke="#94A3B8" strokeWidth="12" strokeLinecap="round" />
      <path d="M70 220 Q200 232 330 220" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
      
      {/* Center grip area */}
      <rect x="170" y="214" width="60" height="16" rx="3" fill="#64748B" />
      <rect x="175" y="216" width="50" height="12" rx="2" fill="#94A3B8" />
      
      {/* Knurling pattern on grip */}
      <line x1="180" y1="218" x2="180" y2="226" stroke="#64748B" strokeWidth="1" />
      <line x1="185" y1="218" x2="185" y2="226" stroke="#64748B" strokeWidth="1" />
      <line x1="190" y1="218" x2="190" y2="226" stroke="#64748B" strokeWidth="1" />
      <line x1="195" y1="218" x2="195" y2="226" stroke="#64748B" strokeWidth="1" />
      <line x1="200" y1="218" x2="200" y2="226" stroke="#64748B" strokeWidth="1" />
      <line x1="205" y1="218" x2="205" y2="226" stroke="#64748B" strokeWidth="1" />
      <line x1="210" y1="218" x2="210" y2="226" stroke="#64748B" strokeWidth="1" />
      <line x1="215" y1="218" x2="215" y2="226" stroke="#64748B" strokeWidth="1" />
      <line x1="220" y1="218" x2="220" y2="226" stroke="#64748B" strokeWidth="1" />
      
      {/* Small inner weight plates */}
      <rect x="85" y="195" width="15" height="50" rx="3" fill="#475569" />
      <rect x="300" y="195" width="15" height="50" rx="3" fill="#475569" />
      
      {/* Collars */}
      <rect x="105" y="210" width="20" height="25" rx="2" fill="#334155" />
      <rect x="275" y="210" width="20" height="25" rx="2" fill="#334155" />
      
      {/* ZZZ sleeping indicators */}
      <g fill="#3B82F6" fontWeight="bold">
        <text x="130" y="170" fontSize="20" opacity="0.9">Z</text>
        <text x="145" y="155" fontSize="16" opacity="0.7">Z</text>
        <text x="155" y="145" fontSize="12" opacity="0.5">z</text>
      </g>
      
      {/* Stars/dizzy indicators around the barbell */}
      <g fill="#FBBF24">
        <polygon points="260,165 262,170 268,170 264,174 266,180 260,176 254,180 256,174 252,170 258,170" />
        <polygon points="240,155 241,158 245,158 242,160 243,164 240,162 237,164 238,160 235,158 239,158" transform="scale(0.7) translate(100, 70)" />
      </g>
      
      {/* "404" text styled as weight plate numbers */}
      <text x="200" y="100" fontSize="60" fill="#1E3A8A" textAnchor="middle" fontWeight="bold" fontFamily="system-ui">404</text>
      
      {/* Decorative dumbbells on the ground */}
      <g transform="translate(80, 250)">
        <rect x="0" y="5" width="8" height="15" rx="2" fill="#64748B" />
        <rect x="8" y="8" width="20" height="8" rx="1" fill="#94A3B8" />
        <rect x="28" y="5" width="8" height="15" rx="2" fill="#64748B" />
      </g>
      
      <g transform="translate(290, 250)">
        <rect x="0" y="5" width="8" height="15" rx="2" fill="#64748B" />
        <rect x="8" y="8" width="20" height="8" rx="1" fill="#94A3B8" />
        <rect x="28" y="5" width="8" height="15" rx="2" fill="#64748B" />
      </g>
    </svg>
  )
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AthleteHub</span>
          </Link>
        </div>

        {/* SVG Illustration */}
        <div className="mb-8">
          <TiredWeightsSVG />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Looks like this page took a rest day. The weights are tired and so is this URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 shadow-lg transition-all"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-blue-600 bg-transparent px-6 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Activity className="h-5 w-5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
