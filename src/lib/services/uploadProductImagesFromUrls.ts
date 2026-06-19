import { getCloudinaryServer, isCloudinaryConfigured } from '@/lib/cloudinaryServer'
import { MIN_PRODUCT_IMAGES } from '@/lib/services/searchProductImages'

const UPLOAD_FOLDER = 'signed_upload_product_form'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

async function fetchImageAsDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'image/*' },
      signal: AbortSignal.timeout(15_000),
      redirect: 'follow',
    })
    if (!res.ok) return null

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.startsWith('image/')) return null

    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.byteLength < 500) return null

    return `data:${contentType};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
}

async function uploadSource(
  cloudinary: ReturnType<typeof getCloudinaryServer>,
  url: string
): Promise<string | null> {
  const dataUri = await fetchImageAsDataUri(url)
  if (dataUri) {
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: UPLOAD_FOLDER,
        resource_type: 'image',
      })
      if (result.public_id) return result.public_id
    } catch (err) {
      console.error('Cloudinary data-uri upload failed for', url, err)
    }
  }

  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: UPLOAD_FOLDER,
      resource_type: 'image',
    })
    if (result.public_id) return result.public_id
  } catch (err) {
    console.error('Cloudinary remote-url upload failed for', url, err)
  }

  return null
}

export async function uploadProductImagesFromUrls(
  urls: string[],
  target = MIN_PRODUCT_IMAGES
): Promise<string[]> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    )
  }

  const cloudinary = getCloudinaryServer()
  const uploaded: string[] = []

  for (const url of urls) {
    if (uploaded.length >= target) break

    const publicId = await uploadSource(cloudinary, url)
    if (publicId) uploaded.push(publicId)
  }

  return uploaded
}
