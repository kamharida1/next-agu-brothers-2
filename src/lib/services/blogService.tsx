import dbConnect from '@/lib/dbConnect'
import { cache } from 'react'
import BlogModel, { Blog } from '../models/BlogModel'
import { notFound } from 'next/navigation' // Importing the notFound function from Next.js for handling 404 errors.


export const revalidate = 3600 // revalidate the data at most every hour

const getBlogs = cache(async (): Promise<Blog[]> => {
  await dbConnect()
  const posts = await BlogModel.find({}).sort({ updatedAt: -1 }).limit(4).exec()
  return posts as Blog[]
})


const getBlogById = cache(async (id: string): Promise<Blog | null> => {
  await dbConnect()
  const post = await BlogModel.findOne({ id }).exec()
  if (!post) {
    throw notFound()
  }
  return post as Blog
})

const blogServices = {
  getBlogById,
  getBlogs,
}

export default blogServices
