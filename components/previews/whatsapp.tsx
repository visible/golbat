"use client"

import { nocache } from "@/lib/cache"

interface PlatformPreviewProps {
  metadata: any
  url: string
}

export default function WhatsAppPreview({
  metadata,
  url,
}: PlatformPreviewProps) {
  const title = metadata.ogTitle || metadata.title || url
  const description = metadata.ogDescription || metadata.description || ""
  const image = metadata.ogImage || metadata.twitterImage || ""

  return (
    <div className="max-w-md overflow-hidden rounded-lg bg-white text-gray-900 dark:bg-[#1c1c1c] dark:text-[#e0e0e0]">
      <div className="p-3">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-[#444444] dark:bg-[#1c1c1c]">
          {image && (
            <div>
              <img
                src={nocache(image)}
                alt={title}
                className="h-44 w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          )}
          <div className="p-3">
            <div className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-[#e0e0e0]">
              {title}
            </div>
            <div className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-[#b0b0b0]">
              {description}
            </div>
            <div className="mt-1 text-xs text-gray-400 dark:text-[#888888]">
              {url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
