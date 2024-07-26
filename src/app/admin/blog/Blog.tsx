import BlogItem from '@/components/blog/BlogItem'
import PostDelete from '@/components/blog/PostDelete'
import type { Blog } from '@/lib/models/BlogModel'
import blogServices from '@/lib/services/blogService'
import { convertDocToObj } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default async function Blog() {
  const posts = await blogServices.getBlogs()
  return (
    <>
      <div>
        <Link
          href="/admin/blog/create"
          type="button"
          className="btn btn-primary my-6 w-64"
        >
          Create
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {posts.map((post: Blog) => (
          <BlogItem blog={convertDocToObj(post)} key={post.slug} />
        ))}
      </div>
    </>
  )
}
