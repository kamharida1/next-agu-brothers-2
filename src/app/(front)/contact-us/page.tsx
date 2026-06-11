import { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from './ContactForm'
import { BASE_URL, BUSINESS, staticPageMetadata } from '@/lib/seo'

export const metadata: Metadata = staticPageMetadata({
  title: 'Contact Us | Agu Brothers Electronics',
  description:
    'Contact Agu Brothers customer service — phone, email, store address in Enugu, and online help form. We respond within 24 hours.',
  path: '/contact-us',
})

const FAQS = [
  { q: 'What is your return policy?', a: 'We accept returns within 7 days of purchase. The product must be in its original condition and packaging.' },
  { q: 'How can I track my order?', a: 'Visit "Your Orders" in your account to see real-time status updates on your order.' },
  { q: 'Do you offer nationwide shipping?', a: 'Yes! We ship to major cities and states across Nigeria. Shipping fees are calculated at checkout.' },
  { q: 'What payment methods do you accept?', a: 'We accept debit cards, credit cards, bank transfer, and USSD via Paystack. Cash on delivery is also available.' },
  { q: 'Can I change my order after placing it?', a: 'You can cancel an unpaid order from your order history page. For other changes, contact us within 24 hours.' },
]

export default function Contact() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Agu Brothers Electronics',
    url: `${BASE_URL}/contact-us`,
    mainEntity: {
      '@type': 'Organization',
      name: BUSINESS.name,
      email: BUSINESS.email,
      telephone: BUSINESS.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.address.street,
        addressLocality: BUSINESS.address.locality,
        addressRegion: BUSINESS.address.region,
        addressCountry: BUSINESS.address.country,
      },
      sameAs: BUSINESS.sameAs,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Help &amp; Customer Service</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h1 className="text-2xl font-bold text-[#0F1111] mb-1 pb-3 border-b border-[#D5D9D9]">
                Contact Customer Service
              </h1>
              <p className="text-sm text-[#565959] my-4">
                We&apos;re here to help. Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>

            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {FAQS.map((faq, i) => (
                  <details key={i} className="group border border-[#D5D9D9] rounded-sm overflow-hidden">
                    <summary className="flex items-center justify-between px-4 py-3 text-sm font-medium text-[#0F1111] cursor-pointer hover:bg-[#F7F8F8] list-none">
                      {faq.q}
                      <svg className="w-4 h-4 text-[#565959] group-open:rotate-180 transition-transform flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-4 py-3 text-sm text-[#565959] bg-[#F7F8F8] border-t border-[#D5D9D9]">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Find Us</h3>
              <div className="rounded-sm overflow-hidden border border-[#D5D9D9] mb-3">
                <iframe
                  title="Agu Brothers store location on Google Maps"
                  src="https://maps.google.com/maps?q=33+Ogui+Road+Enugu+Nigeria&output=embed"
                  className="w-full h-48"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#007185] hover:underline hover:text-[#CC0C39]"
              >
                View on Google Maps →
              </a>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Contact Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">📍</span>
                  <div>
                    <p className="font-semibold text-[#0F1111]">Store Address</p>
                    <p className="text-[#565959]">{BUSINESS.address.street}<br />{BUSINESS.address.region}, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">📞</span>
                  <div>
                    <p className="font-semibold text-[#0F1111]">Phone</p>
                    <p className="text-[#007185]">{BUSINESS.phoneDisplay}</p>
                    <p className="text-[#007185]">{BUSINESS.phoneSecondary.replace('+234-', '+234 ')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">✉️</span>
                  <div>
                    <p className="font-semibold text-[#0F1111]">Email</p>
                    <p className="text-[#007185]">{BUSINESS.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🕐</span>
                  <div>
                    <p className="font-semibold text-[#0F1111]">Business Hours</p>
                    <p className="text-[#565959]">Mon–Sat: 8am – 6pm<br />Sunday: 12pm – 4pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">🔗</span>
                  <div>
                    <p className="font-semibold text-[#0F1111]">Follow Us</p>
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
                      {' · '}
                      <a
                        href={BUSINESS.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#007185] hover:underline hover:text-[#CC0C39]"
                      >
                        WhatsApp
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#FFF8E6] border border-[#FF9900] rounded-sm p-4">
              <p className="text-sm font-bold text-[#0F1111] mb-1">💡 Tip</p>
              <p className="text-xs text-[#565959]">
                For the fastest response, have your order number ready when contacting us.
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4">
              <p className="text-sm font-bold text-[#0F1111] mb-3">Self-Service Options</p>
              <ul className="space-y-2">
                {[
                  { href: '/order-history', label: '📦 Track your order' },
                  { href: '/profile', label: '👤 Manage your account' },
                  { href: '/all-products', label: '🛒 Browse products' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[#007185] hover:underline hover:text-[#CC0C39]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}