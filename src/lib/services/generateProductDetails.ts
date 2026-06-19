import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export type GeneratedProductDetails = {
  description: string
  brand: string
  cat: string
  weight: number
  keyFeatures: string[]
  suggestedPrice?: number
}

export async function generateProductDetails(
  productName: string,
  categoryNames: string[],
  costPrice: number,
  sellingPrice: number
): Promise<GeneratedProductDetails> {
  const categoryList =
    categoryNames.length > 0
      ? categoryNames.join(', ')
      : 'Televisions, Refrigerators, Gas Cookers, Generators, Freezers, Washing Machines'

  const priceContext =
    sellingPrice > 0
      ? `The seller has set:
- Cost price: ₦${costPrice.toLocaleString()}
- Selling price: ₦${sellingPrice.toLocaleString()}`
      : 'The seller has not set prices yet — include a realistic suggested selling price in Nigerian Naira.'

  const jsonFields =
    sellingPrice > 0
      ? `{
  "description": "3-4 sentence product description highlighting key features, benefits, and why a Nigerian customer should buy it. Be specific about specs if you know them.",
  "brand": "brand name extracted from product name, or best guess",
  "cat": "single best matching category from the list provided",
  "weight": estimated weight in kg as a number (e.g. 15),
  "keyFeatures": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"]
}`
      : `{
  "description": "3-4 sentence product description highlighting key features, benefits, and why a Nigerian customer should buy it. Be specific about specs if you know them.",
  "brand": "brand name extracted from product name, or best guess",
  "cat": "single best matching category from the list provided",
  "weight": estimated weight in kg as a number (e.g. 15),
  "suggestedPrice": estimated selling price in Nigerian Naira as a number (e.g. 450000),
  "keyFeatures": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"]
}`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a product listing expert for a Nigerian electronics store called "Agu Brothers Electronics".

Generate product details for: "${productName}"

${priceContext}

Available categories: ${categoryList}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
${jsonFields}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

  const generated = JSON.parse(text) as GeneratedProductDetails
  return generated
}
