"use client"

import { useCallback, useState } from "react"

export interface MetaData {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  ogUrl?: string
  ogSiteName?: string
  ogLocale?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterSite?: string
  twitterCreator?: string
  canonical?: string
  favicon?: string
  language?: string
  charset?: string
  viewport?: string
  robots?: string
  generator?: string
  themeColor?: string
  alternate?: string
  author?: string
  prev?: string
  next?: string
  search?: string
  icon?: string
  mobileApp?: string
  mobileAppUrl?: string
  appleItunesApp?: string
  appleMobileWebAppCapable?: string
  appleMobileWebAppTitle?: string
  formatDetection?: string
  robotsFile?: string
  sitemap?: string
  [key: string]: string | undefined
}

export function usemetadata() {
  const [url, setUrl] = useState("")
  const [metadata, setMetadata] = useState<MetaData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchMetadata = useCallback(async (urlToFetch: string) => {
    if (!urlToFetch) {
      setError("Please enter a URL")
      return
    }

    let formattedUrl = urlToFetch
    if (
      !urlToFetch.startsWith("http://") &&
      !urlToFetch.startsWith("https://")
    ) {
      formattedUrl = `https://${urlToFetch}`
    }

    try {
      setLoading(true)
      setError("")
      setMetadata(null)

      const response = await fetch(
        `/api/metadata?url=${encodeURIComponent(formattedUrl)}&full=true`,
      ).catch(() => null)

      if (!response || !response.ok) {
        setError("Error fetching metadata. Please check the URL and try again.")
        return
      }

      const data = await response.json().catch(() => null)
      if (!data) {
        setError("Error fetching metadata. Please check the URL and try again.")
        return
      }

      setMetadata(data)
    } catch {
      setError("Error fetching metadata. Please check the URL and try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setUrl("")
    setMetadata(null)
    setError("")
  }, [])

  const refresh = useCallback(() => {
    if (url) fetchMetadata(url)
  }, [url, fetchMetadata])

  return {
    url,
    setUrl,
    metadata,
    loading,
    error,
    fetchMetadata,
    clear,
    refresh,
  }
}
