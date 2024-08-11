// File: pages/contact.js

import ContactForm from '@/components/ContactForm'
import Head from 'next/head'

const Contact = () => {
  return (
    <>
      <Head>
        <title>Contact Us | Agu Brothers</title>
        <meta
          name="description"
          content="Contact Agu Brothers for any inquiries or support."
        />
      </Head>
      <div className="container mx-auto p-6 prose">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <ContactForm />
      </div>
    </>
  )
}

export default Contact
