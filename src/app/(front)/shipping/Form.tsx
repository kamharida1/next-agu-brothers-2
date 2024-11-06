'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler, ValidationRule } from 'react-hook-form'
import useCartService from '@/lib/hooks/useCartStore'
import { CheckoutSteps } from '@/components/CheckoutSteps'
import { ShippingAddress } from '@/lib/models/OrderModel'
import { shippingRates } from '@/lib/shipping'
import { useSession } from 'next-auth/react'

const Form = () => {
  const router = useRouter()
  const { saveShippingAddress, shippingAddress } = useCartService()
  const {data: session} = useSession()
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      email: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
    },
  })

 
  useEffect(() => {
    // Populate form fields with session and stored address data only on mount
    if (session?.user.email) {
      setValue('email', session.user.email)
    }
    setValue('fullName', shippingAddress.fullName || '')
    setValue('address', shippingAddress.address || '')
    setValue('city', shippingAddress.city || '')
    setValue('postalCode', shippingAddress.postalCode || '')
    setValue('country', shippingAddress.country || 'Nigeria')
    setValue('phone', shippingAddress.phone || '')
  }, [setValue, session, shippingAddress])

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form)
    router.push('/payment')
  }

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof ShippingAddress
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => (
    <div className="mb-2">
      <label className="label" htmlFor={id}>
        {name}
      </label>
      <input
        type="text"
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
          pattern,
        })}
        className="input input-bordered w-full max-w-sm"
      />
      {errors[id]?.message && (
        <div className="text-error">{errors[id]?.message}</div>
      )}
    </div>
  )

  const CitySelect = ({
    id,
    name,
    required,
  }: {
    id: keyof ShippingAddress
    name: string
    required?: boolean
  }) => (
    <div className="mb-2">
      <label className="label" htmlFor={id}>
        {name}
      </label>
      <select
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
        })}
        className="input input-bordered w-full max-w-sm"
      >
        <option value="">Select a city</option>
        {Object.keys(shippingRates).map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {errors[id]?.message && (
        <div className="text-error">{errors[id]?.message}</div>
      )}
    </div>
  )

  return (
    <div>
      <CheckoutSteps current={1} />

      <div className="max-w-sm mx-auto card bg-base-300 my-4">
        <div className="card-body">
          <h1 className="card-title">Shipping Address</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <FormInput name="Full Name" id="fullName" required />
            <FormInput name="Address" id="address" required />
            {/* <FormInput name="City" id="city" required /> */}
            <CitySelect name="City" id="city" required />
            <FormInput name="Phone" id="phone" required />
            <FormInput name="Postal Code" id="postalCode" required />
            <FormInput name="Country" id="country" required />
            <FormInput
              name="Email"
              id="email"
              required
              pattern={{
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
              }}
            />
            <div className="my-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Form
