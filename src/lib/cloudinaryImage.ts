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
