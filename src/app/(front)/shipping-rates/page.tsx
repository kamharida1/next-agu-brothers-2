import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping Rates & Delivery | Agu Brothers',
  description: 'View Agu Brothers shipping rates, estimated delivery times, and delivery zones across Nigeria.',
}

const ZONES = [
  { zone: 'Enugu State', time: '1–2 business days', fee: 'FREE on orders above ₦50,000 | ₦1,500 below' },
  { zone: 'South East (Anambra, Imo, Abia, Ebonyi)', time: '2–3 business days', fee: '₦3,000 – ₦5,000' },
  { zone: 'South South (Rivers, Cross River, Delta, Edo, Bayelsa, Akwa Ibom)', time: '3–5 business days', fee: '₦5,000 – ₦8,000' },
  { zone: 'Lagos & South West (Oyo, Ogun, Osun, Ondo, Ekiti)', time: '3–5 business days', fee: '₦6,000 – ₦9,000' },
  { zone: 'Abuja (FCT)', time: '2–4 business days', fee: '₦5,000 – ₦7,000' },
  { zone: 'North Central (Kogi, Benue, Plateau, Kwara, Niger, Nasarawa)', time: '4–6 business days', fee: '₦6,000 – ₦10,000' },
  { zone: 'North West & North East', time: '5–7 business days', fee: '₦8,000 – ₦15,000' },
]

const LARGE_ITEM_NOTE = [
  'Refrigerators, washing machines, and generators require specialist delivery vehicles.',
  'Large-item delivery is booked separately and our logistics team will contact you to schedule.',
  'Same-day delivery is available within Enugu metropolis for orders placed before 12:00 PM.',
  'Free installation is offered on select products in Enugu State — check the product page for eligibility.',
]

const POLICIES = [
  { title: 'Order Processing', desc: 'Orders are processed within 24 hours on business days (Monday–Friday). Orders placed on weekends or public holidays are processed the next business day.' },
  { title: 'Tracking Your Order', desc: 'Once your order is dispatched you will receive a tracking number via SMS and email. You can also view your order status in the Your Orders section of your account.' },
  { title: 'Failed Delivery', desc: 'If delivery is attempted and you are unavailable, our courier will try again the next business day. After two failed attempts, the item is returned to our warehouse and you will be contacted to reschedule.' },
  { title: 'Damaged in Transit', desc: 'If your item arrives damaged, please do not sign for it and contact us immediately on 09099234242. We will arrange a replacement or full refund.' },
]

export default function ShippingRatesPage() {
  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Shipping Rates</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Shipping Rates & Delivery</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl">
            We deliver electronics and home appliances across Nigeria. View rates and estimated delivery times for your region.
          </p>
        </div>

        {/* Zone table */}
        <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Delivery Zones & Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-[#D5D9D9] bg-[#F7F8F8]">
                  <th className="text-left py-3 px-3 text-[#0F1111] font-bold">Delivery Zone</th>
                  <th className="text-left py-3 px-3 text-[#0F1111] font-bold">Est. Delivery Time</th>
                  <th className="text-left py-3 px-3 text-[#0F1111] font-bold">Shipping Fee</th>
                </tr>
              </thead>
              <tbody>
                {ZONES.map((z, i) => (
                  <tr key={z.zone} className={`border-b border-[#D5D9D9] ${i % 2 === 0 ? '' : 'bg-[#F7F8F8]'}`}>
                    <td className="py-3 px-3 font-semibold text-[#0F1111]">{z.zone}</td>
                    <td className="py-3 px-3 text-[#565959]">{z.time}</td>
                    <td className="py-3 px-3 text-[#007600] font-semibold">{z.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#565959] mt-3">
            Fees are estimates and may vary based on product weight, dimensions, and exact delivery address. Final shipping cost is shown at checkout.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">

            {/* Large item note */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Large & Bulky Items</h2>
              <ul className="space-y-2">
                {LARGE_ITEM_NOTE.map(n => (
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
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5 border-l-4 border-[#FF9900]">
              <h3 className="font-bold text-[#0F1111] mb-2">Free Delivery</h3>
              <p className="text-sm text-[#565959]">
                Orders above <span className="font-bold text-[#007600]">₦50,000</span> within Enugu State qualify for free delivery.
              </p>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Need Help?</h3>
              <div className="space-y-1.5 text-sm text-[#565959] mb-4">
                <p>📞 09099234242</p>
                <p>✉️ delivery@agubrothers.com</p>
                <p className="text-xs">Mon–Sat, 8:00 AM – 6:00 PM</p>
              </div>
              <Link href="/contact-us" className="btn-amazon w-full py-2.5 rounded-sm text-sm text-center block font-bold">
                Contact Us
              </Link>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Related Links</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { href: '/order-history', label: 'Track Your Order' },
                  { href: '/terms-and-conditions', label: 'Returns & Refunds' },
                  { href: '/contact-us', label: 'Report a Delivery Issue' },
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
