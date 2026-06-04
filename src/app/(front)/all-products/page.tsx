import { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'
import ProductPagination from '@/components/products/ProductPagination'
import productServices, { CATALOG_PAGE_SIZE } from '@/lib/services/productService'
import { Product } from '@/lib/models/ProductModel'

import { BASE_URL, ROBOTS_INDEX, ROBOTS_NOINDEX_FOLLOW } from '@/lib/seo'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const { page: pageParam } = await searchParams
  const pageNum = Math.max(1, Number(pageParam) || 1)
  const isPaginated = pageNum > 1

  return {
    title: isPaginated
      ? `All Products — Page ${pageNum} | Agu Brothers`
      : 'All Products | Agu Brothers Electronics Nigeria',
    description:
      'Browse our complete range of electronics and home appliances — TVs, refrigerators, generators, air conditioners, gas cookers, washing machines and more. Fast delivery across Nigeria.',
    robots: isPaginated ? ROBOTS_NOINDEX_FOLLOW : ROBOTS_INDEX,
    alternates: { canonical: `${BASE_URL}/all-products` },
    openGraph: {
      title: 'All Products | Agu Brothers Electronics',
      description: 'Browse all electronics and home appliances at Agu Brothers Nigeria.',
      url: `${BASE_URL}/all-products`,
    },
  }
}

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = pageParam ?? '1'
  const { products, countProducts, pages } = JSON.parse(
    JSON.stringify(await productServices.getAllPaginated({ page }))
  )
  const pageNum = Number(page)
  const from = countProducts === 0 ? 0 : (pageNum - 1) * CATALOG_PAGE_SIZE + 1
  const to = Math.min(pageNum * CATALOG_PAGE_SIZE, countProducts)

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="text-sm text-[#565959] mb-3">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
            Home
          </Link>
          <span className="mx-1">›</span>
          <span>All Products</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-4">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D5D9D9]">
            <h1 className="text-2xl font-medium text-[#0F1111]">All Products</h1>
            <span className="text-sm text-[#565959]">
              {countProducts === 0
                ? '0 results'
                : `${from}-${to} of ${countProducts}`}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="py-12 text-center text-[#565959]">
              <p className="text-lg mb-2">No products found</p>
              <Link href="/" className="text-[#007185] hover:underline text-sm">
                Return to home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
              {products.map((product: Product) => (
                <ProductCard key={product.slug} product={product} compact />
              ))}
            </div>
          )}

          <ProductPagination
            page={pageNum}
            pages={pages}
            getHref={(p) => (p === 1 ? '/all-products' : `/all-products?page=${p}`)}
          />
        </div>
      </div>
    </div>
  )
}
