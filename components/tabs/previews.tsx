"use client"

import { useState } from "react"
import Platform from "@/components/platform"
import Suggestions from "@/components/suggestions"
import Tabs from "@/components/tabs"
import type { MetaData } from "@/hooks/metadata"

interface PreviewsTabProps {
  metadata: MetaData
  url: string
  showSuggestions: boolean
}

const platforms = [
  { id: "telegram", label: "Telegram" },
  { id: "discord", label: "Discord" },
  { id: "slack", label: "Slack" },
  { id: "twitter", label: "X" },
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "whatsapp", label: "WhatsApp" },
]

export default function PreviewsTab({
  metadata,
  url,
  showSuggestions,
}: PreviewsTabProps) {
  const [platform, setPlatform] = useState("telegram")

  return (
    <div>
      <Tabs
        tabs={platforms}
        active={platform}
        onChange={setPlatform}
        size="sm"
      />

      <div className="mt-4">
        {platforms.map((p) => (
          <div key={p.id} className={platform === p.id ? "" : "hidden"}>
            <Platform platform={p.id} metadata={metadata} url={url} />
          </div>
        ))}

        {showSuggestions && (
          <Suggestions
            metadata={metadata}
            type="previews"
            platform={platform}
          />
        )}
      </div>
    </div>
  )
}
