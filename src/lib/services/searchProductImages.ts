const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

export const MIN_PRODUCT_IMAGES = 2

const MIN_IMAGE_BYTES = 20_000
const MAX_IMAGE_BYTES = 8_000_000
const MIN_IMAGE_DIMENSION = 400

function extractVqdToken(html: string): string | null {
  const patterns = [
    /vqd=['"]([^'"]+)['"]/,
    /vqd=([\d-]+)/,
    /"vqd":"([^"]+)"/,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

async function fetchDuckDuckGoImageUrls(query: string, limit: number): Promise<string[]> {
  const searchRes = await fetch(
    `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
    { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(12_000) }
  )
  if (!searchRes.ok) return []

  const html = await searchRes.text()
  const vqd = extractVqdToken(html)
  if (!vqd) return []

  const imageRes = await fetch(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqd)}&f=,,,,,&p=1`,
    {
      headers: {
        'User-Agent': USER_AGENT,
        Referer: 'https://duckduckgo.com/',
      },
      signal: AbortSignal.timeout(12_000),
    }
  )
  if (!imageRes.ok) return []

  const data = (await imageRes.json()) as {
    results?: Array<{ image?: string; width?: number; height?: number }>
  }

  return (data.results ?? [])
    .filter(
      (r) =>
        r.image &&
        (r.width ?? 0) >= MIN_IMAGE_DIMENSION &&
        (r.height ?? 0) >= MIN_IMAGE_DIMENSION
    )
    .map((r) => r.image!)
    .slice(0, limit * 4)
}

async function isValidProductImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(10_000),
      redirect: 'follow',
    })
    if (!res.ok) return false

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.startsWith('image/')) return false

    const length = Number(res.headers.get('content-length') ?? 0)
    if (length > 0 && (length < MIN_IMAGE_BYTES || length > MAX_IMAGE_BYTES)) {
      return false
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.byteLength < MIN_IMAGE_BYTES || buffer.byteLength > MAX_IMAGE_BYTES) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function searchProductImages(
  productName: string,
  limit = 4
): Promise<string[]> {
  const queries = [
    `${productName} product image white background`,
    `${productName} official product photo`,
    `${productName} product photo high resolution`,
    productName,
  ]

  const seen = new Set<string>()
  const valid: string[] = []
  const target = Math.max(limit, MIN_PRODUCT_IMAGES)

  for (const query of queries) {
    if (valid.length >= target) break

    const candidates = await fetchDuckDuckGoImageUrls(query, target)
    for (const url of candidates) {
      if (seen.has(url) || valid.length >= target) continue
      seen.add(url)

      if (await isValidProductImage(url)) {
        valid.push(url)
      }
    }
  }

  return valid
}
