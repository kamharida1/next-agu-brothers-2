'use client'
import Link from 'next/link'
import useWishListStore from '@/lib/hooks/useWishListStore'
import CldImage from '@/components/CldImage'
import { formatPrice } from '@/lib/utils'
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi'
import useCartService from '@/lib/hooks/useCartStore'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { items, removeItem } = useWishListStore()
  const { increase } = useCartService()

  const addToCart = (item: any) => {
    increase({ ...item, qty: 0, weight: item.weight || 0, countInStock: item.countInStock || 1 })
    toast.success(`${item.name} added to cart!`, { icon: '🛒' })
  }

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-4">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <Link href="/profile" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Your Account</Link>
          <span className="mx-1">›</span>
          <span>Your Wish List</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-5">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#D5D9D9]">
            <FiHeart className="w-6 h-6 text-[#CC0C39] fill-current" />
            <h1 className="text-2xl font-medium text-[#0F1111]">Your Wish List</h1>
            <span className="text-sm text-[#565959]">({items.length} item{items.length !== 1 ? 's' : ''})</span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <FiHeart className="w-16 h-16 mx-auto text-[#D5D9D9] mb-4" />
              <h2 className="text-xl font-medium text-[#0F1111] mb-2">Your Wish List is empty</h2>
              <p className="text-[#565959] mb-6 max-w-sm mx-auto">
                Add items you love to your wish list. Review them anytime and move them to your cart.
              </p>
              <Link href="/" className="btn-amazon px-8 py-3 rounded-md inline-block text-sm">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item._id} className="amazon-card group flex flex-col">
                  <Link href={`/product/${item.slug}`} className="flex-1">
                    <div className="bg-white p-4 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                      <CldImage
                        src={item.images[0]}
                        alt={item.name}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-3 border-t border-[#F7F8F8]">
                      <p className="text-sm text-[#0F1111] line-clamp-2 leading-snug group-hover:text-[#CC0C39]">
                        {item.name}
                      </p>
                      <p className="font-bold text-base text-[#0F1111] mt-1.5">{formatPrice(item.price)}</p>
                      <p className="text-[#007600] text-xs mt-0.5">In Stock</p>
                    </div>
                  </Link>
                  <div className="p-3 pt-0 flex flex-col gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="btn-amazon w-full py-2 rounded-md text-sm flex items-center justify-center gap-1"
                    >
                      <FiShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeItem(item)}
                      className="flex items-center justify-center gap-1 text-xs text-[#CC0C39] hover:underline py-1"
                    >
                      <FiTrash2 className="w-3 h-3" />
                      Remove from list
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
