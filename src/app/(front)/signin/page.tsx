import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { authPathWithCallback, resolveCallbackUrl } from '@/lib/authCallbackUrl'
import Form from './Form'

export const metadata: Metadata = {
  title: 'Sign in | Agu Brothers',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{
  callbackUrl?: string
  error?: string
  success?: string
}>

export default async function Signin({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const cookieCallback = (await cookies()).get('authjs.callback-url')?.value ?? null
  const callbackUrl = resolveCallbackUrl(params.callbackUrl, cookieCallback)

  // OAuth cancel / auth errors land on bare /signin — restore callbackUrl from cookie
  if (!params.callbackUrl && cookieCallback) {
    redirect(
      authPathWithCallback('/signin', callbackUrl, {
        ...(params.error ? { error: params.error } : {}),
        ...(params.success ? { success: params.success } : {}),
      })
    )
  }

  return <Form callbackUrl={callbackUrl} />
}
