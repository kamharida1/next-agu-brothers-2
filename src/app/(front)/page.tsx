/* eslint-disable @next/next/no-img-element */
import ProductItem from "@/components/products/ProductItem";
import data from "@/lib/data";
import { Product } from "@/lib/models/ProductModel";
import productServices from "@/lib/services/productService";
import { convertDocToObj } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Agu Brothers',
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Store for all electronics and gadgets',
}


export default async function Home() {
  const featuredProducts = await productServices.getFeatured()
  const latestProducts = await productServices.getLatest()
  return (
    <>
      <div className="w-full carousel rounded-box mt-4">
        {featuredProducts.map((product: Product, index: number) => (
          <div
            key={product._id}
            id={`slide-${index}`}
            className="carousel-item relative w-full"
          >
            <Link href={`/product/${product.slug}`}>
              <img src={product.banner} className="w-full" alt={product.name} />
            </Link>

            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href={`#slide-${index === 0 ? featuredProducts.length - 1 : 0}`}
                className="btn btn-circle"
              >
                ❮
              </a>
              <a href="#slide-2" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-2xl py-2">Latest Products</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {latestProducts.map((product: Product) => (
          <ProductItem
            product={convertDocToObj(product)}
            key={product.slug}
          ></ProductItem>
        ))}
      </div>
    </>
  )
};