/**
 * Sync product.rating and product.numReviews with Review documents.
 *
 * Usage:
 *   npm run sync:product-ratings
 *   npm run sync:product-ratings -- --apply
 *
 * Without --apply, runs in dry-run mode.
 */

import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import dbConnect from '../src/lib/dbConnect'
import ProductModel from '../src/lib/models/ProductModel'
import ReviewModel from '../src/lib/models/ReviewModel'

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
      if (!process.env[key]) process.env[key] = value
    }
  }
}

loadEnvFiles()

async function main() {
  const apply = process.argv.includes('--apply')

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set.')
    process.exit(1)
  }

  await dbConnect()

  const products = await ProductModel.find({}, '_id slug rating numReviews').lean()
  let updates = 0

  for (const product of products) {
    const reviews = await ReviewModel.find({ product: product._id }).lean()
    const reviewCount = reviews.length
    const avgRating =
      reviewCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0

    const roundedRating = Math.round(avgRating * 10) / 10
    const needsUpdate =
      product.numReviews !== reviewCount ||
      product.rating !== roundedRating

    if (!needsUpdate) continue

    updates++
    console.log(
      `${apply ? 'Updating' : 'Would update'} ${product.slug}: numReviews ${product.numReviews} -> ${reviewCount}, rating ${product.rating} -> ${roundedRating}`
    )

    if (apply) {
      await ProductModel.updateOne(
        { _id: product._id },
        { $set: { numReviews: reviewCount, rating: roundedRating } }
      )
    }
  }

  console.log(`\n${apply ? 'Updated' : 'Would update'} ${updates} product(s).`)
  if (!apply && updates > 0) {
    console.log('Re-run with --apply to persist changes.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
