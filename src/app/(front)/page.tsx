import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import blogServices from '@/lib/services/blogService'
import { Metadata } from 'next'
import ProductCard from '@/components/products/ProductCard'
import BlogPostCard from '@/components/blog/BlogPostCard'
import HomeHero from '@/components/home/HomeHero'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import CategoryDepartmentCard from '@/components/categories/CategoryDepartmentCard'

import {
  BASE_URL,
  BUSINESS,
  LOGO_URL,
  OG_IMAGE,
  ROBOTS_INDEX,
} from '@/lib/seo'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Agu Brothers — Brand New Electronics & Home Appliances Nigeria',
  description: 'Shop 100% brand new electronics and home appliances in Nigeria: TVs, refrigerators, generators, air conditioners, gas cookers, freezers. All products are brand new — no tokunbo. Fast delivery nationwide.',
  robots: ROBOTS_INDEX,
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'Agu Brothers — Brand New Electronics & Home Appliances Nigeria',
    description: 'Shop 100% brand new electronics and home appliances in Nigeria. All products are brand new — no second-hand goods. TVs, fridges, generators, ACs and more. Fast nationwide delivery.',
    url: BASE_URL,
    siteName: 'Agu Brothers Electronics',
    type: 'website',
    images: [{
      url: OG_IMAGE,
      width: 1200,
      height: 630,
      alt: 'Agu Brothers Electronics — Nigeria',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agu Brothers — Electronics & Home Appliances Nigeria',
    description: 'Premium electronics and home appliances. Fast delivery across Nigeria.',
    images: [OG_IMAGE],
  },
}

export default async function Home() {
  const [featuredProducts, latestProducts, categories, categoryThumbnails, latestPosts] =
    await Promise.all([
      productServices.getFeatured(),
      productServices.getLatest(),
      productServices.getCategories(),
      productServices.getCategoryThumbnails(),
      blogServices.getLatestBlogs(4),
    ])

  const featured = JSON.parse(JSON.stringify(featuredProducts))
  const latest   = JSON.parse(JSON.stringify(latestProducts))

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ElectronicsStore',
    name: BUSINESS.name,
    description: 'Agu Brothers Electronics sells 100% brand new electronics and home appliances in Nigeria. All products are brand new — we do not sell second-hand or tokunbo goods. Products include televisions, refrigerators, air conditioners, generators, gas cookers, washing machines, and freezers.',
    image: OG_IMAGE,
    url: BASE_URL,
    telephone: BUSINESS.phone,
    priceRange: '₦₦',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.4521,
      longitude: 7.5248,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '08:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '12:00', closes: '16:00' },
    ],
    hasMap: BUSINESS.mapsUrl,
    sameAs: BUSINESS.sameAs,
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS.name,
    url: BASE_URL,
    logo: LOGO_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phone,
      contactType: 'Customer Service',
      areaServed: 'NG',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressCountry: BUSINESS.address.country,
    },
    sameAs: BUSINESS.sameAs,
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BUSINESS.name,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    <div className="bg-[#EAEDED] min-h-screen">
      <HomeHero />

      <div className="max-w-[1500px] mx-auto px-4 py-4 space-y-8">

        {/* ── Shop by Department ── */}
        <section>
          <div className="bg-white rounded-sm shadow-sm p-4 md:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-[#0F1111]">Shop by Department</h2>
              <Link
                href="/categories"
                className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline flex items-center gap-1 self-start sm:self-auto py-1 touch-manipulation"
              >
                View all departments <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {categories.map((cat: string) => (
                <CategoryDepartmentCard
                  key={cat}
                  category={cat}
                  imageSrc={categoryThumbnails[cat]}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── New Arrivals ── */}
        {latest.length > 0 && (
          <section>
            <div className="bg-white rounded-sm shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[#0F1111]">New Arrivals</h2>
                  <p className="text-sm text-[#565959] mt-0.5">Fresh products just added</p>
                </div>
                <Link href="/all-products" className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline flex items-center gap-1">
                  See all <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                {latest.map((product: Product, i: number) => (
                  <ProductCard key={product.slug} product={product} priority={i < 4} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Why Shop with Us ── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '🆕', title: '100% Brand New', sub: 'No tokunbo — ever' },
              { icon: '🚚', title: 'Fast Delivery',   sub: 'Nationwide shipping' },
              { icon: '🔒', title: 'Secure Checkout', sub: 'Paystack encrypted' },
              { icon: '🔄', title: '7-Day Returns',   sub: 'Easy hassle-free returns' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-sm shadow-sm p-4 flex items-center gap-3">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-[#0F1111]">{f.title}</p>
                  <p className="text-xs text-[#565959]">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Products ── */}
        {featured.length > 0 && (
          <section>
            <div className="bg-white rounded-sm shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[#0F1111]">Featured Products</h2>
                  <p className="text-sm text-[#565959] mt-0.5">Handpicked top picks</p>
                </div>
                <Link href="/all-products" className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline flex items-center gap-1">
                  See all <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                {featured.map((product: Product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Buying Guides & Tips ── */}
        {latestPosts.length > 0 && (
          <section>
            <div className="bg-white rounded-sm shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[#0F1111]">Buying Guides &amp; Tips</h2>
                  <p className="text-sm text-[#565959] mt-0.5">
                    Expert advice on choosing and using your appliances
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline flex items-center gap-1"
                >
                  See all articles <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {latestPosts.map((post, i) => (
                  <BlogPostCard key={post.slug} blog={post} priority={i < 2} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Deal Banner ── */}
        <section>
          <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-6 md:p-10 text-center">
            <p className="text-[#FF9900] font-bold text-sm uppercase tracking-wider mb-2">Special Offer</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Need help choosing the right appliance?</h2>
            <p className="text-[#CCCCCC] mb-6 max-w-lg mx-auto">Our experts are ready to guide you. Call or visit us today.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/contact-us" className="btn-amazon px-8 py-3 rounded-md font-bold text-base">Contact Us</Link>
              <Link href="/all-products" className="px-8 py-3 rounded-md text-white border border-white/50 hover:bg-white/10 transition-colors duration-100 text-base">Browse All Products</Link>
            </div>
          </div>
        </section>

      </div>
    </div>
    </>
  )
}
