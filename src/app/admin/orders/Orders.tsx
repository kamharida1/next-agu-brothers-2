'use client'

import { useState, useEffect } from 'react'
import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import useSWR from 'swr'
import Price from '@/components/products/Price'
import {
  FiSearch,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiAlertCircle,
} from 'react-icons/fi'
import {
  AdminAlert,
  AdminBadge,
  AdminFilterChips,
  AdminLoading,
  AdminSearch,
  AdminStatCard,
  AdminStatGrid,
  AdminTable,
  AdminTableFoot,
  AdminToolbar,
  AdminLinkAction,
} from '@/components/admin/AdminUI'

export default function Orders() {
  const { data: orders, error } = useSWR('/api/admin/orders')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'delivered'>('all')

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  if (error) return <AdminAlert>Failed to load orders: {error.message}</AdminAlert>
  if (!orders) return <AdminLoading />

  const filteredOrders = orders
    .filter((order: Order) => {
      if (filter === 'paid') return order.isPaid
      if (filter === 'unpaid') return !order.isPaid
      if (filter === 'delivered') return order.isDelivered
      return true
    })
    .filter((order: Order) => {
      if (!debouncedSearchTerm) return true
      const term = debouncedSearchTerm.toLowerCase()
      return (
        order._id.toLowerCase().includes(term) ||
        order.user?.name?.toLowerCase().includes(term) ||
        order.shippingAddress.phone?.toLowerCase().includes(term) ||
        order.shippingAddress.city?.toLowerCase().includes(term)
      )
    })

  const stats = {
    total: orders.length,
    paid: orders.filter((o: Order) => o.isPaid).length,
    unpaid: orders.filter((o: Order) => !o.isPaid).length,
    delivered: orders.filter((o: Order) => o.isDelivered).length,
  }

  return (
    <div className="space-y-5">
      <AdminStatGrid>
        <AdminStatCard
          label="Total orders"
          value={stats.total}
          icon={<FiEye className="w-4 h-4" />}
          onClick={() => setFilter('all')}
        />
        <AdminStatCard
          label="Paid"
          value={stats.paid}
          icon={<FiCheckCircle className="w-4 h-4" />}
          accent="success"
          onClick={() => setFilter('paid')}
        />
        <AdminStatCard
          label="Unpaid"
          value={stats.unpaid}
          icon={<FiXCircle className="w-4 h-4" />}
          accent="danger"
          onClick={() => setFilter('unpaid')}
        />
        <AdminStatCard
          label="Delivered"
          value={stats.delivered}
          icon={<FiTruck className="w-4 h-4" />}
          accent="brand"
          onClick={() => setFilter('delivered')}
        />
      </AdminStatGrid>

      <AdminToolbar>
        <div className="relative flex-1 flex items-center gap-2">
          <FiSearch className="w-4 h-4 text-[#565959] shrink-0" />
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search ID, customer, phone, city…"
          />
        </div>
        <AdminFilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'all', label: 'All' },
            { id: 'paid', label: 'Paid' },
            { id: 'unpaid', label: 'Unpaid' },
            { id: 'delivered', label: 'Delivered' },
          ]}
        />
      </AdminToolbar>

      <AdminTable>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Delivery</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-12 text-[#565959]">
                No orders found
              </td>
            </tr>
          ) : (
            filteredOrders.map((order: Order) => (
              <tr key={order._id}>
                <td>
                  <span className="font-mono text-xs bg-[#F0F2F2] px-2 py-0.5 rounded text-[#0F1111]">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </td>
                <td>
                  <p className="font-medium text-[#0F1111]">{order.user?.name || 'Deleted'}</p>
                  <p className="text-xs text-[#565959]">{order.shippingAddress.city}</p>
                </td>
                <td className="text-[#565959]">
                  {new Date(order.createdAt).toLocaleDateString('en-NG', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="font-semibold">
                  <Price amount={order.totalPrice} size="sm" />
                </td>
                <td>
                  <AdminBadge variant={order.isPaid ? 'success' : 'error'}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </AdminBadge>
                </td>
                <td>
                  <AdminBadge variant={order.isDelivered ? 'success' : 'neutral'}>
                    {order.isDelivered ? 'Delivered' : 'Pending'}
                  </AdminBadge>
                </td>
                <td>
                  <AdminLinkAction href={`/order/${order._id}`}>
                    <FiEye className="w-3.5 h-3.5" /> View
                  </AdminLinkAction>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>
      {filteredOrders.length > 0 && (
        <AdminTableFoot>
          Showing {filteredOrders.length} of {orders.length} orders
        </AdminTableFoot>
      )}
    </div>
  )
}
