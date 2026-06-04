'use client'
import CldImage from '@/components/CldImage'
import useCartService from '@/lib/hooks/useCartStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Price from '@/components/products/Price'
import { OrderItem } from '@/lib/models/OrderModel'
import { FiTrash2 } from 'react-icons/fi'

export default function CartDetails() {
  const router = useRouter()
  const { items, itemsPrice, decrease, increase } = useCartService()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const totalItems = items.reduce((a, c) => a + c.qty, 0)

  if (items.length === 0) {
    return (
      <div className="bg-[#EAEDED] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-sm shadow-sm text-center max-w-lg mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-medium text-[#0F1111] mb-2">Your Shopping Cart is empty</h1>
            <p className="text-[#565959] mb-6">Your Shopping Cart lives to serve. Give it purpose — fill it with groceries, clothing, household supplies, electronics, and more.</p>
            <Link href="/" className="btn-amazon px-8 py-3 rounded-md inline-block text-sm">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">

          {/* ── Cart Items (left) ── */}
          <div className="flex-1 bg-white rounded-sm shadow-sm p-5">
            <h1 className="text-3xl font-normal text-[#0F1111] border-b border-[#D5D9D9] pb-4 mb-4">
              Shopping Cart
            </h1>
            <div className="text-right text-sm text-[#565959] border-b border-[#D5D9D9] pb-2 mb-2 hidden md:block">
              Price
            </div>

            {items.map((item: OrderItem) => (
              <div key={item.slug} className="flex gap-4 py-4 border-b border-[#D5D9D9] last:border-0">
                {/* Image */}
                <Link href={`/product/${item.slug}`} className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 bg-white flex items-center justify-center">
                  <CldImage
                    src={item.images[0]}
                    alt={item.name}
                    width={140}
                    height={140}
                    className="object-contain w-full h-full"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-[#007185] hover:text-[#CC0C39] hover:underline text-base line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-[#007600] text-sm mt-1 font-medium">In Stock</p>
                  <p className="text-sm text-[#565959] mt-0.5"><Price amount={item.price} size="sm" /> each</p>

                  {/* Qty + Delete */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-[#D5D9D9] rounded-md bg-[#F7F8F8]">
                      <button
                        type="button"
                        onClick={() => decrease(item)}
                        className="w-9 h-9 flex items-center justify-center text-lg font-bold text-[#0F1111] hover:bg-[#EAEDED] rounded-l-md"
                        title={item.qty === 1 ? 'Remove' : 'Decrease'}
                      >
                        {item.qty === 1 ? <FiTrash2 className="w-3.5 h-3.5 text-[#CC0C39]" /> : '−'}
                      </button>
                      <span className="px-3 text-sm font-medium text-[#0F1111] min-w-[2.5rem] text-center">
                        Qty: {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => increase(item)}
                        disabled={item.qty >= item.countInStock}
                        className="w-9 h-9 flex items-center justify-center text-lg font-bold text-[#0F1111] hover:bg-[#EAEDED] rounded-r-md disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[#D5D9D9]">|</span>
                    <button
                      type="button"
                      onClick={() => { for (let i = 0; i < item.qty; i++) decrease(item) }}
                      className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Price (right) */}
                <div className="hidden md:block text-right flex-shrink-0">
                  <Price amount={item.price * item.qty} size="md" />
                </div>
              </div>
            ))}

            <div className="text-right text-base font-medium text-[#0F1111] pt-3">
              Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):
              <span className="font-bold inline-flex"> <Price amount={itemsPrice} size="md" /></span>
            </div>
          </div>

          {/* ── Order Summary (right) ── */}
          <div className="w-full lg:w-80 bg-white rounded-sm shadow-sm p-5 flex-shrink-0">
            {/* Secure badge */}
            <div className="flex items-center gap-2 text-[#007600] text-sm mb-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              Your order is secure
            </div>

            <p className="text-xl font-medium text-[#0F1111] mb-1">
              Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):{' '}
              <span className="font-bold inline-flex"><Price amount={itemsPrice} size="md" /></span>
            </p>
            <p className="text-sm text-[#565959] mb-4">Shipping and tax calculated at checkout.</p>

            <button
              className="btn-amazon w-full py-2.5 rounded-md text-sm font-normal"
              onClick={() => router.push('/shipping')}
            >
              Proceed to checkout ({totalItems} item{totalItems !== 1 ? 's' : ''})
            </button>

            <Link href="/" className="btn-amazon-outline w-full py-2.5 rounded-md text-sm text-center mt-2 block">
              Continue shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
