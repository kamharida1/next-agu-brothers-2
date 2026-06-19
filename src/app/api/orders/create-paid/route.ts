import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel, { OrderItem, ShippingAddress } from '@/lib/models/OrderModel'
import ProductModel from '@/lib/models/ProductModel'
import { round2 } from '@/lib/utils'
import { shippingRates } from '@/lib/shipping'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'
import {
  resolveOrderItemPrice,
  validateOrderStock,
  type ProductDocForOrder,
} from '@/lib/productPricing'
import { fulfillOrderStock } from '@/lib/orderStock'

const ORDER_PRODUCT_FIELDS =
  'name price discountPercentage discountedPrice countInStock'

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { user } = req.auth

  try {
    const { items, shippingAddress, paymentMethod, paystackReference } = await req.json()

    if (!paystackReference) {
      return Response.json({ message: 'Paystack reference is required' }, { status: 400 })
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${paystackReference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const verifyData = await verifyRes.json()

    if (!verifyData.status || verifyData.data?.status !== 'success') {
      return Response.json(
        { message: 'Payment verification failed. Please contact support.' },
        { status: 400 }
      )
    }

    await dbConnect()

    const dbProducts = (await ProductModel.find(
      { _id: { $in: items.map((x: { _id: string }) => x._id) } },
      ORDER_PRODUCT_FIELDS
    ).lean()) as ProductDocForOrder[]

    const stockError = validateOrderStock(items, dbProducts)
    if (stockError) {
      return Response.json({ message: stockError }, { status: 400 })
    }

    const dbOrderItems = items.map((x: { _id: string; qty: number; name: string }) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === x._id)
      return {
        ...x,
        product: x._id,
        price: resolveOrderItemPrice(dbProduct),
        _id: undefined,
      }
    })

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(
      dbOrderItems,
      shippingAddress
    )

    const paidAmount = verifyData.data.amount / 100
    if (Math.abs(paidAmount - totalPrice) > 10) {
      return Response.json({ message: 'Payment amount mismatch' }, { status: 400 })
    }

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

    const order = await OrderModel.create({
      items: dbOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      user: user._id,
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: verifyData.data.reference,
        status: verifyData.data.status,
        update_time: new Date(),
        email_address: verifyData.data.customer?.email ?? shippingAddress.email,
      },
    })

    sendOrderConfirmationEmail(order).catch(() => {})
    sendAdminOrderNotification(order).catch(() => {})

    return Response.json({ message: 'Order created and paid', order }, { status: 201 })
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
