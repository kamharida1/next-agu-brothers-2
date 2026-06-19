import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Shipping Address | Agu Brothers',
  robots: { index: false, follow: false },
}

export default async function ShippingPage() {
  return <Form />
}
