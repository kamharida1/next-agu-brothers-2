'use client'
import Link from 'next/link'
import React from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import useSWR from 'swr'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js'
import { formatPrice } from '@/lib/utils'
import {
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiArrowRight,
  FiTrendingUp,
} from 'react-icons/fi'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Filler, Legend, BarElement, ArcElement
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' as const },
  },
  scales: {
    y: { beginAtZero: true },
  },
}

const StatCard = ({
  title,
  value,
  icon,
  href,
  color,
  subtitle,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  href: string
  color: string
  subtitle?: string
}) => (
  <div className={`card bg-base-100 shadow border border-base-200`}>
    <div className="card-body p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-base-content/60 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-base-content/50 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <Link href={href} className="text-xs text-primary hover:underline flex items-center gap-1 mt-2">
        View details <FiArrowRight className="w-3 h-3" />
      </Link>
    </div>
  </div>
)

const Dashboard = () => {
  const { data: summary, error } = useSWR('/api/admin/orders/summary')

  if (error) return (
    <div className="alert alert-error">
      <span>Failed to load dashboard data: {error.message}</span>
    </div>
  )

  if (!summary) return (
    <div className="flex items-center justify-center py-16">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )

  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [{
      fill: true,
      label: 'Revenue (₦)',
      data: summary.salesData.map((x: { totalSales: number }) => x.totalSales),
      borderColor: 'rgb(251, 191, 36)',
      backgroundColor: 'rgba(251, 191, 36, 0.1)',
      tension: 0.4,
    }],
  }

  const ordersData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [{
      fill: true,
      label: 'Orders',
      data: summary.salesData.map((x: { totalOrders: number }) => x.totalOrders),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }],
  }

  const productsData = {
    labels: summary.productsData.map((x: { _id: string }) => x._id),
    datasets: [{
      label: 'Products by Category',
      data: summary.productsData.map((x: { totalProducts: number }) => x.totalProducts),
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(249, 115, 22, 0.8)',
      ],
      borderWidth: 0,
    }],
  }

  const usersData = {
    labels: summary.usersData.map((x: { _id: string }) => x._id),
    datasets: [{
      label: 'New Users',
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      data: summary.usersData.map((x: { totalUsers: number }) => x.totalUsers),
    }],
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Welcome back, Admin!</h2>
          <p className="text-white/70 text-sm mt-1">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <FiTrendingUp className="w-12 h-12 text-white/30" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatPrice(summary.ordersPrice)}
          icon={<FiDollarSign className="w-5 h-5 text-warning" />}
          href="/admin/orders"
          color="bg-warning/15"
          subtitle="All time sales"
        />
        <StatCard
          title="Total Orders"
          value={summary.ordersCount}
          icon={<FiShoppingBag className="w-5 h-5 text-primary" />}
          href="/admin/orders"
          color="bg-primary/15"
          subtitle="Includes all statuses"
        />
        <StatCard
          title="Total Products"
          value={summary.productsCount}
          icon={<FiPackage className="w-5 h-5 text-success" />}
          href="/admin/products"
          color="bg-success/15"
          subtitle="Active listings"
        />
        <StatCard
          title="Total Users"
          value={summary.usersCount}
          icon={<FiUsers className="w-5 h-5 text-info" />}
          href="/admin/users"
          color="bg-info/15"
          subtitle="Registered accounts"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h3 className="font-semibold text-base">Revenue Overview</h3>
            <div className="h-56">
              <Line data={salesData} options={chartOptions} />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h3 className="font-semibold text-base">Orders Trend</h3>
            <div className="h-56">
              <Line data={ordersData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h3 className="font-semibold text-base">Products by Category</h3>
            <div className="h-56 flex items-center justify-center">
              <Doughnut
                data={productsData}
                options={{ ...chartOptions, maintainAspectRatio: true }}
              />
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h3 className="font-semibold text-base">User Registrations</h3>
            <div className="h-56">
              <Bar data={usersData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
