"use client"

import { ExternalLink } from "lucide-react"
import { nocache } from "@/lib/cache"

interface PlatformPreviewProps {
  metadata: any
  url: string
}

export default function SlackPreview({ metadata, url }: PlatformPreviewProps) {
  const title = metadata.ogTitle || metadata.title || url
  const description = metadata.ogDescription || metadata.description || ""
  const image = metadata.ogImage || metadata.twitterImage || ""

  return (
    <div className="max-w-md overflow-hidden rounded-lg bg-white text-gray-900 dark:bg-[#222222] dark:text-[#d1d2d3]">
      <div className="p-3">
        <div className="border-l-4 border-gray-900 pl-3 py-2 dark:border-[#444444]">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </div>
          <div className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-[#9f9f9f]">
            {description}
          </div>
          {image && (
            <div className="mt-2">
              <img
                src={nocache(image)}
                alt={title}
                className="max-h-48 max-w-full rounded object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          )}
          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-[#9f9f9f]">
            {url.replace(/^https?:\/\//, "")}
            <ExternalLink size={12} className="ml-1 opacity-50" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
