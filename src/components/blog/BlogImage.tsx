import Image from 'next/image'
import { resolveBlogImageUrl } from '@/lib/cloudinaryImage'

type BlogImageProps = {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

/** Blog hero/card images — Cloudinary public_id, secure_url, or local /public path. */
export default function BlogImage({
  src,
  alt,
  width = 1200,
  height = 675,
  className,
  fill,
  sizes,
  priority,
}: BlogImageProps) {
  const resolved = resolveBlogImageUrl(src, { w: width, h: height })

  if (!resolved) return null

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        className={className}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}
