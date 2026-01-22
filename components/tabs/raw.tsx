"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import type { MetaData } from "@/hooks/metadata"

interface RawTabProps {
  metadata: MetaData
}

function generateHtml(metadata: MetaData): string {
  const tags: string[] = []

  if (metadata.title) {
    tags.push(`<title>${metadata.title}</title>`)
  }
  if (metadata.description) {
    tags.push(`<meta name="description" content="${metadata.description}" />`)
  }
  if (metadata.canonical) {
    tags.push(`<link rel="canonical" href="${metadata.canonical}" />`)
  }
  if (metadata.ogTitle) {
    tags.push(`<meta property="og:title" content="${metadata.ogTitle}" />`)
  }
  if (metadata.ogDescription) {
    tags.push(`<meta property="og:description" content="${metadata.ogDescription}" />`)
  }
  if (metadata.ogImage) {
    tags.push(`<meta property="og:image" content="${metadata.ogImage}" />`)
  }
  if (metadata.ogType) {
    tags.push(`<meta property="og:type" content="${metadata.ogType}" />`)
  }
  if (metadata.ogUrl) {
    tags.push(`<meta property="og:url" content="${metadata.ogUrl}" />`)
  }
  if (metadata.ogSiteName) {
    tags.push(`<meta property="og:site_name" content="${metadata.ogSiteName}" />`)
  }
  if (metadata.twitterCard) {
    tags.push(`<meta name="twitter:card" content="${metadata.twitterCard}" />`)
  }
  if (metadata.twitterTitle) {
    tags.push(`<meta name="twitter:title" content="${metadata.twitterTitle}" />`)
  }
  if (metadata.twitterDescription) {
    tags.push(`<meta name="twitter:description" content="${metadata.twitterDescription}" />`)
  }
  if (metadata.twitterImage) {
    tags.push(`<meta name="twitter:image" content="${metadata.twitterImage}" />`)
  }
  if (metadata.twitterSite) {
    tags.push(`<meta name="twitter:site" content="${metadata.twitterSite}" />`)
  }

  return tags.join("\n")
}

export default function RawTab({ metadata }: RawTabProps) {
  const [format, setFormat] = useState<"json" | "html">("json")
  const [copied, setCopied] = useState(false)

  const json = JSON.stringify(metadata, null, 2)
  const html = generateHtml(metadata)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(format === "json" ? json : html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-3">
          <button
            type="button"
            onMouseDown={() => setFormat("json")}
            className={`text-xs uppercase tracking-[0.1em] transition-colors ${
              format === "json"
                ? "text-neutral-900 dark:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            JSON
          </button>
          <button
            type="button"
            onMouseDown={() => setFormat("html")}
            className={`text-xs uppercase tracking-[0.1em] transition-colors ${
              format === "html"
                ? "text-neutral-900 dark:text-white"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            }`}
          >
            HTML
          </button>
        </div>
        <button
          type="button"
          onMouseDown={copyToClipboard}
          className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <Check size={12} aria-hidden="true" />
          ) : (
            <Copy size={12} aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 overflow-auto max-h-96">
        <pre className="text-xs text-neutral-600 dark:text-neutral-400">
          {format === "json" ? json : html}
        </pre>
      </div>
    </div>
  )
}
