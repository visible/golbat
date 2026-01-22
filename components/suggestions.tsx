"use client"

import type { MetaData } from "@/hooks/metadata"

interface SuggestionsProps {
  metadata: MetaData
  type: "basic" | "opengraph" | "twitter" | "images" | "previews"
  platform?: string
}

export default function Suggestions({
  metadata,
  type,
  platform,
}: SuggestionsProps) {
  return (
    <div className="mt-6 p-4 bg-[#111] border border-[#222] rounded-lg">
      <h3 className="text-sm font-medium mb-3">Suggestions</h3>
      <div className="space-y-2 text-sm">
        {type === "basic" && <BasicSuggestions metadata={metadata} />}
        {type === "opengraph" && <OpenGraphSuggestions metadata={metadata} />}
        {type === "twitter" && <TwitterSuggestions metadata={metadata} />}
        {type === "images" && <ImagesSuggestions metadata={metadata} />}
        {type === "previews" && (
          <PreviewsSuggestions metadata={metadata} platform={platform} />
        )}
      </div>
    </div>
  )
}

function Status({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-500" : "bg-red-500"}`}
      />
      <span className={ok ? "text-[#888]" : "text-[#888]"}>{label}</span>
    </div>
  )
}

function BasicSuggestions({ metadata }: { metadata: MetaData }) {
  const items = []

  if (!metadata.title) {
    items.push(<Status key="title" ok={false} label="Missing title" />)
  } else if (metadata.title.length < 30 || metadata.title.length > 60) {
    items.push(
      <Status
        key="title"
        ok={false}
        label={`Title length: ${metadata.title.length} (aim for 50-60)`}
      />,
    )
  } else {
    items.push(
      <Status
        key="title"
        ok={true}
        label={`Title: ${metadata.title.length} chars`}
      />,
    )
  }

  if (!metadata.description) {
    items.push(<Status key="desc" ok={false} label="Missing description" />)
  } else if (
    metadata.description.length < 120 ||
    metadata.description.length > 160
  ) {
    items.push(
      <Status
        key="desc"
        ok={false}
        label={`Description: ${metadata.description.length} (aim for 150-160)`}
      />,
    )
  } else {
    items.push(
      <Status
        key="desc"
        ok={true}
        label={`Description: ${metadata.description.length} chars`}
      />,
    )
  }

  if (!metadata.canonical) {
    items.push(
      <Status key="canonical" ok={false} label="Missing canonical URL" />,
    )
  }

  return <>{items}</>
}

function OpenGraphSuggestions({ metadata }: { metadata: MetaData }) {
  return (
    <>
      <Status
        ok={!!metadata.ogTitle}
        label={metadata.ogTitle ? "og:title present" : "Missing og:title"}
      />
      <Status
        ok={!!metadata.ogDescription}
        label={
          metadata.ogDescription
            ? "og:description present"
            : "Missing og:description"
        }
      />
      <Status
        ok={!!metadata.ogImage}
        label={metadata.ogImage ? "og:image present" : "Missing og:image"}
      />
    </>
  )
}

function TwitterSuggestions({ metadata }: { metadata: MetaData }) {
  return (
    <>
      <Status
        ok={!!metadata.twitterCard}
        label={
          metadata.twitterCard ? "twitter:card present" : "Missing twitter:card"
        }
      />
      <Status
        ok={!!metadata.twitterTitle || !!metadata.ogTitle}
        label="Title available"
      />
      <Status
        ok={!!metadata.twitterImage || !!metadata.ogImage}
        label="Image available"
      />
    </>
  )
}

function ImagesSuggestions({ metadata }: { metadata: MetaData }) {
  const hasImages = metadata.ogImage || metadata.twitterImage
  return (
    <>
      <Status
        ok={!!hasImages}
        label={hasImages ? "Social images present" : "No social images"}
      />
      <Status
        ok={!!metadata.favicon}
        label={metadata.favicon ? "Favicon present" : "No favicon detected"}
      />
    </>
  )
}

function PreviewsSuggestions({
  metadata,
  platform,
}: {
  metadata: MetaData
  platform?: string
}) {
  const hasTitle = metadata.ogTitle || metadata.title
  const hasImage = metadata.ogImage || metadata.twitterImage
  const hasDesc = metadata.ogDescription || metadata.description

  return (
    <>
      <Status
        ok={!!hasTitle}
        label={hasTitle ? "Title available" : "Missing title"}
      />
      <Status
        ok={!!hasDesc}
        label={hasDesc ? "Description available" : "Missing description"}
      />
      <Status
        ok={!!hasImage}
        label={hasImage ? "Image available" : "Missing image"}
      />
    </>
  )
}
