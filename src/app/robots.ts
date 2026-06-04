import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.agubrothers.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/cart',
        '/checkout',
        '/shipping',
        '/payment',
        '/place-order',
        '/order/',
        '/order-history',
        '/profile',
        '/signin',
        '/register',
        '/wishlist',
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
