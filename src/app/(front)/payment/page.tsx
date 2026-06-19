import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Payment Method | Agu Brothers',
  robots: { index: false, follow: false },
}

export default async function PaymentPage() {
  return <Form />
}
