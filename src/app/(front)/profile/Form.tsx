'use client'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Link from 'next/link'

type Inputs = { name: string; email: string; password: string; confirmPassword: string }

const Form = () => {
  const { data: session, update } = useSession()

  const { register, handleSubmit, getValues, setValue, formState: { errors, isSubmitting } } =
    useForm<Inputs>({ defaultValues: { name: '', email: '', password: '' } })

  useEffect(() => {
    if (session?.user) {
      setValue('name', session.user.name!)
      setValue('email', session.user.email!)
    }
  }, [session, setValue])

  const formSubmit: SubmitHandler<Inputs> = async ({ name, email, password }) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (res.status === 200) {
        toast.success('Profile updated successfully')
        await update({ ...session, user: { ...session?.user, name, email } })
      } else {
        const data = await res.json()
        toast.error(data.message || 'Update failed')
      }
    } catch (err: any) {
      toast.error(err.message || 'Update failed')
    }
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen py-8 px-4">
      <div className="max-w-[1000px] mx-auto">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <Link href="/profile" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Your Account</Link>
          <span className="mx-1">›</span>
          <span>Login & Security</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#232F3E] text-white px-4 py-3">
                <p className="text-sm font-bold">Your Account</p>
              </div>
              <ul className="divide-y divide-[#D5D9D9]">
                {[
                  { href: '/profile',        label: 'Login & Security', active: true },
                  { href: '/order-history',  label: 'Your Orders' },
                  { href: '/wishlist',       label: 'Your Wish List' },
                  { href: '/shipping',       label: 'Your Addresses' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className={`block px-4 py-3 text-sm hover:bg-[#F7F8F8] transition-colors ${l.active ? 'text-[#0F1111] font-semibold bg-[#F7F8F8]' : 'text-[#007185]'}`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 bg-white rounded-sm shadow-sm p-6">
            <h1 className="text-3xl font-medium text-[#0F1111] pb-4 border-b border-[#D5D9D9] mb-5">
              Login &amp; Security
            </h1>

            <form onSubmit={handleSubmit(formSubmit)} className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="name">Your name</label>
                <input type="text" id="name" {...register('name', { required: 'Name is required' })} className="amazon-input" />
                {errors.name && <p className="text-[#CC0C39] text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="email">Email address</label>
                <input type="email" id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Invalid email' },
                  })} className="amazon-input" />
                {errors.email && <p className="text-[#CC0C39] text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="border-t border-[#D5D9D9] pt-4">
                <p className="text-sm font-bold text-[#0F1111] mb-3">Change Password (optional)</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="password">New password</label>
                    <input type="password" id="password" placeholder="Leave blank to keep current"
                      {...register('password', { minLength: { value: 6, message: 'At least 6 characters' } })}
                      className="amazon-input" />
                    {errors.password && <p className="text-[#CC0C39] text-xs mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="confirmPassword">Re-enter new password</label>
                    <input type="password" id="confirmPassword"
                      {...register('confirmPassword', {
                        validate: (v) => !getValues('password') || getValues('password') === v || 'Passwords must match',
                      })} className="amazon-input" />
                    {errors.confirmPassword && <p className="text-[#CC0C39] text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting}
                className="btn-amazon px-8 py-2.5 rounded-md text-sm flex items-center gap-2">
                {isSubmitting && <span className="loading loading-spinner loading-xs"></span>}
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Form
