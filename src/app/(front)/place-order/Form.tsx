'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { trackPurchase } from '@/lib/analytics'
import useCartService from '@/lib/hooks/useCartStore'
import { CheckoutSteps } from '@/components/CheckoutSteps'
import Link from 'next/link'
import CldImage from '@/components/CldImage'
import toast from 'react-hot-toast'
import Price from '@/components/products/Price'
import { formatPriceAmount } from '@/lib/utils'
import { PaystackButton } from 'react-paystack'
import { useSession } from 'next-auth/react'

const Form = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const {
    paymentMethod, shippingAddress, items,
    itemsPrice, taxPrice, shippingPrice, totalPrice, clear,
  } = useCartService()

  const [mounted, setMounted] = useState(false)
  const [isPlacing, setIsPlacing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted || isPlacing || orderComplete) return
    if (!paymentMethod) router.push('/payment')
    else if (items.length === 0) router.push('/')
  }, [mounted, paymentMethod, items.length, router, isPlacing, orderComplete])

  // ── Cash on Delivery ──────────────────────────────────────────
  const placeCODOrder = async () => {
    setIsPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod, shippingAddress, items,
          itemsPrice, taxPrice, shippingPrice, totalPrice,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrderComplete(true)
        trackPurchase(data.order._id, items, totalPrice)
        toast.success('Order placed! We\'ll collect payment on delivery.')
        router.push(`/order/${data.order._id}`)
        clear()
      } else {
        toast.error(data.message)
      }
    } finally {
      setIsPlacing(false)
    }
  }

  // ── Paystack handlers ─────────────────────────────────────────
  const paystackConfig = {
    email: shippingAddress.email || session?.user?.email || '',
    amount: Math.round(totalPrice * 100), // kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    reference: `agubros_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  }

  const handlePaystackSuccess = useCallback(async (response: any) => {
    setIsPlacing(true)
    try {
      const res = await fetch('/api/orders/create-paid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items, shippingAddress, paymentMethod,
          paystackReference: response.reference,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setOrderComplete(true)
        trackPurchase(data.order._id, items, totalPrice)
        toast.success('Payment confirmed! Your order is placed.')
        router.push(`/order/${data.order._id}`)
        clear()
      } else {
        toast.error(data.message || 'Order creation failed. Contact support.')
      }
    } finally {
      setIsPlacing(false)
    }
  }, [items, shippingAddress, paymentMethod, clear, router, totalPrice])

  const handlePaystackClose = () => {
    toast('Payment cancelled. Your order has not been placed.', { icon: 'ℹ️' })
  }

  if (!mounted) return null

  const isPaystack = paymentMethod === 'Paystack'

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <CheckoutSteps current={3} />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <h1 className="text-2xl font-medium text-[#0F1111] mb-5">Review your order</h1>

        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* ── Left: Delivery + Payment + Items ── */}
          <div className="flex-1 space-y-3 min-w-0">

            {/* Delivery */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-[#0F1111] mb-2">Delivery address</h2>
                  <p className="text-sm font-medium text-[#0F1111]">{shippingAddress.fullName}</p>
                  <p className="text-sm text-[#565959]">{shippingAddress.address}</p>
                  <p className="text-sm text-[#565959]">
                    {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                  <p className="text-sm text-[#565959]">{shippingAddress.phone}</p>
                  <p className="text-sm text-[#007185] mt-1">{shippingAddress.email}</p>
                </div>
                <Link href="/shipping" className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline flex-shrink-0">
                  Change
                </Link>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#0F1111] mb-1">Payment method</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#565959]">
                      {isPaystack ? '💳 Pay Online (Paystack)' : '🚚 Cash on Delivery'}
                    </span>
                    {isPaystack && (
                      <span className="text-[10px] bg-[#FF9900] text-white px-1.5 py-0.5 rounded-sm font-bold">SECURE</span>
                    )}
                  </div>
                </div>
                <Link href="/payment" className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline">
                  Change
                </Link>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#0F1111]">
                  Order items ({items.reduce((a, c) => a + c.qty, 0)})
                </h2>
                <Link href="/cart" className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline">
                  Edit cart
                </Link>
              </div>

              <div className="space-y-4 divide-y divide-[#D5D9D9]">
                {items.map((item) => (
                  <div key={item.slug} className="flex gap-4 pt-4 first:pt-0">
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <CldImage
                        src={item.images?.[0] ?? item.image}
                        alt={item.name}
                        width={72}
                        height={72}
                        className="object-contain rounded-sm border border-[#D5D9D9]"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.slug}`}>
                        <p className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline line-clamp-2 font-medium">
                          {item.name}
                        </p>
                      </Link>
                      <p className="text-[#007600] text-xs mt-0.5 font-medium">In Stock</p>
                      <p className="text-sm text-[#565959] mt-0.5">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm text-[#0F1111]"><Price amount={item.price * item.qty} size="sm" /></p>
                      <p className="text-xs text-[#565959] mt-0.5"><Price amount={item.price} size="sm" /> each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA at bottom of items on mobile */}
              <div className="mt-6 lg:hidden">
                <OrderCTA
                  isPaystack={isPaystack}
                  isPlacing={isPlacing}
                  totalPrice={totalPrice}
                  paystackConfig={paystackConfig}
                  onPaystackSuccess={handlePaystackSuccess}
                  onPaystackClose={handlePaystackClose}
                  onCOD={placeCODOrder}
                />
              </div>
            </div>
          </div>

          {/* ── Right: Summary + Pay ── */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
            <div className="bg-white rounded-sm shadow-sm p-5">
              <OrderCTA
                isPaystack={isPaystack}
                isPlacing={isPlacing}
                totalPrice={totalPrice}
                paystackConfig={paystackConfig}
                onPaystackSuccess={handlePaystackSuccess}
                onPaystackClose={handlePaystackClose}
                onCOD={placeCODOrder}
              />

              <p className="text-xs text-[#565959] mt-3 leading-relaxed">
                By placing your order, you agree to Agu Brothers&apos;{' '}
                <Link href="/terms-and-conditions" className="text-[#007185] hover:underline">Conditions of Use</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-[#007185] hover:underline">Privacy Notice</Link>.
              </p>

              {/* Order summary */}
              <div className="border-t border-[#D5D9D9] mt-4 pt-4 space-y-2">
                <h3 className="font-bold text-[#0F1111] text-sm mb-3">Order Summary</h3>
                {(
                  [
                    ['Items', itemsPrice],
                    ['Shipping & handling', shippingPrice],
                    ['Tax (0.6%)', taxPrice],
                  ] as const
                ).map(([label, amount]) => (
                  <div key={label} className="flex justify-between items-center text-sm text-[#0F1111]">
                    <span className="text-[#565959]">{label}:</span>
                    <Price amount={amount} size="sm" />
                  </div>
                ))}
                <div className="border-t border-[#D5D9D9] pt-3 mt-2">
                  <div className="flex justify-between items-center font-bold text-lg text-[#CC0C39]">
                    <span>Order total:</span>
                    <Price amount={totalPrice} size="md" className="text-[#CC0C39]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Security badge */}
            <div className="bg-white rounded-sm shadow-sm p-4 flex items-center gap-3">
              <svg className="w-8 h-8 text-[#007600] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-xs font-bold text-[#0F1111]">Safe & secure checkout</p>
                <p className="text-xs text-[#565959] mt-0.5">
                  {isPaystack ? 'Payments processed by Paystack — SSL encrypted' : 'Cash collected on delivery'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Extracted CTA so it can render in both mobile and desktop positions ──
function OrderCTA({
  isPaystack, isPlacing, totalPrice, paystackConfig,
  onPaystackSuccess, onPaystackClose, onCOD,
}: {
  isPaystack: boolean
  isPlacing: boolean
  totalPrice: number
  paystackConfig: any
  onPaystackSuccess: (res: any) => void
  onPaystackClose: () => void
  onCOD: () => void
}) {
  if (isPlacing) {
    return (
      <button disabled className="btn-amazon w-full py-3 rounded-md text-sm flex items-center justify-center gap-2">
        <span className="loading loading-spinner loading-xs"></span>
        Processing your order…
      </button>
    )
  }

  if (isPaystack) {
    if (!paystackConfig.publicKey) {
      return (
        <p className="text-sm text-[#CC0C39] text-center">
          Online payment is temporarily unavailable. Please choose Cash on Delivery or contact support.
        </p>
      )
    }
    return (
      <div className="space-y-2">
        <PaystackButton
          {...paystackConfig}
          onSuccess={onPaystackSuccess}
          onClose={onPaystackClose}
          className="btn-amazon w-full py-3 rounded-md text-sm font-medium cursor-pointer text-center block"
          text={`Pay ${formatPriceAmount(totalPrice)} with Paystack`}
        />
        <p className="text-xs text-center text-[#565959]">
          You&apos;ll be charged immediately. Order is confirmed after payment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={onCOD}
        className="btn-amazon w-full py-3 rounded-md text-sm font-medium"
      >
        Place your order
      </button>
      <p className="text-xs text-center text-[#565959]">
        Payment collected on delivery. Order may be cancelled before dispatch.
      </p>
    </div>
  )
}

export default Form
