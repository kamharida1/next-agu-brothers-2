"use client";
import { OrderItem } from "@/lib/models/OrderModel";
import { formatDate } from "@/lib/utils";
import Price from "@/components/products/Price";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { PaystackButton } from "react-paystack";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, error, mutate } = useSWR(`/api/orders/${orderId}`);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { trigger: userDeleteOrder, isMutating: isUserDeleting } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/orders/${orderId}/delete-order`, { method: "DELETE" });
      const body = await res.json();
      if (res.ok) { toast.success("Order cancelled"); router.push("/order-history"); }
      else toast.error(body.message);
    }
  );

  const { trigger: deleteOrder, isMutating: isDeleting } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/delete`, { method: "DELETE" });
      const body = await res.json();
      if (res.ok) { toast.success("Order deleted"); router.push("/admin/orders"); }
      else toast.error(body.message);
    }
  );

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, { method: "PUT" });
      const body = await res.json();
      if (res.ok) { toast.success("Marked as delivered"); mutate(); }
      else toast.error(body.message);
    }
  );

  const { trigger: markPaid, isMutating: isMarkingPaid } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/pay`, { method: "PUT" });
      const body = await res.json();
      if (res.ok) { toast.success("Marked as paid"); mutate(); }
      else toast.error(body.message);
    }
  );

  if (error) return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-sm text-center">
        <p className="text-[#CC0C39] text-xl font-bold mb-2">Error loading order</p>
        <p className="text-[#565959]">{error.message}</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-[#FF9900]"></span>
        <p className="text-[#565959] mt-3">Loading your order...</p>
      </div>
    </div>
  );

  const { paymentMethod, shippingAddress, items, itemsPrice, shippingPrice, taxPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt } = data;

  const paystackConfig = {
    email: shippingAddress.email,
    amount: Math.round(totalPrice * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    reference: `order_${orderId}_${Date.now()}`,
    metadata: { orderId, custom_fields: [{ display_name: "Order ID", variable_name: "order_id", value: orderId }] },
  };

  const handlePaystackSuccess = async (response: any) => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/capture-paystack-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: response.reference }),
      });
      const body = await res.json();
      if (res.ok) { toast.success("Payment successful! Thank you."); mutate(); }
      else toast.error(body.message || "Payment capture failed");
    } catch { toast.error("An error occurred. Contact support."); }
    finally { setIsProcessingPayment(false); }
  };

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-medium text-[#0F1111]">Order Details</h1>
          <p className="text-sm text-[#565959]">Order # {orderId} — placed {data.createdAt ? formatDate(data.createdAt) : ''}</p>
        </div>

        {/* Paid / Not paid banner */}
        {isPaid ? (
          <div className="bg-[#F0FFF0] border border-[#007600] rounded-sm p-3 mb-4 text-sm text-[#007600] font-medium">
            ✓ Paid on {paidAt ? formatDate(paidAt) : ''}
          </div>
        ) : (
          <div className="bg-[#FFF8E6] border border-[#FF9900] rounded-sm p-3 mb-4 text-sm text-[#0F1111]">
            ⚠ Payment pending
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left */}
          <div className="flex-1 space-y-3">
            {/* Shipping */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h2 className="font-bold text-[#0F1111] mb-3">Delivery Address</h2>
              <p className="text-sm">{shippingAddress.fullName}</p>
              <p className="text-sm text-[#565959]">{shippingAddress.address}</p>
              <p className="text-sm text-[#565959]">{shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
              <p className="text-sm text-[#565959]">{shippingAddress.phone}</p>
              <div className="mt-3">
                {isDelivered
                  ? <span className="text-[#007600] text-sm font-medium">✓ Delivered {deliveredAt ? formatDate(deliveredAt) : ''}</span>
                  : <span className="text-[#CC0C39] text-sm">Not yet delivered</span>
                }
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h2 className="font-bold text-[#0F1111] mb-2">Payment Method</h2>
              <p className="text-sm text-[#565959]">{paymentMethod}</p>
            </div>

            {/* Items */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h2 className="font-bold text-[#0F1111] mb-4">Order Items</h2>
              <div className="space-y-4 divide-y divide-[#D5D9D9]">
                {items.map((item: OrderItem) => (
                  <div key={item.slug} className="flex gap-4 pt-4 first:pt-0">
                    <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                      <Image src={item.image} alt={item.name} width={64} height={64} className="object-contain" />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/product/${item.slug}`}>
                        <p className="text-sm text-[#007185] hover:text-[#CC0C39] hover:underline">{item.name}</p>
                      </Link>
                      <p className="text-sm text-[#565959] mt-0.5">Qty: {item.qty}</p>
                      <p className="text-sm font-bold mt-0.5"><Price amount={item.price} size="sm" /></p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Price amount={item.price * item.qty} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:w-80 space-y-3 flex-shrink-0">
            {/* Summary */}
            <div className="bg-white rounded-sm shadow-sm p-5">
              <h2 className="font-bold text-[#0F1111] mb-3 text-lg">Order Summary</h2>
              <div className="space-y-1.5 text-sm">
                {(
                  [
                    ['Items', itemsPrice],
                    ['Shipping', shippingPrice],
                    ['Tax', taxPrice],
                  ] as const
                ).map(([l, amount]) => (
                  <div key={l} className="flex justify-between items-center text-[#0F1111]">
                    <span>{l}:</span>
                    <Price amount={amount} size="sm" />
                  </div>
                ))}
                <div className="flex justify-between items-center font-bold text-lg border-t border-[#D5D9D9] pt-2 mt-2 text-[#CC0C39]">
                  <span>Order Total:</span>
                  <Price amount={totalPrice} size="md" className="text-[#CC0C39]" />
                </div>
              </div>

              {/* Payment actions */}
              <div className="mt-4 space-y-2">
                {!isPaid && paymentMethod === "Paystack" && (
                  isProcessingPayment ? (
                    <button className="btn-amazon w-full py-2.5 rounded-md text-sm flex items-center justify-center gap-2" disabled>
                      <span className="loading loading-spinner loading-xs"></span>Verifying...
                    </button>
                  ) : (
                    <PaystackButton
                      {...paystackConfig}
                      onSuccess={handlePaystackSuccess}
                      onClose={() => toast('Payment cancelled', { icon: 'ℹ️' })}
                      className="btn-amazon w-full py-2.5 rounded-md text-sm cursor-pointer text-center block"
                      text="Pay Now with Paystack"
                    />
                  )
                )}

                {!isPaid && paymentMethod === "Cash On Delivery" && (
                  <div className="bg-[#FFF8E6] border border-[#FF9900] rounded-sm p-3 text-xs text-[#0F1111]">
                    Payment will be collected upon delivery
                  </div>
                )}

                {isPaid && isDelivered && (
                  <Link href="/" className="btn-amazon w-full py-2.5 rounded-md text-sm text-center block">
                    Continue Shopping
                  </Link>
                )}

                {!isPaid && !session?.user.isAdmin && (
                  <button onClick={() => userDeleteOrder()} disabled={isUserDeleting}
                    className="btn-amazon-outline w-full py-2 rounded-md text-sm text-[#CC0C39] border-[#CC0C39] flex items-center justify-center gap-1">
                    {isUserDeleting && <span className="loading loading-spinner loading-xs"></span>}
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Admin actions */}
            {session?.user.isAdmin && (
              <div className="bg-white rounded-sm shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#565959] mb-3">Admin Actions</p>
                <div className="space-y-2">
                  {!isDelivered && (
                    <button onClick={() => deliverOrder()} disabled={isDelivering}
                      className="btn-amazon-outline w-full py-2 rounded-md text-sm flex items-center justify-center gap-1">
                      {isDelivering && <span className="loading loading-spinner loading-xs"></span>}
                      Mark as Delivered
                    </button>
                  )}
                  {!isPaid && (
                    <button onClick={() => markPaid()} disabled={isMarkingPaid}
                      className="btn-amazon-outline w-full py-2 rounded-md text-sm flex items-center justify-center gap-1">
                      {isMarkingPaid && <span className="loading loading-spinner loading-xs"></span>}
                      Mark as Paid
                    </button>
                  )}
                  <button onClick={() => deleteOrder()} disabled={isDeleting}
                    className="w-full py-2 rounded-md text-sm border border-[#CC0C39] text-[#CC0C39] hover:bg-[#FFF0F0] flex items-center justify-center gap-1 transition-colors">
                    {isDeleting && <span className="loading loading-spinner loading-xs"></span>}
                    Delete Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
