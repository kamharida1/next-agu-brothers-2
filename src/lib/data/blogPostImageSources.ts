import {
  BLOG_POST_PRODUCT_IMAGE_KEY,
  pexelsUrlForProductKey,
  productImageKeyForSlug,
} from './blogPostCategories'

/** Pexels source URL per blog slug (derived from shared product image key). */
export const BLOG_POST_IMAGE_SOURCES: Record<string, string> = Object.fromEntries(
  Object.keys(BLOG_POST_PRODUCT_IMAGE_KEY).map((slug) => [
    slug,
    pexelsUrlForProductKey(productImageKeyForSlug(slug)),
  ])
)
