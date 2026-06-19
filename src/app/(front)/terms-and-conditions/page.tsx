import { Metadata } from 'next'
import Link from 'next/link'
import { staticPageMetadata } from '@/lib/seo'

export const metadata: Metadata = staticPageMetadata({
  title: 'Terms of Use | Agu Brothers Electronics',
  description:
    'Read the Terms of Use for Agu Brothers Electronics — the conditions that govern your use of our website and services.',
  path: '/terms-and-conditions',
})

const SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    body: [
      'By accessing or using the Agu Brothers Electronics website (agubrothers.com) and related services, you agree to be bound by these Terms of Use ("Terms"). Please read them carefully before using the site.',
      'If you do not agree to these Terms, you must not access or use our website or services. We reserve the right to update these Terms at any time. Continued use of the site after changes constitutes acceptance of the revised Terms.',
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    body: [
      'You must be at least 18 years of age to place an order or create an account on our platform. By using this website, you warrant that you are at least 18 years old and legally capable of entering into a binding contract under Nigerian law.',
      'We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion if we believe a user is acting in violation of these Terms.',
    ],
  },
  {
    id: 'account',
    title: '3. Account Registration',
    body: [
      'To place orders you may be required to create an account. You agree to provide accurate, current, and complete information during registration and to keep your account details up to date.',
      'You are responsible for maintaining the confidentiality of your password and for all activity that occurs under your account. You must notify us immediately of any unauthorised use of your account at info@agubrothers.com.',
      'We reserve the right to terminate accounts that are found to be in breach of these Terms, used fraudulently, or inactive for an extended period.',
    ],
  },
  {
    id: 'products',
    title: '4. Products, Pricing & Availability',
    body: [
      'All prices are displayed in Nigerian Naira (₦) and are inclusive of applicable VAT unless otherwise stated. Prices are subject to change without prior notice.',
      'Product images are for illustrative purposes only. Actual products may vary slightly in appearance from images shown. We make every effort to ensure accurate descriptions but do not warrant that product descriptions are free of errors.',
      'All orders are subject to product availability. If an item is out of stock after your order is placed, we will notify you promptly and offer a full refund or an alternative product.',
    ],
  },
  {
    id: 'orders',
    title: '5. Orders & Contract Formation',
    body: [
      'Placing an item in your cart or completing the checkout process does not constitute a binding contract. A contract is formed only when we send you an order confirmation email.',
      'We reserve the right to cancel any order, before or after confirmation, if we detect fraud, pricing errors, stock shortages, or other issues. In such cases, a full refund will be issued promptly.',
      'Once an order is confirmed and processing has begun, changes may not be possible. Contact us as soon as possible at info@agubrothers.com if you need to amend an order.',
    ],
  },
  {
    id: 'payment',
    title: '6. Payment',
    body: [
      'We accept payment via debit card, credit card, bank transfer, and USSD through our secure payment processor, Paystack. Cash on delivery may be available for select locations.',
      'You agree that all payment information provided is accurate and that you are authorised to use the payment method submitted. We do not store card details on our servers — all transactions are processed securely by Paystack.',
      'In the event of a failed payment, your order will not be processed. If payment is debited but the order is not confirmed, please contact us within 24 hours and we will investigate promptly.',
    ],
  },
  {
    id: 'delivery',
    title: '7. Shipping & Delivery',
    body: [
      'We deliver to major cities and states across Nigeria. Estimated delivery times and shipping rates are available on our Shipping Rates page.',
      'Delivery timelines are estimates only and may be affected by circumstances beyond our control, including logistics partner delays, public holidays, or natural events. We are not liable for delays caused by third-party carriers.',
      'Risk of loss and title for products purchased from Agu Brothers pass to you upon delivery. You are responsible for inspecting items upon receipt and reporting any damage immediately — do not sign for visibly damaged goods.',
    ],
  },
  {
    id: 'returns',
    title: '8. Returns, Exchanges & Refunds',
    body: [
      'We accept returns within 7 days of delivery for items that are defective, damaged in transit, or significantly not as described. Items must be returned in their original packaging with all accessories, manuals, and documentation.',
      'The following items are non-returnable unless defective: items that have been installed, used, or physically damaged by the customer; consumable products; and items sold as "open box" or "clearance".',
      'To initiate a return, contact us at info@agubrothers.com with your order number and photographs of the issue. Approved returns will be refunded to your original payment method within 5–10 business days of us receiving the returned item.',
      'We reserve the right to decline a return if the item does not meet our return conditions.',
    ],
  },
  {
    id: 'warranty',
    title: '9. Product Warranty',
    body: [
      'Most products carry a manufacturer\'s warranty, typically 1 year from the date of purchase. Warranty terms vary by brand and product category — please refer to the warranty card included with your product.',
      'Our warranty covers manufacturing defects under normal use. It does not cover damage caused by misuse, accidents, power surges, unauthorised repairs, or failure to follow the manufacturer\'s instructions.',
      'For warranty claims, contact us at info@agubrothers.com or visit our store at 33 Ogui Road, Enugu with your proof of purchase.',
    ],
  },
  {
    id: 'ip',
    title: '10. Intellectual Property',
    body: [
      'All content on this website — including text, images, logos, product descriptions, graphics, and software — is the property of Agu Brothers Electronics or its content suppliers and is protected by Nigerian and international copyright law.',
      'You may not reproduce, distribute, modify, transmit, or publish any content from this site without our prior written permission. You may print or download content for personal, non-commercial use only.',
    ],
  },
  {
    id: 'conduct',
    title: '11. Prohibited Conduct',
    body: [
      'You agree not to: (a) use the site for any unlawful purpose; (b) attempt to gain unauthorised access to any part of the site or our systems; (c) post or transmit harmful, fraudulent, or misleading content; (d) use automated tools (bots, scrapers) to extract data without our consent; (e) impersonate any person or entity; or (f) interfere with the proper working of the website.',
    ],
  },
  {
    id: 'disclaimer',
    title: '12. Disclaimer of Warranties',
    body: [
      'This website and all content are provided "as is" and "as available" without warranty of any kind, either express or implied. We do not warrant that the site will be uninterrupted, error-free, or free of viruses or other harmful components.',
      'To the fullest extent permitted by applicable law, we disclaim all warranties, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.',
    ],
  },
  {
    id: 'liability',
    title: '13. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, Agu Brothers Electronics shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of, or inability to use, the website or our services.',
      'Our total liability to you for any claim arising from or related to these Terms or your use of the site shall not exceed the amount you paid for the product or service giving rise to the claim.',
    ],
  },
  {
    id: 'privacy',
    title: '14. Privacy',
    body: [
      'Your privacy is important to us. Our collection and use of your personal data is governed by our Privacy Notice, which forms part of these Terms. By using our website, you consent to the data practices described in our Privacy Notice.',
    ],
  },
  {
    id: 'law',
    title: '15. Governing Law & Disputes',
    body: [
      'These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising out of or relating to these Terms shall be resolved first by good-faith negotiation, and if unresolved, submitted to the courts of Enugu State, Nigeria.',
    ],
  },
  {
    id: 'changes',
    title: '16. Changes to These Terms',
    body: [
      'We may update these Terms at any time. When we do, we will revise the "Last updated" date below. We encourage you to review these Terms periodically. Material changes will be notified via email or a prominent notice on the site.',
    ],
  },
  {
    id: 'contact',
    title: '17. Contact',
    body: [
      'If you have questions about these Terms, please contact us: Agu Brothers Electronics, 33 Ogui Road, Enugu State, Nigeria. Email: info@agubrothers.com | Phone: +234 909 923 4242.',
    ],
  },
]

