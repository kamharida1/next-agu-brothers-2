import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import ProductModel from "@/lib/models/ProductModel"

// Update the countInStock of a product
export const PUT = auth(async (req: any) => {
  await dbConnect()
  const { productId, countInStock } = await req.json()
  const product = await ProductModel.findByIdAndUpdate(productId, { countInStock }, { new: true }).lean()

  if (!product) {
    return Response.json({ message: 'Product not found' }, { status: 404 })
  }
  return Response.json(product)
}) as any