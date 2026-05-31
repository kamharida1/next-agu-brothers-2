import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sell on Agu Brothers | Partner With Us',
  description: 'Grow your business by selling your electronics and home appliances on Agu Brothers. Reach thousands of customers across Nigeria.',
}

const STEPS = [
  { step: '1', title: 'Register as a Seller', desc: 'Create a seller account on Agu Brothers. Provide your business name, CAC registration number, contact details, and bank account information for payouts.' },
  { step: '2', title: 'List Your Products', desc: 'Upload your product catalogue — photos, descriptions, pricing, and stock levels. Our team reviews listings within 24–48 hours to ensure quality standards.' },
  { step: '3', title: 'Receive Orders', desc: 'When a customer places an order for your product, you get notified instantly via email and SMS. Prepare the item for pickup or drop-off at our fulfilment centre.' },
  { step: '4', title: 'Get Paid', desc: 'Payouts are processed every Monday and Thursday directly into your registered bank account, minus our small commission fee.' },
]

const BENEFITS = [
  { icon: '🛒', title: 'Reach More Customers', desc: 'Access our growing base of thousands of verified shoppers across Nigeria without spending on your own marketing.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'All transactions are processed through Paystack. You receive confirmed payment before dispatching any order.' },
  { icon: '📦', title: 'Fulfilment Support', desc: 'Use our logistics partners for fast and reliable delivery, or handle your own shipping — the choice is yours.' },
  { icon: '📊', title: 'Seller Dashboard', desc: 'Track your orders, revenue, and inventory in real time through your seller portal.' },
  { icon: '🤝', title: 'Dedicated Support', desc: 'Our seller success team is available to help you set up, optimise your listings, and resolve issues quickly.' },
  { icon: '💸', title: 'Low Commission', desc: 'We charge a competitive commission only when you make a sale. No listing fees, no monthly charges.' },
]

const CATEGORIES = [
  'Televisions & Displays', 'Refrigerators & Freezers', 'Air Conditioners',
  'Generators & Inverters', 'Washing Machines', 'Gas Cookers & Ovens',
  'Microwaves', 'Home Audio & Theatre', 'Small Appliances',
]

export default function SellOnAguBrothers() {
  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Sell on Agu Brothers</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Sell on Agu Brothers</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mb-6">
            Reach thousands of buyers across Nigeria. List your electronics and home appliances on Nigeria&apos;s trusted store.
          </p>
          <Link
            href="/contact-us"
            className="inline-block bg-[#FF9900] hover:bg-[#FA8900] text-[#0F1111] font-bold py-3 px-8 rounded-sm text-sm transition-colors"
          >
            Get Started — Contact Us
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">

            {/* How it works */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">How It Works</h2>
              <div className="space-y-4">
                {STEPS.map(s => (
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

            {/* Benefits */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Why Sell With Us?</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {BENEFITS.map(b => (
                  <div key={b.title} className="flex gap-3 p-3 bg-[#F7F8F8] rounded-sm border border-[#D5D9D9]">
                    <span className="text-2xl flex-shrink-0">{b.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-[#0F1111] mb-1">{b.title}</h3>
                      <p className="text-xs text-[#565959] leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accepted categories */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Accepted Product Categories</h2>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <span key={c} className="text-xs px-3 py-1.5 bg-[#F7F8F8] border border-[#D5D9D9] rounded-sm text-[#0F1111]">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Ready to Start?</h3>
              <p className="text-sm text-[#565959] mb-4">
                Contact our partnerships team and we will guide you through onboarding.
              </p>
              <Link href="/contact-us" className="btn-amazon w-full py-2.5 rounded-sm text-sm text-center block font-bold">
                Contact Partnerships Team
              </Link>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Requirements</h3>
              <ul className="space-y-2 text-sm text-[#565959]">
                {[
                  'Valid business registration (CAC)',
                  'Nigerian bank account',
                  'Product quality certificate where applicable',
                  'Minimum 5 product listings to start',
                ].map(r => (
                  <li key={r} className="flex gap-2">
                    <span className="text-[#FF9900] font-bold flex-shrink-0">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Contact</h3>
              <div className="space-y-1.5 text-sm text-[#565959]">
                <p>📞 09099234242</p>
                <p>✉️ sell@agubrothers.com</p>
                <p>📍 33 Ogui Road, Enugu, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
