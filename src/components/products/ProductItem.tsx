'use client'

import { Product } from '@/lib/models/ProductModel'
import Link from 'next/link'
import React from 'react'
import { Rating } from './Rating'
import CldImage from '../CldImage'
import useWishListStore from '@/lib/hooks/useWishListStore'
import { formatPrice } from '@/lib/utils'


export default function ProductItem({ product }: { product: Product }) {
  const { addItem, removeItem, items } = useWishListStore()
  
  //toggle wishlist
  const handleWishList = (product: Product) => {
    const isWishlisted = items.some((p) => p._id === product._id)
    isWishlisted ? removeItem(product) : addItem(product)
  }
  return (
    <div className="card card-compact w-80 h-auto bg-base-100 shadow-xl m-6 transition-transform transform hover:scale-60 ">
      <Link href={`/product/${product.slug}`}>
        <figure className="relative overflow-hidden">
          <CldImage
            src={product.images[0]}
            alt={product.name}
            width="300"
            height="300"
            crop={"fit"}
            sizes="100vw"
            className="object-cover  w-full h-64 rounded-t-xl transition-transform transform hover:scale-60"
          />
          <button
            type="button"
            onClick={() => handleWishList(product)}
            className="absolute top-2 right-2 p-2 opacity-80 bg-white btn-sm rounded-full shadow-lg z-10 items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 fill-current ${
                items.some((p) => p._id === product._id)
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 14.25l-1.45-1.32C3.1 10.07 0 7.21 0 4.5 0 2.42 1.5 1 4 1c1.34 0 2.64.76 4 2.11C9.36 1.76 10.66 1 12 1c2.5 0 4 1.42 4 3.5 0 2.71-3.1 5.57-6.55 8.43L8 14.25z"
              />
            </svg>
          </button>
        </figure>
      </Link>
      <div className="card-body p-6">
        <Link href={`/product/${product.slug}`}>
          <h2 className="card-title font-medium hover:font-bold transition-colors">
            {product.name}
          </h2>
        </Link>
        <Rating
          value={product.rating}
          caption={`(${product.numReviews} reviews)`}
        />
        <p className="text-sm mt-2">{product.brand}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          <Link href={`/product/${product.slug}`}>
            <button className="btn btn-primary btn-sm">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
