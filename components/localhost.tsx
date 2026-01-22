"use client"

import { Check, ChevronDown, Copy } from "lucide-react"
import { useRef, useState } from "react"

export default function Localhost() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      <button
        type="button"
        onMouseDown={() => setIsExpanded(!isExpanded)}
        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] transition-colors"
      >
        localhost
        <ChevronDown
          size={12}
          aria-hidden="true"
          className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div ref={contentRef} className="pt-6 space-y-4">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Test your local server using Cloudflare Tunnel:
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-[0.15em] mb-2">
                  1. Install
                </p>
                <CodeBlock
                  code="bun add -g cloudflared"
                  copied={copied === "install"}
                  onCopy={() => handleCopy("bun add -g cloudflared", "install")}
                />
              </div>

              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-[0.15em] mb-2">
                  2. Start your local server on port 3000
                </p>
              </div>

              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-[0.15em] mb-2">
                  3. Run tunnel
                </p>
                <CodeBlock
                  code="cloudflared tunnel --url http://localhost:3000"
                  copied={copied === "tunnel"}
                  onCopy={() =>
                    handleCopy(
                      "cloudflared tunnel --url http://localhost:3000",
                      "tunnel",
                    )
                  }
                />
              </div>

              <p className="text-[10px] text-neutral-400 uppercase tracking-[0.15em]">
                4. Copy the https URL from the output
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CodeBlock({
  code,
  copied,
  onCopy,
}: {
  code: string
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="relative group">
      <code className="block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-sm pr-10">
        {code}
      </code>
      <button
        type="button"
        onMouseDown={onCopy}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        {copied ? (
          <Check size={12} aria-hidden="true" />
        ) : (
          <Copy size={12} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
