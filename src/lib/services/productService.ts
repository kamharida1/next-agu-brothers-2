import dbConnect from '@/lib/dbConnect'
import ProductModel, { Product } from '@/lib/models/ProductModel'
import { cache } from 'react'

export const revalidate = 3600 // revalidate the data at most every hour

const getLatest = cache(async () => {
  await dbConnect()
  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(4)
    .lean()
  return products as Product[]
})

const getFeatured = cache(async () => {
  await dbConnect()
  const products = await ProductModel.find({ isFeatured: true })
  return products as Product[]
})

const getBySlug = cache(async (slug: string) => {
  await dbConnect()
  const product = await ProductModel.findOne({ slug }).lean()
  return product as Product
})

const productServices = {
getLatest,
getFeatured,
getBySlug,
}

export default productServices