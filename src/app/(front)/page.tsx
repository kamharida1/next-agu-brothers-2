import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import { Metadata } from 'next'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const BASE_URL = 'https://www.agubrothers.com'

export const metadata: Metadata = {
  title: 'Agu Brothers — Electronics & Home Appliances Nigeria',
  description: 'Shop premium home electronics and appliances in Nigeria: TVs, refrigerators, generators, air conditioners, gas cookers, freezers. Fast delivery nationwide.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'Agu Brothers — Electronics & Home Appliances Nigeria',
    description: 'Shop premium home electronics and appliances in Nigeria. TVs, fridges, generators, ACs and more. Fast nationwide delivery.',
    url: BASE_URL,
    siteName: 'Agu Brothers Electronics',
    type: 'website',
    images: [{
      url: `${BASE_URL}/og-home.jpg`,
      width: 1200,
      height: 630,
      alt: 'Agu Brothers Electronics — Nigeria',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agu Brothers — Electronics & Home Appliances Nigeria',
    description: 'Premium electronics and home appliances. Fast delivery across Nigeria.',
    images: [`${BASE_URL}/og-home.jpg`],
  },
}

const CATEGORY_ICONS: Record<string, string> = {
  'Televisions':     '📺',
  'Refrigerators':   '🧊',
  'Air Conditioners':'❄️',
  'Generators':      '⚡',
  'Freezers':        '🥶',
  'Gas Cookers':     '🍳',
  'Washing Machines':'🫧',
  'Electronics':     '🔌',
}

export default async function Home() {
  const [featuredProducts, latestProducts, categories] = await Promise.all([
    productServices.getFeatured(),
    productServices.getLatest(),
    productServices.getCategories(),
  ])

  const featured = JSON.parse(JSON.stringify(featuredProducts))
  const latest   = JSON.parse(JSON.stringify(latestProducts))

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Agu Brothers Electronics',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-909-923-4242',
      contactType: 'Customer Service',
      areaServed: 'NG',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '33 Ogui Road',
      addressLocality: 'Enugu',
      addressCountry: 'NG',
    },
    sameAs: [],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Agu Brothers Electronics',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    <div className="bg-[#EAEDED] min-h-screen">
      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#131921] via-[#232F3E] to-[#37475A] text-white">
        <div className="max-w-[1500px] mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div className="inline-block bg-[#FF9900] text-[#131921] text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
              Nigeria&apos;s #1 Electronics Store
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Top Electronics &<br />
              <span className="text-[#FF9900]">Home Appliances</span>
            </h1>
            <p className="text-[#CCCCCC] text-lg max-w-xl">
              TVs, fridges, ACs, generators and more — quality brands, genuine products, fast delivery across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="/all-products" className="btn-amazon text-base px-8 py-3 rounded-md font-bold text-center">
                Shop Now
              </Link>
              <Link href="/search" className="text-base px-8 py-3 rounded-md text-center text-white border border-white/70 hover:bg-white/10 transition-colors duration-100 font-normal">
                Browse All
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#CCCCCC] justify-center md:justify-start pt-2">
              <span className="flex items-center gap-2">✓ 1-Year Warranty</span>
              <span className="flex items-center gap-2">✓ Fast Delivery</span>
              <span className="flex items-center gap-2">✓ Secure Payments</span>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <div className="text-9xl">🏠</div>
          </div>
        </div>
        {/* wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#EAEDED]" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </div>

      <div className="max-w-[1500px] mx-auto px-4 py-6 space-y-8">

        {/* ── Shop by Category ── */}
        <section>
          <div className="bg-white rounded-sm shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#0F1111]">Shop by Category</h2>
              <Link href="/search" className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline flex items-center gap-1">
                See all departments <FiArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {categories.map((cat: string) => (
                <Link
                  key={cat}
                  href={`/search?category=${encodeURIComponent(cat)}`}
                  className="group flex flex-col items-center gap-2 p-3 rounded-sm border border-[#D5D9D9]
                             hover:border-[#FF9900] hover:shadow-sm transition-all text-center"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {CATEGORY_ICONS[cat] ?? '🛍️'}
                  </span>
                  <span className="text-xs text-[#0F1111] leading-tight">{cat}</span>
                </Link>
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
                {latest.map((product: Product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Why Shop with Us ── */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: '🚚', title: 'Fast Delivery', sub: 'Nationwide shipping' },
              { icon: '✅', title: 'Genuine Products', sub: '100% authentic brands' },
              { icon: '🔒', title: 'Secure Checkout', sub: 'Paystack encrypted' },
              { icon: '🔄', title: '7-Day Returns', sub: 'Easy hassle-free returns' },
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
