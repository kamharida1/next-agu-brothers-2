'use client'

import { OrderItem } from '@/lib/models/OrderModel'
import Price from '@/components/products/Price'
import { formatPriceAmount } from '@/lib/utils'
import { BUSINESS } from '@/lib/seo'
import { useSession } from 'next-auth/react'
import CldImage from '@/components/CldImage'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useEffect, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { FiX } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

const PaystackButton = dynamic(
  () => import('react-paystack').then((mod) => mod.PaystackButton),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        className="btn-amazon w-full py-2.5 rounded-md text-sm opacity-70"
        disabled
      >
        Loading payment...
      </button>
    ),
  }
)

import { format } from 'date-fns'

declare global {
  interface Window {
    MonnifySDK?: {
      initialize: (config: Record<string, unknown>) => void
    }
  }
}

function OrderModal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-sm shadow-lg max-w-lg w-full p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-[#565959] hover:text-[#0F1111]"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-[#0F1111] mb-4 pr-8">{title}</h3>
        {children}
      </div>
    </div>
  )
}

function fmtDate(value: string | Date | undefined) {
  if (!value) return '—'
  return format(new Date(value), 'MMM d, yyyy')
}

export default function OrderDetails({ orderId }: { orderId: string }) {
  const router = useRouter()
  const { data: session } = useSession()
  const { data, error, mutate } = useSWR(`/api/orders/${orderId}`)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [transferModalOpen, setTransferModalOpen] = useState(false)
  const [cashModalOpen, setCashModalOpen] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.monnify.com/plugin/monnify.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const { trigger: userDeleteOrder, isMutating: isUserDeleting } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/orders/${orderId}/delete-order`, { method: 'DELETE' })
      const body = await res.json()
      if (res.ok) {
        toast.success('Order cancelled')
        router.push('/order-history')
      } else toast.error(body.message)
    }
  )

  const { trigger: deleteOrder, isMutating: isDeleting } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/delete`, { method: 'DELETE' })
      const body = await res.json()
      if (res.ok) {
        toast.success('Order deleted')
        router.push('/admin/orders')
      } else toast.error(body.message)
    }
  )

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, { method: 'PUT' })
      const body = await res.json()
      if (res.ok) {
        toast.success('Marked as delivered')
        mutate()
      } else toast.error(body.message)
    }
  )

  const { trigger: markPaid, isMutating: isMarkingPaid } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/pay`, { method: 'PUT' })
      const body = await res.json()
      if (res.ok) {
        toast.success('Marked as paid')
        mutate()
      } else toast.error(body.message)
    }
  )

  if (error) {
    return (
      <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-sm shadow-sm text-center max-w-md">
          <p className="text-[#CC0C39] text-xl font-bold mb-2">Error loading order</p>
          <p className="text-[#565959]">{error.message}</p>
          <Link href="/order-history" className="btn-amazon mt-4 inline-block px-6 py-2 rounded-md text-sm">
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-[#FF9900]" />
          <p className="text-[#565959] mt-3">Loading your order...</p>
        </div>
      </div>
    )
  }

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    isDelivered,
    deliveredAt,
    paymentResult,
  } = data

  const paystackConfig = {
    email: shippingAddress.email,
    amount: Math.round(totalPrice * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    reference: `order_${orderId}_${Date.now()}`,
    metadata: {
      orderId,
      custom_fields: [{ display_name: 'Order ID', variable_name: 'order_id', value: orderId }],
    },
  }

  const handlePaystackSuccess = async (response: { reference: string }) => {
    setIsProcessingPayment(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/capture-paystack-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: response.reference }),
      })
      const body = await res.json()
      if (res.ok) {
        toast.success('Payment successful! Thank you.')
        mutate()
      } else toast.error(body.message || 'Payment capture failed')
    } catch {
      toast.error('An error occurred. Contact support.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const monnifyPay = () => {
    if (typeof window.MonnifySDK === 'undefined') {
      toast.error('Payment service is loading. Please try again.')
      return
    }

    window.MonnifySDK.initialize({
      amount: totalPrice,
      currency: 'NGN',
      reference: String(Date.now()),
      customerFullName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      apiKey: 'MK_PROD_TPNN9Q74H1',
      contractCode: '176278549691',
      paymentDescription: 'Agu Brothers order payment',
      onComplete: async (response: unknown) => {
        try {
          const res = await fetch('/api/orders/capture-monnify-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          if (res.ok) {
            toast.success('Payment successful')
            mutate()
          } else toast.error('Payment capture failed')
        } catch {
          toast.error('Failed to process payment')
        }
      },
    })
  }

  return (
    <>
      {transferModalOpen && (
        <OrderModal title="Pay with bank transfer" onClose={() => setTransferModalOpen(false)}>
          <div className="space-y-3 text-sm text-[#0F1111]">
            <p>
              Transfer{' '}
              <span className="font-bold text-[#CC0C39]">{formatPriceAmount(totalPrice)}</span> to:
            </p>
            <div className="bg-[#F7F8F8] border border-[#D5D9D9] rounded-sm p-4 space-y-1">
              <p>
                <span className="text-[#565959]">Account name:</span> Agu Brothers Electronics
              </p>
              <p>
                <span className="text-[#565959]">Account number:</span>{' '}
                <span className="font-bold">1895049684</span>
              </p>
              <p>
                <span className="text-[#565959]">Bank:</span> Access Bank PLC
              </p>
            </div>
            <p className="text-[#565959]">
              Send your payment receipt to WhatsApp{' '}
              <Link
                href={BUSINESS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#007185] hover:text-[#CC0C39] hover:underline"
              >
                {BUSINESS.phoneDisplay}
                <FaWhatsapp className="text-[#25D366]" aria-hidden />
              </Link>
            </p>
            <button
              type="button"
              className="btn-amazon w-full py-2.5 rounded-md text-sm mt-2"
              onClick={() => {
                setTransferModalOpen(false)
                toast.success(
                  'Thank you. We will confirm your payment shortly.',
                  { duration: 5000 }
                )
              }}
            >
              I have completed the transfer
            </button>
          </div>
        </OrderModal>
      )}

      {cashModalOpen && (
        <OrderModal title="Cash on delivery" onClose={() => setCashModalOpen(false)}>
          <div className="space-y-3 text-sm text-[#0F1111]">
            <p>
              Cash on delivery is available for customers near our Enugu showroom. Visit us at:
            </p>
            <div className="bg-[#F7F8F8] border border-[#D5D9D9] rounded-sm p-4 space-y-1">
              <p className="font-medium">{BUSINESS.name}</p>
              <p>{BUSINESS.address.street}, {BUSINESS.address.locality}</p>
              <p>{BUSINESS.phoneDisplay}</p>
            </div>
            <p className="text-[#565959]">
              Outside Enugu? Choose Paystack online payment or contact us on WhatsApp.
            </p>
            <button
              type="button"
              className="btn-amazon w-full py-2.5 rounded-md text-sm"
              onClick={() => {
                setCashModalOpen(false)
                toast.success('Cash on delivery instructions noted.')
              }}
            >
              Got it
            </button>
          </div>
        </OrderModal>
      )}

      <div className="bg-[#EAEDED] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-6">
          <div className="text-sm text-[#565959] mb-4">
            <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
              Home
            </Link>
            <span className="mx-1">›</span>
            <Link href="/order-history" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
              Your Orders
            </Link>
            <span className="mx-1">›</span>
            <span>Order Details</span>
          </div>

          <h1 className="text-3xl font-normal text-[#0F1111] mb-4">Order Details</h1>

          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* Main order card — Amazon list style */}
            <div className="flex-1 min-w-0 bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="bg-[#F7F8F8] border-b border-[#D5D9D9] px-5 py-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-xs text-[#565959]">
                    <div>
                      <p className="uppercase font-bold tracking-wider mb-0.5">Order placed</p>
                      <p className="text-[#0F1111]">{fmtDate(data.createdAt)}</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold tracking-wider mb-0.5">Total</p>
                      <p className="text-[#0F1111]">
                        <Price amount={totalPrice} size="md" />
                      </p>
                    </div>
                    <div>
                      <p className="uppercase font-bold tracking-wider mb-0.5">Ship to</p>
                      <p className="text-[#0F1111] leading-snug">
                        {shippingAddress.fullName}
                        <br />
                        {shippingAddress.city}, {shippingAddress.country}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase font-bold tracking-wider mb-0.5">Order #</p>
                      <p className="text-[#007185] font-mono break-all">{orderId}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 border-b border-[#D5D9D9]">
                {isDelivered ? (
                  <p className="text-base font-bold text-[#007600]">
                    Delivered {deliveredAt ? fmtDate(deliveredAt) : ''}
                  </p>
                ) : isPaid ? (
                  <p className="text-base font-bold text-[#0F1111]">Your order is on the way</p>
                ) : (
                  <p className="text-base font-bold text-[#CC0C39]">Payment required</p>
                )}
                <p className="text-sm text-[#565959] mt-1">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="divide-y divide-[#D5D9D9]">
                {items.map((item: OrderItem) => (
                  <div
                    key={item.slug}
                    className="px-5 py-4 flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between"
                  >
                    <div className="flex gap-4 min-w-0 flex-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-white flex items-center justify-center"
                      >
                        <CldImage
                          src={item.images?.[0] ?? item.image}
                          alt={item.name}
                          width={112}
                          height={112}
                          className="object-contain w-full h-full"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/product/${item.slug}`}>
                          <p className="text-sm sm:text-base text-[#007185] hover:text-[#CC0C39] hover:underline line-clamp-3">
                            {item.name}
                          </p>
                        </Link>
                        <p className="text-sm text-[#565959] mt-2">Qty: {item.qty}</p>
                        <Link
                          href={`/product/${item.slug}`}
                          className="inline-block mt-3 btn-amazon-outline px-4 py-1.5 rounded-md text-xs sm:text-sm"
                        >
                          Buy it again
                        </Link>
                      </div>
                    </div>
                    <div className="sm:text-right flex-shrink-0 pl-28 sm:pl-0">
                      <Price amount={item.price * item.qty} size="md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary sidebar — matches cart checkout panel */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
              <div className="bg-white rounded-sm shadow-sm p-5">
                <h2 className="text-lg font-medium text-[#0F1111] mb-4 pb-3 border-b border-[#D5D9D9]">
                  Order Summary
                </h2>
                <div className="space-y-2 text-sm text-[#0F1111]">
                  <div className="flex justify-between items-center">
                    <span>Items ({items.length}):</span>
                    <Price amount={itemsPrice} size="sm" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping &amp; handling:</span>
                    <Price amount={shippingPrice} size="sm" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Estimated tax:</span>
                    <Price amount={taxPrice} size="sm" />
                  </div>
                  {paymentResult?.debitedAmount != null && (
                    <div className="flex justify-between items-center text-[#565959]">
                      <span>Amount charged:</span>
                      <Price amount={paymentResult.debitedAmount} size="sm" />
                    </div>
                  )}
                  <div className="flex justify-between items-center text-base font-bold border-t border-[#D5D9D9] pt-3 mt-3 text-[#CC0C39]">
                    <span>Order total:</span>
                    <Price amount={totalPrice} size="md" className="text-[#CC0C39]" />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {!isPaid && paymentMethod === 'Paystack' && (
                    isProcessingPayment ? (
                      <button
                        type="button"
                        className="btn-amazon w-full py-2.5 rounded-md text-sm flex items-center justify-center gap-2 opacity-70"
                        disabled
                      >
                        <span className="loading loading-spinner loading-xs" />
                        Verifying payment...
                      </button>
                    ) : (
                      <PaystackButton
                        {...paystackConfig}
                        onSuccess={handlePaystackSuccess}
                        onClose={() => toast('Payment cancelled', { icon: 'ℹ️' })}
                        className="btn-amazon w-full py-2.5 rounded-md text-sm cursor-pointer text-center block"
                        text={`Pay ${formatPriceAmount(totalPrice)}`}
                      />
                    )
                  )}

                  {!isPaid && paymentMethod === 'Transfer' && (
                    <button
                      type="button"
                      className="btn-amazon w-full py-2.5 rounded-md text-sm"
                      onClick={() => setTransferModalOpen(true)}
                    >
                      Pay with bank transfer
                    </button>
                  )}

                  {!isPaid && paymentMethod === 'Moniepoint' && (
                    <button
                      type="button"
                      className="btn-amazon w-full py-2.5 rounded-md text-sm"
                      onClick={monnifyPay}
                    >
                      Pay with Monnify
                    </button>
                  )}

                  {!isPaid && paymentMethod === 'Cash On Delivery' && (
                    <button
                      type="button"
                      className="btn-amazon-outline w-full py-2 rounded-md text-sm"
                      onClick={() => setCashModalOpen(true)}
                    >
                      Cash on delivery info
                    </button>
                  )}

                  <Link
                    href="/"
                    className="btn-amazon-outline w-full py-2.5 rounded-md text-sm text-center block"
                  >
                    Continue shopping
                  </Link>

                  {!isPaid && !session?.user?.isAdmin && (
                    <button
                      type="button"
                      onClick={() => userDeleteOrder()}
                      disabled={isUserDeleting}
                      className="w-full py-2 rounded-md text-sm text-[#007185] hover:text-[#CC0C39] hover:underline disabled:opacity-50"
                    >
                      {isUserDeleting ? 'Cancelling...' : 'Cancel order'}
                    </button>
                  )}
                </div>
              </div>

              {session?.user?.isAdmin && (
                <div className="bg-white rounded-sm shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#565959] mb-3">
                    Admin
                  </p>
                  <div className="space-y-2">
                    {!isDelivered && (
                      <button
                        type="button"
                        onClick={() => deliverOrder()}
                        disabled={isDelivering}
                        className="btn-amazon-outline w-full py-2 rounded-md text-sm"
                      >
                        {isDelivering ? 'Updating...' : 'Mark as delivered'}
                      </button>
                    )}
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => markPaid()}
                        disabled={isMarkingPaid}
                        className="btn-amazon-outline w-full py-2 rounded-md text-sm"
                      >
                        {isMarkingPaid ? 'Updating...' : 'Mark as paid'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteOrder()}
                      disabled={isDeleting}
                      className="w-full py-2 rounded-md text-sm border border-[#CC0C39] text-[#CC0C39] hover:bg-[#FFF0F0] transition-colors"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
