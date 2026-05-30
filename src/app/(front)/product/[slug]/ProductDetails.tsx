'use client'
import AddToCart from '@/components/products/AddToCart'
import { convertDocToObj, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'
import React from 'react'
import { Rating } from '@/components/products/Rating'
import ProductImages from './ProductImages'
import { format } from 'date-fns'
import { Review } from '@/lib/models/ReviewModel'
import ReviewForm from './ReviewForm'
import useSWRMutation from 'swr/mutation'
import useSWR, { mutate } from 'swr'
import { useSession } from 'next-auth/react'
import {
  FiHome, FiStar, FiCheckCircle, FiXCircle,
  FiAlertCircle, FiTrash2, FiArrowLeft, FiTruck, FiShield, FiRefreshCw,
} from 'react-icons/fi'

const formatDate = (dateString: any) => {
  return format(new Date(dateString), 'MMM d, yyyy')
}

export default function ProductDetails({ product }: { product: any }) {
  const { data: session } = useSession()
  const { data: reviews, error: reviewsError } = useSWR(
    `/api/products/${product?.slug}/reviews`
  )

  const { trigger: deleteReview, isMutating: isDeleting } = useSWRMutation(
    `/api/admin/products/reviews`,
    async (url: string, { arg }: { arg: { productId: string; reviewId: string } }) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      })
      if (!response.ok) {
        const data = await response.json()
        toast.error(data.message)
        throw new Error(data.message)
      }
      toast.success('Review deleted')
      return response.text().then(t => t ? JSON.parse(t) : {})
    }
  )

  const { trigger: deleteUserReview, isMutating: isDeletingUserReview } = useSWRMutation(
    `/api/products/${product.slug}/reviews`,
    async (url: string, { arg }: { arg: { username: string; productId: string; reviewId: string } }) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      })
      if (!response.ok) {
        const data = await response.json()
        toast.error(data.message)
        throw new Error(data.message)
      }
      toast.success('Review deleted')
      return response.text().then(t => t ? JSON.parse(t) : {})
    }
  )

  if (!product) return (
    <div className="flex items-center justify-center py-16">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )

  const handleUserDelete = async (reviewId: string) => {
    if (session?.user.name && product._id) {
      await deleteUserReview({ username: session.user.name, productId: product._id, reviewId })
    }
    mutate(`/api/products/${product.slug}/reviews`)
    mutate(`/api/products/${product.slug}`)
  }

  const handleDelete = async (reviewId: string) => {
    if (product._id) {
      await deleteReview({ productId: product._id, reviewId })
    }
    mutate(`/api/products/${product.slug}/reviews`)
    mutate(`/api/products/${product.slug}`)
  }

  const inStock = product.countInStock > 0
  const isLowStock = product.countInStock > 0 && product.countInStock <= 3

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li>
            <Link href="/" className="flex items-center gap-1 text-base-content/60 hover:text-primary">
              <FiHome className="w-3.5 h-3.5" /> Home
            </Link>
          </li>
          <li>
            <Link href={`/search?category=${product.cat}`} className="text-base-content/60 hover:text-primary">
              {product.cat}
            </Link>
          </li>
          <li className="text-base-content truncate max-w-[200px]">{product.name}</li>
        </ul>
      </div>

      {/* Product Main */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
        {/* Images */}
        <div className="lg:col-span-2">
          <ProductImages images={product.images} />
        </div>

        {/* Product Info */}
        <div className="lg:col-span-2 space-y-5">
          {product.brand && (
            <span className="badge badge-outline text-xs tracking-wider">{product.brand}</span>
          )}

          <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3">
            <Rating value={product.rating} caption="" />
            <span className="text-sm text-base-content/60">
              ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            {product.discountPercentage > 0 && (
              <span className="badge badge-error text-white">-{product.discountPercentage}%</span>
            )}
          </div>

          <div className="divider"></div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-base-content/70 leading-relaxed">{product.description}</p>
          </div>

          {product.properties && Object.keys(product.properties).length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Specifications</h3>
              <div className="bg-base-200 rounded-xl overflow-hidden">
                {Object.entries(product.properties).map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex justify-between px-4 py-2 text-sm ${i % 2 === 0 ? '' : 'bg-base-100/50'}`}
                  >
                    <span className="font-medium text-base-content/70">{key}</span>
                    <span>{value as React.ReactNode}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buy Box */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow border border-base-200 sticky top-20">
            <div className="card-body p-5 space-y-4">
              <div className="text-2xl font-bold text-primary">{formatPrice(product.price)}</div>

              {/* Stock Status */}
              <div>
                {inStock ? (
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-error text-sm font-medium">
                    <FiXCircle className="w-4 h-4" />
                    <span>Out of Stock</span>
                  </div>
                )}
                {isLowStock && (
                  <div className="flex items-center gap-1 text-warning text-xs mt-1">
                    <FiAlertCircle className="w-3 h-3" />
                    Only {product.countInStock} left!
                  </div>
                )}
              </div>

              <AddToCart
                item={{
                  ...convertDocToObj(product),
                  qty: 0,
                  weight: product.weight,
                  countInStock: product.countInStock,
                }}
              />

              {/* Trust Signals */}
              <div className="space-y-2 pt-2 border-t border-base-200">
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <FiTruck className="w-3.5 h-3.5 text-primary" />
                  <span>Fast delivery across Nigeria</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <FiShield className="w-3.5 h-3.5 text-success" />
                  <span>1-Year warranty</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-base-content/60">
                  <FiRefreshCw className="w-3.5 h-3.5 text-warning" />
                  <span>7-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-base-200 pt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FiStar className="text-warning" />
          Customer Reviews
          {reviews && <span className="badge badge-ghost ml-2">{reviews.length}</span>}
        </h2>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-2">
            {product._id && <ReviewForm slug={product.slug} />}
          </div>

          {/* Review List */}
          <div className="lg:col-span-3 space-y-4">
            {reviewsError && (
              <div className="alert alert-error text-sm">Failed to load reviews</div>
            )}
            {!reviews && (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            )}
            {reviews && reviews.length === 0 && (
              <div className="text-center py-12 text-base-content/50">
                <FiStar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No reviews yet. Be the first to review!</p>
              </div>
            )}
            {reviews && reviews.map((review: Review) => (
              <div key={review._id} className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-warning fill-current' : 'text-base-content/20'}`}
                          />
                        ))}
                      </div>
                      <h4 className="font-semibold">{review.title}</h4>
                    </div>
                    <span className="text-xs text-base-content/50">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="text-base-content/70 text-sm mt-1">{review.comment}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-base-content/50">— {review.username}</span>
                    {(session?.user.isAdmin || session?.user.name === review.username) && (
                      <button
                        onClick={() => review._id && (session?.user.isAdmin ? handleDelete(review._id) : handleUserDelete(review._id))}
                        className="btn btn-ghost btn-xs text-error gap-1"
                        disabled={isDeleting || isDeletingUserReview}
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
