import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import ClientProviders from './ClientProviders'
import PasswordUpdatePrompt from './PasswordUpdatePrompt'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <PasswordUpdatePrompt />
      <ClientProviders>{children}</ClientProviders>
    </SessionProvider>
  )
}
