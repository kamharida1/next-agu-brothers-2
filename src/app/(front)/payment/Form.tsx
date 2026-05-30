'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useCartService from '@/lib/hooks/useCartStore'
import { CheckoutSteps } from '@/components/CheckoutSteps'

const METHODS = [
  {
    id: 'Paystack',
    icon: '💳',
    title: 'Pay Online',
    desc: 'Visa, Mastercard, Bank Transfer, USSD — powered by Paystack',
    badge: 'Recommended',
  },
  {
    id: 'Cash On Delivery',
    icon: '🚚',
    title: 'Cash on Delivery',
    desc: 'Pay in cash when your order arrives at your door',
    badge: null,
  },
]

const Form = () => {
  const router = useRouter()
  const { savePaymentMethod, paymentMethod, shippingAddress } = useCartService()
  const [selected, setSelected] = useState('')

  useEffect(() => {
    if (!shippingAddress.address) return router.push('/shipping')
    setSelected(paymentMethod || 'Paystack')
  }, [paymentMethod, router, shippingAddress.address])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    savePaymentMethod(selected)
    router.push('/place-order')
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <CheckoutSteps current={2} />
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white border border-[#D5D9D9] rounded-sm shadow-sm p-6">
          <h1 className="text-2xl font-medium text-[#0F1111] mb-1">Payment method</h1>
          <p className="text-sm text-[#565959] mb-6">All transactions are secured and encrypted.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex items-start gap-4 p-4 border-2 rounded-sm cursor-pointer transition-colors ${
                  selected === m.id
                    ? 'border-[#FF9900] bg-[#FFFBF2]'
                    : 'border-[#D5D9D9] hover:border-[#A0A0A0]'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.id}
                  checked={selected === m.id}
                  onChange={() => setSelected(m.id)}
                  className="mt-0.5 accent-[#FF9900] w-4 h-4"
                />
                <span className="text-2xl flex-shrink-0">{m.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#0F1111]">{m.title}</span>
                    {m.badge && (
                      <span className="text-[10px] bg-[#FF9900] text-white px-1.5 py-0.5 rounded-sm font-bold">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#565959] mt-0.5">{m.desc}</p>
                </div>
              </label>
            ))}

            {/* Paystack security note */}
            {selected === 'Paystack' && (
              <div className="flex items-center gap-2 bg-[#F0FFF0] border border-[#007600] rounded-sm p-3 text-xs text-[#007600]">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
                </svg>
                Your card details are encrypted and processed securely by Paystack. We never see your card number.
              </div>
            )}

            <div className="pt-3 space-y-2">
              <button type="submit" className="btn-amazon w-full py-3 rounded-md text-sm font-medium">
                Continue to review order
              </button>
              <button type="button" onClick={() => router.back()}
                className="btn-amazon-outline w-full py-2.5 rounded-md text-sm">
                Return to shipping
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Form
