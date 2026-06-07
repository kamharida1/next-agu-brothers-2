import dbConnect from '@/lib/dbConnect'
import { cache } from 'react'
import BlogModel, { Blog } from '../models/BlogModel'
import { notFound } from 'next/navigation'
import { serializeBlog, serializeBlogs } from '../utils'

export const revalidate = 60000

export const BLOG_PAGE_SIZE = 12

const getBlogs = cache(async (): Promise<Blog[]> => {
  await dbConnect()
  const posts = await BlogModel.find({}).sort({ updatedAt: -1 }).lean()
  return serializeBlogs(posts as Record<string, unknown>[])
})

const getLatestBlogs = cache(async (limit = 4): Promise<Blog[]> => {
  await dbConnect()
  const posts = await BlogModel.find({}).sort({ updatedAt: -1 }).limit(limit).lean()
  return serializeBlogs(posts as Record<string, unknown>[])
})

const getBlogsPaginated = cache(
  async ({ page = '1' }: { page?: string }): Promise<{
    posts: Blog[]
    page: number
    pages: number
    count: number
  }> => {
    await dbConnect()
    const pageNum = Math.max(1, Number(page) || 1)
    const count = await BlogModel.countDocuments()
    const posts = await BlogModel.find({})
      .sort({ updatedAt: -1 })
      .skip(BLOG_PAGE_SIZE * (pageNum - 1))
      .limit(BLOG_PAGE_SIZE)
      .lean()
    return {
      posts: serializeBlogs(posts as Record<string, unknown>[]),
      page: pageNum,
      pages: Math.max(1, Math.ceil(count / BLOG_PAGE_SIZE)),
      count,
    }
  }
)

const getAllBlogSlugs = cache(async (): Promise<{ slug: string; updatedAt: Date }[]> => {
  await dbConnect()
  const posts = await BlogModel.find({}, 'slug updatedAt').sort({ updatedAt: -1 }).lean()
  return (posts as unknown as { slug: string; updatedAt: Date }[]).map((p) => ({
    slug: p.slug,
    updatedAt: new Date(p.updatedAt),
  }))
})

const getBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  await dbConnect()
  const post = await BlogModel.findOne({ slug }).lean()
  return post ? serializeBlog(post as Record<string, unknown>) : null
})

const deleteBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  await dbConnect()
  const post = await BlogModel.findOneAndDelete({ slug }).lean()
  if (!post) {
    throw notFound()
  }
  return serializeBlog(post as Record<string, unknown>)
})

const blogServices = {
  deleteBlogBySlug,
  getBlogBySlug,
  getBlogs,
  getLatestBlogs,
  getBlogsPaginated,
  getAllBlogSlugs,
}

export default blogServices
