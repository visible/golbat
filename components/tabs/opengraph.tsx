"use client"

import Card from "@/components/card"
import Field from "@/components/field"
import Suggestions from "@/components/suggestions"
import type { MetaData } from "@/hooks/metadata"

interface OpenGraphTabProps {
  metadata: MetaData
  showSuggestions: boolean
}

export default function OpenGraphTab({
  metadata,
  showSuggestions,
}: OpenGraphTabProps) {
  return (
    <div className="space-y-6">
      <Card title="Open Graph">
        <Field label="Title" value={metadata.ogTitle} characterCount />
        <Field
          label="Description"
          value={metadata.ogDescription}
          characterCount
        />
        <Field label="Image" value={metadata.ogImage} isImage />
        <Field label="Type" value={metadata.ogType} />
        <Field label="URL" value={metadata.ogUrl} />
        <Field label="Site Name" value={metadata.ogSiteName} />
        <Field label="Locale" value={metadata.ogLocale} />
      </Card>

      {showSuggestions && <Suggestions metadata={metadata} type="opengraph" />}
    </div>
  )
}
