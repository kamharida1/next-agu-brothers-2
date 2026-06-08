import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/CategoryModel'
import ProductModel from '@/lib/models/ProductModel'
import { toPlainObject } from '@/lib/utils'
import { generateProductDetails } from '@/lib/services/generateProductDetails'
import {
  MIN_PRODUCT_IMAGES,
  searchProductImages,
} from '@/lib/services/searchProductImages'
import { uploadProductImagesFromUrls } from '@/lib/services/uploadProductImagesFromUrls'
import { isAutoCategoryBlogEnabled } from '@/lib/services/siteSettingsService'
import { syncCategoryBlogFromProduct } from '@/lib/services/syncCategoryBlogFromProduct'

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const POST = auth(async (req: any) => {
  if (!req.auth?.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, costPrice, price, countInStock = 0, create = false, draft } = body

  if (create) {
    if (
      !draft?.name ||
      !draft?.category ||
      !draft?.images?.length ||
      draft.images.length < MIN_PRODUCT_IMAGES
    ) {
      return Response.json(
        {
          message: `At least ${MIN_PRODUCT_IMAGES} product image is required`,
        },
        { status: 400 }
      )
    }

    await dbConnect()

    const categoryObject = await CategoryModel.findById(draft.category)
    if (!categoryObject) {
      return Response.json({ message: 'Category not found' }, { status: 404 })
    }

    try {
      const product = new ProductModel({
        name: draft.name,
        slug: draft.slug || slugify(draft.name),
        category: draft.category,
        cat: categoryObject.name,
        images: draft.images,
        image: draft.images[0],
        costPrice: draft.costPrice,
        price: draft.price,
        brand: draft.brand,
        rating: 0,
        numReviews: 0,
        countInStock: draft.countInStock ?? 0,
        description: draft.description,
        weight: Number(draft.weight) || undefined,
        discountPercentage: draft.discountPercentage ?? 0,
        isFeatured: draft.isFeatured ?? false,
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

      return Response.json({
        status: 'created',
        message: 'Product created successfully',
        product: plainProduct,
        categoryBlog,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create product'
      return Response.json({ message }, { status: 500 })
    }
  }

  if (!name?.trim()) {
    return Response.json({ message: 'Product name is required' }, { status: 400 })
  }
  if (typeof costPrice !== 'number' || costPrice <= 0) {
    return Response.json({ message: 'Valid cost price is required' }, { status: 400 })
  }
  if (typeof price !== 'number' || price <= 0) {
    return Response.json({ message: 'Valid selling price is required' }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ message: 'ANTHROPIC_API_KEY is not configured' }, { status: 500 })
  }

  await dbConnect()
  const categories = await CategoryModel.find().lean()
  const categoryNames = categories.map((c) => c.name)

  try {
    const [generated, imageUrls] = await Promise.all([
      generateProductDetails(name.trim(), categoryNames, costPrice, price),
      searchProductImages(name.trim(), 4),
    ])

    if (imageUrls.length < MIN_PRODUCT_IMAGES) {
      return Response.json({
        status: 'rejected',
        reason: 'No product image found online. This listing was discarded.',
        productName: name.trim(),
        imagesFound: imageUrls.length,
      })
    }

    const cloudinaryIds = await uploadProductImagesFromUrls(imageUrls)
    if (cloudinaryIds.length < MIN_PRODUCT_IMAGES) {
      return Response.json({
        status: 'rejected',
        reason: 'Found an image online but could not upload it. This listing was discarded.',
        productName: name.trim(),
        imagesUploaded: cloudinaryIds.length,
      })
    }

    const matchedCategory = categories.find(
      (c) => c.name?.toLowerCase() === generated.cat?.toLowerCase()
    )

    const draftPayload = {
      name: name.trim(),
      slug: slugify(name.trim()),
      costPrice,
      price,
      brand: generated.brand,
      description: generated.description,
      weight: generated.weight,
      category: matchedCategory?._id?.toString() ?? '',
      cat: matchedCategory?.name ?? generated.cat,
      countInStock,
      images: cloudinaryIds,
      image: cloudinaryIds[0],
      keyFeatures: generated.keyFeatures ?? [],
    }

    return Response.json({
      status: 'ready',
      draft: draftPayload,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Quick create failed'
    return Response.json({ message }, { status: 500 })
  }
}) as any
