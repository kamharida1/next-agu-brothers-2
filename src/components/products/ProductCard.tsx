'use client'

import { Product } from '@/lib/models/ProductModel'
import { useRouter } from 'next/navigation'
import CldImage from '../CldImage'
import useWishListStore from '@/lib/hooks/useWishListStore'
import { formatPrice } from '@/lib/utils'
import { FiHeart } from 'react-icons/fi'

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const router = useRouter()
  const { addItem, removeItem, items } = useWishListStore()
  const isWishlisted = items.some((p) => p._id === product._id)
  const inStock = product.countInStock > 0

  const handleWishList = (e: React.MouseEvent) => {
    e.stopPropagation()
    isWishlisted ? removeItem(product) : addItem(product)
  }

  return (
    <div
      className="amazon-card relative flex flex-col cursor-pointer"
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      {/* Wishlist */}
      <button
        type="button"
        onClick={handleWishList}
        className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full shadow
                    flex items-center justify-center transition-colors
                    ${isWishlisted ? 'bg-[#CC0C39] text-white' : 'bg-white/90 text-[#565959] hover:bg-white'}`}
        aria-label="Toggle wishlist"
      >
        <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Image */}
      <div className="bg-white flex items-center justify-center p-4" style={{ aspectRatio: '1/1' }}>
        <CldImage
          src={product.images[0]}
          alt={product.name}
          width={200}
          height={200}
          priority={priority}
          className="object-contain w-full h-full"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-[#CC0C39] text-white text-xs font-bold px-3 py-1 rounded-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 border-t border-[#F7F8F8] flex flex-col flex-1 gap-1">
        {product.brand && (
          <p className="text-[10px] text-[#565959] uppercase tracking-wider">{product.brand}</p>
        )}
        <h3 className="text-sm text-[#0F1111] line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? 'text-[#FF9900]' : 'text-[#D5D9D9]'} fill-current`} viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-[#007185]">({product.numReviews})</span>
          </div>
        )}

        <div className="mt-auto pt-1">
          <span className="text-lg font-bold text-[#0F1111]">{formatPrice(product.price)}</span>
        </div>
        {inStock && <p className="text-[#007600] text-xs">In Stock</p>}
      </div>
    </div>
  )
}
