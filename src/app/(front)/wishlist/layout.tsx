import type { Metadata } from 'next'
import { ROBOTS_NOINDEX } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Wishlist',
  robots: ROBOTS_NOINDEX,
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children
}
