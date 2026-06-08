import { searchProductImagesWithAi } from '@/lib/services/searchProductImagesWithAi'
import { searchProductImagesWithSerper } from '@/lib/services/searchProductImagesWithSerper'

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

export const MIN_PRODUCT_IMAGES = 1
export const PREFERRED_PRODUCT_IMAGES = 2

function isHttpImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function mergeUniqueUrls(target: string[], incoming: string[], seen: Set<string>, max: number) {
  for (const url of incoming) {
    if (seen.has(url) || target.length >= max) continue
    if (!isHttpImageUrl(url)) continue
    seen.add(url)
    target.push(url)
  }
}

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

async function searchBingImages(query: string, limit: number): Promise<string[]> {
  try {
    const res = await fetch(
      `https://www.bing.com/images/async?q=${encodeURIComponent(query)}&first=0&count=35&mmasync=1`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(12_000),
      }
    )
    if (!res.ok) return []

    const html = await res.text()
    const urls: string[] = []

    const encodedPattern = /murl&quot;:&quot;(https?:\\\/\\\/[^&]+?)&quot;/g
    for (const match of html.matchAll(encodedPattern)) {
      urls.push(match[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/'))
    }

    const jsonPattern = /"murl":"(https?:\/\/[^"]+)"/g
    for (const match of html.matchAll(jsonPattern)) {
      urls.push(match[1])
    }

    return urls.filter(isHttpImageUrl).slice(0, limit * 4)
  } catch {
    return []
  }
}

async function searchDuckDuckGoImages(query: string, limit: number): Promise<string[]> {
  try {
    const searchRes = await fetch(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
      { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(10_000) }
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
        signal: AbortSignal.timeout(10_000),
      }
    )
    if (!imageRes.ok) return []

    const data = (await imageRes.json()) as {
      results?: Array<{ image?: string; thumbnail?: string }>
    }

    const urls: string[] = []
    for (const result of data.results ?? []) {
      if (result.image) urls.push(result.image)
      if (result.thumbnail) urls.push(result.thumbnail)
    }

    return urls.filter(isHttpImageUrl).slice(0, limit * 4)
  } catch {
    return []
  }
}

async function searchWikimediaImages(query: string, limit: number): Promise<string[]> {
  const apiUrl =
    `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
    `&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo` +
    `&iiprop=url|size&iiurlwidth=800&format=json&origin=*`

  try {
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(10_000) })
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
      .slice(0, limit * 4)
  } catch {
    return []
  }
}

async function collectFromFallbackProviders(
  productName: string,
  poolSize: number
): Promise<string[]> {
  const queries = [
    `${productName} product image`,
    `${productName} product photo`,
    productName,
  ]

  const seen = new Set<string>()
  const merged: string[] = []

  for (const query of queries) {
    if (merged.length >= poolSize) break

    const [bing, ddg, wiki] = await Promise.allSettled([
      searchBingImages(query, poolSize),
      searchDuckDuckGoImages(query, poolSize),
      searchWikimediaImages(query, poolSize),
    ])

    for (const result of [bing, ddg, wiki]) {
      if (result.status === 'fulfilled') {
        mergeUniqueUrls(merged, result.value, seen, poolSize)
      }
    }
  }

  return merged
}

export async function searchProductImages(
  productName: string,
  poolSize = PREFERRED_PRODUCT_IMAGES * 4
): Promise<string[]> {
  const minPool = Math.max(poolSize, PREFERRED_PRODUCT_IMAGES * 4)
  const seen = new Set<string>()
  const urls: string[] = []

  const serperUrls = await searchProductImagesWithSerper(productName, minPool)
  mergeUniqueUrls(urls, serperUrls, seen, minPool)

  if (urls.length < MIN_PRODUCT_IMAGES) {
    const fallbackUrls = await collectFromFallbackProviders(productName, minPool)
    mergeUniqueUrls(urls, fallbackUrls, seen, minPool)
  }

  if (urls.length < MIN_PRODUCT_IMAGES) {
    const aiUrls = await searchProductImagesWithAi(productName, PREFERRED_PRODUCT_IMAGES)
    mergeUniqueUrls(urls, aiUrls, seen, minPool)
  }

  return urls.slice(0, minPool)
}
