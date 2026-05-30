import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Conditions of Use | Agu Brothers' }

export default function TermsAndConditions() {
  return (
    <div className="bg-[#EAEDED] min-h-screen py-6 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Conditions of Use</span>
        </div>
        <div className="bg-white rounded-sm shadow-sm p-8">
          <h1 className="text-3xl font-bold text-[#0F1111] mb-2">Conditions of Use</h1>
          <p className="text-sm text-[#565959] mb-6 pb-4 border-b border-[#D5D9D9]">Last updated: January 2024</p>
          <div className="text-sm leading-relaxed space-y-6 text-[#0F1111]">
            {[
              { title: '1. Acceptance of Terms', body: 'By accessing or using Agu Brothers Electronics, you agree to these Conditions of Use. If you do not agree, please do not use our service.' },
              { title: '2. Products & Pricing', body: 'All prices are in Nigerian Naira (₦). We reserve the right to change prices at any time. Product images are for illustrative purposes.' },
              { title: '3. Orders & Payment', body: 'All orders are subject to availability and confirmation. Payment is processed securely through Paystack — we accept debit/credit cards, bank transfer, and USSD.' },
              { title: '4. Delivery', body: 'Delivery times vary by location. We are not responsible for delays by third-party carriers. Risk transfers to you upon delivery.' },
              { title: '5. Returns & Refunds', body: 'Products may be returned within 7 days of delivery if defective or not as described. Items must be in original packaging. Contact us to initiate a return.' },
              { title: '6. Warranty', body: 'Most products carry a 1-year manufacturer warranty. Terms vary by brand and product category.' },
              { title: '7. Contact', body: 'Questions? Email info@agubrothers.com or visit 33 Ogui Road, Enugu, Nigeria.' },
            ].map(s => (
              <section key={s.title}>
                <h2 className="text-base font-bold mb-1">{s.title}</h2>
                <p className="text-[#565959]">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
