'use client'
import AddToCart from '@/components/products/AddToCart'
import { convertDocToObj, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import { FaStar } from 'react-icons/fa'
import Link from 'next/link'
import React from 'react'
import { Rating } from '@/components/products/Rating'
import ProductImages from './ProductImages'
import { format } from 'date-fns'
import { Review } from '@/lib/models/ReviewModel'
import { GoPackage } from 'react-icons/go'
import ReviewForm from './ReviewForm'
import useSWRMutation from 'swr/mutation'
import useSWR, { mutate } from 'swr'
import { useSession } from 'next-auth/react'
import { Product } from '@/lib/models/ProductModel'

const formatDate = (dateString: any) => {
  return format(new Date(dateString), 'MMMM do yyyy, h:mm:ss a')
}

export default function ProductDetails({ product }: { product: any }) {
  const { data: session } = useSession()
  const { data: reviews, error: reviewsError } = useSWR(
    `/api/products/${product?.slug}/reviews`
  )

  const { trigger: deleteReview, isMutating: isDeleting } = useSWRMutation(
    `/api/admin/products/reviews`,
    async (
      url: string,
      { arg }: { arg: { productId: string; reviewId: string } }
    ) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.message)
        throw new Error(data.message)
      }

      toast.success('Review deleted successfully')

      const text = await response.text()
      return text ? JSON.parse(text) : {}
    }
  )

  const { trigger: deleteUserReview, isMutating: isDeletingUserReview } = useSWRMutation(
    `/api/products/${product.slug}/reviews`,
    async (
      url: string,
      { arg }: { arg: { username: string; productId: string; reviewId: string } }
    ) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.message)
        throw new Error(data.message)
      }

      toast.success('Review deleted successfully')

      const text = await response.text()
      return text ? JSON.parse(text) : {}
    }
  )

  if (!product) return <div>Loading...</div>

  const handleUserDelete = async (reviewId: string) => {
    if (session?.user.name && product._id) {
      await deleteUserReview({ username: session?.user.name, productId: product._id, reviewId })
    } else {
      toast.error('User name is not available')
    }
    mutate(`/api/products/${product.slug}/reviews`)
    mutate(`/api/products/${product.slug}`)
  }

  const handleDelete = async (reviewId: string) => {
    if (product._id) {
      await deleteReview({ productId: product._id, reviewId })
    } else {
      toast.error('Product ID is not available')
    }
    mutate(`/api/products/${product.slug}/reviews`)
    mutate(`/api/products/${product.slug}`)
  }

  return (
    <>
      <div className="text-sm breadcrumbs border-b-2 border-orange-600 py-2 px-4">
        <ul className="text-black dark:text-white">
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
            <GoPackage className="w-4 h-4 mr-2 stroke-current" />
            {product.name}
          </li>
        </ul>
      </div>
      <div className="my-4 px-4 md:px-0">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to products
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 md:px-0">
        <div className="lg:col-span-2">
          <ProductImages images={product.images} />
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <Rating
              value={product.rating}
              caption={`${product.numReviews} ${
                product.numReviews === 1 ? 'person rated' : 'people rated'
              }`}
            />
            <p className="text-lg">{product.brand}</p>
            <div className="divider"></div>
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="text-md">{product.description}</p>
              </div>
            </div>
            <div className="divider"></div>
            <div>
              <h3 className="text-lg font-semibold">Additional Properties</h3>
              <div className="bg-base-200 p-4 rounded-lg">
                <ul className="list-disc list-inside">
                  {product.properties &&
                    Object.entries(product?.properties).map(([key, value]) => (
                      <li key={key} className="flex justify-between">
                        <span className="font-medium text-md">{key}:</span>
                        <span>{value as React.ReactNode}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-xl my-3 lg:my-0">
          <div className="card-body">
            <div className="flex justify-between mb-2">
              <div>Price</div>
              <div>{formatPrice(product.price)}</div>
            </div>
            <div className="flex justify-between mb-2">
              <div>Status</div>
              <div>
                {product.countInStock > 0 ? (
                  <span className="text-green-500">In stock</span>
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </div>
            </div>
            {product.countInStock === 1 && (
              <div className="text-orange-600 text-sm">
                Only 1 item remaining!
              </div>
            )}
            {product.countInStock !== 0 && (
              <div className="card-actions justify-center">
                <AddToCart
                  item={{
                    ...convertDocToObj(product),
                    qty: 0,
                    weight: product.weight,
                    countInStock: product.countInStock,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <h1 className="card-title mt-6 text-2xl font-bold text-center">Reviews</h1>
      <div className="grid lg:grid-cols-4 gap-6 my-6 px-4 md:px-0">
        {product._id && <ReviewForm slug={product.slug} />}
        <div className="lg:col-span-2">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold">
                {reviews
                  ? reviews.length === 0
                    ? 'No reviews yet'
                    : 'All Reviews'
                  : 'Loading reviews...'}
              </h2>
              <ul className="space-y-4">
                {reviewsError && <div>Failed to load reviews</div>}
                {reviews &&
                  reviews.map((review: Review) => (
                    <li
                      key={review._id}
                      className="p-4 bg-base-100 rounded-lg shadow"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                color={i < review.rating ? 'gold' : 'gray'}
                              />
                            ))}
                          </div>
                          <h3 className="text-sm text-gray-500">
                            {formatDate(review?.createdAt)}
                          </h3>
                        </div>
                        <strong className="my-2 text-lg">{review.title}</strong>
                        <p>{review.comment}</p>
                        <small className="text-gray-500">
                          by {review.username}
                        </small>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() =>
                            review._id &&
                            (session?.user.isAdmin
                              ? handleDelete(review._id)
                              : handleUserDelete(review._id))
                          }
                          className="btn btn-sm btn-error w-full"
                        >
                          {isDeleting || isDeletingUserReview ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
