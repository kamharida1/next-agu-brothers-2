'use client'
import CldImage from '@/components/CldImage'
import { Product } from '@/lib/models/ProductModel'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import useSWR from 'swr'
import { Rating } from '@/components/products/Rating'
import useWishListStore from '@/lib/hooks/useWishListStore'
import { FiHeart } from 'react-icons/fi'

export default function ProductList() {
  const { data: products, isLoading } = useSWR('/api/products/all-products')
  const { addItem, removeItem, items } = useWishListStore()

  if (isLoading) return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-[#FF9900]"></span>
    </div>
  )

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-3">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>All Products</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D5D9D9]">
            <h1 className="text-2xl font-medium text-[#0F1111]">All Products</h1>
            <span className="text-sm text-[#565959]">{products?.length || 0} results</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
            {products?.map((product: Product) => {
              const isWishlisted = items.some((p) => p._id === product._id)
              return (
                <div key={product.slug} className="amazon-card relative group flex flex-col">
                  <button
                    onClick={() => isWishlisted ? removeItem(product) : addItem(product)}
                    className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity ${isWishlisted ? '!opacity-100' : ''}`}
                  >
                    <FiHeart className={`w-3.5 h-3.5 ${isWishlisted ? 'text-[#CC0C39] fill-current' : 'text-[#565959]'}`} />
                  </button>
                  <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
                    <div className="bg-white p-3 flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
                      <CldImage
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-2 border-t border-[#F7F8F8] flex flex-col gap-1 flex-1">
                      <p className="text-xs text-[#0F1111] line-clamp-2 leading-snug group-hover:text-[#CC0C39]">{product.name}</p>
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[1,2,3,4,5].map(s => (
                              <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'text-[#FF9900]' : 'text-[#D5D9D9]'} fill-current`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </div>
                          <span className="text-[10px] text-[#007185]">({product.numReviews})</span>
                        </div>
                      )}
                      <span className="font-bold text-sm text-[#0F1111] mt-auto">{formatPrice(product.price)}</span>
                      {product.countInStock > 0
                        ? <p className="text-[#007600] text-[11px]">In Stock</p>
                        : <p className="text-[#CC0C39] text-[11px]">Out of Stock</p>
                      }
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
