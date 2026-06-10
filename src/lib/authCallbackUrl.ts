const DEFAULT_CALLBACK = '/'

/** Resolve a safe same-origin post-auth redirect. */
export function sanitizeCallbackUrl(
  candidate: string | null | undefined,
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): string {
  if (!candidate) return DEFAULT_CALLBACK

  const decoded = (() => {
    try {
      return decodeURIComponent(candidate)
    } catch {
      return candidate
    }
  })()

  if (decoded.startsWith('/') && !decoded.startsWith('//')) {
    return decoded
  }

  try {
    const url = new URL(decoded)
    const base = new URL(baseUrl)
    if (url.origin === base.origin) {
      return `${url.pathname}${url.search}${url.hash}`
    }
  } catch {
    // ignore invalid URLs
  }

  return DEFAULT_CALLBACK
}

/** Prefer explicit query param, then Auth.js callback cookie. */
export function resolveCallbackUrl(
  fromQuery?: string | null,
  fromCookie?: string | null,
  baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
): string {
  if (fromQuery) return sanitizeCallbackUrl(fromQuery, baseUrl)
  if (fromCookie) return sanitizeCallbackUrl(fromCookie, baseUrl)
  return DEFAULT_CALLBACK
}

/** Build auth routes with a properly encoded callbackUrl. */
export function authPathWithCallback(
  path: string,
  callbackUrl: string,
  extra?: Record<string, string>
): string {
  const params = new URLSearchParams()
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value)
    }
  }
  params.set('callbackUrl', callbackUrl)
  return `${path}?${params.toString()}`
}
