"use client"

import { nocache } from "@/lib/cache"

interface PlatformPreviewProps {
  metadata: any
  url: string
}

export default function FacebookPreview({
  metadata,
  url,
}: PlatformPreviewProps) {
  const title = metadata.ogTitle || metadata.title || url
  const description = metadata.ogDescription || metadata.description || ""
  const image = metadata.ogImage || metadata.twitterImage || ""

  return (
    <div className="max-w-md overflow-hidden rounded-lg bg-white text-gray-900 dark:bg-[#242526] dark:text-[#e4e6eb]">
      <div className="p-3">
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-[#3e4042] dark:bg-[#242526]">
          {image && (
            <div>
              <img
                src={nocache(image)}
                alt={title}
                className="h-52 w-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = "none"
                }}
              />
            </div>
          )}
          <div className="p-3">
            <div className="text-xs uppercase text-gray-500 dark:text-[#b0b3b8]">
              {url.replace(/^https?:\/\//, "")}
            </div>
            <div className="mt-1 text-sm font-medium text-gray-900 dark:text-[#e4e6eb]">
              {title}
            </div>
            <div className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-[#b0b3b8]">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
