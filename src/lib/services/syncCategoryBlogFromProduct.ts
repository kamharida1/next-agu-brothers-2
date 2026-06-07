import { revalidatePath } from 'next/cache'
import BlogModel from '@/lib/models/BlogModel'
import { toCloudinaryPublicId } from '@/lib/cloudinaryImage'
import {
  buildCategoryBlogContent,
  buildCategoryBlogTitle,
  getCategoryGuideSlug,
  hasAutoCategoryBlog,
} from '@/lib/data/categoryBlogTemplates'

type ProductInput = {
  name: string
  slug: string
  cat: string
  brand?: string
  image?: string
  images?: string[]
  description?: string
}

function productImagePublicId(product: ProductInput): string | null {
  const raw = product.image?.trim() || product.images?.find((x) => x?.trim())
  if (!raw) return null
  return toCloudinaryPublicId(raw)
}

/**
 * Creates or updates one category guide blog when a product is uploaded.
 * Uses the product image and name; content is a general category guide.
 */
export async function syncCategoryBlogFromProduct(
  product: ProductInput
): Promise<{ slug: string; created: boolean } | null> {
  if (!hasAutoCategoryBlog(product.cat)) return null

  const slug = getCategoryGuideSlug(product.cat)
  if (!slug) return null

  const image = productImagePublicId(product)
  if (!image) return null

  const existing = await BlogModel.findOne({ slug }).lean()
  const payload = {
    title: buildCategoryBlogTitle(product.cat, product.name),
    slug,
    image,
    content: buildCategoryBlogContent(product),
    category: product.cat,
    linkedProductSlug: product.slug,
  }

  if (existing) {
    await BlogModel.updateOne({ slug }, payload)
  } else {
    await BlogModel.create(payload)
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/sitemap.xml')

  return { slug, created: !existing }
}
