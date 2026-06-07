import Link from 'next/link'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import {
  categoryToSlug,
  CATEGORY_ICONS,
  resolveCategoryFromSlug,
} from '@/lib/categorySlugs'
import {
  getCategoryGuidePath,
  getCategoryLandingCopy,
} from '@/lib/data/categoryLandingCopy'
import { BASE_URL, ROBOTS_INDEX, truncateForMeta } from '@/lib/seo'

export const revalidate = 3600

export async function generateStaticParams() {
  const categories = await productServices.getCategories()
  return categories.map((cat) => ({ slug: categoryToSlug(cat) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const categories = await productServices.getCategories()
  const category = resolveCategoryFromSlug(slug, categories)
  if (!category) {
    return { title: 'Category not found', robots: { index: false, follow: false } }
  }

  const copy = getCategoryLandingCopy(category)
  const url = `${BASE_URL}/categories/${slug}`

  return {
    title: `${category} — Shop Brand New | Agu Brothers Nigeria`,
    description: truncateForMeta(copy.description),
    robots: ROBOTS_INDEX,
    alternates: { canonical: url },
    openGraph: {
      title: `${category} | Agu Brothers Electronics`,
      description: truncateForMeta(copy.description),
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category} | Agu Brothers`,
      description: truncateForMeta(copy.description),
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const categories = await productServices.getCategories()
  const category = resolveCategoryFromSlug(slug, categories)
  if (!category) notFound()

  const products: Product[] = JSON.parse(
    JSON.stringify(await productServices.getByCategory(category))
  )
  const copy = getCategoryLandingCopy(category)
  const guidePath = getCategoryGuidePath(category)
  const url = `${BASE_URL}/categories/${slug}`

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} | Agu Brothers`,
    description: copy.description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'Agu Brothers Electronics', url: BASE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 12).map((product, index) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Departments', item: `${BASE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name: category, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-[#EAEDED] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="text-sm text-[#565959] mb-3">
            <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
              Home
            </Link>
            <span className="mx-1">›</span>
            <Link href="/categories" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
              Departments
            </Link>
            <span className="mx-1">›</span>
            <span>{category}</span>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-4 md:p-6 mb-4">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl" aria-hidden="true">
                {CATEGORY_ICONS[category] ?? '🛍️'}
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#0F1111]">{category}</h1>
                <p className="text-sm text-[#565959] mt-1">
                  {products.length} brand-new product{products.length !== 1 ? 's' : ''} in stock
                </p>
              </div>
            </div>
            <p className="text-[#0F1111] leading-relaxed max-w-3xl">{copy.intro}</p>
            <ul className="mt-4 grid sm:grid-cols-3 gap-2">
              {copy.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-[#565959] bg-[#F7F8F8] rounded-sm px-3 py-2"
                >
                  <span className="text-[#FF9900] shrink-0" aria-hidden="true">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            {guidePath && (
              <p className="mt-4 text-sm">
                <Link href={guidePath} className="text-[#007185] hover:text-[#CC0C39] hover:underline">
                  Read our {category.toLowerCase()} buying guide →
                </Link>
              </p>
            )}
          </div>

          <div className="bg-white rounded-sm shadow-sm p-4 md:p-5">
            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-[#565959] mb-4">No products in this category yet.</p>
                <Link href="/all-products" className="btn-amazon px-6 py-2 rounded-md inline-block text-sm">
                  Browse all products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#D5D9D9]">
                  <h2 className="text-lg font-semibold text-[#0F1111]">Shop {category}</h2>
                  <Link
                    href={`/search?category=${encodeURIComponent(category)}`}
                    className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline"
                  >
                    Filter &amp; sort
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                  {products.map((product) => (
                    <ProductCard key={product.slug} product={product} showDetailsButton />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
