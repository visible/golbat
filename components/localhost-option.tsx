"use client";

import { useState } from "react";
import { ArrowRight, Copy, Check, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMetadata } from "@/hooks/use-metadata";

export default function LocalhostOption() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyCommand, setCopyCommand] = useState("");
  const [localhostUrl, setLocalhostUrl] = useState("http://localhost:3000");
  const {
    metadata,
    loading,
    error,
    fetch: fetchMetadata,
  } = useMetadata(undefined, { full: true });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopyCommand(text);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMetadata(localhostUrl);
  };

  return (
    <div>
      <button
        onMouseDown={() => setIsExpanded(!isExpanded)}
        className="text-gray-600 dark:text-[#b0b0b0] hover:text-gray-900 dark:hover:text-[#e0e0e0] flex items-center transition-colors"
      >
        localhost{" "}
        <ArrowRight
          size={14}
          className={`ml-1 transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="mt-3 ml-4 space-y-3">
          <p className="text-xs text-gray-500 dark:text-[#888888]">
            Test your localhost metadata directly from the browser:
          </p>

          <div className="p-3 bg-gray-50 dark:bg-[#1c1c1c] rounded-md border border-gray-200 dark:border-[#444444]">
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 mb-3"
            >
              <Input
                type="url"
                value={localhostUrl}
                onChange={(e) => setLocalhostUrl(e.target.value)}
                placeholder="http://localhost:3000"
                className="text-xs flex-1"
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading}
                className="text-xs"
              >
                {loading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  "Fetch"
                )}
              </Button>
            </form>

            {error && (
              <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-xs mb-3">
                {error}
              </div>
            )}

            {metadata && (
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  {metadata.title && (
                    <div className="text-sm font-medium">{metadata.title}</div>
                  )}
                  {metadata.description && (
                    <div className="text-xs text-gray-700 dark:text-gray-300">
                      {metadata.description}
                    </div>
                  )}
                  {metadata.ogImage && (
                    <img
                      src={metadata.ogImage}
                      alt={metadata.title || "Preview"}
                      className="h-24 object-contain rounded border border-gray-200 dark:border-[#444444]"
                    />
                  )}
                </div>

                <details className="text-xs">
                  <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    View Raw Metadata
                  </summary>
                  <div className="p-2 bg-white dark:bg-[#2a2a2a] rounded-md border border-gray-200 dark:border-[#444444] text-xs max-h-48 overflow-auto mt-2">
                    <pre className="text-gray-800 dark:text-[#e0e0e0]">
                      {JSON.stringify(metadata, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-[#1c1c1c] p-3 rounded-md text-xs font-mono">
            <p className="mb-2 text-gray-900 dark:text-[#e0e0e0]">
              For remote testing, use Cloudflare Tunnel:
            </p>
            <p className="mb-2 text-gray-900 dark:text-[#e0e0e0]">
              1. Install Cloudflare Tunnel:
            </p>
            <div className="relative">
              <code className="block bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-[#e0e0e0] p-2 rounded border border-gray-200 dark:border-[#444444]">
                npm install -g cloudflared
              </code>
              <button
                onMouseDown={() => handleCopy("npm install -g cloudflared")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-[#888888] hover:text-gray-700 dark:hover:text-[#b0b0b0]"
                aria-label="Copy command"
              >
                {copied && copyCommand === "npm install -g cloudflared" ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>

            <p className="mt-3 mb-2 text-gray-900 dark:text-[#e0e0e0]">
              2. Start your local server (e.g., on port 3000)
            </p>

            <p className="mt-3 mb-2 text-gray-900 dark:text-[#e0e0e0]">
              3. Run this command after starting your local server:
            </p>
            <div className="relative">
              <code className="block bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-[#e0e0e0] p-2 rounded border border-gray-200 dark:border-[#444444]">
                cloudflared tunnel --url http://localhost:3000
              </code>
              <button
                onMouseDown={() =>
                  handleCopy("cloudflared tunnel --url http://localhost:3000")
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-[#888888] hover:text-gray-700 dark:hover:text-[#b0b0b0]"
                aria-label="Copy command"
              >
                {copied &&
                copyCommand ===
                  "cloudflared tunnel --url http://localhost:3000" ? (
                  <Check size={14} />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>

            <p className="mt-3 mb-2 text-gray-900 dark:text-[#e0e0e0]">
              4. Copy the https URL from the output and share it with us
            </p>
          </div>

          <div className="text-xs text-gray-500 dark:text-[#888888] mt-2">
            <strong className="text-gray-700 dark:text-[#b0b0b0]">Note:</strong>{" "}
            For localhost URLs, metadata is fetched directly in your browser.
            For remote testing with our team, use the Cloudflare Tunnel
            approach.
          </div>
        </div>
      )}
    </div>
  );
}
