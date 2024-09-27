import OrderDetails from "./OrderDetails"
import OrderInfo from "./OrderInfo"

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Order ${params.id}`,
   // description: `Order ${params.id} details`,
  }
}

export default function OrderDetailsPage({
  params
}: {
  params: { id: string }
}) {
  return (
    <OrderInfo
      orderId={params.id}
    />
  )
}
