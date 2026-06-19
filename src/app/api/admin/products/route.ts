import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/CategoryModel'
import ProductModel from '@/lib/models/ProductModel'
import { toPlainObject } from '@/lib/utils'
import { isAutoCategoryBlogEnabled } from '@/lib/services/siteSettingsService'
import { syncCategoryBlogFromProduct } from '@/lib/services/syncCategoryBlogFromProduct'

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
  const products = await ProductModel.find().populate('category')
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
    image,
    images,
    costPrice,
    price,
    brand,
    rating,
    weight,
    discountPercentage,
    countInStock,
    description,
    isFeatured,
    properties,
    banner,
  } = await req.json()
  
  try {
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

    const product = new ProductModel({
      name,
      slug,
      category,
      cat: categoryName,
      images,
      weight: Number(weight),
      image,
      costPrice,
      price,
      brand,
      rating,
      numReviews: 0,
      countInStock,
      description,
      discountPercentage,
      isFeatured,
      properties,
      banner,
    })
    await product.save()
    const plainProduct = toPlainObject(product.toObject())

    let categoryBlog: { slug: string; created: boolean } | null = null
    if (await isAutoCategoryBlogEnabled()) {
      try {
        categoryBlog = await syncCategoryBlogFromProduct({
          name: plainProduct.name,
          slug: plainProduct.slug,
          cat: plainProduct.cat,
          brand: plainProduct.brand,
          image: plainProduct.image,
          images: plainProduct.images,
          description: plainProduct.description,
        })
      } catch (blogErr) {
        console.error('Category blog sync failed:', blogErr)
      }
    }

      return Response.json(
        {
          message: 'Product created successfully',
          product: plainProduct,
          categoryBlog,
        },
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
