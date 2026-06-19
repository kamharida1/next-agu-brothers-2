import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { authPathWithCallback, resolveCallbackUrl } from '@/lib/authCallbackUrl'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Create Account | Agu Brothers',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ callbackUrl?: string }>

export default async function Register({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const cookieCallback = (await cookies()).get('authjs.callback-url')?.value ?? null
  const callbackUrl = resolveCallbackUrl(params.callbackUrl, cookieCallback)

  if (!params.callbackUrl && cookieCallback) {
    redirect(authPathWithCallback('/register', callbackUrl))
  }

  return <Form callbackUrl={callbackUrl} />
}
