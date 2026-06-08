import { getCloudinaryServer } from '@/lib/cloudinaryServer'
import { MIN_PRODUCT_IMAGES } from '@/lib/services/searchProductImages'

const UPLOAD_FOLDER = 'signed_upload_product_form'

export async function uploadProductImagesFromUrls(
  urls: string[],
  target = MIN_PRODUCT_IMAGES
): Promise<string[]> {
  const cloudinary = getCloudinaryServer()
  const uploaded: string[] = []

  for (const url of urls) {
    if (uploaded.length >= target) break

    try {
      const result = await cloudinary.uploader.upload(url, {
        folder: UPLOAD_FOLDER,
        resource_type: 'image',
      })
      if (result.public_id) uploaded.push(result.public_id)
    } catch (err) {
      console.error('Cloudinary upload failed for', url, err)
    }
  }

  return uploaded
}
