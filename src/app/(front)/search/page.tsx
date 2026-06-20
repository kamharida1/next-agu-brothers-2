import { Metadata } from 'next'
import ProductCard from '@/components/products/ProductCard'
import ProductPagination from '@/components/products/ProductPagination'
import { Rating } from '@/components/products/Rating'
import { Product } from '@/lib/models/ProductModel'
import ProductListingToolbar from '@/components/products/ProductListingToolbar'
import productServices, { PAGE_SIZE } from '@/lib/services/productService'
import { PRICE_RANGES, priceFilterLabel } from '@/lib/searchFilters'
import {
  buildListingUrl,
  buildQuickSortLinks,
  buildSortLinks,
  normalizeSort,
} from '@/lib/productSort'
import { BASE_URL, searchRobots, truncateForMeta } from '@/lib/seo'
import { categoryHref, categoryToSlug } from '@/lib/categorySlugs'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const ratings = [4, 3, 2, 1] as const

type SearchParams = {
  q?: string
  category?: string
  rating?: string
  sort?: string
  page?: string
  price?: string
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const sp = await searchParams
  const q = sp.q && sp.q !== 'all' ? sp.q : null
  const category = sp.category && sp.category !== 'all' ? sp.category : null
  const price = sp.price && sp.price !== 'all' ? sp.price : null

  const title = q
    ? `"${q}" results | Agu Brothers`
    : category
      ? `${category} | Agu Brothers Electronics`
      : 'Shop All Electronics | Agu Brothers'

  const description = truncateForMeta(
    q
      ? `Search results for "${q}" at Agu Brothers — Nigeria's trusted electronics store.`
      : category
        ? `Shop ${category} at Agu Brothers. Best prices, genuine brand-new products, fast delivery across Nigeria.`
        : 'Browse our full range of electronics and home appliances. TVs, fridges, generators, ACs and more.'
  )

  const canonicalParams = new URLSearchParams()
  if (category) canonicalParams.set('category', category)
  if (price && !q) canonicalParams.set('price', price)
  const canonicalQuery = canonicalParams.toString()
  const canonical =
    category && !q && !price
      ? `${BASE_URL}${categoryHref(category)}`
      : `${BASE_URL}/search${canonicalQuery ? `?${canonicalQuery}` : ''}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
    robots: searchRobots(sp),
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const q = sp.q ?? 'all'
  const category = sp.category ?? 'all'
  const rating = sp.rating ?? 'all'
  const sort = normalizeSort(sp.sort)
  const page = sp.page ?? '1'
  const price = sp.price ?? 'all'
  const basePath = '/search'
  const listingParams = { q, category, price, rating, sort, page }

  if (
    category !== 'all' &&
    q === 'all' &&
    rating === 'all' &&
    sort === 'newest' &&
    page === '1' &&
    price === 'all'
  ) {
    redirect(`/categories/${categoryToSlug(category)}`)
  }

  const getFilterUrl = ({
    c,
    s,
    r,
    pg,
    pr,
  }: {
    c?: string
    s?: string
    r?: string
    pg?: string
    pr?: string
  }) => {
    const params: Record<string, string> = { q, category, price, rating, sort, page }
    if (c) params.category = c
    if (r) params.rating = r
    if (pg) params.page = pg
    if (s) params.sort = s
    if (pr) params.price = pr
    if (params.page === '1') delete params.page
    if (params.sort === 'newest') delete params.sort
    return `/search?${new URLSearchParams(params)}`
  }

  const sortLinks = buildSortLinks(basePath, listingParams, sort)
  const quickSortLinks = buildQuickSortLinks(basePath, listingParams, sort)

  const categories = JSON.parse(JSON.stringify(await productServices.getCategories()))
  const { countProducts, products, pages } = JSON.parse(
    JSON.stringify(
      await productServices.getByQuery({ category, q, price, rating, page, sort })
    )
  )

  const pageNum = Math.max(1, Number(page) || 1)
  const resultFrom = countProducts === 0 ? 0 : (pageNum - 1) * PAGE_SIZE + 1
  const resultTo = Math.min(pageNum * PAGE_SIZE, countProducts)

  const hasFilters =
    q !== 'all' || category !== 'all' || rating !== 'all' || price !== 'all'

  const itemListJsonLd =
    category !== 'all' && products.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${category} — Agu Brothers`,
          numberOfItems: countProducts,
          itemListElement: products.slice(0, 10).map((p: Product, i: number) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${BASE_URL}/product/${p.slug}`,
            name: p.name,
          })),
        }
      : null

  const filterChip = (label: string, href: string, active: boolean) => (
    <Link
      href={href}
      className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap flex-shrink-0 transition-colors ${
        active
          ? 'bg-[#131921] text-white border-[#131921]'
          : 'border-[#D5D9D9] text-[#0F1111] hover:border-[#AAAAAA]'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <div className="bg-[#EAEDED] min-h-screen">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="flex gap-4">
            <aside className="hidden md:block w-52 flex-shrink-0">
              <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[120px] space-y-5">
                <div>
                  <h3 className="font-bold text-sm text-[#0F1111] mb-2">Department</h3>
                  <ul className="space-y-1.5">
                    <li>
                      <Link
                        href={getFilterUrl({ c: 'all', pr: 'all' })}
                        className={`text-sm block ${category === 'all' ? 'font-bold text-[#0F1111]' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}
                      >
                        Any Department
                      </Link>
                    </li>
                    {categories.map((c: string) => (
                      <li key={c}>
                        <Link
                          href={getFilterUrl({ c })}
                          className={`text-sm block ${c === category ? 'font-bold text-[#0F1111]' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}
                        >
                          {c}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#D5D9D9]" />

                <div>
                  <h3 className="font-bold text-sm text-[#0F1111] mb-2">Price</h3>
                  <ul className="space-y-1.5">
                    {PRICE_RANGES.map((range) => (
                      <li key={range.value}>
                        <Link
                          href={getFilterUrl({ pr: range.value, pg: '1' })}
                          className={`text-sm block ${price === range.value ? 'font-bold text-[#0F1111]' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}
                        >
                          {range.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#D5D9D9]" />

                <div>
                  <h3 className="font-bold text-sm text-[#0F1111] mb-2">Customer Review</h3>
                  <ul className="space-y-1.5">
                    <li>
                      <Link
                        href={getFilterUrl({ r: 'all' })}
                        className={`text-sm block ${rating === 'all' ? 'font-bold text-[#0F1111]' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}
                      >
                        All Reviews
                      </Link>
                    </li>
                    {ratings.map((r) => (
                      <li key={r}>
                        <Link
                          href={getFilterUrl({ r: `${r}` })}
                          className={`flex items-center gap-1 text-sm ${`${r}` === rating ? 'font-bold' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}
                        >
                          <Rating value={r} caption="" />
                          <span className="text-xs">& Up</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {category !== 'all' && (
                <h1 className="sr-only">{category} — Agu Brothers Electronics</h1>
              )}

              <div className="bg-white rounded-sm shadow-sm p-4 mb-4 space-y-3">
                <div className="text-sm text-[#0F1111] flex flex-wrap items-center gap-2">
                  <span className="font-bold">
                    {countProducts === 0
                      ? 'No'
                      : `${resultFrom}-${resultTo} of ${countProducts}`}
                  </span>
                  <span>results</span>
                  {q !== 'all' && (
                    <span className="text-[#565959]">for &quot;{q}&quot;</span>
                  )}
                  {category !== 'all' && (
                    <span className="text-[#565959]">in {category}</span>
                  )}
                  {price !== 'all' && (
                    <span className="text-[#565959]">{priceFilterLabel(price)}</span>
                  )}
                  {rating !== 'all' && (
                    <span className="text-[#565959]">{rating}★ & up</span>
                  )}
                  {hasFilters && (
                    <Link
                      href="/search"
                      className="text-xs text-[#007185] hover:underline border border-[#D5D9D9] px-2 py-0.5 rounded-sm"
                    >
                      Clear all
                    </Link>
                  )}
                </div>

                <div id="listing-filters" className="flex md:hidden gap-2 overflow-x-auto pb-1 no-scrollbar scroll-mt-28">
                  {filterChip('All', getFilterUrl({ c: 'all' }), category === 'all')}
                  {categories.map((c: string) =>
                    filterChip(c, getFilterUrl({ c }), c === category)
                  )}
                </div>

                <div className="flex md:hidden gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {PRICE_RANGES.map((range) =>
                    filterChip(
                      range.label,
                      getFilterUrl({ pr: range.value, pg: '1' }),
                      price === range.value
                    )
                  )}
                </div>

                <ProductListingToolbar
                  currentSort={sort}
                  sortLinks={sortLinks}
                  quickSortLinks={quickSortLinks}
                  filterHref="#listing-filters"
                  showFilter
                />
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-sm shadow-sm p-12 text-center">
                  <p className="text-xl text-[#565959] mb-2">No results found</p>
                  <p className="text-sm text-[#565959] mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Link
                    href="/search"
                    className="btn-amazon px-6 py-2 rounded-md inline-block text-sm"
                  >
                    See all products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                  {products.map((product: Product) => (
                    <ProductCard key={product.slug} product={product} showDetailsButton />
                  ))}
                </div>
              )}

              <ProductPagination
                page={pageNum}
                pages={pages}
                getHref={(p) => getFilterUrl({ pg: `${p}` })}
              />
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
