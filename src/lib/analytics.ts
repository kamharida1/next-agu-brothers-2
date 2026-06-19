import type { OrderItem } from '@/lib/models/OrderModel'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

type GaItem = {
  item_id: string
  item_name: string
  price: number
  quantity?: number
  item_brand?: string
  item_category?: string
}

function toGaItem(item: {
  slug: string
  name: string
  price: number
  qty?: number
  brand?: string
  cat?: string
}): GaItem {
  return {
    item_id: item.slug,
    item_name: item.name,
    price: item.price,
    quantity: item.qty ?? 1,
    ...(item.brand && { item_brand: item.brand }),
    ...(item.cat && { item_category: item.cat }),
  }
}

function gaEvent(eventName: string, params?: Record<string, unknown>) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return
  window.gtag?.('event', eventName, params)
}

export function trackViewItem(product: {
  slug: string
  name: string
  price: number
  brand?: string
  cat?: string
}) {
  gaEvent('view_item', {
    currency: 'NGN',
    value: product.price,
    items: [toGaItem(product)],
  })
}

export function trackAddToCart(item: OrderItem & { brand?: string; cat?: string }) {
  gaEvent('add_to_cart', {
    currency: 'NGN',
    value: item.price * (item.qty || 1),
    items: [toGaItem({ ...item, qty: item.qty || 1 })],
  })
}

export function trackPurchase(
  orderId: string,
  items: OrderItem[],
  totalPrice: number
) {
  gaEvent('purchase', {
    transaction_id: orderId,
    currency: 'NGN',
    value: totalPrice,
    items: items.map((item) => toGaItem({ ...item, qty: item.qty })),
  })
}
