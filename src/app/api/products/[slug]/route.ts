import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import ProductModel from "@/lib/models/ProductModel"

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  // if (!req.auth) {
  //   return Response.json(
  //     { message: 'unauthorized' },
  //     {
  //       status: 401,
  //     }
  //   )
  // }
  try {
    await dbConnect()
  const product = await ProductModel.findOne({ slug: params.slug });

  if (!product) {
    return Response.json(
      { message: 'product not found' },
      {
        status: 404,
      }
    )
  }
  return Response.json(product)
  }catch(e) {
    console.error('Error fetching product', e)
    return Response.json(
      { message: 'Internal Server Error' },
      {
        status: 500,
      }
    )
  }

}) as any