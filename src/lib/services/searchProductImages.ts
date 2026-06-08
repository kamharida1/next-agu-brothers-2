const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

export const MIN_PRODUCT_IMAGES = 1

const MIN_IMAGE_BYTES = 8_000
const MAX_IMAGE_BYTES = 8_000_000
const PREFERRED_MIN_DIMENSION = 300
const FALLBACK_MIN_DIMENSION = 180

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

async function fetchDuckDuckGoImageUrls(
  query: string,
  limit: number,
  page = 1,
  minDimension = PREFERRED_MIN_DIMENSION
): Promise<string[]> {
  const searchRes = await fetch(
    `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
    { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(15_000) }
  )
  if (!searchRes.ok) return []

  const html = await searchRes.text()
  const vqd = extractVqdToken(html)
  if (!vqd) return []

  const imageRes = await fetch(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${encodeURIComponent(vqd)}&f=,,,,,&p=${page}`,
    {
      headers: {
        'User-Agent': USER_AGENT,
        Referer: 'https://duckduckgo.com/',
      },
      signal: AbortSignal.timeout(15_000),
    }
  )
  if (!imageRes.ok) return []

  const data = (await imageRes.json()) as {
    results?: Array<{ image?: string; width?: number; height?: number }>
  }

  const filtered = (data.results ?? []).filter(
    (r) =>
      r.image &&
      (r.width ?? 0) >= minDimension &&
      (r.height ?? 0) >= minDimension
  )

  const pool = filtered.length > 0 ? filtered : (data.results ?? []).filter((r) => r.image)

  return pool
    .map((r) => r.image!)
    .slice(0, limit * 5)
}

async function searchWikimediaImages(query: string, limit: number): Promise<string[]> {
  const apiUrl =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo` +
    `&iiprop=url|size&iiurlwidth=800&format=json&origin=*`

  try {
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(12_000) })
    if (!res.ok) return []

    const data = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          { imageinfo?: Array<{ url?: string; thumburl?: string; width?: number; height?: number }> }
        >
      }
    }

    return Object.values(data.query?.pages ?? {})
      .flatMap((page) => page.imageinfo ?? [])
      .filter(
        (info) =>
          (info.thumburl || info.url) &&
          (info.width ?? 0) >= FALLBACK_MIN_DIMENSION &&
          (info.height ?? 0) >= FALLBACK_MIN_DIMENSION
      )
      .map((info) => info.thumburl || info.url!)
      .slice(0, limit)
  } catch {
    return []
  }
}

async function isValidProductImage(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(12_000),
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

async function collectFromQueries(
  queries: string[],
  target: number,
  seen: Set<string>,
  valid: string[]
) {
  for (const query of queries) {
    if (valid.length >= target) break

    for (const page of [1, 2]) {
      if (valid.length >= target) break

      for (const minDim of [PREFERRED_MIN_DIMENSION, FALLBACK_MIN_DIMENSION]) {
        const candidates = await fetchDuckDuckGoImageUrls(query, target, page, minDim)
        for (const url of candidates) {
          if (seen.has(url) || valid.length >= target) continue
          seen.add(url)
          if (await isValidProductImage(url)) valid.push(url)
        }
        if (valid.length >= target) break
      }
    }
  }
}

export async function searchProductImages(
  productName: string,
  limit = 4
): Promise<string[]> {
  const seen = new Set<string>()
  const valid: string[] = []
  const target = Math.max(limit, MIN_PRODUCT_IMAGES)

  const queries = [
    `${productName} product image`,
    `${productName} official product photo`,
    `${productName} product photo`,
    productName,
  ]

  await collectFromQueries(queries, target, seen, valid)

  if (valid.length < MIN_PRODUCT_IMAGES) {
    const wikiUrls = await searchWikimediaImages(productName, target * 3)
    for (const url of wikiUrls) {
      if (seen.has(url) || valid.length >= target) continue
      seen.add(url)
      if (await isValidProductImage(url)) valid.push(url)
    }
  }

  return valid
}
