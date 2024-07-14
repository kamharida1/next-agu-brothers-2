import PostDelete from '@/components/blog/PostDelete'
import blogServices from '@/lib/services/blogService'
import Image from 'next/image'
import Link from 'next/link'

export default async function Blog() {
  const posts = await blogServices.getBlogs()
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return (
    <main className="flex min-h-screen flex-col items-start p-24">
      <div className="mb-4">
        <Link className="bg-gray px-4 py-2 rounded" href="/admin/blog/create">
          Create Post
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post: any) => (
          <div key={post._id} className="bg-white p-4 rounded shadow">
            <Image
              src={post.image}
              alt={post.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            ></Image>
            <Link
              key={post._id}
              href={`/admin/blog/${post.slug}`}
              className=""
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>{post.title}</h2>
            </Link>{' '}
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString(
                'en-US',
                dateOptions
              )}
            </p>
            <p className="mt-2">{post.content.slice(0, 100)}...</p>
            <Link
              href={`/admin/blog/${post.slug}`}
              className="text-blue-500 mt-2"
            >
              Read more
            </Link>
            <div className="text-sm opacity-30">
              {'Updated at ' +
                post.updatedAt.toLocaleDateString('en-US', dateOptions)}
            </div>
            <PostDelete id={post.slug} />
          </div>
        ))}
      </div>
    </main>
  )
}
