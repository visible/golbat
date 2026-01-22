"use client"

import Card from "@/components/card"
import Field from "@/components/field"
import Suggestions from "@/components/suggestions"
import type { MetaData } from "@/hooks/metadata"

interface TwitterTabProps {
  metadata: MetaData
  showSuggestions: boolean
}

export default function TwitterTab({
  metadata,
  showSuggestions,
}: TwitterTabProps) {
  return (
    <div className="space-y-6">
      <Card title="X Card">
        <Field label="Card Type" value={metadata.twitterCard} />
        <Field label="Title" value={metadata.twitterTitle} characterCount limit={70} />
        <Field
          label="Description"
          value={metadata.twitterDescription}
          characterCount
          limit={200}
        />
        <Field label="Image" value={metadata.twitterImage} isImage />
        <Field label="Site" value={metadata.twitterSite} />
        <Field label="Creator" value={metadata.twitterCreator} />
      </Card>

      {showSuggestions && <Suggestions metadata={metadata} type="twitter" />}
    </div>
  )
}
