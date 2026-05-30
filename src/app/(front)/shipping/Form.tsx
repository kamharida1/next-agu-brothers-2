'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import useCartService from '@/lib/hooks/useCartStore'
import { CheckoutSteps } from '@/components/CheckoutSteps'
import { ShippingAddress } from '@/lib/models/OrderModel'
import { shippingRates } from '@/lib/shipping'
import { useSession } from 'next-auth/react'

const Form = () => {
  const router = useRouter()
  const { saveShippingAddress, shippingAddress } = useCartService()
  const { data: session } = useSession()

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<ShippingAddress>({
      defaultValues: { fullName: '', address: '', email: '', city: '', postalCode: '', country: '', phone: '' }
    })

  useEffect(() => {
    if (session?.user.email) setValue('email', session.user.email)
    if (session?.user.name) setValue('fullName', shippingAddress.fullName || session.user.name)
    setValue('address',    shippingAddress.address    || '')
    setValue('city',       shippingAddress.city       || '')
    setValue('postalCode', shippingAddress.postalCode || '')
    setValue('country',    shippingAddress.country    || 'Nigeria')
    setValue('phone',      shippingAddress.phone      || '')
  }, [setValue, session, shippingAddress])

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form)
    router.push('/payment')
  }

  const Field = ({ id, label, type = 'text', placeholder, rules }: {
    id: keyof ShippingAddress; label: string; type?: string; placeholder?: string; rules?: object
  }) => (
    <div>
      <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor={id}>{label}</label>
      <input type={type} id={id} placeholder={placeholder}
        {...register(id, rules)}
        className="amazon-input" />
      {(errors as any)[id] && (
        <p className="text-[#CC0C39] text-xs mt-1">{(errors as any)[id]?.message}</p>
      )}
    </div>
  )

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <CheckoutSteps current={1} />
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#D5D9D9] rounded-sm shadow-sm p-6">
          <h1 className="text-2xl font-medium text-[#0F1111] mb-5 pb-3 border-b border-[#D5D9D9]">
            Enter a delivery address
          </h1>

          <form onSubmit={handleSubmit(formSubmit)} className="space-y-4">
            <Field id="fullName" label="Full name (First and Last name)"
              placeholder="John Doe" rules={{ required: 'Enter your name' }} />
            <Field id="phone" label="Mobile number"
              placeholder="+234 800 000 0000" rules={{ required: 'Enter your phone number' }} />
            <Field id="address" label="Address"
              placeholder="Street address or P.O. Box" rules={{ required: 'Enter your address' }} />
            <Field id="email" label="Email address" type="email"
              placeholder="you@example.com"
              rules={{
                required: 'Enter your email',
                pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: 'Invalid email' }
              }} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="city">City</label>
                <select id="city" {...register('city', { required: 'Select your city' })}
                  className="amazon-input">
                  <option value="">Select city</option>
                  {Object.keys(shippingRates).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-[#CC0C39] text-xs mt-1">{errors.city.message}</p>}
              </div>
              <Field id="postalCode" label="Postal code" placeholder="100001"
                rules={{ required: 'Enter postal code' }} />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0F1111] mb-1" htmlFor="country">Country</label>
              <input id="country" {...register('country', { required: true })}
                readOnly className="amazon-input bg-[#F7F8F8] cursor-not-allowed" />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="btn-amazon w-full py-3 rounded-md text-sm flex items-center justify-center gap-2 mt-2">
              {isSubmitting && <span className="loading loading-spinner loading-xs"></span>}
              Use this address
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Form
