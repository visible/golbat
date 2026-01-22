"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface HistoryProps {
  onSelect: (url: string) => void
}

const KEY = "golbat_history"
const MAX = 5

export function addHistory(url: string) {
  if (typeof window === "undefined") return
  const history = getHistory()
  const filtered = history.filter((u) => u !== url)
  const updated = [url, ...filtered].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function getHistory(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function clearHistory() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEY)
}

export default function History({ onSelect }: HistoryProps) {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  if (history.length === 0) return null

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] text-neutral-400 uppercase tracking-[0.2em]">
          Recent
        </div>
        <button
          type="button"
          onMouseDown={handleClear}
          className="text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 uppercase tracking-[0.1em] transition-colors flex items-center gap-1"
        >
          <X size={10} aria-hidden="true" />
          Clear
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {history.map((url) => (
          <button
            type="button"
            key={url}
            onMouseDown={() => onSelect(url)}
            className="text-sm text-neutral-900 dark:text-white hover:opacity-60 transition-opacity flex items-center gap-1.5"
          >
            <span className="text-neutral-400">↘</span>
            {url}
          </button>
        ))}
      </div>
    </div>
  )
}
