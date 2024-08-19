'use client'
import { useState, useEffect } from 'react'
import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import useSWR from 'swr'
import Price from '@/components/products/Price'

export default function Orders() {
  const { data: orders, error } = useSWR(`/api/admin/orders`)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  if (error) return 'An error has occurred.'
  if (!orders) return 'Loading...'

  const filteredOrders = debouncedSearchTerm
    ? orders.filter((order: Order) => {
        const paidAt = order.paidAt
          ? new Date(order.paidAt).toISOString().substring(0, 10)
          : ''
        const deliveredAt = order.deliveredAt
          ? new Date(order.deliveredAt).toISOString().substring(0, 10)
          : ''
        const phone = order.shippingAddress.city || ''

        return (
          paidAt.includes(debouncedSearchTerm) ||
          deliveredAt.includes(debouncedSearchTerm) ||
          phone.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      })
    : orders

  return (
    <div>
      <h1 className="py-4 text-2xl">Orders</h1>

      {/* Search input */}
      <div className="py-4">
        <input
          type="text"
          placeholder="Search by paidAt, deliveredAt, or city"
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-compact w-full table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: Order) => (
              <tr key={order._id}>
                <td>..{order._id.substring(20, 24)}</td>
                <td>{order.user?.name || 'Deleted user'}</td>
                <td>
                  {new Date(order.createdAt).toISOString().substring(0, 10)}
                </td>
                <td>
                  <Price price={order.totalPrice} />
                </td>
                <td
                  className={
                    order.isPaid && order.paidAt
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {order.isPaid && order.paidAt
                    ? `${new Date(order.paidAt).toISOString().substring(0, 10)}`
                    : 'not paid'}
                </td>
                <td
                  className={
                    order.isDelivered && order.deliveredAt
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {order.isDelivered && order.deliveredAt
                    ? `${new Date(order.deliveredAt)
                        .toISOString()
                        .substring(0, 10)}`
                    : 'not delivered'}
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
