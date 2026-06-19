import { Metadata } from 'next'
import Link from 'next/link'
import { staticPageMetadata } from '@/lib/seo'

export const metadata: Metadata = staticPageMetadata({
  title: 'Agu Brothers Credit | Buy Now, Pay Later',
  description:
    'Shop premium electronics and appliances today and pay in convenient instalments with Agu Brothers Credit.',
  path: '/credit',
})

const PLANS = [
  { title: '3-Month Plan', deposit: '30%', duration: '3 months', note: '0% interest for orders above ₦200,000', highlight: false },
  { title: '6-Month Plan', deposit: '20%', duration: '6 months', note: 'Small monthly admin fee applies', highlight: true },
  { title: '12-Month Plan', deposit: '15%', duration: '12 months', note: 'Available on select premium products', highlight: false },
]

const ELIGIBILITY = [
  'Valid government-issued ID (NIN, Driver\'s Licence, or International Passport)',
  'Nigerian bank account (minimum 6 months active)',
  'Proof of regular income or employment letter',
  'Minimum purchase amount of ₦100,000',
  'No outstanding defaults on previous credit orders',
]

const HOW_TO_APPLY = [
  { step: '1', title: 'Choose Your Product', desc: 'Add the item to your cart and select "Pay with Agu Brothers Credit" at checkout.' },
  { step: '2', title: 'Select a Plan', desc: 'Pick the instalment plan that suits your budget — 3, 6, or 12 months.' },
  { step: '3', title: 'Submit Documents', desc: 'Upload your ID and income proof via the secure portal. Approval takes 1–2 business days.' },
  { step: '4', title: 'Pay Your Deposit & Collect', desc: 'Once approved, pay the initial deposit and your order is confirmed. Delivery proceeds as normal.' },
]

const FAQS = [
  { q: 'What happens if I miss a payment?', a: 'A reminder is sent 3 days before your due date. Missing a payment attracts a late fee of 2% of the overdue amount. Consistent defaults may affect future credit eligibility.' },
  { q: 'Can I pay off my balance early?', a: 'Yes. You can settle your remaining balance at any time with no early repayment penalty.' },
  { q: 'Is my product covered under warranty during the credit period?', a: 'Yes. All standard manufacturer warranties apply from the date of delivery, regardless of payment status.' },
  { q: 'How are monthly payments collected?', a: 'Payments are collected via direct debit from your registered bank account on a fixed date each month.' },
]

export default function CreditPage() {
  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Agu Brothers Credit</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Agu Brothers Credit</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mb-2">
            Get the appliances you need today and spread the cost over time. Simple, transparent, and flexible.
          </p>
          <p className="text-[#FF9900] text-sm font-semibold">Buy Now. Pay in Instalments. No Hidden Charges.</p>
        </div>

        {/* Instalment Plans */}
        <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Instalment Plans</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {PLANS.map(p => (
              <div
                key={p.title}
                className={`p-5 rounded-sm border-2 ${p.highlight ? 'border-[#FF9900] bg-[#FFFBF2]' : 'border-[#D5D9D9] bg-[#F7F8F8]'}`}
              >
                {p.highlight && (
                  <span className="inline-block text-xs bg-[#FF9900] text-[#0F1111] font-bold px-2 py-0.5 rounded-sm mb-2">Most Popular</span>
                )}
                <h3 className="font-bold text-[#0F1111] text-base mb-3">{p.title}</h3>
                <div className="space-y-1.5 text-sm">
                  <p className="text-[#565959]">Initial deposit: <span className="font-bold text-[#0F1111]">{p.deposit}</span></p>
                  <p className="text-[#565959]">Duration: <span className="font-bold text-[#0F1111]">{p.duration}</span></p>
                  <p className="text-xs text-[#007600] mt-2">{p.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">

            {/* How to apply */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">How to Apply</h2>
              <div className="space-y-4">
                {HOW_TO_APPLY.map(s => (
                  <div key={s.step} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#FF9900] text-[#0F1111] font-bold text-sm flex items-center justify-center">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0F1111] mb-1">{s.title}</h3>
                      <p className="text-sm text-[#565959] leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQS.map(f => (
                  <div key={f.q} className="border-b border-[#D5D9D9] pb-4 last:border-0 last:pb-0">
                    <h3 className="font-bold text-sm text-[#0F1111] mb-1">{f.q}</h3>
                    <p className="text-sm text-[#565959] leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Eligibility Criteria</h3>
              <ul className="space-y-2 text-sm text-[#565959]">
                {ELIGIBILITY.map(e => (
                  <li key={e} className="flex gap-2">
                    <span className="text-[#FF9900] font-bold flex-shrink-0 mt-0.5">✓</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Have Questions?</h3>
              <p className="text-sm text-[#565959] mb-3">Our credit team is ready to help you find the right plan.</p>
              <div className="space-y-1.5 text-sm text-[#565959] mb-4">
                <p>📞 09099234242</p>
                <p>✉️ credit@agubrothers.com</p>
              </div>
              <Link href="/contact-us" className="btn-amazon w-full py-2.5 rounded-sm text-sm text-center block font-bold">
                Contact Credit Team
              </Link>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { href: '/all-products', label: 'Browse Products' },
                  { href: '/payment-methods', label: 'Payment Methods' },
                  { href: '/shipping-rates', label: 'Shipping Rates' },
                  { href: '/contact-us', label: 'Get Help' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[#007185] hover:underline hover:text-[#CC0C39]">› {l.label}</Link>
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
