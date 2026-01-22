import type React from "react"

interface FieldProps {
  label: string
  value?: string
  isImage?: boolean
  children?: React.ReactNode
  characterCount?: boolean
  limit?: number
}

function getStatus(length: number, limit?: number): "ok" | "warn" | "error" {
  if (!limit) return "ok"
  if (length <= limit) return "ok"
  if (length <= limit * 1.2) return "warn"
  return "error"
}

export default function Field({
  label,
  value,
  isImage = false,
  children,
  characterCount = false,
  limit,
}: FieldProps) {
  if (!value && !children) return null

  const status = value ? getStatus(value.length, limit) : "ok"
  const statusColor =
    status === "ok"
      ? "text-neutral-500 dark:text-neutral-400"
      : status === "warn"
        ? "text-yellow-500"
        : "text-red-500"

  return (
    <div className="group py-2 -mx-2 px-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-0">
        <div className="text-xs text-neutral-500 dark:text-neutral-400 w-full sm:w-32 sm:pt-0.5">
          {label}
        </div>
        <div className="flex-1 break-words">
          {isImage ? (
            <div>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src={value || "/placeholder.svg"}
                  alt={label}
                  className="max-h-32 max-w-full border border-neutral-200 dark:border-neutral-700 rounded hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement
                    img.style.display = "none"
                    const parent = img.parentElement?.parentElement
                    if (parent) {
                      const errorMsg = document.createElement("span")
                      errorMsg.textContent = "Image unavailable"
                      errorMsg.className =
                        "text-neutral-500 dark:text-neutral-400 text-sm"
                      parent.appendChild(errorMsg)
                    }
                  }}
                />
              </a>
            </div>
          ) : (
            <div>
              {value ? (
                <div className="text-sm">{value}</div>
              ) : (
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                  —
                </span>
              )}
              {characterCount && value && (
                <div className={`text-xs mt-1 ${statusColor}`}>
                  {value.length}
                  {limit && ` / ${limit}`} chars
                </div>
              )}
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
