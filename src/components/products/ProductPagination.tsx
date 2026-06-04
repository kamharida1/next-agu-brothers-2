import Link from 'next/link'

export default function ProductPagination({
  page,
  pages,
  getHref,
}: {
  page: number
  pages: number
  getHref: (pageNum: number) => string
}) {
  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1 mt-4 bg-white rounded-sm shadow-sm p-3 flex-wrap">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={getHref(p)}
          className={`w-9 h-9 flex items-center justify-center text-sm rounded-sm border transition-colors ${
            page === p
              ? 'bg-[#FF9900] border-[#FF9900] text-[#131921] font-bold'
              : 'border-[#D5D9D9] text-[#007185] hover:border-[#AAAAAA]'
          }`}
        >
          {p}
        </Link>
      ))}
    </div>
  )
}
