// File: pages/terms-and-conditions.js

import { Metadata } from 'next'
import Link from 'next/link'
import { MdOutlinePolicy } from 'react-icons/md'

export const metadata: Metadata = {
  title: 'Terms and Conditions | Agu Brothers',
  description: 'Terms and Conditions for Agu Brothers.',
  openGraph: {
    title: 'Terms and Conditions | Agu Brothers',
    description: 'Terms and Conditions for Agu Brothers.',
    type: 'website',
  }
}

const TermsAndConditions = () => {
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
            <MdOutlinePolicy className="w-4 h-4 mr-2 stroke-current" />
            Terms and Conditions
          </li>
        </ul>
      </div>
      <div className="container mx-auto p-6 prose">
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
        <p>
          These Terms and Conditions (&quot;Terms&quot;) govern your use of the
          website and services provided by Agu Brothers (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;). By accessing or using our website
          and services, you agree to be bound by these Terms. If you do not
          agree to these Terms, please do not use our website or services.
        </p>
        <ol className="list-decimal ml-6 mt-4 space-y-4 text-base">
          <li>
            <h2 className="text-2xl font-semibold">Definitions</h2>
            <p>
              &quot;Customer&quot;: Any person or entity purchasing or intending
              to purchase products from us.
            </p>
            <p>
              &quot;Products&quot;: Electronic devices and accessories offered
              for sale by us.
            </p>
            <p>
              &quot;Services&quot;: Any service provided by us, including but
              not limited to repair, maintenance, and customer support.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Eligibility</h2>
            <p>
              To purchase products or use our services, you must be at least 18
              years old and have the legal capacity to enter into binding
              contracts. By using our website, you represent and warrant that
              you meet these requirements.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Orders and Payments</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <h3 className="text-xl font-semibold">Order Placement</h3>
                <p>
                  Orders can be placed through our website, in-store, or via
                  telephone. All orders are subject to acceptance and
                  availability.
                </p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Pricing</h3>
                <p>
                  All prices are quoted in Nigerian Naira (NGN) and include
                  applicable taxes unless otherwise stated. We reserve the right
                  to change prices at any time without prior notice.
                </p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Payment</h3>
                <p>
                  Payment for products and services can be made using various
                  payment methods, including credit/debit cards, bank transfers,
                  and mobile payments. All payments must be received in full
                  before the dispatch of products or the provision of services.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Delivery and Shipping</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <h3 className="text-xl font-semibold">Delivery</h3>
                <p>
                  We offer delivery services within Nigeria. Delivery times and
                  charges may vary depending on the location and the nature of
                  the order.
                </p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Shipping</h3>
                <p>
                  We aim to dispatch orders within 3 business days. However,
                  delivery times may be affected by factors beyond our control.
                  We are not responsible for delays caused by third-party
                  carriers.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Returns and Refunds</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <h3 className="text-xl font-semibold">Returns</h3>
                <p>
                  Products can be returned within 7 days of receipt, provided
                  they are in their original condition and packaging. The
                  customer is responsible for return shipping costs unless the
                  product is defective.
                </p>
              </li>
              <li>
                <h3 className="text-xl font-semibold">Refunds</h3>
                <p>
                  Refunds will be processed within 2 business days after
                  receiving the returned product. Refunds will be made using the
                  original payment method.
                </p>
              </li>
            </ol>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Warranties</h2>
            <p>
              All products are covered by a 12-month warranty from the date of
              purchase. The warranty covers defects in materials and workmanship
              but does not cover damage caused by misuse, accidents, or
              unauthorized repairs.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we shall not be liable for
              any indirect, incidental, special, or consequential damages
              arising out of or in connection with your use of our products or
              services.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, and
              images, is our property or the property of our licensors and is
              protected by intellectual property laws.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Privacy Policy</h2>
            <p>
              Your use of our website and services is also governed by our
              Privacy Policy, which can be found{' '}
              <span>
                <Link href="/privacy-policy" passHref>
                  here
                </Link>
              </span>
              .
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">
              Governing Law and Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of
              Nigeria. Any disputes arising from these Terms shall be resolved
              through arbitration in Nigeria, in accordance with the Arbitration
              and Conciliation Act.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Changes to These Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Any
              changes will be effective immediately upon posting on our website.
              Your continued use of our website and services constitutes your
              acceptance of the revised Terms.
            </p>
          </li>
          <li>
            <h2 className="text-2xl font-semibold">Contact Information</h2>
            <p>
              If you have any questions or concerns about these Terms, please
              contact us at:
            </p>
            <p>Agu Brothers</p>
            <p>33 Ogui Road</p>
            <p>Enugu, Enugu State, 400221</p>
            <p>agubiggest@gmail.com</p>
            <p>09099234242</p>
          </li>
        </ol>
        <p className="mt-4 text-lg">
          Thank you for choosing Agu Brothers. We look forward to serving you!
        </p>
      </div>
    </>
  )
}

export default TermsAndConditions
