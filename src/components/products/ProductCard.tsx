'use client'

import { Product } from "@/lib/models/ProductModel";
import Link from "next/link";
import CldImage from "../CldImage";

export default function ProductCard({ product }:{product: Product}) {
  return (
    <div className='card  w-72 flex flex-col hover:scale:105 shadow-md'>
      <Link href={`/product/${product.slug}`}>
        <CldImage
          src={product.images[0]}
          alt={product.name}
          width={300}
          height={300}
          className='object-center w-96 h-48'
        />
        <div className="card-body p-4">
          <h2 className="card-title font-medium hover:font-bold transition-colors">
            {product.name}
          </h2>
          <span className='text-lg font-semibold'>
            {product.price}
          </span>
        </div>
      </Link>
    </div>
  )
 }