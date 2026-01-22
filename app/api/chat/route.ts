import * as cheerio from "cheerio"
import { createGateway, streamText } from "ai"

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
})

export const maxDuration = 30

function extractUrl(text: string): string | null {
  const urlMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)/i)
  if (urlMatch) {
    const domain = urlMatch[1]
    return `https://${domain}`
  }
  return null
}

async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Golbat/1.0; +https://golb.at)",
      },
    })

    if (!response.ok) return null

    const html = await response.text()
    const $ = cheerio.load(html)

    return {
      title: $("head title").first().text().trim() || undefined,
      description: $('meta[name="description"]').attr("content") || undefined,
      ogTitle: $('meta[property="og:title"]').attr("content") || undefined,
      ogDescription: $('meta[property="og:description"]').attr("content") || undefined,
      ogImage: $('meta[property="og:image"]').attr("content") || undefined,
      twitterCard: $('meta[name="twitter:card"]').attr("content") || undefined,
      twitterTitle: $('meta[name="twitter:title"]').attr("content") || undefined,
      twitterImage: $('meta[name="twitter:image"]').attr("content") || undefined,
    }
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const { messages, metadata, url } = await request.json()

    const lastMessage = messages[messages.length - 1]?.content || ""
    const requestedUrl = extractUrl(lastMessage)

    let extraContext = ""
    if (requestedUrl && !requestedUrl.includes(url.replace(/^https?:\/\//, ""))) {
      const otherMetadata = await fetchMetadata(requestedUrl)
      if (otherMetadata) {
        extraContext = `\n\nUSER ASKED ABOUT ${requestedUrl}:\n${JSON.stringify(otherMetadata, null, 2)}`
      } else {
        extraContext = `\n\nCould not fetch ${requestedUrl}. It may be unavailable.`
      }
    }

    const systemPrompt = `You are a metadata expert. You have access to metadata for ${url}.${extraContext ? " The user also asked about another site." : ""}

CURRENT SITE (${url}):
${JSON.stringify(metadata, null, 2)}${extraContext}

Analyze the relevant metadata. Be concise. Focus on title, description, Open Graph, Twitter cards, and images.`

    const result = streamText({
      model: gateway("openai/gpt-4.1-nano"),
      system: systemPrompt,
      messages,
      maxTokens: 500,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Chat error:", error)
    return Response.json({ error: "Chat failed" }, { status: 500 })
  }
}
