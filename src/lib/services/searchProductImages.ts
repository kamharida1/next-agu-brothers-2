const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

export const MIN_PRODUCT_IMAGES = 1
export const PREFERRED_PRODUCT_IMAGES = 2

const MAX_IMAGE_BYTES = 10_000_000

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

function isHttpImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

async function fetchDuckDuckGoImageUrls(
  query: string,
  limit: number,
  page = 1
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
    results?: Array<{ image?: string; thumbnail?: string }>
  }

  const urls: string[] = []
  for (const result of data.results ?? []) {
    if (result.image && isHttpImageUrl(result.image)) urls.push(result.image)
    if (result.thumbnail && isHttpImageUrl(result.thumbnail)) urls.push(result.thumbnail)
  }

  return urls.slice(0, limit * 6)
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
          { imageinfo?: Array<{ url?: string; thumburl?: string }> }
        >
      }
    }

    return Object.values(data.query?.pages ?? {})
      .flatMap((page) => page.imageinfo ?? [])
      .flatMap((info) => [info.thumburl, info.url].filter(Boolean) as string[])
      .filter(isHttpImageUrl)
      .slice(0, limit)
  } catch {
    return []
  }
}

async function isReachableImage(url: string): Promise<boolean> {
  try {
    const headRes = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(10_000),
      redirect: 'follow',
    })

    if (headRes.ok) {
      const contentType = headRes.headers.get('content-type') ?? ''
      if (contentType.startsWith('image/')) return true
    }
  } catch {
    // fall through to GET
  }

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
    if (length > MAX_IMAGE_BYTES) return false

    return true
  } catch {
    return false
  }
}

async function collectCandidateUrls(productName: string, target: number): Promise<string[]> {
  const queries = [
    `${productName} product image`,
    `${productName} product photo`,
    `${productName}`,
    productName,
  ]

  const seen = new Set<string>()
  const candidates: string[] = []

  const addUrls = (urls: string[]) => {
    for (const url of urls) {
      if (seen.has(url)) continue
      seen.add(url)
      candidates.push(url)
    }
  }

  for (const query of queries) {
    if (candidates.length >= target * 8) break
    for (const page of [1, 2, 3]) {
      addUrls(await fetchDuckDuckGoImageUrls(query, target, page))
    }
  }

  if (candidates.length < target) {
    addUrls(await searchWikimediaImages(productName, target * 4))
  }

  return candidates
}

export async function searchProductImages(
  productName: string,
  limit = PREFERRED_PRODUCT_IMAGES
): Promise<string[]> {
  const target = Math.max(limit, PREFERRED_PRODUCT_IMAGES, MIN_PRODUCT_IMAGES)
  const candidates = await collectCandidateUrls(productName, target)
  const found: string[] = []

  for (const url of candidates) {
    if (found.length >= target) break
    if (await isReachableImage(url)) found.push(url)
  }

  if (found.length >= MIN_PRODUCT_IMAGES) return found

  // Accept any discovered image URL — clear or not — and let Cloudinary try uploading it.
  for (const url of candidates) {
    if (found.length >= target) break
    if (!found.includes(url)) found.push(url)
  }

  return found.slice(0, target)
}
