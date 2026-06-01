import { auth } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export const POST = auth(async (req: any) => {
  if (!req.auth?.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { productName, categories } = await req.json()

  if (!productName?.trim()) {
    return Response.json({ message: 'Product name is required' }, { status: 400 })
  }

  const categoryList = categories?.map((c: any) => c.name).join(', ') || 'Televisions, Refrigerators, Gas Cookers, Generators, Freezers, Washing Machines'

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a product listing expert for a Nigerian electronics store called "Agu Brothers Electronics".

Generate product details for: "${productName}"

Available categories: ${categoryList}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "description": "3-4 sentence product description highlighting key features, benefits, and why a Nigerian customer should buy it. Be specific about specs if you know them.",
  "brand": "brand name extracted from product name, or best guess",
  "cat": "single best matching category from the list provided",
  "weight": estimated weight in kg as a number (e.g. 15),
  "suggestedPrice": estimated selling price in Nigerian Naira as a number (e.g. 450000),
  "keyFeatures": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"]
}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  // Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    const generated = JSON.parse(text)
    return Response.json(generated)
  } catch {
    return Response.json({ message: 'AI returned invalid JSON', raw }, { status: 500 })
  }
}) as any
