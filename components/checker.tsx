"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { usemetadata } from "@/hooks/metadata"
import Chat from "./chat"
import History, { addHistory } from "./history"
import Input from "./input"
import Localhost from "./localhost"
import Tabs from "./tabs"
import Score from "./score"
import BasicTab from "./tabs/basic"
import ImagesTab from "./tabs/images"
import OpenGraphTab from "./tabs/opengraph"
import PreviewsTab from "./tabs/previews"
import RawTab from "./tabs/raw"
import TwitterTab from "./tabs/twitter"

const mainTabs = [
  { id: "score", label: "Score" },
  { id: "previews", label: "Previews" },
  { id: "basic", label: "Basic" },
  { id: "opengraph", label: "Open Graph" },
  { id: "twitter", label: "X" },
  { id: "images", label: "Images" },
  { id: "raw", label: "Raw" },
]

const suggestedUrls = ["vercel.com", "poke.com", "opencode.ai"]

export default function Checker() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {
    url,
    setUrl,
    metadata,
    loading,
    error,
    fetchMetadata,
    clear,
    refresh,
  } = usemetadata()
  const [activeTab, setActiveTab] = useState("score")
  const prevUrlParam = useRef<string | null>(null)

  useEffect(() => {
    const urlParam = searchParams.get("url")

    if (urlParam !== prevUrlParam.current) {
      prevUrlParam.current = urlParam

      if (urlParam) {
        setUrl(urlParam)
        fetchMetadata(urlParam)
      } else {
        clear()
      }
    }
  }, [searchParams, setUrl, fetchMetadata, clear])

  const handleSubmit = () => {
    if (url) {
      router.push(`?url=${encodeURIComponent(url)}`, { scroll: false })
      fetchMetadata(url)
      addHistory(url)
    }
  }

  const handleClear = () => {
    router.push("/", { scroll: false })
    clear()
  }

  const handleSuggestion = (suggestedUrl: string) => {
    setUrl(suggestedUrl)
    router.push(`?url=${encodeURIComponent(suggestedUrl)}`, { scroll: false })
    fetchMetadata(suggestedUrl)
  }

  const handleKeyboard = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      const tabKeys: Record<string, string> = {
        "1": "score",
        "2": "previews",
        "3": "basic",
        "4": "opengraph",
        "5": "twitter",
        "6": "images",
        "7": "raw",
      }

      if (tabKeys[e.key] && metadata) {
        e.preventDefault()
        setActiveTab(tabKeys[e.key])
      }
    },
    [metadata],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard)
    return () => window.removeEventListener("keydown", handleKeyboard)
  }, [handleKeyboard])

  const showLanding = !metadata && !loading

  return (
    <div className="w-full">
      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: showLanding ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="mb-8">
            <h1 className="font-serif italic text-4xl md:text-5xl tracking-tight mb-3">
              metadata
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm leading-relaxed">
              Inspect how your links appear on social platforms.
            </p>
          </div>
        </div>
      </div>

      <Input
        url={url}
        setUrl={setUrl}
        loading={loading}
        error={error}
        hasMetadata={!!metadata}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onRefresh={refresh}
      />

      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: showLanding ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-8">
            <div className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] mb-3">
              Try these
            </div>
            <div className="flex flex-wrap gap-3">
              {suggestedUrls.map((suggestedUrl) => (
                <button
                  type="button"
                  key={suggestedUrl}
                  onMouseDown={() => handleSuggestion(suggestedUrl)}
                  className="text-sm text-neutral-900 dark:text-white hover:opacity-60 transition-opacity flex items-center gap-1.5"
                >
                  <span className="text-neutral-400">↘</span>
                  {suggestedUrl}
                </button>
              ))}
            </div>
            <div className="mt-8">
              <Localhost />
            </div>
            <History onSelect={handleSuggestion} />
          </div>
        </div>
      </div>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: metadata ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="mt-10">
            <Tabs tabs={mainTabs} active={activeTab} onChange={setActiveTab} />

            <div className="mt-6 min-h-[600px]">
              {metadata && (
                <>
                  <div className={activeTab === "score" ? "" : "hidden"}>
                    <Score metadata={metadata} />
                  </div>
                  <div className={activeTab === "previews" ? "" : "hidden"}>
                    <PreviewsTab
                      metadata={metadata}
                      url={url}
                      showSuggestions={false}
                    />
                  </div>
                  <div className={activeTab === "basic" ? "" : "hidden"}>
                    <BasicTab
                      metadata={metadata}
                      url={url}
                      showSuggestions={false}
                    />
                  </div>
                  <div className={activeTab === "opengraph" ? "" : "hidden"}>
                    <OpenGraphTab metadata={metadata} showSuggestions={false} />
                  </div>
                  <div className={activeTab === "twitter" ? "" : "hidden"}>
                    <TwitterTab metadata={metadata} showSuggestions={false} />
                  </div>
                  <div className={activeTab === "images" ? "" : "hidden"}>
                    <ImagesTab metadata={metadata} showSuggestions={false} />
                  </div>
                  <div className={activeTab === "raw" ? "" : "hidden"}>
                    <RawTab metadata={metadata} />
                  </div>
                </>
              )}
            </div>

            {metadata && <Chat metadata={metadata} url={url} />}
          </div>
        </div>
      </div>

      {loading && (
        <div className="mt-10 flex items-center gap-3">
          <div className="h-4 w-4 border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white rounded-full animate-spin" />
          <span className="text-sm text-neutral-500">Loading metadata...</span>
        </div>
      )}
    </div>
  )
}
