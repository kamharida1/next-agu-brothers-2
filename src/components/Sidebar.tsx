'use client'
import useLayoutService from '@/lib/hooks/useLayout'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import useSWR from 'swr'
import { FiX } from 'react-icons/fi'
import { categoryHref } from '@/lib/categorySlugs'
import SocialLinks from '@/components/SocialLinks'

const Sidebar = () => {
  const { toggleDrawer } = useLayoutService()
  const { data: categories } = useSWR('/api/products/categories')
  const { data: brands } = useSWR('/api/products/brands')
  const { data: session } = useSession()

  return (
    <div className="w-72 min-h-full bg-white flex flex-col text-[#0F1111] overflow-y-auto">
      {/* Header */}
      <div className="bg-[#232F3E] text-white flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF9900] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold text-sm">
            {session?.user ? `Hello, ${session.user.name?.split(' ')[0]}` : 'Hello, sign in'}
          </span>
        </div>
        <label htmlFor="my-drawer" className="cursor-pointer hover:text-[#FF9900]">
          <FiX className="w-5 h-5" />
        </label>
      </div>

      {/* Sign in CTA */}
      {!session?.user && (
        <div className="p-4 border-b border-[#D5D9D9]">
          <button onClick={() => signIn()} className="btn-amazon w-full py-2 rounded-md text-sm">
            Sign in
          </button>
          <p className="text-xs text-center mt-2">
            New customer?{' '}
            <Link href="/register" onClick={toggleDrawer} className="text-[#007185] hover:underline">
              Start here
            </Link>
          </p>
        </div>
      )}

      <div className="flex-1">
        {/* Shop by Department */}
        <div className="py-2">
          <div className="px-4 py-2">
            <p className="text-sm font-bold text-[#0F1111]">Shop By Department</p>
          </div>
          <Link href="/all-products" onClick={toggleDrawer}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#EAEDED] transition-colors">
            All Products
          </Link>
          {categories?.map((cat: string) => (
            <Link key={cat} href={categoryHref(cat)} onClick={toggleDrawer}
              className="flex items-center justify-between px-4 py-2 text-sm hover:bg-[#EAEDED] transition-colors">
              <span>{cat}</span>
              <svg className="w-4 h-4 text-[#565959]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Shop by Brand */}
        {brands && brands.length > 0 && (
          <div className="py-2 border-t border-[#D5D9D9]">
            <div className="px-4 py-2">
              <p className="text-sm font-bold text-[#0F1111]">Shop by Brand</p>
            </div>
            {brands.map((brand: string) => (
              <Link key={brand} href={`/${brand}`} onClick={toggleDrawer}
                className="flex items-center justify-between px-4 py-2 text-sm hover:bg-[#EAEDED] transition-colors">
                <span>{brand}</span>
                <svg className="w-4 h-4 text-[#565959]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}

        {/* Help & Settings */}
        <div className="py-2 border-t border-[#D5D9D9]">
          <div className="px-4 py-2">
            <p className="text-sm font-bold text-[#0F1111]">Help & Settings</p>
          </div>
          {[
            { href: '/profile', label: 'Your Account' },
            { href: '/order-history', label: 'Orders & Returns' },
            { href: '/contact-us', label: 'Customer Service' },
          ].map((l) => (
            <Link key={l.href} href={l.href} onClick={toggleDrawer}
              className="block px-4 py-2 text-sm hover:bg-[#EAEDED] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <SocialLinks variant="sidebar" />
      </div>
    </div>
  )
}

export default Sidebar
