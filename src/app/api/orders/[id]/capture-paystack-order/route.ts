import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import ProductModel from '@/lib/models/ProductModel'
import { validateOrderStock, type ProductDocForOrder } from '@/lib/productPricing'
import { fulfillOrderStock } from '@/lib/orderStock'

export const POST = auth(async (req: any, context: any) => {
  const params = await context.params
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()

  const order = await OrderModel.findById(params.id)
  if (!order) {
    return Response.json({ message: 'Order not found' }, { status: 404 })
  }

  if (order.isPaid) {
    return Response.json(order)
  }

  try {
    const { reference } = await req.json()

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const verifyData = await verifyRes.json()

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return Response.json({ message: 'Payment verification failed' }, { status: 400 })
    }

    const paidAmount = verifyData.data.amount / 100
    const expectedAmount = order.totalPrice

    if (Math.abs(paidAmount - expectedAmount) > 1) {
      return Response.json({ message: 'Payment amount mismatch' }, { status: 400 })
    }

    const dbProducts = (await ProductModel.find(
      { _id: { $in: order.items.map((item: { product: string }) => item.product) } },
      'name price discountPercentage discountedPrice countInStock'
    ).lean()) as ProductDocForOrder[]

    const stockError = validateOrderStock(
      order.items.map((item: { product: string; name: string; qty: number }) => ({
        product: item.product.toString(),
        name: item.name,
        qty: item.qty,
      })),
      dbProducts
    )
    if (stockError) {
      return Response.json({ message: stockError }, { status: 400 })
    }

    const stockFulfillError = await fulfillOrderStock(
      order.items.map((item: { product: string; qty: number; name: string }) => ({
        product: item.product.toString(),
        qty: item.qty,
        name: item.name,
      }))
    )
    if (stockFulfillError) {
      return Response.json({ message: stockFulfillError }, { status: 400 })
    }

    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: verifyData.data.reference,
      status: verifyData.data.status,
      update_time: new Date(),
      email_address: verifyData.data.customer.email,
    }

    const updatedOrder = await order.save()
    return Response.json(updatedOrder)
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}) as any
