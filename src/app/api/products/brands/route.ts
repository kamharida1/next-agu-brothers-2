import productServices from '@/lib/services/productService'

export const GET = async () => {
  const brands = await productServices.getAllBrands()
  return Response.json(brands)
}