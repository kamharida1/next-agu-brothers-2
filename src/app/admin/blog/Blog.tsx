import BlogPostCard from '@/components/blog/BlogPostCard'
import BlogAdminActions from '@/components/blog/BlogAdminActions'
import type { Blog } from '@/lib/models/BlogModel'
import blogServices from '@/lib/services/blogService'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'

export default async function Blog() {
  const posts = await blogServices.getBlogs()
  return (
    <div className="space-y-5">
      <div className="admin-panel p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm text-[#565959]">Manage blog posts for the storefront</p>
          <p className="text-lg font-bold text-[#0F1111] mt-1">{posts.length} posts</p>
        </div>
        <Link href="/admin/blog/create" className="btn-amazon inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm">
          <FiPlus className="w-4 h-4" />
          Create post
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post: Blog) => (
          <div key={post.slug} className="h-full flex flex-col">
            <BlogPostCard blog={post} />
            <BlogAdminActions slug={post.slug} />
          </div>
        ))}
      </div>
    </div>
  )
}
