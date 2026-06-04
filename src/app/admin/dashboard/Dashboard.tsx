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
import { formatPriceAmount } from '@/lib/utils'
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
  subtitle,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  href: string
  subtitle?: string
}) => (
  <div className="admin-stat">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-[#565959]">{title}</p>
        <p className="text-2xl font-bold text-[#0F1111] mt-1">{value}</p>
        {subtitle && <p className="text-xs text-[#565959] mt-1">{subtitle}</p>}
      </div>
      <div className="p-2.5 rounded-sm bg-[#F7F8F8] border border-[#D5D9D9] text-[#FF9900]">
        {icon}
      </div>
    </div>
    <Link
      href={href}
      className="text-xs text-[#007185] hover:text-[#CC0C39] flex items-center gap-1 mt-3"
    >
      View details <FiArrowRight className="w-3 h-3" />
    </Link>
  </div>
)

const Dashboard = () => {
  const { data: summary, error } = useSWR('/api/admin/orders/summary')

  if (error) {
    return (
      <div className="admin-panel p-4 text-sm text-[#B12704] bg-[#FFF4F4]">
        Failed to load dashboard data: {error.message}
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="loading loading-spinner loading-lg text-[#FF9900]" />
      </div>
    )
  }

  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [{
      fill: true,
      label: 'Revenue (₦)',
      data: summary.salesData.map((x: { totalSales: number }) => x.totalSales),
      borderColor: '#FF9900',
      backgroundColor: 'rgba(255, 153, 0, 0.12)',
      tension: 0.4,
    }],
  }

  const ordersData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [{
      fill: true,
      label: 'Orders',
      data: summary.salesData.map((x: { totalOrders: number }) => x.totalOrders),
      borderColor: '#232F3E',
      backgroundColor: 'rgba(35, 47, 62, 0.08)',
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
      <div className="bg-[#131921] text-white rounded-sm p-6 flex items-center justify-between border border-[#3a4553]">
        <div>
          <h2 className="text-xl font-bold">Store overview</h2>
          <p className="text-[#DDD] text-sm mt-1">
            Sales, orders, and inventory at a glance.
          </p>
        </div>
        <FiTrendingUp className="w-12 h-12 text-[#FF9900]/40" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatPriceAmount(summary.ordersPrice)}
          icon={<FiDollarSign className="w-5 h-5" />}
          href="/admin/orders"
          subtitle="All time sales"
        />
        <StatCard
          title="Total Orders"
          value={summary.ordersCount}
          icon={<FiShoppingBag className="w-5 h-5" />}
          href="/admin/orders"
          subtitle="Includes all statuses"
        />
        <StatCard
          title="Total Products"
          value={summary.productsCount}
          icon={<FiPackage className="w-5 h-5" />}
          href="/admin/products"
          subtitle="Active listings"
        />
        <StatCard
          title="Total Users"
          value={summary.usersCount}
          icon={<FiUsers className="w-5 h-5" />}
          href="/admin/users"
          subtitle="Registered accounts"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="admin-panel p-5">
          <h3 className="font-bold text-[#0F1111] text-sm mb-4">Revenue overview</h3>
          <div className="h-56">
            <Line data={salesData} options={chartOptions} />
          </div>
        </div>
        <div className="admin-panel p-5">
          <h3 className="font-bold text-[#0F1111] text-sm mb-4">Orders trend</h3>
          <div className="h-56">
            <Line data={ordersData} options={chartOptions} />
          </div>
        </div>
        <div className="admin-panel p-5">
          <h3 className="font-bold text-[#0F1111] text-sm mb-4">Products by category</h3>
          <div className="h-56 flex items-center justify-center">
            <Doughnut data={productsData} options={{ ...chartOptions, maintainAspectRatio: true }} />
          </div>
        </div>
        <div className="admin-panel p-5">
          <h3 className="font-bold text-[#0F1111] text-sm mb-4">User registrations</h3>
          <div className="h-56">
            <Bar data={usersData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
