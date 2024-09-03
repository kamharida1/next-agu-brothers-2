'use client'

import useLayoutService from '@/lib/hooks/useLayout'
import Link from 'next/link'
import useSWR from 'swr'

const Sidebar = () => {
  const { toggleDrawer } = useLayoutService()
  const { data: categories, error } = useSWR('/api/products/categories')
  const { data: brands } = useSWR('/api/products/brands')
  
  if (error) return error.message
  if (!categories) return 'Loading...'
  if (!brands) return 'Loading...'

  return (
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <li className='text-xl'>
        <Link href="/all-products" onClick={toggleDrawer}>
          All Products
        </Link>
      </li>
      <li>
        <h2 className="text-xl">Shop By Department</h2>
      </li>
      {categories.map((category: string) => (
        <li key={category}>
          <Link href={`/search?category=${category}`} onClick={toggleDrawer}>
            {category}
          </Link>
        </li>
      ))}
      <li>
        <h2 className="text-xl">Shop By Brand</h2>
      </li>
      {brands.map((brand: string) => (
        <li key={brand}>
          <Link href={`/${brand}`} onClick={toggleDrawer}>
            {brand}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Sidebar
