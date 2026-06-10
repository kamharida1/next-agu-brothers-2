/**
 * Seed product guide blog posts into MongoDB.
 *
 * Usage:
 *   npm run seed:blogs
 *
 * Loads `.env.local` then `.env` from the project root (same as Next.js).
 * Removes posts no longer in the seed list, then creates or updates the rest.
 */

import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import mongoose from 'mongoose'
import dbConnect from '../src/lib/dbConnect'
import BlogModel from '../src/lib/models/BlogModel'
import { BLOG_POST_PRODUCT_CATEGORY } from '../src/lib/data/blogPostCategories'
import { BLOG_POSTS_SEED } from '../src/lib/data/blogPostsSeed'

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

async function main() {
  if (!process.env.MONGODB_URI) {
    console.error(
      'MONGODB_URI is not set. Add it to `.env` or `.env.local` in the project root.'
    )
    process.exit(1)
  }

  await dbConnect()

  const keepSlugs = BLOG_POSTS_SEED.map((p) => p.slug)
  const removed = await BlogModel.deleteMany({ slug: { $nin: keepSlugs } })

  let created = 0
  let updated = 0
  let skipped = 0

  for (const post of BLOG_POSTS_SEED) {
    const exists = await BlogModel.findOne({ slug: post.slug })
    if (exists) {
      if (exists.image !== post.image) {
        await BlogModel.updateOne({ slug: post.slug }, { image: post.image })
        updated++
        console.log(`Updated image: ${post.slug}`)
      } else {
        skipped++
      }
      continue
    }
    await BlogModel.create({
      ...post,
      category: BLOG_POST_PRODUCT_CATEGORY[post.slug],
    })
    created++
    console.log(`Created: ${post.slug}`)
  }

  console.log(
    `\nDone. Removed ${removed.deletedCount} old post(s). Created ${created}, updated ${updated} images, skipped ${skipped} unchanged.`
  )
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
