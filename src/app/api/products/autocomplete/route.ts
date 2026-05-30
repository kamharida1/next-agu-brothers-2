import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return Response.json([])
  }

  await dbConnect()

  const products = await ProductModel.find(
    { name: { $regex: q, $options: 'i' } },
    'name slug images price cat',
    { limit: 6, sort: { sold: -1 } }
  ).lean()

  return Response.json(products)
}
