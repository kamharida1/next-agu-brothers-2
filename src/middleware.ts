import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'

const authConfig = {
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ]
      const { pathname } = request.nextUrl
      if (protectedPaths.some((p) => p.test(pathname))) return !!auth
      return true
    },
  },
} satisfies NextAuthConfig

export const { auth: middleware } = NextAuth(authConfig)

export const config = {
  matcher: [
    '/shipping/:path*',
    '/payment/:path*',
    '/place-order/:path*',
    '/profile/:path*',
    '/order/:path*',
    '/admin/:path*',
  ],
}
