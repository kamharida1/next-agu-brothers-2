import dbConnect from '@/lib/dbConnect'
import ProductModel, { Product } from '@/lib/models/ProductModel'
import { brandMatchRegex, dedupeBrands } from '@/lib/brandUtils'
import { cache } from 'react'
import ReviewModel from '../models/ReviewModel'
import { toPlainObject } from '../utils'

export const revalidate = 60000 // revalidate the data at most every hour

/** Even count for 2-column mobile grids (3 full rows). */
export const HOME_SECTION_PRODUCT_LIMIT = 6

const getLatest = cache(async () => {
  await dbConnect()
  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(HOME_SECTION_PRODUCT_LIMIT)
    .lean()
  return products as Product[]
})

// get products by brand
const getByBrand = cache(async (brand: string) => {
  await dbConnect()
  const products = await ProductModel.find({
    brand: brandMatchRegex(decodeURIComponent(brand)),
  }).lean()
  return products as Product[]
})

const getFeatured = cache(async () => {
  await dbConnect()
  const products = await ProductModel.find({ isFeatured: true })
    .sort({ _id: -1 })
    .limit(HOME_SECTION_PRODUCT_LIMIT)
    .lean()
    return products as Product[];
})

const getBySlug = cache(async (slug: string) => {
  await dbConnect()
  const product = await ProductModel.findOne({ slug }).populate({ path: 'reviews', model: ReviewModel }).lean()
  return product as Product
})

export const PAGE_SIZE = 8
export const CATALOG_PAGE_SIZE = 24

const getAllPaginated = cache(async ({ page = '1' }: { page?: string }) => {
  await dbConnect()
  const pageNum = Math.max(1, Number(page) || 1)

  const products = await ProductModel.find({}, '-reviews')
    .sort({ _id: -1 })
    .skip(CATALOG_PAGE_SIZE * (pageNum - 1))
    .limit(CATALOG_PAGE_SIZE)
    .lean()

  const countProducts = await ProductModel.countDocuments()

  return {
    products: products as Product[],
    countProducts,
    page: String(pageNum),
    pages: Math.ceil(countProducts / CATALOG_PAGE_SIZE),
  }
})
const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    price,
    rating,
    page = '1',
  }: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }) => {
    await dbConnect()

    const queryFilter =
      q && q !== 'all'
        ? {
            name: {
              $regex: q,
              $options: 'i',
            },
          }
        : {}
    const categoryFilter = category && category !== 'all' ? { cat: category } : {}
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {}
    // 10-50
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {}
    const order: Record<string, 1 | -1> =
      sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'rating' || sort === 'toprated'
        ? { rating: -1 }
        : { _id: -1 }

    const categories = await ProductModel.find().distinct('cat')
    const products = await ProductModel.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
      '-reviews'
    )
      .sort(order)
      .skip(PAGE_SIZE * (Number(page) - 1))
      .limit(PAGE_SIZE)
      .lean()

    const countProducts = await ProductModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })

    return {
      products: products as Product[],
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
      categories,
    }
  }
)

const getCategories = cache(async () => {
  await dbConnect()
  const categories = await ProductModel.find().distinct('cat')
  return categories
})

const getAllBrands = cache(async () => {
  await dbConnect()
  const brands = await ProductModel.distinct('brand')
  return dedupeBrands(brands as string[])
})

const getRelated = cache(
  async (slug: string, cat: string, brand: string, limit = 5) => {
    await dbConnect()
    const products = await ProductModel.find(
      {
        slug: { $ne: slug },
        $or: [{ cat }, { brand }],
      },
      '-reviews'
    )
      .sort({ sold: -1, rating: -1, _id: -1 })
      .limit(limit)
      .lean()
    return products as Product[]
  }
)

/** One representative product image per department (featured / best-selling first). */
const getCategoryThumbnails = cache(async (): Promise<Record<string, string>> => {
  await dbConnect()
  const rows = await ProductModel.aggregate<{ _id: string; image: string }>([
    { $sort: { isFeatured: -1, sold: -1, _id: -1 } },
    {
      $group: {
        _id: '$cat',
        image: {
          $first: {
            $ifNull: [{ $arrayElemAt: ['$images', 0] }, '$image'],
          },
        },
      },
    },
  ])

  return Object.fromEntries(
    rows
      .filter((row) => row._id && row.image)
      .map((row) => [row._id, row.image])
  )
})

const getOneByCategory = cache(async (category: string) => {
  await dbConnect()
  const product = await ProductModel.findOne({
    cat: category,
    countInStock: { $gt: 0 },
  })
    .sort({ isFeatured: -1, sold: -1, _id: -1 })
    .lean()

  if (product) return product as Product

  const fallback = await ProductModel.findOne({ cat: category })
    .sort({ isFeatured: -1, sold: -1, _id: -1 })
    .lean()

  return (fallback as Product) ?? null
})

const getByCategory = cache(async (category: string) => {
  await dbConnect()
  const products = await ProductModel.find({ cat: category }, '-reviews')
    .sort({ isFeatured: -1, sold: -1, _id: -1 })
    .lean()
  return products as Product[]
})

const getAllSlugs = cache(async () => {
  await dbConnect()
  const products = await ProductModel.find({}, 'slug')
    .lean<{ slug: string }[]>()
    .exec()
  return products.map((p) => p.slug)
})

const productServices = {
  getBySlug,
  getFeatured,
  getLatest,
  getByQuery,
  getAllPaginated,
  getCategories,
  getAllBrands,
  getByBrand,
  getRelated,
  getOneByCategory,
  getCategoryThumbnails,
  getByCategory,
  getAllSlugs,
}

export default productServices