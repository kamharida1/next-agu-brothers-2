import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import OrderModel, { OrderItem, ShippingAddress } from '@/lib/models/OrderModel'
import { round2 } from '@/lib/utils'
import { shippingRates } from '@/lib/shipping'
import {
  resolveOrderItemPrice,
  validateOrderStock,
  type ProductDocForOrder,
} from '@/lib/productPricing'

const ORDER_PRODUCT_FIELDS =
  'name price discountPercentage discountedPrice countInStock'

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { user } = req.auth

  try {
    const payload = await req.json()
    await dbConnect()

    const dbProducts = (await ProductModel.find(
      { _id: { $in: payload.items.map((x: { _id: string }) => x._id) } },
      ORDER_PRODUCT_FIELDS
    ).lean()) as ProductDocForOrder[]

    const stockError = validateOrderStock(payload.items, dbProducts)
    if (stockError) {
      return Response.json({ message: stockError }, { status: 400 })
    }

    const dbOrderItems = payload.items.map((item: { _id: string; qty: number; name: string }) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === item._id)
      return {
        ...item,
        product: item._id,
        price: resolveOrderItemPrice(dbProduct),
        _id: undefined,
      }
    })

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(
      dbOrderItems,
      payload.shippingAddress
    )

    const order = await OrderModel.create({
      items: dbOrderItems,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod || 'Paystack',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: user._id,
      isPaid: false,
    })

    return Response.json({ order }, { status: 201 })
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}) as any

const calcPrices = (items: OrderItem[], shippingAddress: ShippingAddress) => {
  const itemsPrice = round2(items.reduce((a, i) => a + i.price * i.qty, 0))
  const totalWeight = items.reduce((a, i) => a + (i.weight ?? 0) * i.qty, 0)
  const cityRates = shippingRates[shippingAddress.city as keyof typeof shippingRates]
  const shippingPrice = cityRates
    ? round2(cityRates.baseRate + cityRates.perKg * totalWeight)
    : 0
  const taxPrice = round2(0.006 * itemsPrice)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
  return { itemsPrice, taxPrice, shippingPrice, totalPrice }
}
