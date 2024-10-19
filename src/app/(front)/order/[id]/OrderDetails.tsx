"use client";
import { OrderItem } from "@/lib/models/OrderModel";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

// Extend the Window interface to include handlePgData
declare global {
  interface Window {
    handlePgData: any;
    RmPaymentEngine: any;
  }
}
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const [transactionRef, setTransactionRef] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    narration: '',
    amount: '',
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hydrogenpay.com/inline.js";
    script.async = true;
    script.onload = () => {
      console.log("HydrogenPay script loaded successfully");
      if (typeof (window as any).handlePgData === "undefined") {
        console.error("HydrogenPay Payment Engine not loaded");
      } else {
        console.log("HydrogenPay Payment Engine loaded");
      }
    };
    script.onerror = () => console.error("Failed to load HydrogenPay script");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Equivalent of setDemoData (only runs during demo mode)
  useEffect(() => {
    setFormData({
      firstName: 'Jefferson',
      lastName: 'Ighalo',
      email: 'jefferson@ighalo.com',
      narration: 'test payment',
      amount: '19999',
    });

    // Dynamically load the external RmPaymentEngine script
    const script = document.createElement('script');
    script.src = 'https://remitademo.net/payment/v1/remita-pay-inline.bundle.js'; // Replace with the actual script URL
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up on component unmount
    };
  }, []);

  

  // User can delete their order using useSWRMutation
  const { trigger: userDeleteOrder, isMutating: isUserDeleting } =
    useSWRMutation(`/api/orders/${orderId}`, async (url) => {
      const res = await fetch(`/api/orders/${orderId}/delete-order`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success("Order deleted successfully")
        : toast.error(data.message);
      router.push("/orders");
    });

  const { trigger: deleteOrder, isMutating: isDeleting } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success("Order deleted successfully")
        : toast.error(data.message);
      router.push("/admin/orders");
    }
  );

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success("Order delivered successfully")
        : toast.error(data.message);
    }
  );

  const { trigger: payOrder, isMutating: isPaying } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/pay`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success("Order paid successfully")
        : toast.error(data.message);
    }
  );

  const { data: session } = useSession();
  const { data, error } = useSWR(`/api/orders/${orderId}`);

  if (error) return error.message;
  if (!data) return "loading...";

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
  } = data;

  let obj = {
    amount: totalPrice,
    email: shippingAddress.email,
    currency: "NGN",
    description: `Payment for order ${orderId}`,
    meta: shippingAddress.fullName,
    callback: window.location.href,
    isAPI: true,
  };

  const token = "PK_TEST_98a4f6909c45b5dc0bdbb0d87230c5de";

  // Trigger payment modal via HydrogenPay script
  async function openDialogModal() {
    if (typeof (window as any).handlePgData === "undefined") {
      console.error("Remita Payment Engine not loaded");
      return;
    }
    let res = (window as any).handlePgData(obj, token, () => {
      console.log("Payment dialog closed");
    });
    console.log("return transaction ref", await res);
  }

  async function onApproveRemitaOrder(data: any) {
    try {
      const response = await fetch(
        `/api/orders/${orderId}/capture-remita-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        // If the response is not OK, throw an error with the status code
        const errorMessage = await response.text(); // Fetch the error message from the response
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorMessage}`
        );
      }

      const orderData = await response.json();

      // Handle successful response
      toast.success("Order paid successfully");
      return orderData;
    } catch (error) {
      // Handle fetch or JSON parsing error
      console.error("Error processing order payment:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  }
  const [firstName, lastName] = shippingAddress.fullName.trim().split(" ");

  const remitaPay = () => {
    if (typeof window.RmPaymentEngine === 'undefined') {
      console.error('Payment engine script not loaded.');
      return;
    }

    const handler = window.RmPaymentEngine.init({
      key: 'QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=', // Replace with actual public key
      customerId: shippingAddress.email, // Replace with customer id
      transactionId: Math.random(), // Replace with unique transaction id
      lastName,
      firstName,
      email: shippingAddress.email,
      amount: totalPrice,
      narration: `Payment for order ${orderId}`,
      onSuccess: (response: any) => {
        console.log('callback Successful Response', response);
        onApproveRemitaOrder(response);
      },
      onError: (response: any) => {
        console.log('callback Error Response', response);
      },
      onClose: () => {
        console.log('Transaction closed by user');
      },
    });

    handler.openIframe();
  };

  return (
    <>
      <Script
        src="https://js.hydrogenpay.com/inline.js"
        noModule={true}
        strategy="lazyOnload"
      />
      {/* <Script
        src="https://demo.remita.net/payment/v1/remita-pay-inline.bundle.js"
        strategy="lazyOnload"
      /> */}

      <div>
        <h1 className="text-2xl py-4"> Order {orderId}</h1>
        <div className="grid md:grid-cols-4 md:gap-5 my-4">
          <div className="md:col-span-3">
            <div className="card bg-base-300">
              <div className="card-body">
                <h2 className="card-title">Shipping Address</h2>
                <p>{shippingAddress.fullName}</p>
                <p>
                  {shippingAddress.address}, {shippingAddress.city},{" "}
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
                            href={`/product/${item.slug}`}
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
                        <td>{formatPrice(item.price)}</td>
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
                  <span>{formatPrice(itemsPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPrice(taxPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {!isPaid && paymentMethod === "HydrogenPay" && (
                  <div>
                    <ul>
                      <li>
                        <button
                          className="btn btn-primary w-full my-2"
                          disabled={loading}
                          onClick={() => openDialogModal()}
                          id="hydrogen-pay-button"
                        >
                          {loading ? "Processing..." : "Checkout"}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
                {!isPaid && paymentMethod === "Remita" && (
                  <div>
                    <ul>
                      <li>
                        <button
                          className="btn btn-primary w-full my-2"
                          disabled={loading}
                          onClick={remitaPay}
                        >
                          {loading ? "Processing..." : "Pay with Remita"}
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
                {/* User can delete unpaid order */}
                {!isPaid && !session?.user.isAdmin && (
                  <div>
                    <button
                      className="btn btn-error w-full my-2"
                      onClick={() => userDeleteOrder()}
                      disabled={isUserDeleting}
                    >
                      {isUserDeleting && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Delete Order
                    </button>
                  </div>
                )}
                {session?.user.isAdmin && !isDelivered && (
                  <button
                    className="btn w-full my-2"
                    onClick={() => deliverOrder()}
                    disabled={isDelivering || isDelivered}
                  >
                    {isDelivering && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Mark as delivered
                  </button>
                )}
                {session?.user.isAdmin && !isPaid && (
                  <button
                    className="btn w-full my-2"
                    onClick={() => payOrder()}
                    disabled={isPaying || isPaid}
                  >
                    {isPaying && (
                      <span className="loading loading-spinner"></span>
                    )}
                    Mark as paid & delivered
                  </button>
                )}
                {isDelivered && (
                  <Link
                    className="btn w-full my-2 btn-primary"
                    href={`/`}
                    passHref
                  >
                    Shop for more items
                  </Link>
                )}
              </div>
            </div>
            {session?.user.isAdmin && (
              <div className="card-footer">
                <button
                  className="btn btn-error my-2 w-full"
                  onClick={() => deleteOrder()}
                  disabled={isDeleting}
                >
                  {isDeleting && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Delete Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
