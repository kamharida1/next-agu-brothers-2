/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumbs'
import ProductItem from '@/components/products/ProductItem'
import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import { convertDocToObj, formatPrice } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import PageSkeleton from './ui/skeletons/PageSkeleton'
import { RiBloggerLine } from 'react-icons/ri'
import CldImage from '@/components/CldImage'

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
      <div className="block items-center">
        {/* Latest Products */}
        <h1 className="text-2xl text-center font-semibold m-4 ">Latest Products</h1>
        <div className="grid grid-cols-5 gap-4 m-4">
          {latestProducts.map((product: Product) => (
            <div key={product.slug} className="border border-gray-200 p-4">
              <Link href={`/product/${product.slug}`}>
                <CldImage
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-48"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                {/* <p className="text-sm text-gray-600">{product.description}</p> */}
                <p className="text-lg font-semibold text-orange-600">
                  {formatPrice(product.price)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="block">
        <div className="grid grid-cols-5 gap-4 m-4">
          {featuredProducts.map((product: Product) => (
            <div key={product.slug} className="border border-gray-200 p-4">
              <Link href={`/product/${product.slug}`}>
                <CldImage
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-cover w-full h-48"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                {/* <p className="text-sm text-gray-600">{product.description}</p> */}
                <p className="text-lg font-semibold text-orange-600">
                  {formatPrice(product.price)}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
