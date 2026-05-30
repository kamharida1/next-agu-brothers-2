'use client'
import { useSearchParams } from 'next/navigation'

export const SearchBox = () => {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''

  return (
    <form action="/search" method="GET" className="w-full">
      <div className="flex h-10 rounded-md overflow-hidden">
        <input
          name="q"
          defaultValue={q}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </div>
    </form>
  )
}
