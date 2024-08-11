import BlogItem from '@/components/blog/BlogItem'
import type { Blog } from '@/lib/models/BlogModel'
import blogServices from '@/lib/services/blogService'
import { convertDocToObj } from '@/lib/utils'
import Link from 'next/link'

export default async function Blog() {
  const posts = await blogServices.getBlogs()
  return (
    <>
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold">Our Blog</h1>
        <Link href="/admin/blog/create" className="btn btn-primary my-6">
          Create New Post
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((post: Blog) => (
          <BlogItem blog={convertDocToObj(post)} key={post.slug} />
        ))}
      </div>
    </>
  )
}
