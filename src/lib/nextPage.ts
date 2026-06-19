/** Next.js 15+ page prop helpers (async params / searchParams). */
export type PageParams<T extends Record<string, string>> = {
  params: Promise<T>
}

export type PageSearchParams<T extends Record<string, string | undefined>> = {
  searchParams: Promise<T>
}
