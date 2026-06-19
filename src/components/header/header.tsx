import React from 'react'
import Menu from './Menu'
import { SearchBox } from './SearchBox'
import NavBar from './NavBar'
import SiteLogo from '@/components/SiteLogo'

const Header = () => {
  return (
    <header className="sticky top-0 z-50">
      {/* ── Row 1: Logo / Search / Account / Cart ── */}
      <div className="bg-[#131921] text-white">
        <div className="max-w-[1500px] mx-auto px-3 py-2 flex items-center gap-2">

          {/* Hamburger (mobile) */}
          <label
            htmlFor="my-drawer"
            className="btn-amazon-nav flex items-center gap-1 lg:hidden flex-shrink-0 p-1.5"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>

          <SiteLogo priority />

          {/* Search — hidden on mobile, shown md+ */}
          <div className="hidden md:flex flex-1 min-w-0">
            <SearchBox />
          </div>

          {/* Right menu */}
          <Menu />
        </div>

        {/* ── Mobile search row ── */}
        <div className="md:hidden px-3 pb-2">
          <SearchBox />
        </div>
      </div>

      {/* ── Row 2: Nav Bar ── */}
      <NavBar />
    </header>
  )
}

export default Header
