import { Metadata } from 'next'
import Link from 'next/link'
import { BASE_URL, BUSINESS, staticPageMetadata } from '@/lib/seo'

export const metadata: Metadata = staticPageMetadata({
  title: 'About Us | Agu Brothers Electronics',
  description:
    'About Agu Brothers — Nigeria\'s trusted electronics store since 1979. We sell 100% brand new electronics and home appliances only. No tokunbo, no second-hand goods.',
  path: '/about-us',
})

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ElectronicsStore',
  name: BUSINESS.name,
  description: 'Agu Brothers Electronics has been selling 100% brand new electronics and home appliances in Nigeria since 1979. We exclusively stock brand new products sourced from authorised distributors — no second-hand, no tokunbo, no refurbished goods.',
  url: BASE_URL,
  telephone: BUSINESS.phone,
  foundingDate: '1979',
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.locality,
    addressRegion: BUSINESS.address.region,
    addressCountry: BUSINESS.address.country,
  },
  sameAs: BUSINESS.sameAs,
}

const SECTIONS = [
  { title: 'Who We Are', content: 'We are dedicated to bringing the best in home electronics and appliances to our valued customers. From high-definition televisions to energy-efficient refrigerators, and from versatile gas cookers to powerful freezers, our mission is simple: to provide reliable, innovative, and affordable products that enhance your everyday life.' },
  { title: 'Our Story', content: 'Agu Brothers started with a vision to bridge the gap between technology and comfort. Founded in 1979, we began with a small range of electronic products, and over time expanded to cater to diverse customer needs. Today, we are proud to be a leading supplier of quality electronics, helping homes and businesses upgrade their lifestyle.' },
  { title: 'Why Choose Us?', content: 'Every single product we sell is 100% brand new — sourced directly from authorised distributors and manufacturers. We do not sell second-hand, refurbished, or tokunbo goods of any kind. Our key strengths include Quality Assurance, Affordable Prices, Expert Support, and Customer Satisfaction. We partner with leading brands to bring you products that are built to last.' },
  { title: 'Our Mission', content: 'Our mission is to provide a seamless shopping experience for every customer, backed by superior products and unmatched service. We aim to be a trusted name in electronics retail, known for our commitment to quality, affordability, and reliability.' },
]

const PRODUCTS = [
  { icon: '📺', name: 'Televisions', desc: 'Smart, LED, UHD options' },
  { icon: '🧊', name: 'Refrigerators', desc: 'All sizes, top brands' },
  { icon: '❄️',  name: 'Air Conditioners', desc: 'Energy-efficient cooling' },
  { icon: '⚡', name: 'Generators', desc: 'Reliable power backup' },
  { icon: '🥶', name: 'Freezers', desc: 'Domestic & commercial' },
  { icon: '🍳', name: 'Gas Cookers', desc: 'Safe & durable' },
  { icon: '🫧', name: 'Washing Machines', desc: 'Front & top loaders' },
  { icon: '🔌', name: 'Home Appliances', desc: 'Microwaves, irons & more' },
]

export default function About() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>About Us</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <div className="inline-block bg-[#007600] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider mb-4">
            100% Brand New Products Only
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">About Agu Brothers Electronics</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl">Nigeria&apos;s trusted source for quality electronics and home appliances since 1979. Every product we sell is brand new.</p>
        </div>

        {/* Brand New Pledge Banner */}
        <div className="bg-[#007600] text-white rounded-sm p-5 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-4xl flex-shrink-0">🆕</div>
          <div>
            <p className="font-bold text-lg">We Only Sell Brand New Products</p>
            <p className="text-[#d4f0d4] text-sm mt-1 max-w-2xl">
              Every item at Agu Brothers is sourced directly from authorised manufacturers and distributors. We have never sold, and will never sell, second-hand, refurbished, or tokunbo goods. When you shop with us, you get exactly what you pay for — a brand new product, sealed in its original packaging, with a full manufacturer&apos;s warranty.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-3">
            {SECTIONS.map(s => (
              <div key={s.title} className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-xl font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">{s.title}</h2>
                <p className="text-[#565959] leading-relaxed text-sm">{s.content}</p>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Contact */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Contact Information</h3>
              <div className="space-y-2 text-sm text-[#565959]">
                <p>📍 33 Ogui Road, Enugu State, Nigeria</p>
                <p>📞 {BUSINESS.phoneDisplay}</p>
                <p>✉️ {BUSINESS.email}</p>
                <p>
                  <a
                    href={BUSINESS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#007185] hover:underline hover:text-[#CC0C39]"
                  >
                    Facebook
                  </a>
                  {' · '}
                  <a
                    href={BUSINESS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#007185] hover:underline hover:text-[#CC0C39]"
                  >
                    Instagram
                  </a>
                </p>
              </div>
              <Link href="/contact-us" className="btn-amazon w-full py-2 rounded-md text-sm text-center block mt-4">
                Contact Us
              </Link>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { href: '/all-products', label: 'Shop All Products' },
                  { href: '/careers',      label: 'Careers' },
                  { href: '/blog',         label: 'Blog' },
                  { href: '/contact-us',   label: 'Get Help' },
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

        {/* Products grid */}
        <div className="bg-white rounded-sm shadow-sm p-6 mt-4">
          <h2 className="text-xl font-bold text-[#0F1111] mb-5 pb-2 border-b border-[#D5D9D9]">Our Product Range</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRODUCTS.map(p => (
              <div key={p.name} className="text-center p-4 bg-[#F7F8F8] rounded-sm border border-[#D5D9D9] hover:border-[#FF9900] transition-colors">
                <div className="text-3xl mb-2">{p.icon}</div>
                <p className="font-bold text-sm text-[#0F1111]">{p.name}</p>
                <p className="text-xs text-[#565959] mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
