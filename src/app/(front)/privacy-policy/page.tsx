import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Privacy Notice | Agu Brothers' }

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#EAEDED] min-h-screen py-6 px-4">
      <div className="max-w-[900px] mx-auto">
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Privacy Notice</span>
        </div>
        <div className="bg-white rounded-sm shadow-sm p-8">
          <h1 className="text-3xl font-bold text-[#0F1111] mb-2">Privacy Notice</h1>
          <p className="text-sm text-[#565959] mb-6 pb-4 border-b border-[#D5D9D9]">Last updated: January 2024</p>
          <div className="prose max-w-none text-[#0F1111] prose-headings:text-[#0F1111] prose-a:text-[#007185] text-sm leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold">1. Information We Collect</h2>
              <p>We collect information you provide when creating an account, placing orders, or contacting us. This includes your name, email address, phone number, delivery address, and payment information (processed securely through Paystack).</p>
            </section>
            <section>
              <h2 className="text-lg font-bold">2. How We Use Your Information</h2>
              <p>We use your information to process orders, send order confirmations and updates, provide customer support, improve our services, and send you relevant promotions (with your consent).</p>
            </section>
            <section>
              <h2 className="text-lg font-bold">3. Information Sharing</h2>
              <p>We do not sell your personal information. We share data only with trusted partners necessary to operate our service, including payment processors (Paystack) and delivery partners, under strict confidentiality agreements.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data. All payment transactions are encrypted using SSL technology and processed by Paystack.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information. Contact us at <a href="mailto:info@agubrothers.com" className="text-[#007185] hover:underline">info@agubrothers.com</a> to exercise these rights.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold">6. Contact Us</h2>
              <p>For privacy concerns, contact: Agu Brothers Electronics, 33 Ogui Road, Enugu State, Nigeria. Email: info@agubrothers.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
