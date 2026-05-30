'use client'
import useCartService from '@/lib/hooks/useCartStore'
import useLayoutService from '@/lib/hooks/useLayout'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useWishListStore from '@/lib/hooks/useWishListStore'

const Menu = () => {
  const { theme, toggleTheme } = useLayoutService()
  const { items } = useCartService()
  const { items: wishlist } = useWishListStore()
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  const { init } = useCartService()

  useEffect(() => { setMounted(true) }, [])

  const handleClick = () => {
    ;(document.activeElement as HTMLElement).blur()
  }

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' })
    init()
  }

  const cartCount = items.reduce((a, c) => a + c.qty, 0)

  return (
    <div className="flex items-center gap-1 flex-shrink-0">

      {/* Theme toggle */}
      {mounted && (
        <button
          onClick={toggleTheme}
          className="btn-amazon-nav hidden md:flex flex-col leading-none px-2 py-1"
          title="Toggle theme"
        >
          <span className="text-[10px] text-[#CCCCCC]">{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
        </button>
      )}

      {/* Account */}
      {session?.user ? (
        <div className="dropdown dropdown-bottom dropdown-end">
          <label tabIndex={0} className="btn-amazon-nav flex flex-col leading-none cursor-pointer px-2 py-1">
            <span className="hidden md:block text-[10px] text-[#CCCCCC]">Hello, {session.user.name?.split(' ')[0]}</span>
            {/* Mobile: just a person icon */}
            <svg className="md:hidden w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:flex text-white text-sm font-bold items-center gap-0.5">
              Account &amp; Lists
              <svg className="w-3 h-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </label>
          <ul tabIndex={0} className="dropdown-content bg-white shadow-xl border border-[#D5D9D9] rounded-sm w-56 mt-1 py-2 z-[100] text-[#0F1111]">
            <li className="px-4 py-2 border-b border-[#D5D9D9]">
              <p className="text-xs text-[#565959]">{session.user.email}</p>
            </li>
            {session.user.isAdmin && (
              <li onClick={handleClick} className="hover:bg-[#F3F3F3]">
                <Link href="/admin/dashboard" className="block px-4 py-2 text-sm">Admin Dashboard</Link>
              </li>
            )}
            <li onClick={handleClick} className="hover:bg-[#F3F3F3]">
              <Link href="/order-history" className="block px-4 py-2 text-sm">Returns & Orders</Link>
            </li>
            <li onClick={handleClick} className="hover:bg-[#F3F3F3]">
              <Link href="/wishlist" className="block px-4 py-2 text-sm">
                Wish List
                {mounted && wishlist.length > 0 && (
                  <span className="ml-2 text-[#CC0C39] font-bold text-xs">({wishlist.length})</span>
                )}
              </Link>
            </li>
            <li onClick={handleClick} className="hover:bg-[#F3F3F3]">
              <Link href="/profile" className="block px-4 py-2 text-sm">Account Settings</Link>
            </li>
            <li className="border-t border-[#D5D9D9] mt-1">
              <button onClick={signoutHandler} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F3F3F3]">
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="btn-amazon-nav flex flex-col leading-none px-2 py-1"
        >
          <span className="hidden md:block text-[10px] text-[#CCCCCC]">Hello, sign in</span>
          {/* Mobile: just person icon */}
          <svg className="md:hidden w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden md:flex text-white text-sm font-bold items-center gap-0.5">
            Account &amp; Lists
            <svg className="w-3 h-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
      )}

      {/* Returns & Orders */}
      <Link href="/order-history" className="btn-amazon-nav hidden md:flex flex-col leading-none px-2 py-1">
        <span className="text-[10px] text-[#CCCCCC]">Returns</span>
        <span className="text-white text-sm font-bold">& Orders</span>
      </Link>

      {/* Cart */}
      <Link href="/cart" className="btn-amazon-nav flex items-end gap-1 px-2 py-1 relative">
        <div className="relative">
          <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 10a4 4 0 01-8 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {mounted && cartCount > 0 && (
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-[#FF9900] text-[#131921] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
        <span className="text-white text-sm font-bold hidden sm:block pb-1">Cart</span>
      </Link>
    </div>
  )
}

export default Menu
