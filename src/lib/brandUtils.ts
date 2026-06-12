function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Case-insensitive, trim-aware match for product brand fields. */
export function brandMatchRegex(brand: string): RegExp {
  const trimmed = brand.trim()
  if (!trimmed) return /^$/
  return new RegExp(`^\\s*${escapeRegex(trimmed)}\\s*$`, 'i')
}

function brandDisplayScore(name: string): number {
  if (/^[A-Z][a-z]/.test(name)) return 3
  if (/^[A-Z0-9+&.-]+$/.test(name)) return 2
  return 1
}

function pickCanonicalBrand(existing: string, candidate: string): string {
  const a = existing.trim()
  const b = candidate.trim()
  const scoreA = brandDisplayScore(a)
  const scoreB = brandDisplayScore(b)
  if (scoreA !== scoreB) return scoreA > scoreB ? a : b
  return a.length <= b.length ? a : b
}

/** Collapse whitespace/case duplicates into one display name per brand. */
export function dedupeBrands(brands: string[]): string[] {
  const seen = new Map<string, string>()

  for (const raw of brands) {
    if (!raw) continue
    const trimmed = raw.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    const existing = seen.get(key)
    seen.set(key, existing ? pickCanonicalBrand(existing, trimmed) : trimmed)
  }

  return [...seen.values()].sort((a, b) => a.localeCompare(b))
}
