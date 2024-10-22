import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import ProductModel from "@/lib/models/ProductModel"

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  await dbConnect()
  const product = await ProductModel.findOne({ slug: params.slug }).populate('reviews').lean();

  if (!product) {
    return Response.json(
      { message: 'product not found' },
      {
        status: 404,
      }
    )
  }
  return Response.json(product)
}) as any