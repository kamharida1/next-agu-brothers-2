import { MetadataRoute } from 'next'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import BlogModel from '@/lib/models/BlogModel'
import { categoryToSlug } from '@/lib/categorySlugs'
import { BASE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await dbConnect()

  const products = (await ProductModel.find({}, 'slug updatedAt').lean()) as {
    slug: string
    updatedAt?: Date
  }[]
  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt ?? new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categories = await ProductModel.distinct('cat')
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat: string) => ({
    url: `${BASE_URL}/categories/${categoryToSlug(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const brands = (await ProductModel.distinct('brand')) as string[]
  const brandUrls: MetadataRoute.Sitemap = brands
    .filter(Boolean)
    .map((brand) => ({
      url: `${BASE_URL}/${encodeURIComponent(brand)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  const blogs = (await BlogModel.find({}, 'slug updatedAt').lean()) as {
    slug: string
    updatedAt?: Date
  }[]
  const blogUrls: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: b.updatedAt ?? new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/all-products`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/categories`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/search`, priority: 0.6, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/about-us`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/contact-us`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/blog`, priority: 0.6, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/careers`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/sell-on-agu-brothers`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/affiliate`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/payment-methods`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/credit`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/shipping-rates`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/privacy-policy`, priority: 0.3, changeFrequency: 'yearly' as const },
    { url: `${BASE_URL}/terms-and-conditions`, priority: 0.3, changeFrequency: 'yearly' as const },
  ].map((p) => ({ ...p, lastModified: new Date() }))

  return [...staticPages, ...categoryUrls, ...brandUrls, ...blogUrls, ...productUrls]
}
