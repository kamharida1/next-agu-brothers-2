import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import { CATALOG_PAGE_SIZE } from '@/lib/services/productService'

export const GET = async (req: Request) => {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page')) || 1)

    const [products, countProducts] = await Promise.all([
      ProductModel.find({}, '-reviews')
        .sort({ _id: -1 })
        .skip(CATALOG_PAGE_SIZE * (page - 1))
        .limit(CATALOG_PAGE_SIZE)
        .lean(),
      ProductModel.countDocuments(),
    ])

    return Response.json({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / CATALOG_PAGE_SIZE),
      pageSize: CATALOG_PAGE_SIZE,
    })
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 })
  }
}
