import { v2 as cloudinary } from 'cloudinary'

let configured = false

export function getCloudinaryApiSecret(): string | undefined {
  return process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY &&
      getCloudinaryApiSecret()
  )
}

export function getCloudinaryServer() {
  if (!configured) {
    const apiSecret = getCloudinaryApiSecret()
    if (!apiSecret) {
      throw new Error(
        'Cloudinary API secret is missing. Set CLOUDINARY_API_SECRET or NEXT_PUBLIC_CLOUDINARY_API_SECRET.'
      )
    }

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: apiSecret,
    })
    configured = true
  }
  return cloudinary
}
