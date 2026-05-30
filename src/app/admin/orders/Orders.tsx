'use client'
import { useState, useEffect } from 'react'
import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import useSWR from 'swr'
import { formatPrice } from '@/lib/utils'
import { FiSearch, FiEye, FiCheckCircle, FiXCircle, FiTruck, FiAlertCircle } from 'react-icons/fi'

export default function Orders() {
  const { data: orders, error } = useSWR('/api/admin/orders')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid' | 'delivered'>('all')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  if (error) return (
    <div className="alert alert-error">
      <FiAlertCircle className="w-5 h-5" />
      <span>Failed to load orders: {error.message}</span>
    </div>
  )

  if (!orders) return (
    <div className="flex items-center justify-center py-16">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )

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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: stats.total, icon: <FiEye className="w-4 h-4" />, color: 'bg-base-200', onClick: () => setFilter('all') },
          { label: 'Paid', value: stats.paid, icon: <FiCheckCircle className="w-4 h-4 text-success" />, color: 'bg-success/10', onClick: () => setFilter('paid') },
          { label: 'Unpaid', value: stats.unpaid, icon: <FiXCircle className="w-4 h-4 text-error" />, color: 'bg-error/10', onClick: () => setFilter('unpaid') },
          { label: 'Delivered', value: stats.delivered, icon: <FiTruck className="w-4 h-4 text-primary" />, color: 'bg-primary/10', onClick: () => setFilter('delivered') },
        ].map((s) => (
          <button
            key={s.label}
            onClick={s.onClick}
            className={`card ${s.color} border border-base-200 text-left hover:shadow-sm transition-shadow cursor-pointer`}
          >
            <div className="card-body p-4">
              <div className="flex items-center gap-2">
                {s.icon}
                <span className="text-xs font-medium text-base-content/70">{s.label}</span>
              </div>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search by ID, customer name, phone, city..."
                className="input input-bordered w-full pl-9 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'paid', 'unpaid', 'delivered'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`btn btn-sm capitalize ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card bg-base-100 shadow border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-xs uppercase tracking-wider">Customer</th>
                <th className="text-xs uppercase tracking-wider">Date</th>
                <th className="text-xs uppercase tracking-wider">Total</th>
                <th className="text-xs uppercase tracking-wider">Payment</th>
                <th className="text-xs uppercase tracking-wider">Delivery</th>
                <th className="text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-base-content/50">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: Order) => (
                  <tr key={order._id} className="hover">
                    <td>
                      <span className="font-mono text-xs bg-base-200 px-2 py-0.5 rounded">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-sm">{order.user?.name || 'Deleted'}</p>
                        <p className="text-xs text-base-content/50">{order.shippingAddress.city}</p>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70">
                      {new Date(order.createdAt).toLocaleDateString('en-NG', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="font-semibold text-sm">{formatPrice(order.totalPrice)}</td>
                    <td>
                      {order.isPaid ? (
                        <div className="badge badge-success badge-sm gap-1">
                          <FiCheckCircle className="w-3 h-3" /> Paid
                        </div>
                      ) : (
                        <div className="badge badge-error badge-sm gap-1">
                          <FiXCircle className="w-3 h-3" /> Unpaid
                        </div>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <div className="badge badge-success badge-sm gap-1">
                          <FiTruck className="w-3 h-3" /> Delivered
                        </div>
                      ) : (
                        <div className="badge badge-warning badge-sm gap-1">
                          <FiAlertCircle className="w-3 h-3" /> Pending
                        </div>
                      )}
                    </td>
                    <td>
                      <Link href={`/order/${order._id}`} className="btn btn-primary btn-xs gap-1">
                        <FiEye className="w-3 h-3" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredOrders.length > 0 && (
          <div className="px-4 py-3 border-t border-base-200 text-sm text-base-content/50">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </div>
    </div>
  )
}
