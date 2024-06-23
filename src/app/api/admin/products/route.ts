import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/CategoryModel'
import ProductModel from '@/lib/models/ProductModel'
import { toPlainObject } from '@/lib/utils'

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const products = await ProductModel.find()
  return Response.json(products)
}) as any

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const {
    name,
    slug,
    category,
    images,
    price,
    brand,
    rating,
    numReviews,
    countInStock,
    description,
    isFeatured,
    properties,
    banner,
  } = await req.json()
  
  try {
    const product = new ProductModel({
      name,
      slug,
      category,
      images,
      price,
      brand,
      rating,
      numReviews: 0,
      countInStock,
      description,
      isFeatured: true,
      properties,
      banner,
    })
    await product.save()
    const plainProduct = toPlainObject(product.toObject()); // Assuming Mongoose model, use toObject() to get a plain JS object
      return Response.json(
        { message: 'Product created successfully', product: plainProduct },
        {
          status: 201,
        }
      );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
