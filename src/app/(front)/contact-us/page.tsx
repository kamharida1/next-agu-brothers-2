// File: pages/contact.js

import Head from 'next/head'
import Link from 'next/link'
import { IoIosInformation } from 'react-icons/io'
import ContactForm from './ContactForm'

const Contact = () => {
  return (
    <>
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={'/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <IoIosInformation className="w-4 h-4 mr-2 stroke-current" />
            Contact Us
          </li>
        </ul>
      </div>
      <Head>
        <title>Contact Us | Agu Brothers</title>
        <meta
          name="description"
          content="Contact Agu Brothers for any inquiries or support."
        />
      </Head>
      <div className="container mx-auto p-6 prose">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {/* Dropdown FAQ 1 */}
            <details className="collapse collapse-arrow bg-base-200 rounded-box">
              <summary className="collapse-title text-lg font-medium">
                What is your return policy?
              </summary>
              <div className="collapse-content">
                <p>
                  We accept returns within 30 days of purchase. The product must
                  be in its original condition.
                </p>
              </div>
            </details>
            {/* Dropdown FAQ 2 */}
            <details className="collapse collapse-arrow bg-base-200 rounded-box">
              <summary className="collapse-title text-lg font-medium">
                How can I track my order?
              </summary>
              <div className="collapse-content">
                <p>
                  Once your order has shipped, you will receive an email with
                  tracking information.
                </p>
              </div>
            </details>
            {/* Dropdown FAQ 3 */}
            <details className="collapse collapse-arrow bg-base-200 rounded-box">
              <summary className="collapse-title text-lg font-medium">
                Do you offer nationwide shipping?
              </summary>
              <div className="collapse-content">
                <p>
                  Yes, we offer nationwide shipping to select states across the
                  country. Shipping fees and delivery times vary based on
                  location.
                </p>
              </div>
            </details>
            {/* Dropdown FAQ 4 */}
            <details className="collapse collapse-arrow bg-base-200 rounded-box">
              <summary className="collapse-title text-lg font-medium">
                What payment methods do you accept?
              </summary>
              <div className="collapse-content">
                <p>
                  We accept major debit cards, Moniepoint, and bank transfers
                  for online purchases.
                </p>
              </div>
            </details>
            {/* Dropdown FAQ 5 */}
            <details className="collapse collapse-arrow bg-base-200 rounded-box">
              <summary className="collapse-title text-lg font-medium">
                Can I change my order after it&apos;s been placed?
              </summary>
              <div className="collapse-content">
                <p>
                  You can modify your order within 24 hours of placing it. After
                  that, changes are not guaranteed due to processing times.
                </p>
              </div>
            </details>
            {/* Dropdown FAQ 6 */}
            <details className="collapse collapse-arrow bg-base-200 rounded-box">
              <summary className="collapse-title text-lg font-medium">
                How do I contact customer support?
              </summary>
              <div className="collapse-content">
                <p>
                  You can contact our customer support team via email at
                  support@agubrothers.com or by phone at +234 909 993 4242.
                </p>
              </div>
            </details>
          </div>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Address Details */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Our Address</h2>
          <div className="bg-base-200 p-4 rounded-box">
            <p>Agu Brothers,</p>
            <p>33 Ogui Road,</p>
            <p>Enugu, Nigeria.</p>
            <p>Email: info@agubrothers.com</p>
            <p>WhatsApp: +234 909 993 4242</p>
            <p>Phone: +234 906 087 7648</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
