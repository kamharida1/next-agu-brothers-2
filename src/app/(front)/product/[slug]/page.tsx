import AddToCart from '@/components/products/AddToCart'
import { convertDocToObj } from '@/lib/utils'
import productServices from '@/lib/services/productService'
import { FaStar } from 'react-icons/fa'
import Link from 'next/link'
import React from 'react'
import { Rating } from '@/components/products/Rating'
import ProductImages from '@/components/products/ProductImages'
import ReviewForm from '@/components/products/ReviewForm'
import { format } from 'date-fns'
import { Review } from '@/lib/models/ReviewModel'

const formatDate = (dateString: any) => {
  return format(new Date(dateString), 'MMMM do yyyy, h:mm:ss a')
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const product = await productServices.getBySlug(params.slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails({
  params,
}: {
  params: {
    slug: string
  }
  }) {
   const product = await productServices.getBySlug(params.slug)
  if (!product) {
    return <div>Product Not Found</div>
  }
  return (
    <>
      <div className="my-2">
        <Link href="/" className="text-blue-500 hover:underline cursor-pointer">
          back to products
        </Link>
      </div>
      <div className="grid md:grid-cols-5 md:gap-3">
        <div className="md:col-span-2">
          <ProductImages images={product.images} />
          {/* <CldImage
            src={product?.images[0]}
            alt={product.name}
            width={640}
            height={640}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto',
            }}
          /> */}
        </div>
        <div className="md:col-span-2">
          <ul className="space-y-4">
            <li>
              <h1 className="text-xl">{product.name}</h1>
            </li>
            <li>
              <Rating
                value={product.rating}
                caption={`${product.numReviews} ratings`}
              />
            </li>
            <li> {product.brand}</li>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              Description: <p>{product.description}</p>
            </li>
          </ul>
        </div>
        <div>
          <div className="card  bg-base-300 shadow-xl my-3 md:mt-0">
            <div className="card-body">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>${product.price}</div>
              </div>
              <div className="mb-2 flex justify-between">
                <div>Status</div>
                <div>
                  {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                </div>
              </div>
              {product.countInStock !== 0 && (
                <div className="card-actions justify-center">
                  <AddToCart
                    item={{
                      ...convertDocToObj(product),
                      qty: 0,
                      color: '',
                      size: '',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <h1 className="card-title mt-4"> Reviews </h1>
      <div className="grid md:grid-cols-4 gap-5 my-4">
        {product._id && <ReviewForm productId={product._id} />}
        <div className="md:col-span-2">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">All reviews</h2>
              <ul className="space-y-3">
                {product.reviews &&
                  product.reviews.map((review: Review) => (
                    <li key={review._id}>
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
                          <h3 className="text-sm">
                            {formatDate(review?.createdAt)}
                          </h3>
                        </div>
                        <strong className="my-2 ">{review.title}</strong>
                        <div>
                          <p>{review.comment}</p>
                          <div>
                            <small>by {review.username}</small>
                          </div>
                        </div>
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
