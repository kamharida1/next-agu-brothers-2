'use client'
import MonnifyButton from "@/components/MonnifyButton"
import { OrderItem } from "@/lib/models/OrderModel"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import toast from "react-hot-toast"
import useSWR from "swr"
import useSWRMutation from "swr/mutation"

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
  }) {
  
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Order delivered successfully')
        : toast.error(data.message)
    }
  )

  const { data: session } = useSession()

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id)
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success('Order paid successfully')
      })
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`)

  if (error) return error.message
  if (!data) return 'loading...'

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = data

  return (
    <div>
      <h1 className="text-2xl py-4"> Order {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <div className="text-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="text-error">Not Delivered</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className="text-success">Paid at {paidAt}</div>
              ) : (
                <div className="text-error">Not Paid</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4 ">
            <div className="card-body">
              <h2 className="card-title">Order Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/products/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <div className="mb-2 flex justify-between">
                <span>Items</span>
                <span>${itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${taxPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
              {!isPaid && paymentMethod === 'PayPal' && (
                <div className="flex">
                  <ul className="flex">
                    <li>
                      <PayPalScriptProvider
                        options={{ clientId: paypalClientId }}
                      >
                        <PayPalButtons
                          createOrder={createPayPalOrder}
                          onApprove={onApprovePayPalOrder}
                        />
                      </PayPalScriptProvider>
                    </li>
                  </ul>
                </div>
              )}
              {!isPaid && paymentMethod === 'Moniepoint' && (
                <div>
                  <ul>
                    <li>
                      <MonnifyButton orderId={orderId} />
                    </li>
                  </ul>
                </div>
              )}
              {session?.user.isAdmin && (
                <li>
                  <button
                    className="btn w-full my-2"
                    onClick={() => deliverOrder()}
                    disabled={isDelivering}
                  >
                    {isDelivering && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Mark as delivered
                  </button>
                </li>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}