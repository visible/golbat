"use client"

import { ExternalLink } from "lucide-react"
import { nocache } from "@/lib/cache"

interface PlatformPreviewProps {
  metadata: any
  url: string
}

export default function DiscordPreview({
  metadata,
  url,
}: PlatformPreviewProps) {
  const title = metadata.ogTitle || metadata.title || url
  const description = metadata.ogDescription || metadata.description || ""
  const image = metadata.ogImage || metadata.twitterImage || ""

  return (
    <div className="max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 transition-colors hover:border-gray-300 dark:border-[#444444] dark:bg-[#1c1c1c] dark:text-[#e0e0e0] dark:hover:border-[#888888]">
      <div className="p-4">
        <div className="border-l-4 border-gray-900 pl-3 py-2 dark:border-[#444444]">
          {image && (
            <div className="mb-3">
              <img
                src={nocache(image)}
                alt={title}
                className="max-h-[300px] w-full rounded object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          )}
          <div className="mb-1 text-base font-semibold text-gray-900 dark:text-[#e0e0e0]">
            {title}
          </div>
          {description && (
            <div className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-[#b0b0b0]">
              {description}
            </div>
          )}
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-[#888888]">
            {url.replace(/^https?:\/\//, "")}
            <ExternalLink size={12} className="ml-1 opacity-50" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
