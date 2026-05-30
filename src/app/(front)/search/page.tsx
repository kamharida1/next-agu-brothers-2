import { Metadata } from 'next'
import ProductItem from '@/components/products/ProductItem'
import { Rating } from '@/components/products/Rating'
import { Product } from '@/lib/models/ProductModel'
import productServices from '@/lib/services/productService'
import Link from 'next/link'

const BASE_URL = 'https://www.agubrothers.com'

const sortOrders = [
  { value: 'newest',  label: 'Newest Arrivals' },
  { value: 'lowest',  label: 'Price: Low to High' },
  { value: 'highest', label: 'Price: High to Low' },
  { value: 'rating',  label: 'Avg. Customer Review' },
]
const ratings = [4, 3, 2, 1]

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string; category?: string }
}): Promise<Metadata> {
  const q = searchParams.q && searchParams.q !== 'all' ? searchParams.q : null
  const category = searchParams.category && searchParams.category !== 'all' ? searchParams.category : null

  const title = q
    ? `"${q}" results | Agu Brothers`
    : category
    ? `${category} | Agu Brothers Electronics`
    : 'Shop All Electronics | Agu Brothers'

  const description = q
    ? `Search results for "${q}" at Agu Brothers — Nigeria's trusted electronics store.`
    : category
    ? `Shop ${category} at Agu Brothers. Best prices, genuine products, fast delivery across Nigeria.`
    : 'Browse our full range of electronics and home appliances. TVs, fridges, generators, ACs and more.'

  return {
    title,
    description,
    alternates: {
      canonical: category
        ? `${BASE_URL}/search?category=${encodeURIComponent(category)}`
        : `${BASE_URL}/search`,
    },
    openGraph: { title, description, url: `${BASE_URL}/search` },
    // Search result pages should be indexed for category browsing
    robots: q ? { index: false } : { index: true },
  }
}

export default async function SearchPage({
  searchParams: { q = 'all', category = 'all', rating = 'all', sort = 'newest', page = '1' },
}: {
  searchParams: { q: string; category: string; rating: string; sort: string; page: string }
}) {
  const getFilterUrl = ({ c, s, r, pg }: { c?: string; s?: string; r?: string; pg?: string }) => {
    const params = { q, category, price: 'all', rating, sort, page }
    if (c) params.category = c
    if (r) params.rating = r
    if (pg) params.page = pg
    if (s) params.sort = s
    return `/search?${new URLSearchParams(params)}`
  }

  const categories = JSON.parse(JSON.stringify(await productServices.getCategories()))
  const { countProducts, products, pages } = JSON.parse(JSON.stringify(
    await productServices.getByQuery({ category, q, price: 'all', rating, page, sort })
  ))

  const hasFilters = q !== 'all' || category !== 'all' || rating !== 'all'

  // ItemList JSON-LD for category pages
  const itemListJsonLd = category !== 'all' && products.length > 0 ? {
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
  } : null

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

            {/* ── Sidebar (desktop only) ── */}
            <aside className="hidden md:block w-52 flex-shrink-0">
              <div className="bg-white rounded-sm shadow-sm p-4 sticky top-[120px] space-y-5">
                <div>
                  <h3 className="font-bold text-sm text-[#0F1111] mb-2">Department</h3>
                  <ul className="space-y-1.5">
                    <li>
                      <Link href={getFilterUrl({ c: 'all' })}
                        className={`text-sm block ${category === 'all' ? 'font-bold text-[#0F1111]' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}>
                        Any Department
                      </Link>
                    </li>
                    {categories.map((c: string) => (
                      <li key={c}>
                        <Link href={getFilterUrl({ c })}
                          className={`text-sm block ${c === category ? 'font-bold text-[#0F1111]' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}>
                          {c}
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
                      <Link href={getFilterUrl({ r: 'all' })}
                        className={`text-sm block ${rating === 'all' ? 'font-bold text-[#0F1111]' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}>
                        All Reviews
                      </Link>
                    </li>
                    {ratings.map((r) => (
                      <li key={r}>
                        <Link href={getFilterUrl({ r: `${r}` })}
                          className={`flex items-center gap-1 text-sm ${`${r}` === rating ? 'font-bold' : 'text-[#007185] hover:underline hover:text-[#CC0C39]'}`}>
                          <Rating value={r} caption="" />
                          <span className="text-xs">& Up</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* ── Results ── */}
            <main className="flex-1 min-w-0">
              {category !== 'all' && (
                <h1 className="sr-only">{category} — Agu Brothers Electronics</h1>
              )}

              <div className="bg-white rounded-sm shadow-sm p-4 mb-4 space-y-3">
                <div className="text-sm text-[#0F1111] flex flex-wrap items-center gap-2">
                  <span className="font-bold">
                    {countProducts === 0 ? 'No' : `1-${Math.min(countProducts, 8)} of ${countProducts}`}
                  </span>
                  <span>results</span>
                  {q !== 'all' && <span className="text-[#565959]">for &quot;{q}&quot;</span>}
                  {category !== 'all' && <span className="text-[#565959]">in {category}</span>}
                  {rating !== 'all' && <span className="text-[#565959]">{rating}★ & up</span>}
                  {hasFilters && (
                    <Link href="/search" className="text-xs text-[#007185] hover:underline border border-[#D5D9D9] px-2 py-0.5 rounded-sm">
                      Clear all
                    </Link>
                  )}
                </div>

                {/* Mobile category chips */}
                <div className="flex md:hidden gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {['all', ...categories].map((c: string) => (
                    <Link key={c} href={getFilterUrl({ c })}
                      className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap flex-shrink-0 transition-colors ${
                        (c === 'all' ? category === 'all' : c === category)
                          ? 'bg-[#131921] text-white border-[#131921]'
                          : 'border-[#D5D9D9] text-[#0F1111] hover:border-[#AAAAAA]'
                      }`}>
                      {c === 'all' ? 'All' : c}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#565959] text-sm flex-shrink-0">Sort by:</span>
                  <div className="flex gap-1 flex-wrap">
                    {sortOrders.map((s) => (
                      <Link key={s.value} href={getFilterUrl({ s: s.value })}
                        className={`px-2.5 py-1 rounded-sm text-xs border transition-colors ${
                          sort === s.value
                            ? 'bg-[#FF9900] border-[#FF9900] text-[#131921] font-bold'
                            : 'border-[#D5D9D9] text-[#007185] hover:border-[#AAAAAA]'
                        }`}>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-sm shadow-sm p-12 text-center">
                  <p className="text-xl text-[#565959] mb-2">No results found</p>
                  <p className="text-sm text-[#565959] mb-4">Try adjusting your search or filters</p>
                  <Link href="/search" className="btn-amazon px-6 py-2 rounded-md inline-block text-sm">
                    See all products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                  {products.map((product: Product) => (
                    <ProductItem key={product.slug} product={product} />
                  ))}
                </div>
              )}

              {pages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-4 bg-white rounded-sm shadow-sm p-3 flex-wrap">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <Link key={p} href={getFilterUrl({ pg: `${p}` })}
                      className={`w-9 h-9 flex items-center justify-center text-sm rounded-sm border transition-colors ${
                        Number(page) === p
                          ? 'bg-[#FF9900] border-[#FF9900] text-[#131921] font-bold'
                          : 'border-[#D5D9D9] text-[#007185] hover:border-[#AAAAAA]'
                      }`}>
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
