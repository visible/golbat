import * as cheerio from "cheerio"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const full = request.nextUrl.searchParams.get("full") === "true"

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Golbat/1.0; +https://golb.at)",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch the URL: ${response.statusText}` },
        { status: response.status },
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Clean text content by removing extra whitespace and duplicates
    const cleanText = (text: string) => {
      const words = text.split(/\s+/).filter(Boolean)
      return [...new Set(words)].join(" ").trim()
    }

    const metadata: Record<string, string | undefined> = {
      // Get title with priority and cleaning
      title:
        cleanText($("head title").first().text()) ||
        cleanText($("meta[property='og:title']").attr("content") || "") ||
        cleanText($("meta[name='twitter:title']").attr("content") || "") ||
        undefined,
      description: $('meta[name="description"]').attr("content") || undefined,

      ogTitle: $('meta[property="og:title"]').attr("content") || undefined,
      ogDescription:
        $('meta[property="og:description"]').attr("content") || undefined,
      ogImage: $('meta[property="og:image"]').attr("content") || undefined,
      ogType: $('meta[property="og:type"]').attr("content") || undefined,
      ogUrl: $('meta[property="og:url"]').attr("content") || undefined,
      ogSiteName:
        $('meta[property="og:site_name"]').attr("content") || undefined,
      ogLocale: $('meta[property="og:locale"]').attr("content") || undefined,

      twitterCard: $('meta[name="twitter:card"]').attr("content") || undefined,
      twitterTitle:
        $('meta[name="twitter:title"]').attr("content") || undefined,
      twitterDescription:
        $('meta[name="twitter:description"]').attr("content") || undefined,
      twitterImage:
        $('meta[name="twitter:image"]').attr("content") || undefined,
      twitterSite: $('meta[name="twitter:site"]').attr("content") || undefined,
      twitterCreator:
        $('meta[name="twitter:creator"]').attr("content") || undefined,

      charset:
        $("meta[charset]").attr("charset") ||
        $('meta[http-equiv="Content-Type"]').attr("content") ||
        undefined,
      viewport: $('meta[name="viewport"]').attr("content") || undefined,
      robots: $('meta[name="robots"]').attr("content") || undefined,
      generator: $('meta[name="generator"]').attr("content") || undefined,
      themeColor: $('meta[name="theme-color"]').attr("content") || undefined,
      language: $("html").attr("lang") || undefined,

      canonical: $('link[rel="canonical"]').attr("href") || undefined,
      alternate: $('link[rel="alternate"]').attr("href") || undefined,
      author: $('link[rel="author"]').attr("href") || undefined,
      prev: $('link[rel="prev"]').attr("href") || undefined,
      next: $('link[rel="next"]').attr("href") || undefined,
      search: $('link[rel="search"]').attr("href") || undefined,
      icon: $('link[rel="icon"]').attr("href") || undefined,

      mobileApp:
        $('meta[name="apple-itunes-app"]').attr("content") || undefined,
      mobileAppUrl: $('meta[name="al:ios:url"]').attr("content") || undefined,
      appleItunesApp:
        $('meta[name="apple-itunes-app"]').attr("content") || undefined,
      appleMobileWebAppCapable:
        $('meta[name="apple-mobile-web-app-capable"]').attr("content") ||
        undefined,
      appleMobileWebAppTitle:
        $('meta[name="apple-mobile-web-app-title"]').attr("content") ||
        undefined,
      formatDetection:
        $('meta[name="format-detection"]').attr("content") || undefined,

      favicon:
        $(
          'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"], link[rel="mask-icon"], link[rel="fluid-icon"]',
        ).attr("href") || undefined,
    }

    if (full) {
      $("meta").each((_i, elem) => {
        const name =
          $(elem).attr("name") ||
          $(elem).attr("property") ||
          $(elem).attr("http-equiv")
        const content = $(elem).attr("content")

        if (name && content) {
          const key = name.replace(/[:.]/g, "_")
          metadata[`meta_${key}`] = content
        }
      })

      $("link").each((_i, elem) => {
        const rel = $(elem).attr("rel")
        const href = $(elem).attr("href")

        if (rel && href) {
          const key = rel.replace(/[:.]/g, "_")
          metadata[`link_${key}`] = href
        }
      })
    }

    const urlObj = new URL(url)
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`

    const makeAbsoluteUrl = (
      relativeUrl: string | undefined,
    ): string | undefined => {
      if (!relativeUrl) return undefined
      if (relativeUrl.startsWith("http")) return relativeUrl
      return relativeUrl.startsWith("/")
        ? `${baseUrl}${relativeUrl}`
        : `${baseUrl}/${relativeUrl}`
    }

    Object.keys(metadata).forEach((key) => {
      if (
        key.includes("image") ||
        key.includes("icon") ||
        key.includes("url") ||
        key.includes("href") ||
        key.includes("link")
      ) {
        metadata[key] = makeAbsoluteUrl(metadata[key])
      }
    })

    if (!metadata.favicon) {
      const rootFaviconUrl = `${urlObj.protocol}//${urlObj.host}/favicon.ico`

      try {
        const faviconResponse = await fetch(rootFaviconUrl, { method: "HEAD" })
        if (faviconResponse.ok) {
          metadata.favicon = rootFaviconUrl
        }
      } catch (_error) {}
    }

    const robotsUrl = `${baseUrl}/robots.txt`
    try {
      const robotsResponse = await fetch(robotsUrl, { method: "HEAD" })
      if (robotsResponse.ok) {
        metadata.robotsFile = robotsUrl
      }
    } catch (_error) {}

    const sitemapUrl = `${baseUrl}/sitemap.xml`
    try {
      const sitemapResponse = await fetch(sitemapUrl, { method: "HEAD" })
      if (sitemapResponse.ok) {
        metadata.sitemap = sitemapUrl
      }
    } catch (_error) {}

    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    })
  } catch (error) {
    console.error("Error fetching metadata:", error)
    return NextResponse.json(
      { error: "Failed to fetch or parse the website" },
      { status: 500 },
    )
  }
}
