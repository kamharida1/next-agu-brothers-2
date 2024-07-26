/* eslint-disable @next/next/no-img-element */
import Breadcrumb from "@/components/Breadcrumb";
import CldImage from "@/components/CldImage";
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
              <div
                className="hero min-h-[300px]"
                style={{
                  backgroundImage: `url(${product.images[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                  <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">{product.name}</h1>
                    <p className="mb-5">{product.description}</p>
                    <button className="btn btn-primary">View Product</button>
                  </div>
                </div>
              </div>
            </Link>

            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a
                href={`#slide-${
                  index === 0 ? featuredProducts.length - 1 : index - 1
                }`}
                className="btn btn-circle"
              >
                ❮
              </a>
              <a
                href={`#slide-${
                  index === featuredProducts.length - 1 ? 0 : index + 1
                }`}
                className="btn btn-circle"
              >
                ❯
              </a>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="w-full carousel rounded-box mt-4">
        {featuredProducts.map((product: Product, index: number) => (
          <div
            key={product._id}
            id={`slide-${index}`}
            className="carousel-item relative w-full"
          >
            <Link href={`/product/${product.slug}`}>
              <CldImage
                src={product.images[0]}
                height={300}
                width={1024}
                style={{
                  width: '100%',
                  height: '50%',
                }}
                alt={product.name}
              />
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
      </div> */}
      <div className="flex items-center">
        <Breadcrumb homeElement={'Home'} />
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