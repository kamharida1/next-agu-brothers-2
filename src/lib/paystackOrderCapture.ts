import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import ProductModel from '@/lib/models/ProductModel'
import { validateOrderStock, type ProductDocForOrder } from '@/lib/productPricing'
import { fulfillOrderStock } from '@/lib/orderStock'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'
import type { PaystackVerifyData } from '@/lib/paystack'

type CaptureResult =
  | { ok: true; order: typeof OrderModel.prototype; alreadyPaid: boolean }
  | { ok: false; message: string; status: number }

const AMOUNT_TOLERANCE_NGN = 1

export async function capturePaystackOrderPayment(
  orderId: string,
  verifyData: PaystackVerifyData
): Promise<CaptureResult> {
  await dbConnect()

  const order = await OrderModel.findById(orderId)
  if (!order) {
    return { ok: false, message: 'Order not found', status: 404 }
  }

  if (order.isPaid) {
    return { ok: true, order, alreadyPaid: true }
  }

  if (verifyData.status !== 'success') {
    return { ok: false, message: 'Payment verification failed', status: 400 }
  }

  const paidAmount = verifyData.amount / 100
  if (Math.abs(paidAmount - order.totalPrice) > AMOUNT_TOLERANCE_NGN) {
    return { ok: false, message: 'Payment amount mismatch', status: 400 }
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
    return { ok: false, message: stockError, status: 400 }
  }

  const stockFulfillError = await fulfillOrderStock(
    order.items.map((item: { product: string; qty: number; name: string }) => ({
      product: item.product.toString(),
      qty: item.qty,
      name: item.name,
    }))
  )
  if (stockFulfillError) {
    return { ok: false, message: stockFulfillError, status: 400 }
  }

  order.isPaid = true
  order.paidAt = new Date()
  order.paymentResult = {
    id: verifyData.reference,
    status: verifyData.status,
    update_time: new Date(),
    email_address: verifyData.customer?.email ?? order.shippingAddress.email,
  }

  const updatedOrder = await order.save()

  sendOrderConfirmationEmail(updatedOrder).catch(() => {})
  sendAdminOrderNotification(updatedOrder).catch(() => {})

  return { ok: true, order: updatedOrder, alreadyPaid: false }
}
