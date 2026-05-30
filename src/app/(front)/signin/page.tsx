import { Metadata } from 'next'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Sign in | Agu Brothers',
  robots: { index: false, follow: false },
}

export default async function Signin() {
  return <Form />
}
