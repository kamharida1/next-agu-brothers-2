import { round2 } from '@/lib/utils'

export type PricedProduct = {
  price: number
  discountPercentage?: number
  discountedPrice?: number
}

/** Customer-facing unit price (sale price when discounted). */
export function getSalePrice(product: PricedProduct): number {
  const list = round2(product.price)
  if (typeof product.price !== 'number' || isNaN(product.price)) return 0

  const discounted = product.discountedPrice
  if (
    typeof discounted === 'number' &&
    !isNaN(discounted) &&
    round2(discounted) < list
  ) {
    return round2(discounted)
  }

  const pct = product.discountPercentage
  if (typeof pct === 'number' && pct > 0) {
    return round2(list - (list * pct) / 100)
  }

  return list
}

/** True when sale price is at least ₦1 below list (ignores float noise). */
export function hasDiscount(product: PricedProduct): boolean {
  const list = round2(product.price)
  return getSalePrice(product) <= list - 1
}

export function getListPrice(product: PricedProduct): number {
  return product.price
}

export type ProductDocForOrder = PricedProduct & {
  _id: { toString(): string }
  name: string
  countInStock: number
}

export function resolveOrderItemPrice(
  dbProduct: ProductDocForOrder | undefined,
  fallbackPrice?: number
): number {
  if (dbProduct) return getSalePrice(dbProduct)
  if (typeof fallbackPrice === 'number' && !isNaN(fallbackPrice)) return fallbackPrice
  throw new Error('Product not found')
}

export function validateOrderStock(
  items: { _id?: string; product?: string; name: string; qty: number }[],
  dbProducts: ProductDocForOrder[]
): string | null {
  for (const item of items) {
    const id = item._id ?? item.product
    if (!id) return `Invalid line item: ${item.name}`

    const db = dbProducts.find((p) => p._id.toString() === id)
    if (!db) return `Product not found: ${item.name}`
    if (db.countInStock < item.qty) {
      const left = db.countInStock
      return left === 0
        ? `${db.name} is out of stock.`
        : `Only ${left} left in stock for ${db.name}.`
    }
  }
  return null
}
