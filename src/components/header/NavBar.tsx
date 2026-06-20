'use client'
import Link from 'next/link'
import useSWR from 'swr'
import { categoryHref } from '@/lib/categorySlugs'

const STATIC_LINKS = [
  { label: '☰ All', href: '/all-products' },
  { label: 'Departments', href: '/categories' },
  { label: 'Best Prices', href: '/search?sort=lowest' },
  { label: 'Blog', href: '/blog' },
]

export default function NavBar() {
  const { data: categories } = useSWR('/api/products/categories')

  return (
    <div className="bg-[#232F3E] text-white">
      <div className="max-w-[1500px] mx-auto px-3">
        <div className="flex items-center overflow-x-auto no-scrollbar">
          {STATIC_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className="btn-amazon-nav whitespace-nowrap text-sm py-1.5 px-2.5">
              {l.label}
            </Link>
          ))}
          {categories?.map((cat: string) => (
            <Link
              key={cat}
              href={categoryHref(cat)}
              className="btn-amazon-nav whitespace-nowrap text-sm py-1.5 px-2.5"
            >
              {cat}
            </Link>
          ))}
          <Link href="/contact-us"
            className="btn-amazon-nav whitespace-nowrap text-sm py-1.5 px-2.5">
            Customer Service
          </Link>
        </div>
      </div>
    </div>
  )
}
