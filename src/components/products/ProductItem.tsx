'use client'

import { Product } from '@/lib/models/ProductModel'
import { useRouter } from 'next/navigation'
import { Rating } from './Rating'
import CldImage from '../CldImage'
import useWishListStore from '@/lib/hooks/useWishListStore'
import { formatPrice } from '@/lib/utils'
import { FiHeart } from 'react-icons/fi'

export default function ProductItem({ product }: { product: Product }) {
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
          crop="fit"
          className="object-contain w-full h-full"
        />
      </div>

      {/* Info */}
      <div className="p-3 border-t border-[#F7F8F8] flex flex-col gap-1.5 flex-1">
        <h2 className="text-sm text-[#0F1111] line-clamp-2 leading-snug">{product.name}</h2>
        <Rating value={product.rating} caption={`${product.numReviews} reviews`} />
        {product.brand && <p className="text-xs text-[#565959]">{product.brand}</p>}
        <div className="mt-auto pt-1">
          <span className="text-lg font-bold text-[#0F1111]">{formatPrice(product.price)}</span>
        </div>
        {inStock
          ? <p className="text-[#007600] text-xs">In Stock</p>
          : <p className="text-[#CC0C39] text-xs">Out of Stock</p>
        }
      </div>

      {/* See Details */}
      <div className="p-3 pt-0" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn-amazon w-full text-sm py-1.5 rounded-md"
          onClick={() => router.push(`/product/${product.slug}`)}
        >
          See Details
        </button>
      </div>
    </div>
  )
}
