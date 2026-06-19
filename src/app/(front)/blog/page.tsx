import BlogPostCard from '@/components/blog/BlogPostCard'
import BlogAdminActions from '@/components/blog/BlogAdminActions'
import type { Blog } from '@/lib/models/BlogModel'
import blogServices from '@/lib/services/blogService'
import Link from 'next/link'
import { staticPageMetadata } from '@/lib/seo'

export const metadata = staticPageMetadata({
  title: 'Blog | Agu Brothers Electronics',
  description:
    'Electronics tips, product guides, and home appliance advice from the Agu Brothers team.',
  path: '/blog',
})

const TOPICS = [
  { icon: '📺', label: 'TV & Display' },
  { icon: '❄️', label: 'Cooling & AC' },
  { icon: '⚡', label: 'Power & Generators' },
  { icon: '🧊', label: 'Refrigerators' },
  { icon: '🍳', label: 'Kitchen Appliances' },
  { icon: '💡', label: 'Buying Guides' },
]

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const { posts, page, pages, count } = await blogServices.getBlogsPaginated({
    page: pageParam,
  })

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="text-sm text-[#565959] mb-3">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
            Home
          </Link>
          <span className="mx-1">›</span>
          <span>Blog</span>
        </div>

        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-6 md:p-10 mb-4">
          <p className="text-[#FF9900] text-xs font-bold uppercase tracking-wider mb-2">
            Expert Guides
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Agu Brothers Blog</h1>
          <p className="text-[#CCCCCC] text-sm md:text-base max-w-2xl">
            Product guides, usage tips, and buying advice for TVs, fridges, ACs, generators, and
            more — written for Nigerian homes.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-sm shadow-sm p-4 md:p-5 mb-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D5D9D9] mb-4">
                <h2 className="text-lg font-bold text-[#0F1111]">Latest Articles</h2>
                <span className="text-sm text-[#565959]">
                  {count} article{count !== 1 ? 's' : ''}
                </span>
              </div>

              {posts.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-4xl mb-3">✍️</p>
                  <h3 className="text-lg font-bold text-[#0F1111] mb-2">Articles Coming Soon</h3>
                  <p className="text-sm text-[#565959] mb-4 max-w-sm mx-auto">
                    Helpful product guides will appear here shortly.
                  </p>
                  <Link href="/all-products" className="btn-amazon px-6 py-2 rounded-md text-sm">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {posts.map((post: Blog) => (
                      <div key={post.slug} className="h-full flex flex-col">
                        <BlogPostCard blog={post} />
                        <BlogAdminActions slug={post.slug} />
                      </div>
                    ))}
                  </div>

                  {pages > 1 && (
                    <nav
                      className="flex justify-center gap-2 mt-6 pt-4 border-t border-[#D5D9D9]"
                      aria-label="Blog pagination"
                    >
                      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                        <Link
                          key={p}
                          href={p === 1 ? '/blog' : `/blog?page=${p}`}
                          className={`min-w-[2.25rem] px-3 py-1.5 rounded-sm text-sm border text-center ${
                            p === page
                              ? 'bg-[#FF9900] border-[#FF9900] text-[#131921] font-bold'
                              : 'border-[#D5D9D9] text-[#007185] hover:border-[#AAAAAA]'
                          }`}
                        >
                          {p}
                        </Link>
                      ))}
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>

          <aside className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">
                Topics We Cover
              </h3>
              <ul className="space-y-2">
                {TOPICS.map((t) => (
                  <li key={t.label} className="flex items-center gap-2 text-sm text-[#565959]">
                    <span>{t.icon}</span> {t.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-2 pb-2 border-b border-[#D5D9D9]">
                Need Help Choosing?
              </h3>
              <p className="text-xs text-[#565959] mb-3">
                Not sure which product is right for you? Our team is happy to help.
              </p>
              <Link
                href="/contact-us"
                className="btn-amazon w-full py-2 rounded-md text-sm text-center block"
              >
                Talk to Us
              </Link>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4">
              <p className="text-sm font-bold text-[#0F1111] mb-3">Explore</p>
              <ul className="space-y-2">
                {[
                  { href: '/all-products', label: 'Shop All Products' },
                  { href: '/about-us', label: 'About Us' },
                  { href: '/contact-us', label: 'Contact Us' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[#007185] hover:underline hover:text-[#CC0C39]"
                    >
                      › {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
