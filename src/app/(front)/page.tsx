/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumbs'
import ProductItem from '@/components/products/ProductItem'
import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import { convertDocToObj } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import PageSkeleton from './ui/skeletons/PageSkeleton'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Agu Brothers',
  description:
    process.env.NEXT_PUBLIC_APP_DESC || 'Store for all electronics and gadgets',
}

export default async function Home() {
  const featuredProducts = await productServices.getFeatured()
  const latestProducts = await productServices.getLatest()

  if (!featuredProducts || !latestProducts) return <PageSkeleton />

  return (
    <>
      <div className="w-full carousel mt-2">
        {featuredProducts.map((product: Product, index: number) => (
          <div
            key={product._id}
            id={`slide-${index}`}
            className="carousel-item relative w-full md:h-[500px] "
          >
            <Link href={`/product/${product.slug}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 w-full px-24 items-center">
                <div className="hero min-h-[400px] w-[3/4] flex items-center justify-center rounded-md px-4 bg-base-300 p-4">
                  <div className="max-w-md">
                    <h1 className="mb-5 text-3xl font-bold">{product.name}</h1>
                    <p className="mb-5 truncate">{product.description}</p>
                    <button className="btn btn-primary">View Product</button>
                  </div>
                </div>
                <div
                  className="hero min-h-[400px] w-full rounded-md bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${product.images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
                </div>
              </div>
            </Link>
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href={`#slide-${
                  index === 0 ? featuredProducts.length - 1 : index - 1
                }`}
                className="btn btn-circle btn-lg bg-white text-gray-800 border-none shadow-lg"
              >
                ❮
              </a>
              <a
                href={`#slide-${
                  index === featuredProducts.length - 1 ? 0 : index + 1
                }`}
                className="btn btn-circle btn-lg bg-white text-gray-800 border-none shadow-lg"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-medium py-2 px-2 text-center">
        Latest Products
      </h2>

      <div className="p-5 flex flex-col gap-6 items-center">
        <div className="flex flex-wrap justify-center gap-6">
          {latestProducts.map((product: Product) => (
            <ProductItem
              product={convertDocToObj(product)}
              key={product.slug}
            />
          ))}
        </div>
      </div>
    </>
  )
}
