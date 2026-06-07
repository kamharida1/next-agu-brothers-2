/**
 * Sync blog hero images: one Cloudinary asset per product type, shared by all
 * related posts (e.g. every TV guide uses `blog_images/products/televisions`).
 *
 * Usage:
 *   npm run upload:blog-images
 */

import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { v2 as cloudinary } from 'cloudinary'
import mongoose from 'mongoose'
import dbConnect from '../src/lib/dbConnect'
import BlogModel from '../src/lib/models/BlogModel'
import ProductModel from '../src/lib/models/ProductModel'
import { toCloudinaryPublicId } from '../src/lib/cloudinaryImage'
import {
  allBlogProductImageKeys,
  BLOG_POST_PRODUCT_IMAGE_KEY,
  fallbackPexelsIdForProductKey,
  slugsForProductImageKey,
} from '../src/lib/data/blogPostCategories'
import {
  blogProductCloudinaryPublicId,
  BLOG_PRODUCT_IMAGE_FOLDER,
} from '../src/lib/data/blogPostImages'
import { pexelsUrlForProductKey } from '../src/lib/data/blogPostCategories'

function loadEnvFiles() {
  for (const file of ['.env.local', '.env']) {
    const path = resolve(process.cwd(), file)
    if (!existsSync(path)) continue

    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const eq = trimmed.indexOf('=')
      if (eq === -1) continue

      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      if (!process.env[key]) process.env[key] = value
    }
  }
}

loadEnvFiles()

const useCatalogImages = process.env.USE_CATALOG_BLOG_IMAGES === 'true'

/** Map product image key → store category for catalog lookup. */
const PRODUCT_KEY_TO_CATEGORY: Record<string, string> = {
  televisions: 'Televisions',
  refrigerators: 'Refrigerators',
  'air-conditioners': 'Air Conditioners',
  generators: 'Generators',
  freezers: 'Freezers',
  'gas-cookers': 'Gas Cookers',
  'washing-machines': 'Washing Machines',
  microwave: 'Electronics',
  iron: 'Electronics',
  'surge-protector': 'Electronics',
  'home-electronics': 'Electronics',
}

function productImageSrc(product: { image?: string; images?: string[] }): string | null {
  const raw = product.image?.trim() || product.images?.find((x) => x?.trim())
  return raw || null
}

async function findProductForCategory(category: string) {
  return ProductModel.findOne({
    cat: category,
    $or: [
      { image: { $exists: true, $nin: [null, ''] } },
      { images: { $exists: true, $not: { $size: 0 } } },
    ],
  })
    .sort({ isFeatured: -1, sold: -1, createdAt: -1 })
    .lean<{ image?: string; images?: string[] }>()
}

async function uploadWebImageForProductKey(productKey: string) {
  const sourceUrl = pexelsUrlForProductKey(productKey)

  const response = await fetch(sourceUrl)
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} fetching Pexels photo ${fallbackPexelsIdForProductKey(productKey)}`
    )
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const dataUri = `data:${contentType};base64,${buffer.toString('base64')}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: BLOG_PRODUCT_IMAGE_FOLDER,
    public_id: productKey,
    overwrite: true,
    invalidate: true,
    resource_type: 'image',
  })

  return result.public_id
}

async function assignImageToSlugs(productKey: string, publicId: string) {
  const slugs = slugsForProductImageKey(productKey)
  await BlogModel.updateMany({ slug: { $in: slugs } }, { image: publicId })
  return slugs.length
}

async function main() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  const apiSecret =
    process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    console.error(
      'Missing Cloudinary env vars. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    )
    process.exit(1)
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set.')
    process.exit(1)
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

  await dbConnect()

  let fromProduct = 0
  let fromWeb = 0
  let postsUpdated = 0
  let failed = 0

  console.log(
    useCatalogImages
      ? 'Mode: one image per product type; catalog when available, else web stock'
      : 'Mode: one web stock image per product type (set USE_CATALOG_BLOG_IMAGES=true to prefer catalog)'
  )

  for (const productKey of allBlogProductImageKeys()) {
    const category = PRODUCT_KEY_TO_CATEGORY[productKey]
    const expectedPublicId = blogProductCloudinaryPublicId(productKey)

    try {
      if (useCatalogImages && category) {
        const product = await findProductForCategory(category)
        const rawImage = product ? productImageSrc(product) : null

        if (rawImage) {
          const publicId = toCloudinaryPublicId(rawImage)
          const count = await assignImageToSlugs(productKey, publicId)
          fromProduct++
          postsUpdated += count
          console.log(`Catalog [${productKey}]: ${count} post(s) → ${publicId}`)
          continue
        }
      }

      const publicId = await uploadWebImageForProductKey(productKey)
      const count = await assignImageToSlugs(productKey, publicId)
      fromWeb++
      postsUpdated += count
      console.log(`Web [${productKey}]: ${count} post(s) → ${publicId}`)
      await new Promise((r) => setTimeout(r, 400))
    } catch (err) {
      failed++
      console.error(`Failed [${productKey}]:`, err instanceof Error ? err.message : err)
    }
  }

  // Ensure any slug missing from DB still gets the shared public id
  for (const [slug, productKey] of Object.entries(BLOG_POST_PRODUCT_IMAGE_KEY)) {
    const publicId = blogProductCloudinaryPublicId(productKey)
    await BlogModel.updateOne({ slug }, { image: publicId })
  }

  console.log(
    `\nDone. ${allBlogProductImageKeys().length} product images, ${postsUpdated} post assignments, ${fromWeb} from web, ${fromProduct} from catalog, ${failed} failed.`
  )
  await mongoose.disconnect()

  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
