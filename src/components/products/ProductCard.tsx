"use client";

import { Product } from "@/lib/models/ProductModel";
import Link from "next/link";
import CldImage from "../CldImage";
import useWishListStore from "@/lib/hooks/useWishListStore";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, removeItem, items } = useWishListStore();

  //toggle wishlist
  const handleWishList = (product: Product) => {
    const isWishlisted = items.some((p) => p._id === product._id);
    isWishlisted ? removeItem(product) : addItem(product);
  };
  return (
    <div className="card shadow-lg border border-gray-200">
      <Link href={`/product/${product.slug}`}>
        <figure className="p-4">
          <CldImage
            src={product.images[0]}
            alt={product.name}
            width={200}
            height={200}
            className="object-cover max-w-full sm:w-60 h-40 sm:h-60 md:h-48"
          />
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title text-md md:text-lg font-semibold">
            {product.name}
          </h2>
          <p className="text-md md:text-lg font-semibold text-orange-600">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
      {/* Add a heart button for wishlist */}
      <button
        type="button"
        onClick={() => handleWishList(product)}
        className="absolute top-6 right-6 p-2  bg-white btn-sm rounded-full shadow-lg items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 fill-current ${
            items.some((p) => p._id === product._id)
              ? "text-red-500"
              : "text-gray-500"
          }`}
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 14.25l-1.45-1.32C3.1 10.07 0 7.21 0 4.5 0 2.42 1.5 1 4 1c1.34 0 2.64.76 4 2.11C9.36 1.76 10.66 1 12 1c2.5 0 4 1.42 4 3.5 0 2.71-3.1 5.57-6.55 8.43L8 14.25z"
          />
        </svg>
      </button>
    </div>
  );
}
