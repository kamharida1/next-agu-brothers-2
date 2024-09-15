'use client'
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { Contact } from '@/lib/models/ContactModel'


const ContactForm = () => {
  const { data: session } = useSession()
  // user's email
  const email = session?.user?.email as string

  const [formData, setFormData] = useState({
    name: '',
    email,
    message: '',
    phone: '',
    read: false,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const { trigger: createContact, isMutating: isCreating } = useSWRMutation(
    `/api/contact`,
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json() 
      if (!res.ok) return toast.error(data.message)
      
      toast.success('Message has been sent!')
      setIsSubmitted(true)
    }
  )

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    // Simulating form submission
    const contactData: Contact = {
      ...formData,
    }
    await createContact(contactData as any)
    // await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return (
    <div className="container mx-auto p-6 prose">
      {isSubmitted ? (
        <p className="text-lg text-green-500  p-2">
          Thank you for your message! We will get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="name">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="phone">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="message">
              <span className="label-text">Message</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
          </div>
          <button
            type="submit"
              className={`btn btn-primary ${isCreating ? 'loading' : ''}`}
            >
              Submit
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm
