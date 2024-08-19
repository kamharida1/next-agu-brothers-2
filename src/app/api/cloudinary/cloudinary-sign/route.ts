import { auth } from '@/lib/auth'
import cloudinary from 'cloudinary'

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder: 'signed_upload_product_form'
    },
    'raOnuH6_f9FpgQZs4NgFKTdzLzc'
  )

  return Response.json({ signature, timestamp })
}) as any