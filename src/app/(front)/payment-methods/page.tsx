import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Payment Methods | Agu Brothers',
  description: 'Learn about the secure payment options available at Agu Brothers — card, bank transfer, USSD, and instalment plans.',
}

const METHODS = [
  {
    icon: '💳',
    title: 'Debit / Credit Card',
    desc: 'Pay securely with Visa, Mastercard, or Verve. Card details are never stored on our servers — all transactions are processed by Paystack\'s PCI-DSS Level 1 compliant gateway.',
    badge: 'Instant',
  },
  {
    icon: '🏦',
    title: 'Bank Transfer',
    desc: 'Transfer directly from your bank app or internet banking. A unique virtual account number is generated for each order. Payment is confirmed automatically once received.',
    badge: 'Up to 30 mins',
  },
  {
    icon: '📱',
    title: 'USSD',
    desc: 'No internet? No problem. Dial *737# (GTBank), *894# (Access), *966# (Zenith), or your bank\'s USSD code to complete payment from any phone.',
    badge: 'Instant',
  },
  {
    icon: '📲',
    title: 'Mobile Money',
    desc: 'Pay using Opay, PalmPay, or other Paystack-supported mobile wallets. Select "Mobile Money" at checkout.',
    badge: 'Instant',
  },
  {
    icon: '🛍️',
    title: 'Agu Brothers Credit',
    desc: 'Spread the cost over 3, 6, or 12 months. Flexible instalment plans with low initial deposits. Subject to eligibility.',
    badge: 'Flexible',
    link: '/credit',
  },
]

const SECURITY = [
  { title: 'PCI-DSS Compliant', desc: 'All card transactions are processed through Paystack, which is PCI-DSS Level 1 certified — the highest standard for card security.' },
  { title: '3D Secure (3DS)', desc: 'Every card transaction requires OTP verification from your bank, adding an extra layer of fraud protection.' },
  { title: 'SSL Encryption', desc: 'Our entire website runs on HTTPS with 256-bit SSL encryption. Your data is always protected in transit.' },
  { title: 'No Stored Card Data', desc: 'We never store your card number or CVV. Paystack\'s tokenisation system handles recurring or saved payments safely.' },
]

export default function PaymentMethodsPage() {
  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Payment Methods</span>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-r from-[#131921] to-[#232F3E] text-white rounded-sm p-8 md:p-12 mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment Methods</h1>
          <p className="text-[#CCCCCC] text-lg max-w-2xl">
            Multiple secure ways to pay — choose what works best for you. All payments are protected by Paystack.
          </p>
        </div>

        {/* Payment options */}
        <div className="bg-white rounded-sm shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Accepted Payment Methods</h2>
          <div className="space-y-3">
            {METHODS.map(m => (
              <div key={m.title} className="flex gap-4 p-4 bg-[#F7F8F8] rounded-sm border border-[#D5D9D9] hover:border-[#FF9900] transition-colors">
                <span className="text-3xl flex-shrink-0">{m.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm text-[#0F1111]">{m.title}</h3>
                    <span className="text-xs bg-[#E7F5E8] text-[#007600] border border-[#007600] px-2 py-0.5 rounded-sm font-semibold">{m.badge}</span>
                  </div>
                  <p className="text-sm text-[#565959] leading-relaxed">{m.desc}</p>
                  {m.link && (
                    <Link href={m.link} className="text-xs text-[#007185] hover:underline mt-1 inline-block">
                      Learn more about Agu Brothers Credit →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* Security */}
            <div className="bg-white rounded-sm shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">Your Payment Security</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {SECURITY.map(s => (
                  <div key={s.title} className="p-4 bg-[#F7F8F8] rounded-sm border border-[#D5D9D9]">
                    <h3 className="font-bold text-sm text-[#0F1111] mb-1">{s.title}</h3>
                    <p className="text-xs text-[#565959] leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5 text-center">
              <div className="text-4xl mb-2">🔒</div>
              <h3 className="font-bold text-[#0F1111] mb-2">Secured by Paystack</h3>
              <p className="text-xs text-[#565959]">Paystack is licensed by the Central Bank of Nigeria (CBN) and trusted by over 200,000 businesses.</p>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Payment Issues?</h3>
              <p className="text-sm text-[#565959] mb-3">If your payment failed or was debited but not confirmed, contact us immediately.</p>
              <div className="space-y-1.5 text-sm text-[#565959] mb-4">
                <p>📞 09099234242</p>
                <p>✉️ payments@agubrothers.com</p>
              </div>
              <Link href="/contact-us" className="btn-amazon w-full py-2.5 rounded-sm text-sm text-center block font-bold">
                Get Payment Help
              </Link>
            </div>

            <div className="bg-white rounded-sm shadow-sm p-5">
              <h3 className="font-bold text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Related</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { href: '/credit', label: 'Agu Brothers Credit' },
                  { href: '/order-history', label: 'View Your Orders' },
                  { href: '/terms-and-conditions', label: 'Refund Policy' },
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
