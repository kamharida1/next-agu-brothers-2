'use client'

import { Product } from '@/lib/models/ProductModel'
import Link from 'next/link'
import CldImage from '../CldImage'
import useWishListStore from '@/lib/hooks/useWishListStore'
import { ProductPrice } from './Price'
import { hasDiscount } from '@/lib/productPricing'
import { FiHeart } from 'react-icons/fi'

export type ProductCardProps = {
  product: Product
  priority?: boolean
  /** Dense grid (all-products catalog) */
  compact?: boolean
  /** Search-style footer CTA */
  showDetailsButton?: boolean
}

function StarRating({
  rating,
  numReviews,
  starClass,
  reviewClass,
}: {
  rating: number
  numReviews: number
  starClass: string
  reviewClass: string
}) {
  if (rating <= 0) return null
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            className={`${starClass} ${s <= Math.round(rating) ? 'text-[#FF9900]' : 'text-[#D5D9D9]'} fill-current`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className={reviewClass}>({numReviews})</span>
    </div>
  )
}

/** Hover-only effects — avoids first tap “sticking” hover on touch devices */
const HOVER_DEVICE =
  '[@media(hover:hover)_and_(pointer:fine)]:' as const

export default function ProductCard({
  product,
  priority = false,
  compact = false,
  showDetailsButton = false,
}: ProductCardProps) {
  const { addItem, removeItem, items } = useWishListStore()
  const isWishlisted = items.some((p) => p._id === product._id)
  const inStock = product.countInStock > 0
  const imageSrc = product.images?.[0] || product.image
  const productHref = `/product/${product.slug}`

  const handleWishList = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isWishlisted ? removeItem(product) : addItem(product)
  }

  const wishlistBtn = compact
    ? `absolute top-2 right-2 z-[2] w-7 h-7 rounded-full bg-white/90 shadow items-center justify-center
       hidden ${HOVER_DEVICE}flex
       ${HOVER_DEVICE}opacity-0 ${HOVER_DEVICE}pointer-events-none
       ${HOVER_DEVICE}group-hover:opacity-100 ${HOVER_DEVICE}group-hover:pointer-events-auto
       transition-opacity
       ${isWishlisted ? `${HOVER_DEVICE}!opacity-100 ${HOVER_DEVICE}!pointer-events-auto` : ''}`
    : `absolute top-2 right-2 z-[2] w-8 h-8 rounded-full shadow flex items-center justify-center transition-colors
       ${isWishlisted ? 'bg-[#CC0C39] text-white' : 'bg-white/90 text-[#565959] hover:bg-white'}`

  return (
    <article
      className={`amazon-card relative flex flex-col group ${compact ? 'active:scale-[0.99]' : ''}`}
    >
      {/* Stretched link — single tap navigates on mobile (no button inside <a>) */}
      <Link
        href={productHref}
        className="absolute inset-0 z-[1] rounded-[inherit] touch-manipulation"
        aria-label={`View ${product.name}`}
      />

      <button
        type="button"
        onClick={handleWishList}
        className={wishlistBtn}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <FiHeart
          className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${isWishlisted ? 'fill-current text-[#CC0C39]' : ''}`}
        />
      </button>

      <div
        className={`relative aspect-square bg-base-100 overflow-hidden pointer-events-none ${
          showDetailsButton ? 'rounded-t-[inherit]' : ''
        }`}
      >
        <CldImage
          src={imageSrc}
          alt={product.name}
          fill
          sizes={
            compact
              ? '(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw'
              : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
          }
          priority={priority}
          className={`object-contain ${
            compact
              ? `p-2 ${HOVER_DEVICE}group-hover:scale-105 ${HOVER_DEVICE}transition-transform ${HOVER_DEVICE}duration-200`
              : 'p-3'
          }`}
        />
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-[#CC0C39] text-white text-xs font-bold px-3 py-1 rounded-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div
        className={`border-t border-[#F7F8F8] flex flex-col flex-1 pointer-events-none ${
          compact ? 'p-2 gap-1' : 'p-3 gap-1.5'
        }`}
      >
        {!compact && !showDetailsButton && product.brand && (
          <p className="text-[10px] text-[#565959] uppercase tracking-wider">{product.brand}</p>
        )}
        <h3
          className={`text-[#0F1111] line-clamp-2 leading-snug ${
            compact
              ? `text-xs ${HOVER_DEVICE}group-hover:text-[#CC0C39]`
              : 'text-sm'
          }`}
        >
          {product.name}
        </h3>

        <StarRating
          rating={product.rating}
          numReviews={product.numReviews}
          starClass={compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}
          reviewClass={compact ? 'text-[10px] text-[#007185]' : 'text-[11px] text-[#007185]'}
        />

        {showDetailsButton && product.brand && (
          <p className="text-xs text-[#565959]">{product.brand}</p>
        )}

        <div className="mt-auto pt-1 flex flex-wrap items-center gap-1.5">
          <ProductPrice product={product} size={compact ? 'sm' : 'md'} />
          {hasDiscount(product) && (
            <span className="text-[10px] font-bold text-white bg-[#CC0C39] px-1.5 py-0.5 rounded-sm">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {inStock ? (
          <p className={`text-[#007600] ${compact ? 'text-[11px]' : 'text-xs'}`}>In Stock</p>
        ) : (
          <p className={`text-[#CC0C39] ${compact ? 'text-[11px]' : 'text-xs'}`}>Out of Stock</p>
        )}
      </div>

      {showDetailsButton && (
        <div className="p-3 pt-0 pointer-events-none">
          <span className="btn-amazon w-full text-sm py-1.5 rounded-md block text-center">
            See Details
          </span>
        </div>
      )}
    </article>
  )
}
