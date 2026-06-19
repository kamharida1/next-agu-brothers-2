import { Metadata } from 'next'
import MyOrders from './MyOrders'

export const metadata: Metadata = {
  title: 'Your Orders | Agu Brothers',
  robots: { index: false, follow: false },
}

export default function OrderHistory() {
  return <MyOrders />
}
