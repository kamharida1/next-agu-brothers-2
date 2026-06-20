import { Metadata } from 'next'
import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'
import ProductListingToolbar from '@/components/products/ProductListingToolbar'
import {
  buildListingUrl,
  buildQuickSortLinks,
  buildSortLinks,
  normalizeSort,
} from '@/lib/productSort'

import {
  BASE_URL,
  BUSINESS,
  OG_IMAGE,
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  truncateForMeta,
} from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>
}): Promise<Metadata> {
  const { brand: brandParam } = await params
  const brand = decodeURIComponent(brandParam)
  const items = await productServices.getByBrand(brandParam)
  const url = `${BASE_URL}/${brandParam}`

  if (items.length === 0) {
    return {
      title: `${brand} Products | Agu Brothers Electronics`,
      description: `Shop genuine ${brand} electronics and appliances at Agu Brothers. Best prices with fast delivery across Nigeria.`,
      robots: ROBOTS_NOINDEX,
      alternates: { canonical: url },
    }
  }

  const description = truncateForMeta(
    `Shop ${items.length} brand-new ${brand} electronics and home appliances at Agu Brothers Nigeria. Genuine products, fast nationwide delivery.`
  )

  return {
    title: `${brand} Products | Agu Brothers Electronics`,
    description,
    robots: ROBOTS_INDEX,
    alternates: { canonical: url },
    openGraph: {
      title: `${brand} | Agu Brothers Electronics`,
      description,
      url,
      type: 'website',
      siteName: BUSINESS.name,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${brand} products at Agu Brothers` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand} | Agu Brothers`,
      description,
      images: [OG_IMAGE],
    },
  }
}

export default async function ProductsByBrand({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>
  searchParams: Promise<{ sort?: string }>
}) {
  const { brand: brandParam } = await params
  const { sort: sortParam } = await searchParams
  const sort = normalizeSort(sortParam)
  const brand = decodeURIComponent(brandParam)
  const basePath = `/${brandParam}`
  const listingParams = { sort }
  const filterHref = buildListingUrl('/search', { q: brand, sort })

  const items: Product[] = JSON.parse(
    JSON.stringify(await productServices.getByBrand(brandParam, sort))
  )
  const url = `${BASE_URL}/${brandParam}`
  const sortLinks = buildSortLinks(basePath, listingParams, sort)
  const quickSortLinks = buildQuickSortLinks(basePath, listingParams, sort)

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${brand} Products | Agu Brothers`,
    description: `Shop brand-new ${brand} electronics and home appliances at Agu Brothers Nigeria.`,
    url,
    isPartOf: { '@type': 'WebSite', name: BUSINESS.name, url: BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.slice(0, 12).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/product/${product.slug}`,
        name: product.name,
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: brand, item: url },
    ],
  }

  return (
    <>
      {items.length > 0 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
        </>
      )}
      <div className="bg-[#EAEDED] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="text-sm text-[#565959] mb-3">
            <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
              Home
            </Link>
            <span className="mx-1">›</span>
            <span>{brand}</span>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-4 md:p-5">
            <div className="flex flex-col gap-3 mb-5 pb-3 border-b border-[#D5D9D9] md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-medium text-[#0F1111]">{brand}</h1>
                <p className="text-sm text-[#565959] mt-0.5">
                  {items.length} result{items.length !== 1 ? 's' : ''}
                </p>
              </div>
              {items.length > 0 && (
                <ProductListingToolbar
                  currentSort={sort}
                  sortLinks={sortLinks}
                  quickSortLinks={quickSortLinks}
                  filterHref={filterHref}
                  showFilter
                />
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-[#565959] mb-4">
                  No products found for &quot;{brand}&quot;
                </p>
                <Link
                  href="/all-products"
                  className="btn-amazon px-6 py-2 rounded-md inline-block text-sm"
                >
                  Browse all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                {items.map((item) => (
                  <ProductCard key={item.slug} product={item} showDetailsButton />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
