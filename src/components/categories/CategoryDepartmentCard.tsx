import CldImage from '@/components/CldImage'
import Link from 'next/link'
import { categoryHref } from '@/lib/categorySlugs'

type Props = {
  category: string
  imageSrc?: string | null
  labelClassName?: string
  imageSize?: 'sm' | 'md'
}

function CategoryPlaceholder({ category }: { category: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#232F3E] to-[#37475A] text-white text-xl font-bold">
      {category.charAt(0)}
    </div>
  )
}

export default function CategoryDepartmentCard({
  category,
  imageSrc,
  labelClassName = 'text-xs',
  imageSize = 'sm',
}: Props) {
  const frameClass =
    imageSize === 'md'
      ? 'max-w-[120px] sm:max-w-[140px]'
      : 'max-w-[88px] sm:max-w-[96px]'

  return (
    <Link
      href={categoryHref(category)}
      className="group flex flex-col items-center gap-2 p-2.5 sm:p-3 rounded-sm border border-[#D5D9D9]
                 hover:border-[#FF9900] hover:shadow-sm active:scale-[0.98] transition-all text-center bg-white
                 touch-manipulation min-h-[44px] w-full"
    >
      <div
        className={`relative w-full aspect-square ${frameClass} rounded-sm overflow-hidden bg-white border border-[#EAEDED]`}
      >
        {imageSrc ? (
          <CldImage
            src={imageSrc}
            alt={category}
            fill
            sizes={imageSize === 'md' ? '(max-width: 640px) 120px, 140px' : '(max-width: 640px) 100px, 96px'}
            className="object-contain p-1.5 sm:p-2 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <CategoryPlaceholder category={category} />
        )}
      </div>
      <span
        className={`${labelClassName} text-[#0F1111] leading-snug font-medium line-clamp-2 px-0.5`}
      >
        {category}
      </span>
    </Link>
  )
}