export default function TermsAndConditions() {
  return (
    <div className="bg-[#EAEDED] min-h-screen py-6 px-4">
      <div className="max-w-[960px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Conditions of Use</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 items-start">
          {/* Table of contents — sticky sidebar */}
          <nav className="hidden lg:block bg-white rounded-sm shadow-sm p-4 sticky top-4">
            <p className="font-bold text-sm text-[#0F1111] mb-3 pb-2 border-b border-[#D5D9D9]">Contents</p>
            <ul className="space-y-1.5">
              {SECTIONS.map(s => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-xs text-[#007185] hover:underline hover:text-[#CC0C39] block leading-snug">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content */}
          <div className="lg:col-span-3 bg-white rounded-sm shadow-sm p-8">
            <h1 className="text-3xl font-bold text-[#0F1111] mb-2">Conditions of Use</h1>
            <p className="text-sm text-[#565959] mb-6 pb-4 border-b border-[#D5D9D9]">
              Last updated: June 2025
            </p>

            <div className="space-y-8 text-sm text-[#0F1111]">
              {SECTIONS.map(s => (
                <section key={s.id} id={s.id} className="scroll-mt-4">
                  <h2 className="text-base font-bold mb-3 pb-1 border-b border-[#F0F0F0]">{s.title}</h2>
                  {s.body.map((para, i) => (
                    <p key={i} className="text-[#565959] leading-relaxed mb-2 last:mb-0">{para}</p>
                  ))}
                </section>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-[#D5D9D9] flex flex-wrap gap-4 text-xs text-[#565959]">
              <Link href="/privacy-policy" className="text-[#007185] hover:underline">Privacy Notice</Link>
              <Link href="/shipping-rates" className="text-[#007185] hover:underline">Shipping Rates</Link>
              <Link href="/contact-us" className="text-[#007185] hover:underline">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
