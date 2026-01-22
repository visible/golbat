import { createGateway, generateText } from "ai"

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { metadata, url } = await request.json()

    if (!metadata) {
      return Response.json({ error: "No metadata provided" }, { status: 400 })
    }

    const prompt = `Analyze this website's metadata for SEO and social media sharing optimization. Be concise and actionable.

URL: ${url}

Metadata:
${JSON.stringify(metadata, null, 2)}

Provide analysis in this exact JSON format:
{
  "score": <number 0-100>,
  "summary": "<one sentence overall assessment>",
  "issues": [
    {"severity": "critical|warning|info", "title": "<short title>", "fix": "<specific actionable fix>"}
  ],
  "strengths": ["<strength 1>", "<strength 2>"]
}

Focus on:
- Title and description presence and length
- Open Graph tags completeness
- Twitter card setup
- Image availability and dimensions
- Canonical URL
- Mobile optimization tags

Return ONLY valid JSON, no markdown or explanation.`

    const { text } = await generateText({
      model: gateway("xai/grok-3-mini"),
      prompt,
      maxTokens: 1000,
    })

    let jsonText = text.trim()
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1].trim()
    }
    const analysis = JSON.parse(jsonText)
    return Response.json(analysis)
  } catch (error) {
    console.error("Analysis error:", error)
    return Response.json(
      { error: "Failed to analyze metadata" },
      { status: 500 },
    )
  }
}
