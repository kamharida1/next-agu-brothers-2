import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping Rates & Delivery | Agu Brothers Electronics',
  description: 'View Agu Brothers shipping rates, estimated delivery times, and delivery policies across Nigeria.',
}

const ZONES = [
  { zone: 'Enugu State', time: '1–2 business days', fee: 'FREE on orders ₦50,000+  |  ₦1,500 below' },
  { zone: 'South East (Anambra, Imo, Abia, Ebonyi)', time: '2–3 business days', fee: '₦3,000 – ₦5,000' },
  { zone: 'South South (Rivers, Delta, Edo, Cross River, Bayelsa, Akwa Ibom)', time: '3–5 business days', fee: '₦5,000 – ₦8,000' },
  { zone: 'Lagos & South West (Oyo, Ogun, Osun, Ondo, Ekiti)', time: '3–5 business days', fee: '₦6,000 – ₦9,000' },
  { zone: 'Abuja (FCT)', time: '2–4 business days', fee: '₦5,000 – ₦7,000' },
  { zone: 'North Central (Kogi, Benue, Plateau, Kwara, Niger, Nasarawa)', time: '4–6 business days', fee: '₦6,000 – ₦10,000' },
  { zone: 'North West & North East', time: '5–7 business days', fee: '₦8,000 – ₦15,000' },
]

const LARGE_ITEMS = [
  'Refrigerators, washing machines, and generators require specialist delivery vehicles.',
  'Large-item delivery is booked separately — our logistics team will call to schedule a convenient time.',
  'Same-day delivery is available within Enugu metropolis for orders placed before 12:00 PM on business days.',
  'Free installation is offered on select products in Enugu State — check individual product pages for eligibility.',
]

const POLICIES = [
  {
    title: 'Order Processing',
    desc: 'Orders are processed within 24 hours on business days (Monday–Friday). Orders placed on weekends or public holidays are processed the next business day.',
  },
  {
    title: 'Order Tracking',
    desc: 'Once your order is dispatched you will receive a tracking reference via SMS and email. You can also view your live order status in the "Your Orders" section of your account.',
  },
  {
    title: 'Failed Delivery',
    desc: 'If delivery is attempted and you are unavailable, our courier will retry the next business day. After two failed attempts, the item is returned to our warehouse and we will contact you to reschedule.',
  },
  {
    title: 'Damaged in Transit',
    desc: 'If your item arrives visibly damaged, do not sign for it — refuse the delivery and contact us immediately on +234 909 923 4242. We will arrange a replacement or full refund at no extra cost.',
  },
  {
    title: 'Wrong Item Delivered',
    desc: 'If you receive an item that is different from what you ordered, contact us within 48 hours with your order number and a photo. We will arrange collection and redelivery of the correct item.',
  },
  {
    title: 'Restricted Locations',
    desc: 'We currently do not deliver to P.O. boxes, military addresses, or certain rural locations not served by our logistics partners. If your address is outside our coverage, we will notify you at checkout.',
  },
]

const FAQS = [
  { q: 'Can I change my delivery address after placing an order?', a: 'Yes, but only if the order has not yet been dispatched. Contact us at info@agubrothers.com or +234 909 923 4242 as soon as possible.' },
  { q: 'Do you deliver on weekends?', a: 'Deliveries within Enugu State may be arranged on Saturdays. Inter-state deliveries operate Monday–Friday only.' },
  { q: 'Can someone else receive my delivery?', a: 'Yes. Any adult at the delivery address can sign for the package. Please inform them in advance and ensure someone is available.' },
  { q: 'What happens if my item arrives late?', a: 'While we aim to meet our estimated delivery windows, delays can occur. If your order is significantly late, contact us and we will investigate with our logistics partner.' },
]

export default function ShippingRatesPage() {
  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Shipping Rates &amp; Delivery</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Shipping Rates &amp; Delivery</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl">
            We deliver electronics and home appliances across Nigeria. View rates, estimated delivery times, and our delivery policies below.
          </p>
        </div>

        {/* Zone table */}
        <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Delivery Zones &amp; Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#F7F8F8] border-b-2 border-[#D5D9D9]">
                  <th className="text-left py-3 px-4 font-bold text-[#0F1111]">Delivery Zone</th>
                  <th className="text-left py-3 px-4 font-bold text-[#0F1111]">Est. Delivery Time</th>
                  <th className="text-left py-3 px-4 font-bold text-[#0F1111]">Shipping Fee</th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((z, i) => (
                  <tr key={z.zone} className={`border-b border-[#D5D9D9] ${i % 2 !== 0 ? 'bg-[#F7F8F8]' : ''}`}>
                    <td className="py-3 px-4 font-semibold text-[#0F1111]">{z.zone}</td>
                    <td className="py-3 px-4 text-[#565959]">{z.time}</td>
                    <td className="py-3 px-4 text-[#007600] font-semibold">{z.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#565959] mt-3">
            * Fees are estimates. Final shipping cost is calculated at checkout based on product weight, dimensions, and exact delivery address.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Large items */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Large &amp; Bulky Items</h2>
              <ul className="space-y-2">
                {LARGE_ITEMS.map(n => (
                  <li key={n} className="flex gap-2 text-sm text-[#565959]">
                    <span className="text-[#FF9900] font-bold flex-shrink-0 mt-0.5">•</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery policies */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Delivery Policies</h2>
              <div className="space-y-4">
                {POLICIES.map(p => (
                  <div key={p.title} className="border-b border-[#D5D9D9] pb-4 last:border-0 last:pb-0">
                    <h3 className="font-bold text-sm text-[#0F1111] mb-1">{p.title}</h3>
                    <p className="text-sm text-[#565959] leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Delivery FAQs</h2>
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

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-[#007600]">
              <h3 className="font-bold text-[#0F1111] mb-2">Free Delivery</h3>
              <p className="text-sm text-[#565959]">
                Orders above <span className="font-bold text-[#007600]">₦50,000</span> delivered within Enugu State ship free.
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Delivery Support</h3>
              <div className="space-y-1.5 text-sm text-[#565959] mb-4">
                <p>📞 +234 909 923 4242</p>
                <p>✉️ info@agubrothers.com</p>
                <p className="text-xs">Mon–Sat, 8:00 AM – 6:00 PM</p>
              </div>
              <Link href="/contact-us" className="btn-amazon w-full py-2 rounded-sm text-sm text-center block font-bold">
                Contact Us
              </Link>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Track Your Order</h3>
              <p className="text-sm text-[#565959] mb-3">
                Sign in to your account to view live order status and delivery updates.
              </p>
              <Link href="/order-history" className="btn-amazon w-full py-2 rounded-sm text-sm text-center block font-bold">
                Your Orders
              </Link>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-4">
              <p className="text-sm font-bold text-[#0F1111] mb-3">Related</p>
              <ul className="space-y-2 text-sm">
                {[
                  { href: '/terms-and-conditions', label: 'Returns & Refunds Policy' },
                  { href: '/contact-us',           label: 'Report a Delivery Issue' },
                  { href: '/all-products',          label: 'Continue Shopping' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[#007185] hover:underline hover:text-[#CC0C39]">
                      › {l.label}
                    </Link>
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
