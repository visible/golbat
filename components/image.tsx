"use client"

import { useState } from "react"
import { nocache } from "@/lib/cache"

interface PreviewProps {
  title: string
  url: string
}

const RECOMMENDED = {
  og: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 600 },
}

export default function Preview({ title, url }: PreviewProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [error, setError] = useState(false)

  const isFavicon = title.toLowerCase().includes("favicon")
  const isOg = title.toLowerCase().includes("open graph")
  const isTwitter = title.toLowerCase().includes("x")
  const imageUrl = nocache(url)

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement
    setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
  }

  const getStatus = () => {
    if (!dimensions || isFavicon) return null

    const rec = isTwitter ? RECOMMENDED.twitter : RECOMMENDED.og
    const isGood = dimensions.width >= rec.width && dimensions.height >= rec.height

    return (
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`w-1.5 h-1.5 rounded-full ${isGood ? "bg-green-500" : "bg-yellow-500"}`}
        />
        <span className="text-xs text-neutral-400">
          {dimensions.width} × {dimensions.height}
          {!isGood && ` (recommended: ${rec.width}×${rec.height})`}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <div className="text-[10px] text-neutral-400 uppercase tracking-[0.15em] mb-3">
        {title}
      </div>
      {error ? (
        <span className="text-neutral-400 text-sm">Unavailable</span>
      ) : (
        <>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={imageUrl}
              alt={title}
              className={`${isFavicon ? "h-10 w-10" : "max-h-40 max-w-full"} border border-neutral-200 dark:border-neutral-800 rounded hover:opacity-80 transition-opacity`}
              onLoad={handleLoad}
              onError={() => setError(true)}
            />
          </a>
          {getStatus()}
        </>
      )}
    </div>
  )
}
