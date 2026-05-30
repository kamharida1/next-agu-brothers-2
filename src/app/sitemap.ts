import { MetadataRoute } from 'next'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

const BASE_URL = 'https://www.agubrothers.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect()

  const products = await ProductModel.find({}, 'slug updatedAt').lean() as any[]
  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt ?? new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categories = await ProductModel.distinct('cat')
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat: string) => ({
    url: `${BASE_URL}/search?category=${encodeURIComponent(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                           priority: 1.0, changeFrequency: 'daily'   as const },
    { url: `${BASE_URL}/all-products`,         priority: 0.9, changeFrequency: 'daily'   as const },
    { url: `${BASE_URL}/search`,               priority: 0.7, changeFrequency: 'weekly'  as const },
    { url: `${BASE_URL}/about-us`,             priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/contact-us`,           priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/blog`,                 priority: 0.6, changeFrequency: 'weekly'  as const },
    { url: `${BASE_URL}/careers`,              priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/privacy-policy`,       priority: 0.3, changeFrequency: 'yearly'  as const },
    { url: `${BASE_URL}/terms-and-conditions`, priority: 0.3, changeFrequency: 'yearly'  as const },
  ].map((p) => ({ ...p, lastModified: new Date() }))

  return [...staticPages, ...categoryUrls, ...productUrls]
}
