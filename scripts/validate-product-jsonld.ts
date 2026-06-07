/**
 * Validate Product JSON-LD for Google Product snippets.
 *
 * Usage:
 *   npm run validate:product-jsonld
 *   npm run validate:product-jsonld -- --slug my-product-slug
 *   npm run validate:product-jsonld -- --url https://www.agubrothers.com/product/my-product-slug
 *
 * Loads `.env.local` then `.env` from the project root (same as Next.js).
 */

import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import dbConnect from '../src/lib/dbConnect'
import ProductModel from '../src/lib/models/ProductModel'
import ReviewModel, { Review } from '../src/lib/models/ReviewModel'
import {
  buildProductJsonLd,
  validateProductJsonLd,
} from '../src/lib/productStructuredData'
import { Product } from '../src/lib/models/ProductModel'

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

function parseArgs() {
  const args = process.argv.slice(2)
  let slug: string | undefined
  let url: string | undefined

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) slug = args[++i]
    if (args[i] === '--url' && args[i + 1]) url = args[++i]
  }

  return { slug, url }
}

function productImageUrl(product: Product): string | null {
  if (!product.images[0]) return null
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) return null
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_800,h_800,c_fill/${product.images[0]}`
}

function extractProductJsonLdFromHtml(html: string): unknown[] {
  const blocks: unknown[] = []
  const pattern =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi

  for (const match of html.matchAll(pattern)) {
    try {
      const parsed = JSON.parse(match[1].trim())
      if (Array.isArray(parsed)) {
        blocks.push(...parsed.filter((item) => item?.['@type'] === 'Product'))
      } else if (parsed?.['@type'] === 'Product') {
        blocks.push(parsed)
      }
    } catch {
      // skip malformed blocks
    }
  }

  return blocks
}

function printResult(label: string, jsonLd: unknown) {
  const result = validateProductJsonLd(jsonLd)

  console.log(`\n${label}`)
  console.log(JSON.stringify(jsonLd, null, 2))

  if (result.warnings.length) {
    console.log('\nWarnings:')
    for (const warning of result.warnings) console.log(`  ⚠ ${warning}`)
  }

  if (result.errors.length) {
    console.log('\nErrors:')
    for (const error of result.errors) console.log(`  ✗ ${error}`)
    return false
  }

  console.log('\n✓ Product JSON-LD looks valid for Google Product snippets')
  return true
}

async function validateFromDatabase(slug?: string) {
  if (!process.env.MONGODB_URI) {
    console.error(
      'MONGODB_URI is not set. Add it to `.env` or `.env.local`, or pass --url instead.'
    )
    process.exit(1)
  }

  await dbConnect()

  const product = slug
    ? await ProductModel.findOne({ slug })
        .populate({ path: 'reviews', model: ReviewModel })
        .lean()
    : await ProductModel.findOne({ numReviews: { $gt: 0 } })
        .sort({ numReviews: -1 })
        .populate({ path: 'reviews', model: ReviewModel })
        .lean()

  if (!product) {
    console.error(
      slug
        ? `No product found for slug "${slug}".`
        : 'No products with reviews found. Pass --slug to validate a specific product.'
    )
    process.exit(1)
  }

  const typedProduct = product as Product
  const reviews = typedProduct._id
    ? ((await ReviewModel.find({ product: typedProduct._id }).lean()) as Review[])
    : []

  const jsonLd = buildProductJsonLd(typedProduct, productImageUrl(typedProduct), reviews)
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.agubrothers.com'}/product/${typedProduct.slug}`

  console.log(`Product: ${typedProduct.name}`)
  console.log(`URL: ${pageUrl}`)
  console.log(`Reviews in DB: ${typedProduct.numReviews}`)

  const ok = printResult('Generated JSON-LD:', jsonLd)

  if (typedProduct.numReviews > 0 && reviews.length === 0) {
    console.warn(
      '\n⚠ Data inconsistency: numReviews is > 0 but no Review documents exist in the database'
    )
  }

  process.exit(ok ? 0 : 1)
}

async function validateFromUrl(url: string) {
  console.log(`Fetching: ${url}`)

  const response = await fetch(url, {
    headers: { 'User-Agent': 'agu-brothers-jsonld-validator/1.0' },
  })

  if (!response.ok) {
    console.error(`Failed to fetch URL (${response.status} ${response.statusText})`)
    process.exit(1)
  }

  const html = await response.text()
  const productBlocks = extractProductJsonLdFromHtml(html)

  if (productBlocks.length === 0) {
    console.error('No Product JSON-LD block found on the page')
    process.exit(1)
  }

  let allOk = true
  productBlocks.forEach((block, index) => {
    const ok = printResult(`Product JSON-LD block #${index + 1}:`, block)
    allOk = allOk && ok
  })

  process.exit(allOk ? 0 : 1)
}

async function main() {
  loadEnvFiles()
  const { slug, url } = parseArgs()

  if (url) {
    await validateFromUrl(url)
    return
  }

  await validateFromDatabase(slug)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
