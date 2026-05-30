import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Account Settings | Agu Brothers',
  robots: { index: false, follow: false },
}

export default async function Profile() {
  return <Form />
}
