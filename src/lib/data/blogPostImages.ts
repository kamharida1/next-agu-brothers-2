import {
  BLOG_POST_PRODUCT_IMAGE_KEY,
  productImageKeyForSlug,
} from './blogPostCategories'

/** Cloudinary folder for blog hero images (one asset per product type). */
export const BLOG_IMAGE_FOLDER = 'blog_images'
export const BLOG_PRODUCT_IMAGE_FOLDER = `${BLOG_IMAGE_FOLDER}/products`

export function blogProductCloudinaryPublicId(productKey: string): string {
  return `${BLOG_PRODUCT_IMAGE_FOLDER}/${productKey}`
}

export function blogCloudinaryPublicId(slug: string): string {
  return blogProductCloudinaryPublicId(productImageKeyForSlug(slug))
}

/** Cloudinary public_ids — shared by all posts about the same product type. */
export const BLOG_POST_IMAGES: Record<string, string> = Object.fromEntries(
  Object.keys(BLOG_POST_PRODUCT_IMAGE_KEY).map((slug) => [slug, blogCloudinaryPublicId(slug)])
)
