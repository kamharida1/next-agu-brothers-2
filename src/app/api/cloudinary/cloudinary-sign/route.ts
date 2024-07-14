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
      eager: 'c_pad,h_300,w_400|c_crop,h_200,w_260',
      folder: 'signed_upload_product_form'
    },
    process.env.NEXT_PUBLIC_CLOUDINARY_SECRET!
  )

  return Response.json({ signature, timestamp })
}) as any