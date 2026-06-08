type SerperImageResult = {
  imageUrl?: string
  thumbnailUrl?: string
  title?: string
  source?: string
}

type SerperImagesResponse = {
  images?: SerperImageResult[]
}

function isHttpImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

async function fetchSerperImages(query: string, num: number): Promise<string[]> {
  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) return []

  const res = await fetch('https://google.serper.dev/images', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: query,
      gl: 'ng',
      hl: 'en',
      num: Math.min(Math.max(num, 1), 100),
    }),
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('Serper images API error:', res.status, body)
    return []
  }

  const data = (await res.json()) as SerperImagesResponse
  const urls: string[] = []

  for (const image of data.images ?? []) {
    if (image.imageUrl && isHttpImageUrl(image.imageUrl)) urls.push(image.imageUrl)
    if (image.thumbnailUrl && isHttpImageUrl(image.thumbnailUrl)) urls.push(image.thumbnailUrl)
  }

  return urls
}

export async function searchProductImagesWithSerper(
  productName: string,
  limit: number
): Promise<string[]> {
  if (!process.env.SERPER_API_KEY) return []

  const queries = [
    `${productName} product image`,
    `${productName} product photo`,
    productName,
  ]

  const seen = new Set<string>()
  const urls: string[] = []

  for (const query of queries) {
    if (urls.length >= limit) break

    try {
      const results = await fetchSerperImages(query, limit * 2)
      for (const url of results) {
        if (seen.has(url) || urls.length >= limit) continue
        seen.add(url)
        urls.push(url)
      }
    } catch (err) {
      console.error('Serper image search failed for query:', query, err)
    }
  }

  return urls
}
