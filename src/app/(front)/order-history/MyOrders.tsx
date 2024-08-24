'use client'
import { Order } from '@/lib/models/OrderModel'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import OrderHistorySkeleton from '../ui/skeletons/OrderHistorySkeleton'
import { formatPrice } from '@/lib/utils'

const formatDate = (dateString: any) => {
  return format(new Date(dateString), 'MMMM do yyyy, h:mm:ss a')
}

export default function MyOrders() {
  const router = useRouter()
  const { data: orders, error } = useSWR(`/api/orders/mine`)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>
  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="alert alert-error shadow-lg w-1/2">
        <div>
          <span>An error has occurred.</span>
        </div>
      </div>
    </div>
  )
  if (!orders) return (
   <OrderHistorySkeleton />
  )

  return (
    <div className="container mx-auto p-6">
      <div className="overflow-x-auto">
        <table className="table table-compact w-full table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order._id}>
                <td>{order._id.substring(20, 24)}</td>
                <td>{formatDate(order.createdAt.substring(0, 10))}</td>
                <td>
                  {formatPrice(order.totalPrice)}
                </td>
                <td
                  className={
                    order.isPaid && order.paidAt
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {order.isPaid && order.paidAt
                    ? `${formatDate(order.paidAt.substring(0, 10))}`
                    : 'Not Paid'}
                </td>
                <td
                  className={
                    order.isDelivered && order.deliveredAt
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {order.isDelivered && order.deliveredAt
                    ? `${formatDate(order.deliveredAt.substring(0, 10))}`
                    : 'Not Delivered'}
                </td>
                <td>
                  <Link
                    className="btn btn-primary btn-sm"
                    href={`/order/${order._id}`}
                    passHref
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
