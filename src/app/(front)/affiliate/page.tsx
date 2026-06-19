import { Metadata } from 'next'
import Link from 'next/link'
import { staticPageMetadata } from '@/lib/seo'

export const metadata: Metadata = staticPageMetadata({
  title: 'Affiliate Programme | Agu Brothers Electronics',
  description:
    'Earn commissions by promoting Agu Brothers products. Join our affiliate programme and get paid for every sale you refer.',
  path: '/affiliate',
})

const HOW_IT_WORKS = [
  { step: '1', title: 'Apply & Get Approved', desc: 'Fill out our affiliate application. Our team reviews your profile within 2–3 business days and sets up your unique referral link.' },
  { step: '2', title: 'Share Your Link', desc: 'Promote Agu Brothers products on your website, blog, YouTube channel, WhatsApp groups, or social media using your personalised referral link.' },
  { step: '3', title: 'Earn Commission', desc: 'Every time someone clicks your link and completes a purchase, you earn a commission of up to 5% of the order value — credited to your affiliate account.' },
  { step: '4', title: 'Get Paid Monthly', desc: 'Commissions accumulate throughout the month and are paid out via bank transfer on the first working day of the following month.' },
]

const COMMISSION_TIERS = [
  { category: 'Televisions', rate: '3%' },
  { category: 'Refrigerators & Freezers', rate: '3%' },
  { category: 'Air Conditioners', rate: '4%' },
  { category: 'Generators & Inverters', rate: '4%' },
  { category: 'Washing Machines', rate: '3%' },
  { category: 'Gas Cookers & Ovens', rate: '5%' },
  { category: 'Small Appliances', rate: '5%' },
]

const TOOLS = [
  { icon: '🔗', title: 'Unique Referral Links', desc: 'Deep-link to any product page with your affiliate ID automatically appended.' },
  { icon: '📊', title: 'Real-time Dashboard', desc: 'Track clicks, conversions, and earnings in your affiliate portal 24/7.' },
  { icon: '🖼️', title: 'Marketing Banners', desc: 'Download branded banners and creatives for your website or blog.' },
  { icon: '📱', title: 'Product Feed', desc: 'Access an up-to-date product feed with prices and stock availability.' },
]

export default function AffiliatePage() {
  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Become an Affiliate</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Become an Agu Brothers Affiliate</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl mb-6">
            Recommend products you love and earn commission on every successful sale — completely free to join.
          </p>
          <Link
            href="/contact-us"
            className="inline-block bg-[#FF9900] hover:bg-[#FA8900] text-[#0F1111] font-bold py-3 px-8 rounded-sm text-sm transition-colors"
          >
            Apply Now
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">

            {/* How it works */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">How It Works</h2>
              <div className="space-y-4">
                {HOW_IT_WORKS.map(s => (
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

            {/* Commission table */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Commission Rates by Category</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#D5D9D9]">
                      <th className="text-left py-2 text-[#0F1111] font-bold">Product Category</th>
                      <th className="text-right py-2 text-[#0F1111] font-bold">Commission Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMMISSION_TIERS.map((t, i) => (
                      <tr key={t.category} className={`border-b border-[#D5D9D9] ${i % 2 === 0 ? 'bg-[#F7F8F8]' : ''}`}>
                        <td className="py-2.5 text-[#565959]">{t.category}</td>
                        <td className="py-2.5 text-right font-bold text-[#007185]">{t.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#565959] mt-3">Commission is calculated on the final order value excluding delivery fees and taxes.</p>
            </div>

            {/* Tools */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Tools We Provide</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {TOOLS.map(t => (
                  <div key={t.title} className="flex gap-3 p-3 bg-[#F7F8F8] rounded-sm border border-[#D5D9D9]">
                    <span className="text-2xl flex-shrink-0">{t.icon}</span>
                    <div>
                      <h3 className="font-bold text-sm text-[#0F1111] mb-1">{t.title}</h3>
                      <p className="text-xs text-[#565959] leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Earnings at a Glance</h3>
              <div className="space-y-2 text-sm text-[#565959]">
                <p>Refer a ₦500,000 generator → <span className="font-bold text-[#007600]">earn ₦20,000</span></p>
                <p>Refer a ₦200,000 TV → <span className="font-bold text-[#007600]">earn ₦6,000</span></p>
                <p>Refer a ₦150,000 AC → <span className="font-bold text-[#007600]">earn ₦6,000</span></p>
              </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Who Can Apply?</h3>
              <ul className="space-y-2 text-sm text-[#565959]">
                {[
                  'Bloggers & content creators',
                  'Social media influencers',
                  'YouTube channels (tech/home)',
                  'Comparison & review websites',
                  'WhatsApp community admins',
                ].map(r => (
                  <li key={r} className="flex gap-2">
                    <span className="text-[#FF9900] font-bold flex-shrink-0">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Apply Today</h3>
              <p className="text-sm text-[#565959] mb-4">Free to join. No monthly fees. Earn on every sale.</p>
              <Link href="/contact-us" className="btn-amazon w-full py-2.5 rounded-sm text-sm text-center block font-bold">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
