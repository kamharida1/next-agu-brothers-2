import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel, { Product } from '@/lib/models/ProductModel'

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
    const { brand, factor } = await req.json()
    const products = await ProductModel.find({ brand }).lean()
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        const newPrice = product.price * factor
        const newCostPrice = product.costPrice * factor

        return ProductModel.findByIdAndUpdate(product._id,
          { $set: { price: newPrice, costPrice: newCostPrice } },
          { new: true }
        )
      })
    )
    return Response.json(updatedProducts)
  } catch (e: any) {
    return Response.json({ message: e.message }, { status: 500 })
  }
  
}) as any