import { Metadata } from 'next'
import Link from 'next/link'
import { staticPageMetadata } from '@/lib/seo'

export const metadata: Metadata = staticPageMetadata({
  title: 'Privacy Notice | Agu Brothers Electronics',
  description:
    'Learn how Agu Brothers Electronics collects, uses, and protects your personal data in compliance with the Nigeria Data Protection Regulation (NDPR).',
  path: '/privacy-policy',
})

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction',
    body: [
      'Agu Brothers Electronics ("we", "us", "our") is committed to protecting and respecting your privacy. This Privacy Notice explains how we collect, use, store, and share your personal information when you visit our website (agubrothers.com), create an account, or make a purchase from us.',
      'We process your data in accordance with the Nigeria Data Protection Regulation (NDPR) 2019, the Nigeria Data Protection Act (NDPA) 2023, and other applicable Nigerian data protection laws.',
    ],
  },
  {
    id: 'controller',
    title: '2. Data Controller',
    body: [
      'The data controller responsible for your personal information is:',
      'Agu Brothers Electronics, 33 Ogui Road, Enugu State, Nigeria. Email: info@agubrothers.com | Phone: +234 909 923 4242.',
      'If you have any questions about how we handle your data, please contact us using the details above.',
    ],
  },
  {
    id: 'collect',
    title: '3. Information We Collect',
    body: [
      'We collect the following categories of personal information:',
      'Identity & Contact Data: Your name, email address, phone number, and delivery address, which you provide when creating an account or placing an order.',
      'Transaction Data: Details about purchases you make, including order history, payment method (type only — we do not store card numbers), and billing information.',
      'Technical Data: IP address, browser type, device information, pages visited, and session duration, collected automatically when you use our website.',
      'Communications Data: Records of any correspondence between you and us, including customer service emails and contact form submissions.',
      'Marketing Preferences: Your preferences regarding receiving marketing communications from us.',
    ],
  },
  {
    id: 'how-collect',
    title: '4. How We Collect Your Information',
    body: [
      'Directly from you: When you register an account, place an order, fill in a contact form, subscribe to our newsletter, or communicate with us.',
      'Automatically: Through cookies and similar technologies when you browse our website. See Section 8 for more on cookies.',
      'From third parties: We may receive limited data from our payment processor (Paystack) to confirm transaction status, and from social login providers if you choose to sign in using a social account.',
    ],
  },
  {
    id: 'use',
    title: '5. How We Use Your Information',
    body: [
      'We use your personal information for the following purposes:',
      '• To process and fulfil your orders, including sending order confirmations, invoices, and delivery updates.',
      '• To manage your account and provide customer support.',
      '• To process payments and prevent fraudulent transactions.',
      '• To send you transactional communications related to your orders.',
      '• To send you marketing emails and promotional offers where you have consented to receive them.',
      '• To improve our website, products, and services through analytics.',
      '• To comply with legal obligations, including tax and accounting requirements.',
      '• To detect and prevent fraud, abuse, or other harmful activities.',
    ],
  },
  {
    id: 'legal-basis',
    title: '6. Legal Basis for Processing',
    body: [
      'Under the NDPR and NDPA, we rely on the following lawful bases for processing your personal data:',
      'Contract performance: Processing necessary to fulfil your orders and provide the services you have requested.',
      'Legitimate interests: Analytics, fraud prevention, and improving our website and services, provided these do not override your rights.',
      'Legal obligation: Where we are required to process your data to comply with Nigerian law.',
      'Consent: For marketing communications and non-essential cookies. You may withdraw your consent at any time.',
    ],
  },
  {
    id: 'sharing',
    title: '7. Sharing Your Information',
    body: [
      'We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.',
      'We may share your data with the following categories of recipients only as necessary to provide our services:',
      '• Payment processors (Paystack): To securely process your payments. Paystack is PCI-DSS compliant.',
      '• Delivery and logistics partners: To arrange delivery of your orders. Only your name, address, and contact number are shared.',
      '• IT and cloud service providers: Who host our website and databases under strict data processing agreements.',
      '• Professional advisers: Including lawyers, accountants, and auditors where legally required.',
      '• Law enforcement or regulatory authorities: Where required by law, court order, or to protect our legal rights.',
      'All third parties are required to respect the security of your data and to treat it in accordance with applicable law.',
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies & Tracking Technologies',
    body: [
      'Our website uses cookies — small text files placed on your device — to improve your browsing experience and to help us understand how visitors use our site.',
      'Essential cookies: Required for the website to function (e.g. maintaining your session and shopping cart). These cannot be disabled.',
      'Analytics cookies: Help us understand how visitors interact with our site (e.g. pages visited, time spent). We use this data in aggregate and anonymised form.',
      'Marketing cookies: Used to show you relevant advertisements. These are only set with your consent.',
      'You can manage your cookie preferences in your browser settings at any time. Note that disabling certain cookies may affect the functionality of our website.',
    ],
  },
  {
    id: 'retention',
    title: '9. Data Retention',
    body: [
      'We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including satisfying any legal, accounting, or reporting requirements.',
      'Account data is retained for as long as your account is active and for a period of 3 years thereafter, in case of disputes or warranty claims.',
      'Transaction records are retained for 7 years in compliance with Nigerian financial and tax regulations.',
      'Marketing data (email preferences) is retained until you withdraw consent or unsubscribe.',
      'When data is no longer needed, we securely delete or anonymise it.',
    ],
  },
  {
    id: 'rights',
    title: '10. Your Rights',
    body: [
      'Under the NDPR and NDPA, you have the following rights regarding your personal data:',
      '• Right of Access: You may request a copy of the personal data we hold about you.',
      '• Right to Rectification: You may ask us to correct any inaccurate or incomplete data.',
      '• Right to Erasure: You may request deletion of your personal data where there is no legitimate reason for us to continue processing it.',
      '• Right to Restriction: You may ask us to temporarily restrict processing of your data while a concern is being resolved.',
      '• Right to Data Portability: You may request a copy of your data in a structured, machine-readable format.',
      '• Right to Object: You may object to processing based on legitimate interests or for direct marketing.',
      '• Right to Withdraw Consent: Where processing is based on consent, you may withdraw it at any time.',
      'To exercise any of these rights, email us at info@agubrothers.com. We will respond within 30 days. You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).',
    ],
  },
  {
    id: 'security',
    title: '11. Data Security',
    body: [
      'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, alteration, or disclosure.',
      'Measures include: SSL/TLS encryption for data in transit; secure password hashing; restricted access to personal data on a need-to-know basis; regular security assessments.',
      'All payment transactions are handled by Paystack, which maintains PCI-DSS Level 1 compliance — the highest level of security certification for payment processors.',
      'While we take security seriously, no method of transmission over the internet is completely secure. If you believe your account has been compromised, please contact us immediately.',
    ],
  },
  {
    id: 'children',
    title: '12. Children\'s Privacy',
    body: [
      'Our website is not directed at children under the age of 18. We do not knowingly collect personal data from anyone under 18 years of age. If we become aware that we have inadvertently collected data from a child, we will delete it promptly.',
      'If you are a parent or guardian and believe your child has provided us with personal information, please contact us at info@agubrothers.com.',
    ],
  },
  {
    id: 'third-party',
    title: '13. Third-Party Links',
    body: [
      'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to read the privacy notices of any third-party sites you visit.',
    ],
  },
  {
    id: 'changes',
    title: '14. Changes to This Notice',
    body: [
      'We may update this Privacy Notice periodically to reflect changes in our practices or applicable law. When we do, we will revise the "Last updated" date. Material changes will be communicated via email or a prominent notice on our website.',
      'We encourage you to review this notice regularly.',
    ],
  },
  {
    id: 'contact',
    title: '15. Contact & Complaints',
    body: [
      'For any privacy-related queries, to exercise your rights, or to raise a concern, please contact us: Agu Brothers Electronics, 33 Ogui Road, Enugu State, Nigeria. Email: info@agubrothers.com | Phone: +234 909 923 4242.',
      'If you are not satisfied with our response, you have the right to complain to the Nigeria Data Protection Commission (NDPC) at ndpc.gov.ng.',
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#EAEDED] min-h-screen py-6 px-4">
      <div className="max-w-[960px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Privacy Notice</span>
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
            <div className="mt-4 pt-3 border-t border-[#D5D9D9]">
              <p className="text-xs text-[#565959] leading-snug">
                Compliant with the <span className="font-semibold">NDPR 2019</span> and <span className="font-semibold">NDPA 2023</span>.
              </p>
            </div>
          </nav>

          {/* Main content */}
          <div className="lg:col-span-3 bg-white rounded-sm shadow-sm p-8">
            <h1 className="text-3xl font-bold text-[#0F1111] mb-2">Privacy Notice</h1>
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
              <Link href="/terms-and-conditions" className="text-[#007185] hover:underline">Conditions of Use</Link>
              <Link href="/shipping-rates" className="text-[#007185] hover:underline">Shipping Rates</Link>
              <Link href="/contact-us" className="text-[#007185] hover:underline">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
