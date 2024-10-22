import dbConnect from '@/lib/dbConnect'
import { cache } from 'react'
import BlogModel, { Blog } from '../models/BlogModel'
import { notFound } from 'next/navigation' // Importing the notFound function from Next.js for handling 404 errors.


export const revalidate = 60000 

const getBlogs = cache(async (): Promise<Blog[]> => {
  await dbConnect()
  const posts = await BlogModel.find({}).sort({ updatedAt: -1 }).limit(4).exec()
  return posts as Blog[]
})


const getBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  await dbConnect()
  const post = await BlogModel.findOne({ slug }).exec()
  if (!post) {
    throw notFound()
  }
  return post as Blog
})

const deleteBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  await dbConnect()
  const post = await BlogModel.findOneAndDelete({ slug }).exec()
  if (!post) {
    throw notFound()
  }
  return post as Blog
})

const blogServices = {
  deleteBlogBySlug,
  getBlogBySlug,
  getBlogs,
}

export default blogServices
