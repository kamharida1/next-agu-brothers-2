import BlogItem from '@/components/blog/BlogItem'
import type { Blog } from '@/lib/models/BlogModel'
import blogServices from '@/lib/services/blogService'
import { convertDocToObj } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import { RiBloggerLine } from 'react-icons/ri'

export const metadata: Metadata = {
  title: 'Blog | Agu Brothers Electronics',
  description: 'Electronics tips, product guides, and home appliance advice from the Agu Brothers team.',
  alternates: { canonical: 'https://www.agubrothers.com/blog' },
  openGraph: {
    title: 'Blog | Agu Brothers Electronics',
    description: 'Electronics tips, product guides and home appliance advice.',
    type: 'website',
    url: 'https://www.agubrothers.com/blog',
  },
} 

export default async function Blog() {
  const posts = await blogServices.getBlogs()
  return (
    <>
      <div className="text-sm breadcrumbs border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={'/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <RiBloggerLine className="w-4 h-4 mr-2 stroke-current" />
            Blog
          </li>
        </ul>
      </div>
      <div className="text-center my-8">
        <h1 className="text-2xl font-medium">Our Blog</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {posts.map((post: Blog) => (
          <BlogItem blog={convertDocToObj(post)} key={post.slug} />
        ))}
      </div>
    </>
  )
}
