'use client'

import CldImage from "@/components/CldImage"
import useCartService from "@/lib/hooks/useCartStore"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IoIosCart } from "react-icons/io"
import { formatPrice } from "@/lib/utils"

export default function CartDetails() { 
  const router = useRouter()
  const { items, itemsPrice, decrease, increase } = useCartService()
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  return (
    <div className="w-full h-screen px-3 py-2">
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul>
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
            <IoIosCart className="w-4 h-4 mr-2 stroke-current" />
            Cart
          </li>
        </ul>
      </div>
      <h1 className="py-4 text-2xl">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="mt-4">
          Cart is empty.{' '}
          <Link
            className="p-4 rounded ml-6 mt-4 w-64 bg-yellow-700 text-white "
            href="/"
          >
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.slug}>
                    <td>
                      <Link
                        href={`/product/${item.slug}`}
                        className="flex items-center"
                      >
                        <CldImage
                          src={item.images[0]}
                          alt={item.name}
                          width={50}
                          height={70}
                          className="rounded-md object-cover object-center"
                        />
                        <span className="px-2 font-medium text-md">
                          {item.name}
                        </span>
                      </Link>
                    </td>
                    <td className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        type="button"
                        className="btn btn-sm sm:btn-md"
                        onClick={() => decrease(item)}
                      >
                        -
                      </button>
                      <span className="px-2">{item.qty}</span>
                      <button
                        type="button"
                        className="btn btn-sm sm:btn-md"
                        onClick={() => increase(item)}
                      >
                        +
                      </button>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card bg-base-300">
              <div className="card-body">
                <ul>
                  <li>
                    <div className="pb-3 text-xl">
                      Subtotal ({items.reduce((acc, item) => acc + item.qty, 0)}{' '}
                      {items.reduce((acc, item) => acc + item.qty, 0) === 1
                        ? 'item'
                        : 'items'}
                      )  :
                      {formatPrice(itemsPrice)}
                    </div>
                  </li>
                  <li>
                    <button
                      className="btn btn-primary w-full"
                      onClick={() => router.push('/shipping')}
                    >
                      Proceed to checkout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}