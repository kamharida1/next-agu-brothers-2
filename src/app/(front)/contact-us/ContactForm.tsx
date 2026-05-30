'use client'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import toast from 'react-hot-toast'
import { Contact } from '@/lib/models/ContactModel'
import Link from 'next/link'

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', read: false })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const { trigger: createContact, isMutating: isCreating } = useSWRMutation('/api/contact',
    async (url, { arg }) => {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(arg) })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)
      toast.success('Message sent!')
      setIsSubmitted(true)
    }
  )

  if (isSubmitted) return (
    <div className="bg-[#F0FFF0] border border-[#007600] rounded-sm p-6 text-center">
      <div className="text-5xl mb-3">✉️</div>
      <h2 className="text-xl font-bold text-[#007600] mb-2">Message sent!</h2>
      <p className="text-[#565959] text-sm">Thank you for contacting us. We&apos;ll get back to you within 24 hours.</p>
      <Link href="/" className="btn-amazon px-6 py-2 rounded-md text-sm inline-block mt-4">Continue Shopping</Link>
    </div>
  )

  return (
    <form onSubmit={(e) => { e.preventDefault(); createContact(formData as any) }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="name">Your name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
            required placeholder="John Doe" className="amazon-input" />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="phone">Phone number</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
            placeholder="+234 800 000 0000" className="amazon-input" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="email">Email address</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
          required placeholder="you@example.com" className="amazon-input" />
      </div>
      <div>
        <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="message">How can we help?</label>
        <textarea id="message" name="message" value={formData.message} onChange={handleChange}
          required rows={5} placeholder="Tell us about your question or concern..."
          className="amazon-input resize-none" />
      </div>
      <button type="submit" disabled={isCreating}
        className="btn-amazon px-8 py-2.5 rounded-md text-sm flex items-center gap-2">
        {isCreating && <span className="loading loading-spinner loading-xs"></span>}
        Send message
      </button>
    </form>
  )
}

export default ContactForm
