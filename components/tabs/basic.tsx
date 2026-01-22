"use client"

import { ExternalLink } from "lucide-react"
import Card from "@/components/card"
import Field from "@/components/field"
import Suggestions from "@/components/suggestions"
import type { MetaData } from "@/hooks/metadata"

interface BasicTabProps {
  metadata: MetaData
  url: string
  showSuggestions: boolean
}

export default function BasicTab({
  metadata,
  url,
  showSuggestions,
}: BasicTabProps) {
  return (
    <div className="space-y-6">
      <Card title="Essential">
        {(metadata.favicon || url) && (
          <div className="py-2 -mx-2 px-2 rounded hover:bg-[#111] transition-colors">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
              <div className="text-xs text-[#666] w-full sm:w-32 sm:pt-0.5">
                Favicon
              </div>
              <a
                href={
                  metadata.favicon ||
                  `https://${url.replace(/^https?:\/\//, "")}/favicon.ico`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src={
                    metadata.favicon ||
                    `https://${url.replace(/^https?:\/\//, "")}/favicon.ico`
                  }
                  alt="Favicon"
                  className="h-5 w-5 border border-[#333] rounded"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const img = e.target as HTMLImageElement
                    const domain = url.replace(/^https?:\/\//, "").split("/")[0]
                    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
                    img.onerror = () => {
                      img.style.display = "none"
                    }
                  }}
                />
              </a>
            </div>
          </div>
        )}

        <RequiredField label="Title" value={metadata.title} limit={60} />
        <RequiredField label="Description" value={metadata.description} limit={160} />

        <div className="py-2 -mx-2 px-2 rounded hover:bg-[#111] transition-colors">
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
            <div className="text-xs text-[#666] w-full sm:w-32 sm:pt-0.5">
              Canonical
            </div>
            <div className="flex-1 break-words">
              {metadata.canonical ? (
                <a
                  href={metadata.canonical}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline inline-flex items-center gap-1"
                >
                  {metadata.canonical}
                  <ExternalLink size={10} className="text-[#666]" />
                </a>
              ) : (
                <span className="text-[#666] text-sm">—</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Technical">
        <Field label="Language" value={metadata.language} />
        <Field label="Charset" value={metadata.charset} />
        <Field label="Viewport" value={metadata.viewport} />
        <Field label="Robots" value={metadata.robots} />
        <Field label="Generator" value={metadata.generator} />
        <Field label="Theme Color" value={metadata.themeColor}>
          {metadata.themeColor && (
            <span
              className="inline-block w-3 h-3 ml-2 rounded border border-[#333]"
              style={{ backgroundColor: metadata.themeColor }}
            />
          )}
        </Field>
      </Card>

      <Card title="SEO Files">
        <LinkField label="robots.txt" value={metadata.robotsFile} />
        <LinkField label="sitemap.xml" value={metadata.sitemap} />
      </Card>

      {showSuggestions && <Suggestions metadata={metadata} type="basic" />}
    </div>
  )
}

function LinkField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="py-2 -mx-2 px-2 rounded hover:bg-[#111] transition-colors">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
        <div className="text-xs text-[#666] w-full sm:w-32 sm:pt-0.5">
          {label}
        </div>
        <div className="flex-1 break-words">
          {value ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-500 hover:underline inline-flex items-center gap-1"
            >
              Found
              <ExternalLink size={10} />
            </a>
          ) : (
            <span className="text-red-400 text-sm">Not found</span>
          )}
        </div>
      </div>
    </div>
  )
}

function getStatus(length: number, limit: number): "ok" | "warn" | "error" {
  if (length <= limit) return "ok"
  if (length <= limit * 1.2) return "warn"
  return "error"
}

function RequiredField({
  label,
  value,
  limit,
}: {
  label: string
  value?: string
  limit: number
}) {
  const status = value ? getStatus(value.length, limit) : "ok"
  const statusColor =
    status === "ok"
      ? "text-[#666]"
      : status === "warn"
        ? "text-yellow-500"
        : "text-red-500"

  return (
    <div className="py-2 -mx-2 px-2 rounded hover:bg-[#111] transition-colors">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
        <div className="text-xs text-[#666] w-full sm:w-32 sm:pt-0.5">
          {label}
        </div>
        <div className="flex-1">
          {value ? (
            <>
              <div className="text-sm break-words">{value}</div>
              <div className={`text-xs mt-1 ${statusColor}`}>
                {value.length} / {limit} chars
              </div>
            </>
          ) : (
            <span className="text-red-400 text-sm">Missing</span>
          )}
        </div>
      </div>
    </div>
  )
}
