import CldImage from '@/components/CldImage'
import blogServices from '@/lib/services/blogService'
import Link from 'next/link'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const blog = await blogServices.getBlogBySlug(params.slug)
  if (!blog) {
    return { title: 'Blog not found' }
  }
  return {
    title: blog.title,
    description: blog.content,
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
  }
}

export default async function BlogDetail({
  params,
}: {
  params: {
    slug: string
  }
}) {
  const blog = await blogServices.getBlogBySlug(params.slug)
  if (!blog) {
    return <div>Blog Not Found</div>
  }
  return (
    <div className="container mx-auto my-8 px-4">
      <Link href="/blog" className="text-blue-500 hover:underline mb-4 block">
        Back to blogs
      </Link>
      <div className="card bg-base-100 shadow-xl mb-8">
        <figure>
          {/* <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 object-cover"
          /> */}
          <CldImage
            src={blog.image}
            alt={blog.title}
            width={400}
            height={350}
            className="object-cover w-full h-64 overflow-hidden rounded-xl transition-transform transform hover:scale-110"
          />
        </figure>
        <div className="card-body items-center">
          <h1 className="card-title text-4xl font-bold">{blog.title}</h1>
          <p className="mb-6">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </div>
    </div>
  )
}
