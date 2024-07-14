// React Server Components
'use server'

import blogServices from "@/lib/services/blogService"
import Image from "next/image";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await blogServices.getBlogs()
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return (
    <main className='flex min-h-screen flex-col items-start p-24'>
      <div className="mb-4">
        <Link className="bg-gray px-4 py-2 rounded" href="/blog/new">
          Create Post
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.slug} className="bg-white p-4 rounded shadow">
            {/* <img src={post.image} alt={post.title} className="w-full h-48 object-cover" /> */}
            <Image src={post.image} alt={post.title} width={300} height={200} className="w-full h-48 object-cover"></Image> 
            <h2 className="text-xl font-bold mt-2">{post.title}</h2>
            <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString('en-US', dateOptions)}</p>
            <p className="mt-2">{post.content.slice(0, 100)}...</p>
            <Link href={`/blog/${post.slug}`} className="text-blue-500 mt-2">Read more</Link>
          </div>
        ))}
      </div>
    </main>
  )
}