import BlogItem from '@/components/blog/BlogItem'
import type { Blog } from '@/lib/models/BlogModel'
import blogServices from '@/lib/services/blogService'
import { convertDocToObj } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import { BASE_URL, ROBOTS_INDEX } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Blog | Agu Brothers Electronics',
  description: 'Electronics tips, product guides, and home appliance advice from the Agu Brothers team.',
  robots: ROBOTS_INDEX,
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'Blog | Agu Brothers Electronics',
    description: 'Electronics tips, product guides and home appliance advice.',
    type: 'website',
    url: 'https://www.agubrothers.com/blog',
  },
}

const TOPICS = [
  { icon: '📺', label: 'TV & Display' },
  { icon: '❄️', label: 'Cooling & AC' },
  { icon: '⚡', label: 'Power & Generators' },
  { icon: '🧊', label: 'Refrigerators' },
  { icon: '🍳', label: 'Kitchen Appliances' },
  { icon: '💡', label: 'Buying Guides' },
]

export default async function Blog() {
  const posts = await blogServices.getBlogs()
  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Blog</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Agu Brothers Blog</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl">
            Expert tips, buying guides, and product reviews to help you make the best electronics decisions.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Posts */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm p-10 text-center">
                <p className="text-5xl mb-4">✍️</p>
                <h2 className="text-xl font-bold text-[#0F1111] mb-2">Articles Coming Soon</h2>
                <p className="text-sm text-[#565959] max-w-sm mx-auto">
                  Our team is working on helpful guides and tips for choosing the right electronics. Check back soon!
                </p>
                <Link href="/all-products" className="btn-amazon inline-block mt-5 px-6 py-2 rounded-md text-sm">
                  Browse Our Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {posts.map((post: Blog) => (
                  <BlogItem blog={convertDocToObj(post)} key={post.slug} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Topics */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Topics We Cover</h3>
              <ul className="space-y-2">
                {TOPICS.map(t => (
                  <li key={t.label} className="flex items-center gap-2 text-sm text-[#565959]">
                    <span>{t.icon}</span> {t.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-2 pb-2 border-b border-[#D5D9D9]">Need Help Choosing?</h3>
              <p className="text-xs text-[#565959] mb-3">
                Not sure which product is right for you? Our team is happy to help.
              </p>
              <Link href="/contact-us" className="btn-amazon w-full py-2 rounded-md text-sm text-center block">
                Talk to Us
              </Link>
            </div>

            {/* Links */}
            <div className="bg-white rounded-sm shadow-sm p-4">
              <p className="text-sm font-bold text-[#0F1111] mb-3">Explore</p>
              <ul className="space-y-2">
                {[
                  { href: '/all-products', label: 'Shop All Products' },
                  { href: '/about-us',     label: 'About Us' },
                  { href: '/contact-us',   label: 'Contact Us' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#007185] hover:underline hover:text-[#CC0C39]">
                      › {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
