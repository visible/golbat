"use client"

import { ArrowRight, RefreshCw, X } from "lucide-react"

interface UrlInputProps {
  url: string
  setUrl: (url: string) => void
  loading: boolean
  error: string
  hasMetadata: boolean
  onSubmit: () => void
  onClear: () => void
  onRefresh: () => void
}

export default function UrlInput({
  url,
  setUrl,
  loading,
  error,
  hasMetadata,
  onSubmit,
  onClear,
  onRefresh,
}: UrlInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-11 px-0 pr-20 bg-transparent border-b border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
            autoComplete="off"
            spellCheck="false"
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
            {loading ? (
              <div className="h-3.5 w-3.5 border border-neutral-400 border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {url && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      onClear()
                    }}
                    className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
                {hasMetadata && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      onRefresh()
                    }}
                    className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <RefreshCw size={14} aria-hidden="true" />
                  </button>
                )}
                {url && !hasMetadata && (
                  <button
                    type="submit"
                    className="p-2 text-neutral-900 dark:text-white hover:opacity-60 transition-opacity"
                  >
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-3 text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}
    </div>
  )
}
