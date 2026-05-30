import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Create Account | Agu Brothers',
  robots: { index: false, follow: false },
}

export default async function Register() {
  return <Form />
}
