"use client";

import { Product } from "@/lib/models/ProductModel";
import Link from "next/link";
import React from "react";
import { Rating } from "./Rating";
import CldImage from "../CldImage";
import useWishListStore from "@/lib/hooks/useWishListStore";
import { formatPrice } from "@/lib/utils";

export default function ProductItem({ product }: { product: Product }) {
  const { addItem, removeItem, items } = useWishListStore();

  const handleWishList = (product: Product) => {
    const isWishlisted = items.some((p) => p._id === product._id);
    isWishlisted ? removeItem(product) : addItem(product);
  };

  return (
    <div className="card card-compact w-full md:w-72 bg-base-100 shadow-xl m-4 hover:shadow-2xl transition-shadow transform hover:scale-105">
      <Link href={`/product/${product.slug}`}>
        <figure className="relative overflow-hidden rounded-t-lg">
          <CldImage
            src={product.images[0]}
            alt={product.name}
            width="300"
            height="300"
            crop="fit"
            sizes="100vw"
            className="object-cover w-full h-48 md:h-64 transition-transform transform hover:scale-105"
          />
        </figure>
      </Link>
      <div className="card-body p-4 md:p-6">
        <Link href={`/product/${product.slug}`}>
          <h2 className="card-title text-base md:text-lg font-medium hover:font-bold transition-colors">
            {product.name}
          </h2>
        </Link>
        <Rating
          value={product.rating}
          caption={
            product.numReviews === 1 ? "1 review" : `${product.numReviews} reviews`
          }
        />
        <p className="text-sm mt-2">{product.brand}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          <Link href={`/product/${product.slug}`}>
            <button className="btn btn-primary btn-sm">View Details</button>
          </Link>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleWishList(product);
        }}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg z-10 items-center justify-center transition-colors hover:bg-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 fill-current ${
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
