'use client'
import useCartService from '@/lib/hooks/useCartStore'
import useLayoutService from '@/lib/hooks/useLayout'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import useWishListStore from '@/lib/hooks/useWishListStore'

const Menu = () => {
  const { theme, toggleTheme } = useLayoutService()
  const { items } = useCartService()
  const { items: wishlist } = useWishListStore()
  const [mounted, setMounted] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { data: session } = useSession()
  const { init } = useCartService()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const close = () => setAccountOpen(false)

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' })
    init()
    close()
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
        <div ref={dropdownRef} className="relative">
          {/* Trigger */}
          <button
            onClick={() => setAccountOpen((o) => !o)}
            className="btn-amazon-nav flex flex-col leading-none cursor-pointer px-2 py-1"
          >
            <span className="hidden md:block text-[10px] text-[#CCCCCC]">
              Hello, {session.user.name?.split(' ')[0]}
            </span>
            {/* Mobile: person icon */}
            <svg className="md:hidden w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden md:flex text-white text-sm font-bold items-center gap-0.5">
              Account &amp; Lists
              <svg className="w-3 h-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </button>

          {/* Dropdown — fixed on mobile so it never overflows */}
          {accountOpen && (
            <>
              {/* Backdrop for mobile */}
              <div className="fixed inset-0 z-[98] md:hidden" onClick={close} />

              <ul className="
                fixed right-2 z-[99] py-2 mt-1
                bg-white shadow-2xl border border-[#D5D9D9] rounded-sm
                w-56 text-[#0F1111]
                md:absolute md:right-0 md:fixed-none
              " style={{ top: 'var(--header-height, 104px)' }}>
                <li className="px-4 py-2 border-b border-[#D5D9D9]">
                  <p className="text-xs font-semibold text-[#0F1111] truncate">{session.user.name}</p>
                  <p className="text-xs text-[#565959] truncate">{session.user.email}</p>
                </li>
                {session.user.isAdmin && (
                  <li className="hover:bg-[#F3F3F3]">
                    <Link href="/admin/dashboard" onClick={close} className="block px-4 py-2.5 text-sm">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li className="hover:bg-[#F3F3F3]">
                  <Link href="/order-history" onClick={close} className="block px-4 py-2.5 text-sm">
                    Returns &amp; Orders
                  </Link>
                </li>
                <li className="hover:bg-[#F3F3F3]">
                  <Link href="/wishlist" onClick={close} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    Wish List
                    {mounted && wishlist.length > 0 && (
                      <span className="text-[#CC0C39] font-bold text-xs">({wishlist.length})</span>
                    )}
                  </Link>
                </li>
                <li className="hover:bg-[#F3F3F3]">
                  <Link href="/profile" onClick={close} className="block px-4 py-2.5 text-sm">
                    Account Settings
                  </Link>
                </li>
                <li className="border-t border-[#D5D9D9] mt-1">
                  <button onClick={signoutHandler} className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F3F3F3]">
                    Sign Out
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="btn-amazon-nav flex flex-col leading-none px-2 py-1"
        >
          <span className="hidden md:block text-[10px] text-[#CCCCCC]">Hello, sign in</span>
          <svg className="md:hidden w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
        <span className="text-white text-sm font-bold">&amp; Orders</span>
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
