import crypto from 'crypto'

export type PaystackVerifyData = {
  reference: string
  status: string
  amount: number
  customer?: { email?: string }
  metadata?: { orderId?: string; [key: string]: unknown }
}

export type PaystackVerifyResponse = {
  status: boolean
  data?: PaystackVerifyData
  message?: string
}

export function verifyPaystackSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret || !signature) return false

  const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
  return hash === signature
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) {
    return { status: false, message: 'Paystack secret key is not configured' }
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return res.json()
}

/** Extract Mongo order id from Paystack reference or metadata. */
export function resolveOrderIdFromPaystack(
  reference: string,
  metadata?: { orderId?: string }
): string | null {
  if (metadata?.orderId) return String(metadata.orderId)

  const match = reference.match(/^order_([a-f0-9]{24})_/i)
  return match?.[1] ?? null
}

export function getPaystackWebhookUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ||
    'https://www.agubrothers.com'
  return `${base}/api/webhooks/paystack`
}
