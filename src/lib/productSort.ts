export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'lowest', label: 'Price: Low to High' },
  { value: 'highest', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
] as const

export const QUICK_SORT_OPTIONS = [
  { value: 'lowest', label: 'Lowest price' },
  { value: 'rating', label: 'Top rated' },
  { value: 'newest', label: 'Newest' },
] as const

export type ProductSort = (typeof SORT_OPTIONS)[number]['value']

export function normalizeSort(sort?: string): ProductSort {
  if (sort === 'lowest' || sort === 'highest' || sort === 'rating') return sort
  if (sort === 'toprated') return 'rating'
  return 'newest'
}

export function getMongoSortOrder(sort: string): Record<string, 1 | -1> {
  const normalized = normalizeSort(sort)
  if (normalized === 'lowest') return { price: 1 }
  if (normalized === 'highest') return { price: -1 }
  if (normalized === 'rating') return { rating: -1 }
  return { _id: -1 }
}

export function sortOptionLabel(sort: string): string {
  return SORT_OPTIONS.find((o) => o.value === normalizeSort(sort))?.label ?? 'Newest Arrivals'
}

/** Build a listing URL, omitting default sort/page values. */
export function buildListingUrl(
  basePath: string,
  params: Record<string, string | undefined>
): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (!value || value === 'all') continue
    if (key === 'sort' && value === 'newest') continue
    if (key === 'page' && value === '1') continue
    search.set(key, value)
  }
  const query = search.toString()
  return query ? `${basePath}?${query}` : basePath
}

export function buildSortLinks(
  basePath: string,
  params: Record<string, string | undefined>,
  currentSort: string
) {
  const normalized = normalizeSort(currentSort)
  return SORT_OPTIONS.map((option) => ({
    ...option,
    active: option.value === normalized,
    href: buildListingUrl(basePath, { ...params, sort: option.value, page: '1' }),
  }))
}

export function buildQuickSortLinks(
  basePath: string,
  params: Record<string, string | undefined>,
  currentSort: string
) {
  const normalized = normalizeSort(currentSort)
  return QUICK_SORT_OPTIONS.map((option) => ({
    ...option,
    active: option.value === normalized,
    href: buildListingUrl(basePath, { ...params, sort: option.value, page: '1' }),
  }))
}
