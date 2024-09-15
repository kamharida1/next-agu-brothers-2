import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/CategoryModel'
import ProductModel from '@/lib/models/ProductModel'

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const product = await ProductModel.findById(params.id)
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

export const PUT = auth(async (...p: any) => {
  const [req, { params }] = p
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const {
    name,
    slug,
    price,
    costPrice,
    category,
    weight,
    image,
    images,
    brand,
    countInStock,
    description,
    properties,
    isFeatured,
    discountPercentage,
  } = await req.json()

  try {
    await dbConnect()
    // Fetch the category by ID to get its name
    const categoryObject = await CategoryModel.findById(category);
    if (!categoryObject) {
      return Response.json(
        { message: 'Category not found' },
        {
          status: 404,
        }
      );
    }
    const categoryName = categoryObject.name; 

    const product = await ProductModel.findById(params.id)
    if (product) {
      product.name = name
      product.slug = slug
      product.price = price
      product.costPrice = costPrice
      product.category = category
      product.cat = categoryName
      product.image = image
      product.images = images
      product.brand = brand
      product.weight = Number(weight)
      product.countInStock = countInStock
      product.description = description
      product.properties = properties
      product.isFeatured = isFeatured
      product.discountPercentage = discountPercentage
      const updatedProduct = await product.save()
      return Response.json(updatedProduct)
    } else {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args

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
    const product = await ProductModel.findById(params.id)
    if (product) {
      await product.deleteOne()
      return Response.json({ message: 'Product deleted successfully' })
    } else {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any