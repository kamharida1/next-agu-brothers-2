import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import DrawerButton from '@/components/DrawerButton'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import Header from '@/components/header/header'
import BackToTop from '@/components/BackToTop'
import WhatsAppButton from '@/components/WhatsAppButton'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { BASE_URL, BUSINESS } from '@/lib/seo'

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Agu Brothers Electronics',
    template: '%s | Agu Brothers',
  },
  description:
    'Shop premium home electronics & appliances at Agu Brothers — TVs, refrigerators, generators, air conditioners and more. Fast delivery across Nigeria.',
  verification: {
    google: 'google-site-verification=S3WVPpJ9iNLKBaAbgZ2gfw8KwkU4fcHRMWX-ukR2a1U',
  },
}

const FOOTER_LINKS = [
  {
    title: 'Get to Know Us',
    links: [
      { href: '/about-us',    label: 'About Agu Brothers' },
      { href: '/careers',     label: 'Careers' },
      { href: '/blog',        label: 'Blog' },
      { href: '/contact-us',  label: 'Contact Us' },
    ],
  },
  {
    title: 'Make Money with Us',
    links: [
      { href: '/sell-on-agu-brothers', label: 'Sell on Agu Brothers' },
      { href: '/affiliate',            label: 'Become an Affiliate' },
    ],
  },
  {
    title: 'Payment Products',
    links: [
      { href: '/payment-methods', label: 'Payment Methods' },
      { href: '/credit',          label: 'Agu Brothers Credit' },
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      { href: '/categories',          label: 'Shop by Department' },
      { href: '/profile',               label: 'Your Account' },
      { href: '/order-history',         label: 'Your Orders' },
      { href: '/shipping-rates',        label: 'Shipping Rates' },
      { href: '/terms-and-conditions',  label: 'Terms of Use' },
      { href: '/privacy-policy',        label: 'Privacy Notice' },
      { href: '/contact-us',            label: 'Help' },
    ],
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Cloudinary for faster image loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preconnect to Paystack */}
        <link rel="preconnect" href="https://api.paystack.co" />
      </head>
      <body className={`${openSans.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <Providers>
          <div className="drawer z-50">
            <DrawerButton />
            <div className="drawer-content flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 bg-[#EAEDED]">{children}</main>
              <WhatsAppButton />

              {/* ── Footer ── */}
              <footer>
                {/* Back to top */}
                <BackToTop />

                {/* Main footer links */}
                <div className="bg-[#232F3E] text-white py-10 px-4">
                  <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {FOOTER_LINKS.map((col) => (
                      <div key={col.title}>
                        <h3 className="font-bold text-sm mb-3">{col.title}</h3>
                        <ul className="space-y-1.5">
                          {col.links.map((l) => (
                            <li key={l.href}>
                              <Link href={l.href} className="text-[#DDDDDD] text-sm hover:text-white hover:underline transition-colors">
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub footer */}
                <div className="bg-[#131921] text-[#DDDDDD] py-6 px-4">
                  <div className="max-w-[1500px] mx-auto flex flex-col items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-white font-bold text-xl tracking-tight">
                        agu<span className="text-[#FF9900]">brothers</span>
                      </span>
                      <span className="text-[#CCCCCC] text-xs mt-0.5">Electronics & Home Appliances</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-xs">
                      <a
                        href={BUSINESS.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-white"
                      >
                        Facebook
                      </a>
                      <a
                        href={BUSINESS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-white"
                      >
                        Instagram
                      </a>
                      <Link href="/terms-and-conditions" className="hover:underline hover:text-white">Conditions of Use</Link>
                      <Link href="/privacy-policy" className="hover:underline hover:text-white">Privacy Notice</Link>
                      <Link href="/contact-us" className="hover:underline hover:text-white">Help</Link>
                    </div>
                    <p className="text-xs text-center">
                      © {new Date().getFullYear()} Agu Brothers Electronics. All rights reserved. Enugu, Nigeria.
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span>Payments secured by</span>
                      <span className="border border-[#565959] rounded px-2 py-0.5 text-white font-semibold">Paystack</span>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            <div className="drawer-side z-[200]">
              <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
