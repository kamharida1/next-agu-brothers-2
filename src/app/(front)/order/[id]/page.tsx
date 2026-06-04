import OrderDet from "./OrderDet"
import { ROBOTS_NOINDEX } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return {
    title: `Order ${id}`,
    robots: ROBOTS_NOINDEX,
  }
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <OrderDet orderId={id} />
}
