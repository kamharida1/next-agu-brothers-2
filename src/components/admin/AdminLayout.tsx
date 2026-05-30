'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import {
  FiBarChart2,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiTag,
  FiFileText,
  FiBriefcase,
  FiSettings,
  FiDollarSign,
  FiMessageSquare,
  FiChevronLeft,
  FiMenu,
  FiHome,
} from 'react-icons/fi'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: FiBarChart2, href: '/admin/dashboard' },
  { key: 'orders', label: 'Orders', icon: FiShoppingBag, href: '/admin/orders' },
  { key: 'products', label: 'Products', icon: FiPackage, href: '/admin/products' },
  { key: 'categories', label: 'Categories', icon: FiTag, href: '/admin/categories' },
  { key: 'users', label: 'Users', icon: FiUsers, href: '/admin/users' },
  { key: 'blog', label: 'Blog', icon: FiFileText, href: '/admin/blog' },
  { key: 'messages', label: 'Messages', icon: FiMessageSquare, href: '/admin/messages' },
  { key: 'jobs', label: 'Jobs', icon: FiBriefcase, href: '/admin/jobs' },
  { key: 'profits', label: 'Profits', icon: FiDollarSign, href: '/admin/profits' },
  { key: 'settings', label: 'Settings', icon: FiSettings, href: '/admin/settings' },
]

const AdminLayout = ({
  activeItem = 'dashboard',
  children,
  title,
}: {
  activeItem: string
  children: React.ReactNode
  title?: string
}) => {
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  if (!session || !session.user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-6xl">🔒</div>
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-base-content/60">You need admin privileges to view this page.</p>
        <Link href="/" className="btn btn-primary">Go to Homepage</Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-base-200/40">
      {/* Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col bg-base-100 border-r border-base-200 shadow-sm
          transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center h-14 border-b border-base-200 px-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && (
            <span className="font-semibold text-sm text-base-content/70 uppercase tracking-wider">
              Admin
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <FiMenu className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
              const isActive = key === activeItem
              return (
                <li key={key}>
                  <Link
                    href={href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom: Back to Store */}
        <div className="p-2 border-t border-base-200">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-base-content/60 hover:bg-base-200 hover:text-base-content transition-all ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'Back to Store' : undefined}
          >
            <FiHome className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-base-100 border-t border-base-200 px-2 py-1">
        <div className="flex items-center justify-around">
          {NAV_ITEMS.slice(0, 5).map(({ key, label, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                key === activeItem ? 'text-primary' : 'text-base-content/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Header */}
        <div className="bg-base-100 border-b border-base-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold capitalize">
              {title || activeItem.replace(/-/g, ' ')}
            </h1>
            <nav className="text-xs text-base-content/50 mt-0.5">
              <span>Admin</span>
              <span className="mx-1">/</span>
              <span className="capitalize">{activeItem}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-base-content/50">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
