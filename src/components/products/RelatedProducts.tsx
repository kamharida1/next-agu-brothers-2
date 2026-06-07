import { Product } from '@/lib/models/ProductModel'
import ProductCard from './ProductCard'
import Link from 'next/link'
import { categoryHref } from '@/lib/categorySlugs'

export default function RelatedProducts({
  products,
  category,
}: {
  products: Product[]
  category: string
}) {
  if (!products.length) return null

  return (
    <section
      aria-labelledby="related-products-heading"
      className="max-w-[1200px] mx-auto px-3 sm:px-4 pb-14"
    >
      <div className="border-t border-base-200 pt-8">
        <div className="flex items-center justify-between mb-5">
          <h2 id="related-products-heading" className="text-xl font-bold text-[#0F1111]">
            Related Products
          </h2>
          <Link
            href={categoryHref(category)}
            className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline"
          >
            More in {category} →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
