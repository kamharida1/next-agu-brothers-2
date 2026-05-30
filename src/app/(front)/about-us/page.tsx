import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Agu Brothers Electronics',
  description: 'Learn about Agu Brothers — Nigeria\'s trusted electronics and home appliances store since 1979.',
}

const SECTIONS = [
  { title: 'Who We Are', content: 'We are dedicated to bringing the best in home electronics and appliances to our valued customers. From high-definition televisions to energy-efficient refrigerators, and from versatile gas cookers to powerful freezers, our mission is simple: to provide reliable, innovative, and affordable products that enhance your everyday life.' },
  { title: 'Our Story', content: 'Agu Brothers started with a vision to bridge the gap between technology and comfort. Founded in 1979, we began with a small range of electronic products, and over time expanded to cater to diverse customer needs. Today, we are proud to be a leading supplier of quality electronics, helping homes and businesses upgrade their lifestyle.' },
  { title: 'Why Choose Us?', content: 'We believe in giving our customers the best value for their money. Our key strengths include Quality Assurance, Affordable Prices, Expert Support, and Customer Satisfaction. We partner with leading brands to bring you products that are built to last.' },
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
          <h1 className="text-3xl md:text-4xl font-bold mb-3">About Agu Brothers Electronics</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl">Nigeria&apos;s trusted source for quality electronics and home appliances since 1979.</p>
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
                <p>📞 09099234242</p>
                <p>✉️ agubiggest@gmail.com</p>
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
  )
}
