/**
 * Products store Cloudinary public_ids. Older uploads may be full secure_urls.
 */

export function toCloudinaryPublicId(src: string): string {
  if (!src?.trim()) return src
  const trimmed = src.trim()
  if (!trimmed.startsWith('http')) return trimmed

  const marker = '/image/upload/'
  const idx = trimmed.indexOf(marker)
  if (idx === -1) return trimmed

  let path = trimmed.slice(idx + marker.length)
  path = path.replace(/^v\d+\//, '')
  path = path.replace(/\.[a-zA-Z0-9]+$/, '')
  return decodeURIComponent(path)
}

export function normalizeImageList(images: unknown): string[] {
  if (!Array.isArray(images)) return []
  return images
    .filter((x): x is string => typeof x === 'string' && x.length > 0)
    .map(toCloudinaryPublicId)
}

export function cloudinaryImageUrl(
  src: string,
  { w = 200, h = 200 }: { w?: number; h?: number } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const publicId = toCloudinaryPublicId(src)
  if (!cloudName || !publicId) return src
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${w},h_${h},c_limit,q_auto,f_auto/${publicId}`
}

/** Absolute URL for blog OG/JSON-LD (public_id, secure_url, or local path). */
export function resolveBlogImageUrl(
  src: string,
  { w = 1200, h = 675 }: { w?: number; h?: number } = {}
): string {
  if (!src) return src
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith('/')) {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'https://www.agubrothers.com'
    return `${base}${src}`
  }
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const publicId = toCloudinaryPublicId(src)
  if (!cloudName || !publicId) return src
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${w},h_${h},c_fill,q_auto,f_auto/${publicId}`
}
