import { auth } from '@/lib/auth'
import { verifyPaystackTransaction } from '@/lib/paystack'
import { capturePaystackOrderPayment } from '@/lib/paystackOrderCapture'

export const POST = auth(async (req: any, context: any) => {
  const params = await context.params
  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { reference } = await req.json()
    if (!reference) {
      return Response.json({ message: 'Payment reference is required' }, { status: 400 })
    }

    const verifyResult = await verifyPaystackTransaction(reference)
    if (!verifyResult.status || !verifyResult.data) {
      return Response.json({ message: 'Payment verification failed' }, { status: 400 })
    }

    const result = await capturePaystackOrderPayment(params.id, verifyResult.data)

    if (!result.ok) {
      return Response.json({ message: result.message }, { status: result.status })
    }

    return Response.json(result.order)
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}) as any
