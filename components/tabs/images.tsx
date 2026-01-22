"use client"

import Preview from "@/components/image"
import Suggestions from "@/components/suggestions"
import type { MetaData } from "@/hooks/metadata"

interface ImagesTabProps {
  metadata: MetaData
  showSuggestions: boolean
}

export default function ImagesTab({
  metadata,
  showSuggestions,
}: ImagesTabProps) {
  const hasImages =
    metadata.ogImage || metadata.twitterImage || metadata.favicon

  return (
    <div className="space-y-4">
      {metadata.ogImage && (
        <Preview title="Open Graph" url={metadata.ogImage} />
      )}
      {metadata.twitterImage && (
        <Preview title="X" url={metadata.twitterImage} />
      )}
      {metadata.favicon && <Preview title="Favicon" url={metadata.favicon} />}

      {!hasImages && (
        <div className="p-6 bg-[#111] border border-[#222] rounded-lg text-center">
          <p className="text-[#666] text-sm">No images found</p>
        </div>
      )}

      {showSuggestions && <Suggestions metadata={metadata} type="images" />}
    </div>
  )
}
