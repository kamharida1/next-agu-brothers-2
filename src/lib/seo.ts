import type { Metadata } from 'next'

const META_DESC_MAX = 160

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ||
  'https://www.agubrothers.com'

/** Consistent NAP + social profiles for schema and contact pages */
export const BUSINESS = {
  name: 'Agu Brothers Electronics',
  email: 'info@agubrothers.com',
  phone: '+234-909-923-4242',
  phoneSecondary: '+234-906-087-7648',
  phoneDisplay: '+234 909 923 4242',
  address: {
    street: '33 Ogui Road',
    locality: 'Enugu',
    region: 'Enugu State',
    country: 'NG',
  },
  mapsUrl: 'https://maps.google.com/?q=33+Ogui+Road+Enugu+Nigeria',
  instagram: 'https://www.instagram.com/agubrothers/',
  facebook: 'https://www.facebook.com/agubrothers/',
  whatsapp: 'https://wa.me/2349099234242',
  sameAs: [
    'https://wa.me/2349099234242',
    'https://www.instagram.com/agubrothers/',
    'https://www.facebook.com/agubrothers/',
    'https://maps.google.com/?q=33+Ogui+Road+Enugu+Nigeria',
  ],
} as const

export const OG_IMAGE = `${BASE_URL}/og-home.jpg`
export const LOGO_URL = `${BASE_URL}/logo.png`

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

/** Strip HTML tags for meta descriptions and JSON-LD snippets. */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Shared metadata for indexable static/marketing pages */
export function staticPageMetadata(opts: {
  title: string
  description: string
  path: string
  ogImage?: string
}): Metadata {
  const url = `${BASE_URL}${opts.path}`
  const image = opts.ogImage ?? OG_IMAGE
  return {
    title: opts.title,
    description: opts.description,
    robots: ROBOTS_INDEX,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      type: 'website',
      siteName: BUSINESS.name,
      images: [{ url: image, width: 1200, height: 630, alt: BUSINESS.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  }
}
