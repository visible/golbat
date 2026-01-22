"use client"

import { nocache } from "@/lib/cache"

interface PlatformPreviewProps {
  metadata: any
  url: string
}

export default function TelegramPreview({
  metadata,
  url,
}: PlatformPreviewProps) {
  const title = metadata.ogTitle || metadata.title || url
  const description = metadata.ogDescription || metadata.description || ""
  const image = metadata.ogImage || metadata.twitterImage || ""

  const truncatedDescription =
    description.length > 120
      ? `${description.substring(0, 120)}...`
      : description

  return (
    <div className="max-w-md overflow-hidden rounded-lg bg-white text-gray-900 dark:bg-[#212121] dark:text-white">
      <div className="overflow-hidden rounded-lg bg-white dark:bg-[#212121]">
        <div className="px-3 pt-2 pb-1 text-xs text-gray-500 dark:text-[#aaaaaa]">
          {url.startsWith("http") ? url : `https://${url}`}
        </div>
        <div className="px-3 pb-2">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-[#aaaaaa]">
            {truncatedDescription}
          </div>
        </div>
        {image && (
          <div>
            <img
              src={nocache(image)}
              alt={title}
              className="h-60 w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
