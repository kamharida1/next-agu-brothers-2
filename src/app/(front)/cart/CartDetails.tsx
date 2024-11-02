'use client'

import CldImage from '@/components/CldImage'
import useCartService from '@/lib/hooks/useCartStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoIosCart } from 'react-icons/io'
import { formatPrice } from '@/lib/utils'
import { OrderItem } from '@/lib/models/OrderModel'

export default function CartDetails() {
  const router = useRouter()
  const { items, itemsPrice, decrease, increase } = useCartService()

  const [mounted, setMounted] = useState(false)
  const [cartUpdate, setCartUpdate] = useState(0) // Track cart updates
  const [animationActive, setAnimationActive] = useState(false) // Control animation
  const [actionType, setActionType] = useState('') // Track whether it's add or remove action

  useEffect(() => {
    setMounted(true)
  }, [])

  // Trigger the animation when cartUpdate changes
  useEffect(() => {
    if (cartUpdate > 0) {
      setAnimationActive(true)
      const timer = setTimeout(() => setAnimationActive(false), 1000) // Animation duration
      return () => clearTimeout(timer)
    }
  }, [cartUpdate])

  if (!mounted) return <></>

  const handleIncrease = (item: OrderItem) => {
    increase(item)
    setCartUpdate(cartUpdate + 1) // Increment the update state
    setActionType('add') // Set action type to 'add'
  }

  const handleDecrease = (item: OrderItem) => {
    decrease(item)
    setCartUpdate(cartUpdate + 1) // Increment the update state
    setActionType('remove') // Set action type to 'remove'
  }

  return (
    <div className="w-full h-full px-3 py-4 relative">
      {/* Animation Element */}
      {animationActive && (
        <div className="absolute top-0 right-0 p-4 bg-yellow-500 text-white rounded-lg shadow-lg animate-bounce">
          {actionType === 'add'
            ? 'Item added to cart!'
            : 'Item removed from cart!'}
        </div>
      )}

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

      <h1 className="py-4 text-2xl text-center md:text-left">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-4">
          Cart is empty.{' '}
          <Link className="btn btn-primary mt-4 w-full md:w-auto" href="/">
            Go shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 md:px-0">
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
                        onClick={() => handleDecrease(item)}
                      >
                        -
                      </button>
                      <span className="px-2">{item.qty}</span>
                      <button
                        type="button"
                        className="btn btn-sm sm:btn-md"
                        onClick={() => handleIncrease(item)}
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
          <div>
            <div className="card bg-base-300 shadow-lg">
              <div className="card-body">
                <ul>
                  <li>
                    <div className="pb-4 text-xl font-semibold">
                      Subtotal ({items.reduce((acc, item) => acc + item.qty, 0)}{' '}
                      {items.reduce((acc, item) => acc + item.qty, 0) === 1 ? 'item' : 'items'}):{' '}
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
        </div>
      )}
    </div>
  )
}
