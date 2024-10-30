/* eslint-disable @next/next/no-img-element */

import { Product } from "@/lib/models/ProductModel";
import productServices from "@/lib/services/productService";
import { Metadata } from "next";
import Link from "next/link";
import PageSkeleton from "./ui/skeletons/PageSkeleton";
import ProductCard from "@/components/products/ProductCard";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Agu Brothers Electronics",
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    `Delivering top-quality home electronics and appliances to our valued customers. From cutting-edge high-definition televisions to energy-efficient refrigerators, versatile gas cookers, powerful freezers, generators, air conditioners, and a wide range of home essentials—our mission is clear: to offer reliable, innovative, and cost-effective solutions that elevate your everyday living experience.`,
};

export default async function Home() {
  const featuredProducts = JSON.parse(
    JSON.stringify(await productServices.getFeatured())
  );
  const latestProducts = JSON.parse(
    JSON.stringify(await productServices.getLatest())
  );

  if (!featuredProducts || !latestProducts) return <PageSkeleton />;

  return (
    <>
      <div className="container mx-auto p-4">
        {/* Latest Products */}
        <h1 className="text-xl md:text-2xl text-center font-semibold my-6">
          Latest Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
          {latestProducts.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>

      <div className="container mx-auto p-4">
        {/* Featured Products */}
        <h1 className="text-xl md:text-2xl text-center font-semibold my-6">
          Featured Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6">
          {featuredProducts.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
