'use client'
import CldImage from "@/components/CldImage"
import { Product } from "@/lib/models/ProductModel"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { RiBloggerLine } from "react-icons/ri"
import useSWR from "swr"

export default function ProductList() {
  const { data: products, isLoading } = useSWR('/api/products/all-products')
  
  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <div className="text-sm breadcrumbs border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={'/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <RiBloggerLine className="w-4 h-4 mr-2 stroke-current" />
            All Products
          </li>
        </ul>
      </div>
      <div className="block">
        {/* Responsive grid for different screen sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-4">
          {products.map((product: Product) => (
            <div key={product.slug} className="border border-gray-200 p-4 rounded-lg hover:shadow-lg transition-shadow">
              <Link href={`/product/${product.slug}`}>
                <CldImage
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-48 rounded-md"
                />
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-lg font-semibold text-orange-600">
                  {formatPrice(product.price)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

