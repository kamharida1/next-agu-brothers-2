'use client'
import CldImage from "@/components/CldImage"
import { Product } from "@/lib/models/ProductModel"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
import { format } from "path"
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
        <div className="grid grid-cols-5 gap-4 m-4">
          {products.map((product: Product) => (
            <div key={product.slug} className="border border-gray-200 p-4">
              <Link href={`/product/${product.slug}`}>
                <CldImage
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-48"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                {/* <p className="text-sm text-gray-600">{product.description}</p> */}
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

const ProductTile = () => { 
  return (
    <></>
  )
}