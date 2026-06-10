import blogServices from '@/lib/services/blogService'
import { resolveBlogImageUrl } from '@/lib/cloudinaryImage'
import {
  BASE_URL,
  BUSINESS,
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  stripHtml,
  truncateForMeta,
} from '@/lib/seo'
import BlogImage from '@/components/blog/BlogImage'
import BlogPostCard from '@/components/blog/BlogPostCard'
import BlogShopCta from '@/components/blog/BlogShopCta'
import { BLOG_POST_PRODUCT_CATEGORY } from '@/lib/data/blogPostCategories'
import { resolveBlogCategory } from '@/lib/data/categoryBlogTemplates'
import { categoryHref } from '@/lib/categorySlugs'
import productServices from '@/lib/services/productService'
import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await blogServices.getBlogBySlug(slug)
  if (!blog) {
    return { title: 'Blog not found', robots: ROBOTS_NOINDEX }
  }

  const description = truncateForMeta(stripHtml(blog.content) || blog.title)
  const url = `${BASE_URL}/blog/${blog.slug}`
  const image = resolveBlogImageUrl(blog.image)

  return {
    title: blog.title,
    description,
    robots: ROBOTS_INDEX,
    alternates: { canonical: url },
    openGraph: {
      title: blog.title,
      description,
      type: 'article',
      url,
      publishedTime: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
      modifiedTime: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
      siteName: BUSINESS.name,
      images: [{ url: image, alt: blog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: [image],
    },
  }
}

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await blogServices.getAllBlogSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export default async function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await blogServices.getBlogBySlug(slug)
  if (!blog) notFound()

  const category =
    blog.category ??
    BLOG_POST_PRODUCT_CATEGORY[slug] ??
    resolveBlogCategory(slug)

  const relatedProductPromise = blog.linkedProductSlug
    ? productServices.getBySlug(blog.linkedProductSlug).catch(() => null)
    : category
      ? productServices.getOneByCategory(category)
      : Promise.resolve(null)

  const [relatedPosts, relatedProductRaw] = await Promise.all([
    blogServices.getLatestBlogs(4).then((posts) => posts.filter((p) => p.slug !== slug).slice(0, 3)),
    relatedProductPromise,
  ])

  const relatedProduct = relatedProductRaw
    ? JSON.parse(JSON.stringify(relatedProductRaw))
    : null

  const url = `${BASE_URL}/blog/${blog.slug}`
  const image = resolveBlogImageUrl(blog.image)

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: truncateForMeta(stripHtml(blog.content), 500),
    image,
    url,
    datePublished: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
    dateModified: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : undefined,
    author: {
      '@type': 'Organization',
      name: BUSINESS.name,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.name,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <div className="bg-[#EAEDED] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="text-sm text-[#565959] mb-3">
            <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
              Home
            </Link>
            <span className="mx-1">›</span>
            <Link href="/blog" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
              Blog
            </Link>
            <span className="mx-1">›</span>
            <span className="line-clamp-1">{blog.title}</span>
          </div>

          <div className="grid lg:grid-cols-4 gap-4">
            <article className="lg:col-span-3 bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="relative aspect-[21/9] bg-[#F7F8F8]">
                <BlogImage
                  src={blog.image}
                  alt={blog.title}
                  width={1200}
                  height={514}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="p-5 md:p-8">
                <p className="text-[#FF9900] text-xs font-bold uppercase tracking-wider mb-2">
                  Product Guide
                </p>
                <h1 className="text-2xl md:text-3xl font-medium text-[#0F1111] leading-snug mb-3">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#565959] pb-4 mb-6 border-b border-[#D5D9D9]">
                  <span>By {BUSINESS.name}</span>
                  <span aria-hidden>·</span>
                  <time dateTime={new Date(blog.createdAt).toISOString()}>
                    {new Date(blog.createdAt).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                <div
                  className="prose prose-sm md:prose-base max-w-none
                    prose-headings:text-[#0F1111] prose-headings:font-medium
                    prose-p:text-[#0F1111] prose-p:leading-relaxed
                    prose-li:text-[#0F1111] prose-strong:text-[#0F1111]
                    prose-a:text-[#007185] prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#C7511F]"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {category && (
                  <div className="mt-8">
                    <BlogShopCta category={category} product={relatedProduct} />
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-[#D5D9D9] flex flex-wrap gap-3">
                  <Link href="/blog" className="btn-amazon-outline px-5 py-2 rounded-md text-sm">
                    ← Back to Blog
                  </Link>
                  {relatedProduct ? (
                    <Link
                      href={`/product/${relatedProduct.slug}`}
                      className="btn-amazon px-5 py-2 rounded-md text-sm"
                    >
                      Buy {relatedProduct.name.length > 32
                        ? `${relatedProduct.name.slice(0, 32)}…`
                        : relatedProduct.name}
                    </Link>
                  ) : category ? (
                    <Link
                      href={categoryHref(category)}
                      className="btn-amazon px-5 py-2 rounded-md text-sm"
                    >
                      Shop {category}
                    </Link>
                  ) : (
                    <Link href="/all-products" className="btn-amazon px-5 py-2 rounded-md text-sm">
                      Shop Products
                    </Link>
                  )}
                </div>
              </div>
            </article>

            <aside className="space-y-3">
              {category && (
                <BlogShopCta category={category} product={relatedProduct} compact />
              )}

              <div className="bg-white rounded-sm shadow-sm p-5">
                <h2 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">
                  More Guides
                </h2>
                {relatedPosts.length > 0 ? (
                  <div className="space-y-3">
                    {relatedPosts.map((post) => (
                      <BlogPostCard key={post.slug} blog={post} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#565959]">More articles coming soon.</p>
                )}
                <Link
                  href="/blog"
                  className="block mt-4 text-sm text-[#007185] hover:underline hover:text-[#CC0C39]"
                >
                  View all articles →
                </Link>
              </div>

              <div className="bg-[#232F3E] text-white rounded-sm p-5">
                <h3 className="font-bold mb-2">Need expert advice?</h3>
                <p className="text-sm text-[#CCCCCC] mb-4">
                  Our team can help you pick the right TV, fridge, AC, or generator for your home.
                </p>
                <Link
                  href="/contact-us"
                  className="btn-amazon w-full py-2 rounded-md text-sm text-center block"
                >
                  Contact Us
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
