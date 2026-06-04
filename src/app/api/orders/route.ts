import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import OrderModel, { OrderItem, ShippingAddress } from '@/lib/models/OrderModel'
import { round2 } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { shippingRates } from '@/lib/shipping'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'
import {
  resolveOrderItemPrice,
  validateOrderStock,
  type ProductDocForOrder,
} from '@/lib/productPricing'
import { fulfillOrderStock } from '@/lib/orderStock'

const ORDER_PRODUCT_FIELDS = 'name price discountPercentage discountedPrice countInStock'

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: 'unauthorized' }, { status: 401 })
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

    const stockFulfillError = await fulfillOrderStock(
      dbOrderItems.map((item: OrderItem & { product: string }) => ({
        product: item.product,
        qty: item.qty,
        name: item.name,
      }))
    )
    if (stockFulfillError) {
      return Response.json({ message: stockFulfillError }, { status: 400 })
    }

    const createdOrder = await OrderModel.create({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id,
    })

    sendOrderConfirmationEmail(createdOrder).catch(() => {})
    sendAdminOrderNotification(createdOrder).catch(() => {})

    return Response.json(
      { message: 'Order has been created', order: createdOrder },
      { status: 201 }
    )
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}) as any

const calcPrices = (items: OrderItem[], shippingAddress: ShippingAddress) => {
  const itemsPrice = round2(items.reduce((acc, item) => acc + item.price * item.qty, 0))
  const totalWeight = items.reduce((acc, item) => acc + item.weight * item.qty, 0)
  const cityRates = shippingRates[shippingAddress.city as keyof typeof shippingRates]
  const shippingPrice = cityRates ? round2(cityRates.baseRate + cityRates.perKg * totalWeight) : 0
  const taxPrice = round2(Number(0.006 * itemsPrice))
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)
  return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}
