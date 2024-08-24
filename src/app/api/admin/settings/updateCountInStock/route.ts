import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import ProductModel from "@/lib/models/ProductModel"

export const PUT = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  try { 
    await dbConnect()
    const { productId, countInStock } = await req.json()
    const product = await ProductModel.findByIdAndUpdate(productId, { countInStock }, { new: true }).lean()

    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 })
    }
    return Response.json(product)
  } catch (e: any) {
    return Response.json({ message: e.message }, { status: 500 })
  }
  
}) as any