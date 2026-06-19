import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function parseImageUrls(raw: string): string[] {
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    const parsed = JSON.parse(text) as { imageUrls?: string[] }
    return (parsed.imageUrls ?? []).filter((url) => typeof url === 'string' && url.startsWith('http'))
  } catch {
    const matches = text.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"'<>]*)?/gi)
    return matches ?? []
  }
}

export async function searchProductImagesWithAi(
  productName: string,
  limit = 2
): Promise<string[]> {
  if (!process.env.ANTHROPIC_API_KEY) return []

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Find up to ${limit} direct HTTPS image URLs for this product: "${productName}"

Use real product photos from manufacturer sites (samsung.com, lg.com, hisense.com, etc.) or major retailers when possible.

Return ONLY valid JSON (no markdown):
{
  "imageUrls": ["https://...", "https://..."]
}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  return parseImageUrls(raw).slice(0, limit)
}
