/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumbs'
import ProductItem from '@/components/products/ProductItem'
import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import { convertDocToObj, formatPrice, toPlainObject } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import PageSkeleton from './ui/skeletons/PageSkeleton'
import { RiBloggerLine } from 'react-icons/ri'
import CldImage from '@/components/CldImage'
import ProductCard from '@/components/products/ProductCard'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Agu Brothers',
  description:
    process.env.NEXT_PUBLIC_APP_DESC || 'Store for all electronics and gadgets',
}

export default async function Home() {
  const featuredProducts = JSON.parse(JSON.stringify(await productServices.getFeatured()))
  const latestProducts = JSON.parse(JSON.stringify(await productServices.getLatest()))

  if (!featuredProducts || !latestProducts) return <PageSkeleton />

  return (
    <>
      <div className="block items-center">
        {/* Latest Products */}
        <h1 className="text-xl md:text-2xl text-center font-semibold m-4">
          Latest Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-4">
          {latestProducts.map((product: Product) => (
           <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>

      <div className="block">
        <h1 className="text-xl md:text-2xl text-center font-semibold m-4">
          Featured Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-4">
          {featuredProducts.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </>
  )
}
