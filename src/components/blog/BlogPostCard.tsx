import Link from 'next/link'
import type { Blog } from '@/lib/models/BlogModel'
import { truncateText } from '@/lib/utils'
import { stripHtml } from '@/lib/seo'
import BlogImage from './BlogImage'

type BlogPostCardProps = {
  blog: Blog
  priority?: boolean
}

export default function BlogPostCard({ blog, priority = false }: BlogPostCardProps) {
  const excerpt = truncateText(stripHtml(blog.content), 120)
  const href = `/blog/${blog.slug}`

  return (
    <article className="amazon-card flex flex-col h-full group">
      <Link href={href} className="block relative aspect-[16/9] bg-[#F7F8F8] overflow-hidden">
        <BlogImage
          src={blog.image}
          alt={blog.title}
          width={800}
          height={450}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
          priority={priority}
        />
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <time
          className="text-xs text-[#565959]"
          dateTime={new Date(blog.createdAt).toISOString()}
        >
          {new Date(blog.createdAt).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>

        <Link href={href}>
          <h2 className="text-sm font-medium text-[#0F1111] leading-snug line-clamp-2 group-hover:text-[#C7511F] transition-colors">
            {blog.title}
          </h2>
        </Link>

        <p className="text-xs text-[#565959] leading-relaxed line-clamp-3 flex-1">{excerpt}</p>

        <Link
          href={href}
          className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline mt-1"
        >
          Read article →
        </Link>
      </div>
    </article>
  )
}
