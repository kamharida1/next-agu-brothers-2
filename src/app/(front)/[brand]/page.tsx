import { Metadata } from 'next'
import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import Link from 'next/link'
import ProductItem from '@/components/products/ProductItem'

const BASE_URL = 'https://www.agubrothers.com'

export async function generateMetadata({ params }: { params: { brand: string } }): Promise<Metadata> {
  const brand = decodeURIComponent(params.brand)
  return {
    title: `${brand} Products | Agu Brothers Electronics`,
    description: `Shop genuine ${brand} electronics and appliances at Agu Brothers. Best prices with fast delivery across Nigeria.`,
    alternates: { canonical: `${BASE_URL}/${params.brand}` },
    openGraph: {
      title: `${brand} | Agu Brothers Electronics`,
      description: `Shop ${brand} products at Agu Brothers Nigeria.`,
      url: `${BASE_URL}/${params.brand}`,
    },
  }
}

export default async function ProductsByBrand({ params }: { params: { brand: string } }) {
  const items: Product[] = JSON.parse(
    JSON.stringify(await productServices.getByBrand(params.brand))
  )
  const brand = decodeURIComponent(params.brand)

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-3">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>{brand}</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-4 md:p-5">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#D5D9D9]">
            <div>
              <h1 className="text-2xl font-medium text-[#0F1111]">{brand}</h1>
              <p className="text-sm text-[#565959] mt-0.5">
                {items.length} result{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-[#565959] mb-4">
                No products found for &quot;{brand}&quot;
              </p>
              <Link href="/all-products" className="btn-amazon px-6 py-2 rounded-md inline-block text-sm">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
              {items.map((item) => (
                <ProductItem key={item.slug} product={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
