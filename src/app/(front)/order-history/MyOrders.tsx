'use client'
import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { formatPrice } from '@/lib/utils'
import { format } from 'date-fns'

const fmt = (d: string) => format(new Date(d), 'MMM d, yyyy')

export default function MyOrders() {
  const { data: orders, error } = useSWR('/api/orders/mine')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null
  if (error) return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-sm p-8 border border-[#CC0C39] text-center max-w-sm">
        <p className="text-[#CC0C39] font-bold">Error loading orders</p>
      </div>
    </div>
  )
  if (!orders) return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-[#FF9900]"></span>
    </div>
  )

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>Your Orders</span>
        </div>

        <h1 className="text-3xl font-medium text-[#0F1111] mb-4">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-medium text-[#0F1111] mb-2">No orders yet</h2>
            <p className="text-[#565959] mb-6">You haven&apos;t placed any orders. Start shopping!</p>
            <Link href="/" className="btn-amazon px-8 py-3 rounded-md inline-block text-sm">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: Order) => (
              <div key={order._id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                {/* Order header */}
                <div className="bg-[#F7F8F8] border-b border-[#D5D9D9] px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-wrap gap-6 text-xs text-[#565959]">
                    <div>
                      <p className="uppercase font-bold tracking-wider mb-0.5">Order Placed</p>
                      <p className="text-[#0F1111]">{fmt(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold tracking-wider mb-0.5">Total</p>
                      <p className="text-[#0F1111] font-bold">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <div>
                      <p className="uppercase font-bold tracking-wider mb-0.5">Payment</p>
                      <p className={order.isPaid ? 'text-[#007600] font-medium' : 'text-[#CC0C39]'}>
                        {order.isPaid ? `Paid ${order.paidAt ? fmt(order.paidAt) : ''}` : 'Not Paid'}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase font-bold tracking-wider mb-0.5">Delivery</p>
                      <p className={order.isDelivered ? 'text-[#007600] font-medium' : 'text-[#565959]'}>
                        {order.isDelivered ? `Delivered ${order.deliveredAt ? fmt(order.deliveredAt) : ''}` : 'In Progress'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-[#565959]">
                    <span className="uppercase font-bold tracking-wider">Order # </span>
                    <span className="text-[#007185] font-mono">{order._id}</span>
                  </div>
                </div>

                {/* Order body */}
                <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    {order.isPaid && !order.isDelivered && (
                      <p className="text-base font-bold text-[#0F1111] mb-1">
                        Your order is on the way
                      </p>
                    )}
                    {order.isDelivered && (
                      <p className="text-base font-bold text-[#007600] mb-1">✓ Delivered</p>
                    )}
                    {!order.isPaid && (
                      <p className="text-base font-bold text-[#CC0C39] mb-1">Payment required</p>
                    )}
                    <p className="text-sm text-[#565959]">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} · {order.paymentMethod}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/order/${order._id}`}
                      className="btn-amazon-outline px-4 py-2 rounded-md text-sm"
                    >
                      View order details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
