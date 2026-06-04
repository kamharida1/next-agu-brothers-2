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
  FiExternalLink,
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
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const pageTitle =
    title || activeItem.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  if (!session || !session.user.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <div className="admin-panel p-8 max-w-md w-full text-center">
          <p className="text-4xl mb-3">🔒</p>
          <h1 className="text-xl font-bold text-[#0F1111]">Access denied</h1>
          <p className="text-sm text-[#565959] mt-2 mb-5">
            You need administrator privileges to view this area.
          </p>
          <Link href="/" className="btn-amazon px-6 py-2 rounded-md text-sm inline-block">
            Return to store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] bg-[#EAEDED]">
      {/* Sidebar — Amazon dark header tone */}
      <aside
        className={`hidden md:flex flex-col bg-[#131921] text-white flex-shrink-0 transition-all duration-200 ${
          collapsed ? 'w-[68px]' : 'w-56'
        }`}
      >
        <div
          className={`flex items-center h-14 border-b border-[#3a4553] px-3 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!collapsed && (
            <span className="font-bold text-sm tracking-tight">
              Agu <span className="text-[#FF9900]">Admin</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded hover:bg-[#232F3E] text-[#DDD]"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <FiMenu className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map(({ key, label, icon: Icon, href }) => {
              const isActive = key === activeItem || pathname.startsWith(href)
              return (
                <li key={key}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                      isActive
                        ? 'bg-[#232F3E] text-white font-medium border-l-[3px] border-[#FF9900] pl-[9px]'
                        : 'text-[#DDD] hover:bg-[#232F3E] hover:text-white'
                    } ${collapsed ? 'justify-center px-2' : ''}`}
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

        <div className="p-2 border-t border-[#3a4553] space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-[#DDD] hover:bg-[#232F3E] hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'View store' : undefined}
          >
            <FiExternalLink className="w-4 h-4 shrink-0" />
            {!collapsed && <span>View storefront</span>}
          </Link>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-[#DDD] hover:bg-[#232F3E] ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? 'Home' : undefined}
          >
            <FiHome className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Customer site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-[#131921] border-t border-[#3a4553] px-1 py-1 safe-area-pb">
        <div className="flex justify-around">
          {NAV_ITEMS.slice(0, 5).map(({ key, label, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 min-w-0 ${
                key === activeItem ? 'text-[#FF9900]' : 'text-[#999]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] truncate max-w-[56px]">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#D5D9D9] px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#0F1111] truncate">{pageTitle}</h1>
            <p className="text-xs text-[#565959] mt-0.5">
              <Link href="/admin/dashboard" className="hover:text-[#CC0C39]">
                Admin
              </Link>
              <span className="mx-1">›</span>
              <span className="text-[#0F1111]">{pageTitle}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#0F1111]">{session.user.name}</p>
              <p className="text-xs text-[#565959]">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-sm bg-[#232F3E] flex items-center justify-center">
              <span className="text-[#FF9900] font-bold text-sm">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-auto">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
