import { getListPrice, getSalePrice, hasDiscount, type PricedProduct } from '@/lib/productPricing'

interface PriceProps {
  amount: number
  compareAt?: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm:  { sym: 'text-xs  leading-none mt-[3px]', int: 'text-sm  ' },
  md:  { sym: 'text-sm  leading-none mt-[3px]', int: 'text-lg  ' },
  lg:  { sym: 'text-base leading-none mt-[4px]', int: 'text-2xl ' },
  xl:  { sym: 'text-lg  leading-none mt-[5px]', int: 'text-3xl ' },
}

const compareSizes = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
  xl: 'text-base',
}

function PriceAmount({
  amount,
  size = 'md',
  className = '',
}: {
  amount: number
  size?: PriceProps['size']
  className?: string
}) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return <span className={className}>₦0</span>
  }

  const integer = amount.toLocaleString('en-NG', { maximumFractionDigits: 0 })
  const { sym, int } = sizes[size]

  return (
    <span
      className={`inline-flex items-start font-bold text-[#0F1111] dark:text-base-content ${className}`}
    >
      <span className={`${sym} mr-0.5`}>₦</span>
      <span className={int}>{integer}</span>
    </span>
  )
}

export default function Price({
  amount,
  compareAt,
  size = 'md',
  className = '',
}: PriceProps) {
  const showCompare =
    typeof compareAt === 'number' &&
    !isNaN(compareAt) &&
    Math.round(compareAt) > Math.round(amount)

  if (!showCompare) {
    return <PriceAmount amount={amount} size={size} className={className} />
  }

  const listInteger = compareAt.toLocaleString('en-NG', { maximumFractionDigits: 0 })

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
      <PriceAmount amount={amount} size={size} />
      <span
        className={`text-[#565959] line-through font-normal ${compareSizes[size]}`}
        aria-label={`Was ₦${listInteger}`}
      >
        ₦{listInteger}
      </span>
    </span>
  )
}

/** Renders sale + strikethrough list price from product fields. */
export function ProductPrice({
  product,
  size = 'md',
  className = '',
}: {
  product: PricedProduct
  size?: PriceProps['size']
  className?: string
}) {
  const sale = getSalePrice(product)
  const list = getListPrice(product)
  return (
    <Price
      amount={sale}
      compareAt={hasDiscount(product) ? list : undefined}
      size={size}
      className={className}
    />
  )
}
