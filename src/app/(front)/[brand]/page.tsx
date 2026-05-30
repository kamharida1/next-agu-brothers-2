import { Metadata } from 'next'
import CldImage from '@/components/CldImage'
import AddToCart from '@/components/products/AddToCart'
import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import { convertDocToObj, formatPrice } from '@/lib/utils'

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
import Link from 'next/link'
import { Rating } from '@/components/products/Rating'

export default async function ProductsByBrand({ params }: { params: { brand: string } }) {
  const items = JSON.parse(JSON.stringify(await productServices.getByBrand(params.brand)))

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-[#565959] mb-3">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">Home</Link>
          <span className="mx-1">›</span>
          <span>{params.brand}</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D5D9D9]">
            <h1 className="text-2xl font-medium text-[#0F1111]">{params.brand}</h1>
            <span className="text-sm text-[#565959]">{items.length} result{items.length !== 1 ? 's' : ''}</span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-[#565959] mb-4">No products found for &quot;{params.brand}&quot;</p>
              <Link href="/all-products" className="btn-amazon px-6 py-2 rounded-md inline-block text-sm">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-[#D5D9D9]">
              {items.map((item: Product) => (
                <div key={item.slug} className="bg-white flex gap-4 p-4 hover:bg-[#F7F8F8] transition-colors">
                  {/* Image */}
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0 w-32 h-32 flex items-center justify-center bg-white">
                    <CldImage
                      src={item.images[0]}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="object-contain w-full h-full"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-[#007185] hover:text-[#CC0C39] hover:underline text-base font-medium line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    <div className="mt-1">
                      <Rating value={item.rating} caption={`${item.numReviews} ratings`} />
                    </div>
                    <p className="text-sm text-[#565959] mt-1 line-clamp-2">{item.description}</p>
                    {item.countInStock > 0
                      ? <p className="text-[#007600] text-sm font-medium mt-1">In Stock</p>
                      : <p className="text-[#CC0C39] text-sm mt-1">Out of Stock</p>
                    }
                  </div>

                  {/* Price + Add to cart */}
                  <div className="flex-shrink-0 text-right flex flex-col items-end gap-2 w-36">
                    <p className="text-xl font-bold text-[#0F1111]">{formatPrice(item.price)}</p>
                    <AddToCart
                      compact
                      item={{ ...convertDocToObj(item) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
