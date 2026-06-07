import Link from 'next/link'
import CldImage from '@/components/CldImage'
import { ProductPrice } from '@/components/products/Price'
import type { Product } from '@/lib/models/ProductModel'
import { categoryHref } from '@/lib/categorySlugs'

type BlogShopCtaProps = {
  category: string
  product: Product | null
  compact?: boolean
}

export default function BlogShopCta({ category, product, compact = false }: BlogShopCtaProps) {
  const shopHref = categoryHref(category)

  if (!product) {
    return (
      <div
        className={`rounded-sm border border-[#D5D9D9] bg-[#F7FAFA] ${
          compact ? 'p-4' : 'p-5 md:p-6'
        }`}
      >
        <h2 className="text-base font-bold text-[#0F1111] mb-1">Ready to buy?</h2>
        <p className="text-sm text-[#565959] mb-4">
          Browse our {category.toLowerCase()} — all brand new with warranty.
        </p>
        <Link href={shopHref} className="btn-amazon inline-block px-5 py-2 rounded-md text-sm font-bold">
          Shop {category}
        </Link>
      </div>
    )
  }

  const imageSrc = product.images?.[0] || product.image
  const inStock = product.countInStock > 0

  return (
    <div
      className={`rounded-sm border border-[#D5D9D9] bg-[#F7FAFA] ${
        compact ? 'p-4' : 'p-5 md:p-6'
      }`}
    >
      <h2 className="text-base font-bold text-[#0F1111] mb-3">Ready to buy?</h2>

      <div className={`flex gap-3 ${compact ? 'flex-col' : 'flex-col sm:flex-row sm:items-center'}`}>
        <Link
          href={`/product/${product.slug}`}
          className="flex shrink-0 items-center gap-3 rounded-sm border border-[#D5D9D9] bg-white p-3 transition-shadow hover:shadow-sm"
        >
          <div className="relative h-20 w-20 shrink-0 bg-white">
            {imageSrc ? (
              <CldImage
                src={imageSrc}
                alt={product.name}
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[#565959]">
                No image
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-medium text-[#007185] hover:text-[#C7511F] hover:underline">
              {product.name}
            </p>
            <div className="mt-1">
              <ProductPrice product={product} />
            </div>
            {inStock ? (
              <span className="mt-1 inline-block text-xs font-semibold text-[#007600]">In stock</span>
            ) : (
              <span className="mt-1 inline-block text-xs text-[#CC0C39]">Out of stock</span>
            )}
          </div>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href={`/product/${product.slug}`}
          className="btn-amazon px-5 py-2 rounded-md text-sm font-bold text-center"
        >
          View product &amp; buy
        </Link>
        <Link
          href={shopHref}
          className="btn-amazon-outline px-5 py-2 rounded-md text-sm text-center"
        >
          More {category}
        </Link>
      </div>
    </div>
  )
}
