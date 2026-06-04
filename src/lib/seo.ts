import type { Metadata } from 'next'

const META_DESC_MAX = 160

export const BASE_URL = 'https://www.agubrothers.com'

/** Pages that should appear in Google search results */
export const ROBOTS_INDEX = { index: true, follow: true } as const

/** Login, checkout, admin, 404s, filtered search, etc. */
export const ROBOTS_NOINDEX = { index: false, follow: false } as const

/** Paginated / filtered views: crawl links, do not index duplicate URLs */
export const ROBOTS_NOINDEX_FOLLOW = { index: false, follow: true } as const

/** Trim text for meta descriptions and JSON-LD snippets. */
export function truncateForMeta(text: string, max = META_DESC_MAX): string {
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned.length <= max) return cleaned
  return `${cleaned.slice(0, max - 1).trim()}…`
}

export function shouldNoindexSearchParams(sp: {
  q?: string
  page?: string
  price?: string
  rating?: string
  sort?: string
}): boolean {
  const q = sp.q && sp.q !== 'all' ? sp.q : null
  const page = sp.page && sp.page !== '1' ? sp.page : null
  const price = sp.price && sp.price !== 'all' ? sp.price : null
  const rating = sp.rating && sp.rating !== 'all' ? sp.rating : null
  const sort = sp.sort && sp.sort !== 'newest' ? sp.sort : null
  return Boolean(q || page || price || rating || sort)
}

export function searchRobots(sp: Parameters<typeof shouldNoindexSearchParams>[0]) {
  return shouldNoindexSearchParams(sp) ? ROBOTS_NOINDEX_FOLLOW : ROBOTS_INDEX
}
