import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import {
  resolveOrderIdFromPaystack,
  verifyPaystackSignature,
  verifyPaystackTransaction,
} from '@/lib/paystack'
import { capturePaystackOrderPayment } from '@/lib/paystackOrderCapture'

type PaystackWebhookEvent = {
  event: string
  data?: {
    reference?: string
    status?: string
    amount?: number
    customer?: { email?: string }
    metadata?: { orderId?: string }
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-paystack-signature')

  if (!verifyPaystackSignature(rawBody, signature)) {
    return Response.json({ message: 'Invalid signature' }, { status: 401 })
  }

  let event: PaystackWebhookEvent
  try {
    event = JSON.parse(rawBody)
  } catch {
    return Response.json({ message: 'Invalid JSON' }, { status: 400 })
  }

  if (event.event !== 'charge.success') {
    return Response.json({ received: true })
  }

  const reference = event.data?.reference
  if (!reference) {
    return Response.json({ message: 'Missing reference' }, { status: 400 })
  }

  const verifyResult = await verifyPaystackTransaction(reference)
  if (!verifyResult.status || !verifyResult.data) {
    return Response.json(
      { message: verifyResult.message || 'Transaction verification failed' },
      { status: 400 }
    )
  }

  await dbConnect()

  let orderId = resolveOrderIdFromPaystack(
    reference,
    verifyResult.data.metadata
  )

  if (!orderId) {
    const orderByReference = await OrderModel.findOne({
      'paymentResult.id': reference,
    }).select('_id')
    orderId = orderByReference?._id?.toString() ?? null
  }

  if (!orderId) {
    console.warn('[paystack webhook] No order matched for reference:', reference)
    return Response.json({ received: true, matched: false })
  }

  const result = await capturePaystackOrderPayment(orderId, verifyResult.data)

  if (!result.ok) {
    console.error('[paystack webhook] Capture failed:', result.message, reference)
    return Response.json({ message: result.message }, { status: result.status })
  }

  return Response.json({
    received: true,
    matched: true,
    orderId,
    alreadyPaid: result.alreadyPaid,
  })
}
