import { v2 as cloudinary } from 'cloudinary'

let configured = false

export function getCloudinaryServer() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    configured = true
  }
  return cloudinary
}
