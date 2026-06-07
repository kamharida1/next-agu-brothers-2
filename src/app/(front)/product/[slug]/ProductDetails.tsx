'use client'

import AddToCart from '@/components/products/AddToCart'
import { ProductPrice } from '@/components/products/Price'
import { getSalePrice } from '@/lib/productPricing'
import { convertDocToObj } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'
import React from 'react'
import { categoryHref } from '@/lib/categorySlugs'
import { Rating } from '@/components/products/Rating'
import ProductImages from './ProductImages'
import { format } from 'date-fns'
import { Product } from '@/lib/models/ProductModel'
import { Review } from '@/lib/models/ReviewModel'
import ReviewForm from './ReviewForm'
import ReviewSummary from './ReviewSummary'
import useSWRMutation from 'swr/mutation'
import useSWR, { mutate } from 'swr'
import { useSession } from 'next-auth/react'
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrash2,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiStar,
} from 'react-icons/fi'

const formatDate = (dateString: string | Date | undefined) =>
  dateString ? format(new Date(dateString), 'MMM d, yyyy') : ''

function reviewerInitial(name: string) {
  return (name?.trim()?.[0] ?? '?').toUpperCase()
}

function ReviewCard({
  review,
  canDelete,
  onDelete,
  deleting,
}: {
  review: Review
  canDelete: boolean
  onDelete: () => void
  deleting: boolean
}) {
  return (
    <article className="border border-[#D5D9D9] rounded-lg p-4 sm:p-5 bg-white hover:border-[#AAAAAA] transition-colors">
      <header className="flex gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full bg-[#232F3E] text-white flex items-center justify-center text-sm font-bold shrink-0"
          aria-hidden
        >
          {reviewerInitial(review.username)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#0F1111] truncate">{review.username}</p>
          <div
            className="flex gap-0.5 mt-0.5"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < review.rating
                    ? 'text-[#FF9900] fill-[#FF9900]'
                    : 'text-[#D5D9D9]'
                }`}
              />
            ))}
          </div>
        </div>
        <time
          className="text-xs text-[#565959] shrink-0"
          dateTime={String(review.createdAt)}
        >
          {formatDate(review.createdAt)}
        </time>
      </header>

      <h3 className="font-bold text-[#0F1111] mb-2">{review.title}</h3>
      <p className="text-sm text-[#0F1111] leading-relaxed">{review.comment}</p>

      {canDelete && (
        <footer className="mt-4 pt-3 border-t border-[#EAEDED]">
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-[#007185] hover:text-[#CC0C39] hover:underline flex items-center gap-1 disabled:opacity-50"
            disabled={deleting}
          >
            <FiTrash2 className="w-3 h-3" /> Remove review
          </button>
        </footer>
      )}
    </article>
  )
}

function BuyBox({
  product,
  inStock,
  isLowStock,
}: {
  product: Product
  inStock: boolean
  isLowStock: boolean
}) {
  return (
    <div className="bg-white border border-[#D5D9D9] rounded-lg p-4 sm:p-5 shadow-sm lg:sticky lg:top-[calc(var(--header-height)+1rem)]">
      <ProductPrice product={product} size="lg" className="mb-3" />

      <div className="mb-4">
        {inStock ? (
          <p className="text-[#007600] text-sm font-medium flex items-center gap-1.5">
            <FiCheckCircle className="w-4 h-4 shrink-0" />
            In Stock
          </p>
        ) : (
          <p className="text-[#B12704] text-sm font-medium flex items-center gap-1.5">
            <FiXCircle className="w-4 h-4 shrink-0" />
            Currently unavailable
          </p>
        )}
        {isLowStock && (
          <p className="text-[#B12704] text-xs mt-1 flex items-center gap-1">
            <FiAlertCircle className="w-3 h-3" />
            Only {product.countInStock} left in stock
          </p>
        )}
      </div>

      <AddToCart
        variant="amazon"
        item={{
          ...convertDocToObj(product),
          price: getSalePrice(product),
          qty: 0,
          weight: product.weight,
          countInStock: product.countInStock,
        }}
      />

      <ul className="mt-4 pt-4 border-t border-[#D5D9D9] space-y-2.5 text-xs text-[#565959]">
        <li className="flex items-start gap-2">
          <FiTruck className="w-4 h-4 text-[#007185] shrink-0 mt-0.5" />
          <span>Fast delivery across Nigeria</span>
        </li>
        <li className="flex items-start gap-2">
          <FiShield className="w-4 h-4 text-[#007185] shrink-0 mt-0.5" />
          <span>1-year manufacturer warranty</span>
        </li>
        <li className="flex items-start gap-2">
          <FiRefreshCw className="w-4 h-4 text-[#007185] shrink-0 mt-0.5" />
          <span>7-day return policy on eligible items</span>
        </li>
      </ul>
    </div>
  )
}

export default function ProductDetails({
  product,
  initialReviews = [],
}: {
  product: Product
  initialReviews?: Review[]
}) {
  const { data: session } = useSession()
  const { data: reviews, error: reviewsError } = useSWR(
    `/api/products/${product?.slug}/reviews`,
    null,
    { fallbackData: initialReviews.length > 0 ? initialReviews : undefined }
  )

  const { trigger: deleteReview, isMutating: isDeleting } = useSWRMutation(
    `/api/admin/products/reviews`,
    async (url: string, { arg }: { arg: { productId: string; reviewId: string } }) => {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.message)
        throw new Error(data.message)
      }
      toast.success('Review deleted')
      return res.text().then((t) => (t ? JSON.parse(t) : {}))
    }
  )

  const { trigger: deleteUserReview, isMutating: isDeletingUserReview } =
    useSWRMutation(
      `/api/products/${product.slug}/reviews`,
      async (
        url: string,
        { arg }: { arg: { username: string; productId: string; reviewId: string } }
      ) => {
        const res = await fetch(url, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(arg),
        })
        if (!res.ok) {
          const data = await res.json()
          toast.error(data.message)
          throw new Error(data.message)
        }
        toast.success('Review deleted')
        return res.text().then((t) => (t ? JSON.parse(t) : {}))
      }
    )

  if (!product) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="loading loading-spinner loading-lg text-[#FF9900]" />
      </div>
    )
  }

  const handleUserDelete = async (reviewId: string) => {
    if (session?.user.name && product._id) {
      await deleteUserReview({
        username: session.user.name,
        productId: product._id,
        reviewId,
      })
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
  const reviewCount = reviews?.length ?? product.numReviews ?? 0
  const hasReviews = reviewCount > 0

  return (
    <main className="max-w-[1200px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-[#565959] mb-4">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-[#CC0C39] hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#565959]">
            ›
          </li>
          <li>
            <Link
              href={categoryHref(product.cat)}
              className="hover:text-[#CC0C39] hover:underline"
            >
              {product.cat}
            </Link>
          </li>
          <li aria-hidden="true" className="text-[#565959]">
            ›
          </li>
          <li className="text-[#0F1111] truncate max-w-[min(100%,280px)]" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product hero */}
      <article className="bg-white border border-[#D5D9D9] rounded-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,40%)_minmax(0,1fr)_280px] gap-6 lg:gap-8">
          {/* Gallery */}
          <section aria-label="Product images" className="min-w-0">
            <ProductImages images={product.images} />
          </section>

          {/* Buy box — right after gallery on mobile */}
          <aside className="lg:hidden">
            <BuyBox product={product} inStock={inStock} isLowStock={isLowStock} />
          </aside>

          {/* Product info */}
          <section className="min-w-0 space-y-3 sm:space-y-4">
            {product.brand && (
              <Link
                href={`/${encodeURIComponent(product.brand)}`}
                className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline inline-block"
              >
                Visit the {product.brand} Store
              </Link>
            )}

            <h1 className="text-xl sm:text-2xl lg:text-[28px] font-normal leading-snug text-[#0F1111]">
              {product.name}
            </h1>

            {hasReviews && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Rating value={product.rating} caption="" />
                <Link
                  href="#customer-reviews"
                  className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline"
                >
                  {reviewCount} {reviewCount === 1 ? 'rating' : 'ratings'}
                </Link>
              </div>
            )}

            <div className="hidden sm:flex flex-wrap items-baseline gap-3 pt-1">
              <ProductPrice product={product} size="xl" />
              {product.discountPercentage > 0 && (
                <span className="text-sm text-[#CC0C39] font-medium">
                  -{product.discountPercentage}% off
                </span>
              )}
            </div>

            <hr className="border-[#D5D9D9] my-4" />

            <div>
              <h2 className="text-base font-bold text-[#0F1111] mb-2">About this item</h2>
              <p className="text-sm text-[#0F1111] leading-relaxed">{product.description}</p>
            </div>

            {product.properties && Object.keys(product.properties).length > 0 && (
              <div>
                <h2 className="text-base font-bold text-[#0F1111] mb-2">Product details</h2>
                <dl className="text-sm border border-[#D5D9D9] rounded-sm overflow-hidden">
                  {Object.entries(product.properties).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`grid grid-cols-[minmax(0,40%)_1fr] gap-3 px-3 py-2.5 ${
                        i % 2 === 0 ? 'bg-[#F7F8F8]' : 'bg-white'
                      }`}
                    >
                      <dt className="font-medium text-[#565959]">{key}</dt>
                      <dd className="text-[#0F1111]">{value as React.ReactNode}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>

          {/* Desktop buy box */}
          <aside className="hidden lg:block min-w-0">
            <BuyBox product={product} inStock={inStock} isLowStock={isLowStock} />
          </aside>
        </div>
      </article>

      {/* Reviews */}
      <section
        id="customer-reviews"
        aria-label="Customer reviews"
        className="bg-white border border-[#D5D9D9] rounded-lg overflow-hidden"
      >
        <div className="px-4 sm:px-6 py-5 border-b border-[#D5D9D9] bg-[#F7F8F8]">
          <h2 className="text-xl font-bold text-[#0F1111]">Customer reviews</h2>
          <p className="text-sm text-[#565959] mt-1">
            See what shoppers are saying about this product
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_1fr] gap-8 lg:gap-10">
            {/* Summary + write review */}
            <div className="space-y-6 lg:border-r lg:border-[#EAEDED] lg:pr-8">
              <ReviewSummary
                averageRating={product.rating}
                totalReviews={reviewCount}
                reviews={reviews ?? []}
              />
              {product._id && <ReviewForm slug={product.slug} />}
            </div>

            {/* Review list */}
            <div>
              <h3 className="text-base font-bold text-[#0F1111] mb-4 pb-2 border-b border-[#D5D9D9]">
                {reviews?.length
                  ? `Top reviews from customers (${reviews.length})`
                  : 'Customer feedback'}
              </h3>

              {reviewsError && (
                <div className="text-sm text-[#B12704] bg-[#FFF4F4] border border-[#F5C6C6] rounded-lg px-4 py-3">
                  Failed to load reviews. Please refresh the page.
                </div>
              )}

              {!reviews && !reviewsError && (
                <div className="flex justify-center py-16">
                  <span className="loading loading-spinner text-[#FF9900]" />
                </div>
              )}

              {reviews?.length === 0 && (
                <div className="text-center py-14 px-4 border border-dashed border-[#D5D9D9] rounded-lg bg-[#F7F8F8]">
                  <div className="flex justify-center gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-6 h-6 text-[#D5D9D9]" />
                    ))}
                  </div>
                  <p className="text-[#0F1111] font-medium mb-1">No reviews yet</p>
                  <p className="text-sm text-[#565959]">
                    Be the first to share your experience with this product.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {reviews?.map((review: Review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    canDelete={
                      Boolean(
                        session?.user.isAdmin || session?.user.name === review.username
                      )
                    }
                    onDelete={() =>
                      review._id &&
                      (session?.user.isAdmin
                        ? handleDelete(review._id)
                        : handleUserDelete(review._id))
                    }
                    deleting={isDeleting || isDeletingUserReview}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
