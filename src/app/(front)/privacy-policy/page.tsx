// File: pages/privacy-policy.js

import { Metadata } from 'next'
import Link from 'next/link'
import { FaTheaterMasks } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Privacy Policy | Agu Brothers',
  description: 'Privacy Policy for Agu Brothers.',
  openGraph: {
    title: 'Privacy Policy | Agu Brothers',
    description: 'Privacy Policy for Agu Brothers.',
    type: 'website',
  }
}

const PrivacyPolicy = () => {
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
            <FaTheaterMasks className="w-4 h-4 mr-2 stroke-current" />
            Privacy Policy
          </li>
        </ul>
      </div>
      <div className="container mx-auto p-6 prose">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="">
          This Privacy Policy describes how Agu Brothers (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares your
          personal information when you visit or make a purchase from our
          website.
        </p>
        <ol className="list-decimal ml-6 mt-4 space-y-4 text-base">
          <li>
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <p>
              We collect various types of information in connection with the
              services we provide, including:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Personal Information:</strong> Information such as your
                name, email address, phone number, and payment information.
              </li>
              <li>
                <strong>Device Information:</strong> Information about your
                device, including IP address, web browser, and operating system.
              </li>
              <li>
                <strong>Usage Information:</strong> Information about how you
                interact with our website, including pages visited and links
                clicked.
              </li>
            </ul>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">
              How We Use Your Information
            </h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                To process and fulfill your orders, including sending emails to
                confirm your order, and shipping products to you.
              </li>
              <li>
                To communicate with you, respond to your inquiries, and provide
                customer support.
              </li>
              <li>
                To improve our website and services by analyzing how users
                interact with our site.
              </li>
              <li>
                To send you promotional materials, including updates on our
                products and special offers, if you have opted in to receive
                such communications.
              </li>
            </ul>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Sharing Your Information</h2>
            <p>
              We may share your personal information with third parties to help
              us use your information as described above. For example:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                We use third-party service providers to assist with payment
                processing, shipping, and marketing.
              </li>
              <li>
                We may share your information to comply with applicable laws and
                regulations, to respond to a subpoena, search warrant, or other
                lawful request for information we receive, or to otherwise
                protect our rights.
              </li>
            </ul>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information
              from unauthorized access, use, or disclosure. However, no internet
              or email transmission is ever fully secure or error-free. Please
              take special care in deciding what information you send to us via
              email.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal
              information. If you wish to exercise these rights, please contact
              us using the contact information provided below.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect
              changes to our practices or for other operational, legal, or
              regulatory reasons. We will notify you of any changes by posting
              the new policy on our website.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or
              our data practices, please contact us at:
            </p>
            <p>Agu Brothers</p>
            <p>33 Ogui Road</p>
            <p>Enugu, Enugu State, 400221</p>
            <p>agubiggest@gmail.com</p>
            <p>09099234242</p>
          </li>
        </ol>
      </div>
    </>
  )
}

export default PrivacyPolicy
