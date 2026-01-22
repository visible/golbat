"use client"

import type { MetaData } from "@/hooks/metadata"

interface ScoreProps {
  metadata: MetaData
}

function calculate(metadata: MetaData): { score: number; checks: { label: string; ok: boolean }[] } {
  const checks: { label: string; ok: boolean }[] = []

  checks.push({ label: "Title", ok: !!metadata.title })
  checks.push({ label: "Title Length", ok: !!metadata.title && metadata.title.length <= 60 })
  checks.push({ label: "Description", ok: !!metadata.description })
  checks.push({ label: "Desc Length", ok: !!metadata.description && metadata.description.length <= 160 })
  checks.push({ label: "OG Title", ok: !!metadata.ogTitle })
  checks.push({ label: "OG Description", ok: !!metadata.ogDescription })
  checks.push({ label: "OG Image", ok: !!metadata.ogImage })
  checks.push({ label: "Twitter Card", ok: !!metadata.twitterCard })
  checks.push({ label: "Twitter Image", ok: !!metadata.twitterImage })
  checks.push({ label: "Canonical", ok: !!metadata.canonical })
  checks.push({ label: "Favicon", ok: !!metadata.favicon })
  checks.push({ label: "Viewport", ok: !!metadata.viewport })
  checks.push({ label: "robots.txt", ok: !!metadata.robotsFile })
  checks.push({ label: "sitemap.xml", ok: !!metadata.sitemap })

  const passed = checks.filter((c) => c.ok).length
  const score = Math.round((passed / checks.length) * 100)

  return { score, checks }
}

export default function Score({ metadata }: ScoreProps) {
  const { score, checks } = calculate(metadata)

  const color =
    score >= 80
      ? "text-green-500"
      : score >= 50
        ? "text-yellow-500"
        : "text-red-500"

  const ring =
    score >= 80
      ? "stroke-green-500"
      : score >= 50
        ? "stroke-yellow-500"
        : "stroke-red-500"

  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-start gap-8">
      <div className="relative w-24 h-24 shrink-0">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-neutral-200 dark:text-neutral-800"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={ring}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-medium ${color}`}>{score}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                check.ok ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
