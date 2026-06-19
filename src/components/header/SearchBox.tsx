'use client'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect, useCallback } from 'react'
import CldImage from '../CldImage'
import { getSalePrice, hasDiscount } from '@/lib/productPricing'
import Price from '@/components/products/Price'

type Suggestion = {
  _id: string
  name: string
  slug: string
  images: string[]
  price: number
  discountPercentage?: number
  discountedPrice?: number
  cat: string
}

export const SearchBox = () => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setSuggestions([]); setOpen(false); return }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products/autocomplete?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setSuggestions(data)
        setOpen(data.length > 0)
      } catch {
        setSuggestions([])
        setOpen(false)
      }
    }, 200)
  }, [])

  useEffect(() => {
    fetchSuggestions(query)
  }, [query, fetchSuggestions])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleSelect = (slug: string) => {
    setOpen(false)
    setQuery('')
    router.push(`/product/${slug}`)
  }

  return (
    <div ref={wrapperRef} className="w-full relative">
      <form onSubmit={handleSubmit}>
        <div className={`flex h-10 rounded-md overflow-hidden transition-shadow ${focused ? 'ring-2 ring-[#FF9900]' : ''}`}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); if (suggestions.length) setOpen(true) }}
            onBlur={() => setFocused(false)}
            placeholder="Search Agu Brothers"
            autoComplete="off"
            className="flex-1 px-4 text-[#0F1111] text-sm bg-white focus:outline-none
                       border-0 placeholder:text-[#6C6C6C] min-w-0"
          />
          <button
            type="submit"
            className="bg-[#FF9900] hover:bg-[#F3A847] px-4 flex items-center justify-center
                       transition-colors duration-100 rounded-r-md flex-shrink-0"
            aria-label="Search"
          >
            <svg className="w-5 h-5 text-[#131921]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Autocomplete dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-[200] bg-white border border-[#D5D9D9]
                        shadow-xl rounded-b-sm mt-0.5 overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s._id}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s.slug) }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F7F8F8]
                         transition-colors text-left border-b border-[#F7F8F8] last:border-0"
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 flex-shrink-0 bg-[#F7F8F8] rounded-sm flex items-center justify-center overflow-hidden">
                {s.images?.[0] && (
                  <CldImage
                    src={s.images[0]}
                    alt={s.name}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#0F1111] truncate">{s.name}</p>
                <p className="text-xs text-[#565959]">{s.cat}</p>
              </div>

              {/* Price */}
              <div className="flex-shrink-0">
                <Price
                  amount={getSalePrice(s)}
                  compareAt={hasDiscount(s) ? s.price : undefined}
                  size="sm"
                />
              </div>
            </button>
          ))}

          {/* View all results */}
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleSubmit(e as any) }}
            className="w-full px-4 py-2.5 text-sm text-[#007185] hover:bg-[#F7F8F8]
                       text-left border-t border-[#D5D9D9] font-medium"
          >
            See all results for &quot;{query}&quot; →
          </button>
        </div>
      )}
    </div>
  )
}
