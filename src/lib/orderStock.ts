import ProductModel from '@/lib/models/ProductModel'

/** Atomically decrement stock; fails if any line cannot be fulfilled. */
export async function fulfillOrderStock(
  items: { product: string; qty: number; name: string }[]
): Promise<string | null> {
  for (const item of items) {
    const updated = await ProductModel.findOneAndUpdate(
      { _id: item.product, countInStock: { $gte: item.qty } },
      { $inc: { countInStock: -item.qty, sold: item.qty } }
    )
    if (!updated) {
      return `Could not fulfill order: insufficient stock for ${item.name}.`
    }
  }
  return null
}
