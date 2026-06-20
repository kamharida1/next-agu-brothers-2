'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SORT_OPTIONS, sortOptionLabel, type ProductSort } from '@/lib/productSort'

type SortLink = {
  value: string
  label: string
  href: string
  active: boolean
}

type ProductListingToolbarProps = {
  currentSort: string
  sortLinks: SortLink[]
  quickSortLinks: SortLink[]
  filterHref?: string
  showFilter?: boolean
  filtersAnchorId?: string
}

export default function ProductListingToolbar({
  currentSort,
  sortLinks,
  quickSortLinks,
  filterHref,
  showFilter = false,
  filtersAnchorId = 'listing-filters',
}: ProductListingToolbarProps) {
  const router = useRouter()
  const normalized = sortOptionLabel(currentSort)

  return (
    <div className="space-y-3">
      {/* Mobile: sticky sort + filter bar */}
      <div className="md:hidden sticky top-[108px] z-20 -mx-4 px-4 py-2 bg-[#EAEDED] border-b border-[#D5D9D9]/80">
        <div className="flex gap-2">
          <label className="flex-1 flex items-center gap-2 bg-white border border-[#D5D9D9] rounded-sm px-3 py-2 text-sm">
            <span className="text-[#565959] whitespace-nowrap">Sort</span>
            <select
              value={normalizeSortValue(currentSort)}
              onChange={(e) => {
                const link = sortLinks.find((s) => s.value === e.target.value)
                if (link) router.push(link.href)
              }}
              className="flex-1 bg-transparent text-[#0F1111] font-medium outline-none cursor-pointer"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {showFilter && filterHref && (
            <Link
              href={filterHref.includes('#') ? filterHref : `${filterHref}#${filtersAnchorId}`}
              className="flex items-center justify-center px-4 py-2 bg-white border border-[#D5D9D9] rounded-sm text-sm font-medium text-[#0F1111] hover:border-[#AAAAAA] whitespace-nowrap"
            >
              Filter
            </Link>
          )}
        </div>
      </div>

      {/* Desktop: dropdown top-right row */}
      <div className="hidden md:flex items-center justify-end gap-2">
        <span className="text-sm text-[#565959]">Sort by:</span>
        <label className="inline-flex items-center gap-2 bg-white border border-[#D5D9D9] rounded-sm px-3 py-1.5 text-sm hover:border-[#AAAAAA]">
          <select
            value={normalizeSortValue(currentSort)}
            onChange={(e) => {
              const link = sortLinks.find((s) => s.value === e.target.value)
              if (link) router.push(link.href)
            }}
            className="bg-transparent text-[#0F1111] font-medium outline-none cursor-pointer pr-6"
            aria-label={`Sort by: ${normalized}`}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Quick sort chips — all breakpoints */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[#565959] flex-shrink-0 md:hidden">Quick sort:</span>
        <span className="text-xs text-[#565959] flex-shrink-0 hidden md:inline">Quick sort:</span>
        <div className="flex gap-1.5 flex-wrap">
          {quickSortLinks.map((chip) => (
            <Link
              key={chip.value}
              href={chip.href}
              className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap transition-colors ${
                chip.active
                  ? 'bg-[#FF9900] border-[#FF9900] text-[#131921] font-bold'
                  : 'border-[#D5D9D9] text-[#007185] hover:border-[#AAAAAA] bg-white'
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function normalizeSortValue(sort: string): ProductSort {
  if (sort === 'lowest' || sort === 'highest' || sort === 'rating') return sort
  return 'newest'
}
