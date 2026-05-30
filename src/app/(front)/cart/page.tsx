import { Metadata } from 'next'
import CartDetails from './CartDetails'

export const metadata: Metadata = {
  title: 'Shopping Cart | Agu Brothers',
  robots: { index: false, follow: false },
}

export default function CartPage() {
  return <CartDetails />
}
