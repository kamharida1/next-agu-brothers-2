import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Review Order | Agu Brothers',
  robots: { index: false, follow: false },
}

export default async function PlaceOrderPage() {
  return <Form />
}
