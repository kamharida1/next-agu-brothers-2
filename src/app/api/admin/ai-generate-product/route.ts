import { auth } from '@/lib/auth'
import { generateProductDetails } from '@/lib/services/generateProductDetails'

export const POST = auth(async (req: any) => {
  if (!req.auth?.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { productName, categories, costPrice, price } = await req.json()

  if (!productName?.trim()) {
    return Response.json({ message: 'Product name is required' }, { status: 400 })
  }

  const categoryNames =
    categories?.map((c: { name?: string }) => c.name).filter(Boolean) ?? []

  try {
    const generated = await generateProductDetails(
      productName.trim(),
      categoryNames,
      typeof costPrice === 'number' ? costPrice : 0,
      typeof price === 'number' ? price : 0
    )
    return Response.json(generated)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'AI generation failed'
    return Response.json({ message }, { status: 500 })
  }
}) as any
