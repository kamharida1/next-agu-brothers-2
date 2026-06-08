import { auth } from '@/lib/auth'
import cloudinary from 'cloudinary'
import { getCloudinaryApiSecret } from '@/lib/cloudinaryServer'

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const apiSecret = getCloudinaryApiSecret()
  if (!apiSecret) {
    return Response.json({ message: 'Cloudinary API secret is not configured' }, { status: 500 })
  }

  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: 'signed_upload_product_form',
    },
    apiSecret
  )

  return Response.json({ signature, timestamp })
}) as any