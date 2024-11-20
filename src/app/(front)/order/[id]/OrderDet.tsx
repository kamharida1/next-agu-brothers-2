"use client";
import { OrderItem } from "@/lib/models/OrderModel";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Script from "next/script";
import { useEffect, useState } from "react";


declare global {
  interface Window {
    handlePgData: any;
    RmPaymentEngine: any;
  }
}

import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { FaWhatsapp } from "react-icons/fa";

type Config = {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
};
export default function OrderDetails({ orderId }: { orderId: string }) {
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility
  const router = useRouter();

  const [paymentResult, setPaymentResult] = useState<any | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [paidAt, setPaidAt] = useState("");
  const [isCashModalVisible, setIsCashModalVisible] = useState(false); // Cash on Delivery modal

  useEffect(() => {
    // Dynamically add Monnify SDK script to the document
    const script = document.createElement("script");
    script.src = "https://sdk.monnify.com/plugin/monnify.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script when the component unmounts
    return () => {
      document.body.removeChild(script);
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
      router.push("/");
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

  useEffect(() => {
    if (data) {
      setIsPaid(data.isPaid);
      setPaidAt(data.paidAt);
      setPaymentResult(data.paymentResult);
    }
  }, [data, orderId]);

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
    //isPaid,
    //paidAt,
    isDelivered,
    deliveredAt,
  } = data;

  async function sendMail(order: any) {
    try {
      const response = await fetch(`/api/orders/${orderId}/send-mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorMessage}`
        );
      }
      const data = await response.json();
      toast.success("Mail sent successfully");
      return data;
    } catch (err) {
      console.error("Error sending mail:", err);
    }
  }

  async function onApproveMonnifyOrder(data: any) {
    try {
      const response = await fetch(
        `/api/orders/capture-monnify-order`,
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

  const monnifyPay = () => {
    if (typeof (window as any).MonnifySDK === "undefined") {
      console.error("Monnify SDK not loaded");
      return;
    }

    (window as any).MonnifySDK.initialize({
      amount: totalPrice,
      currency: "NGN",
      reference: new String(new Date().getTime()),
      customerFullName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      apiKey: "MK_PROD_TPNN9Q74H1",
      contractCode: "176278549691",
      paymentDescription: "Monnify Payment",
      onLoadStart: () => {
        console.log("loading has started");
      },
      onLoadComplete: () => {
        console.log("SDK is UP");
      },
      onComplete: (response: any) => {
        console.log("Payment Successful", response);
        onApproveMonnifyOrder(response);
      },
      onClose: (data: any) => {
        console.log(data);
      },
    });
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>
      {isModalVisible && (
        <div className="modal modal-open w-full flex items-center justify-center transition-all ease-in-out duration-500">
          <div className="modal-box w-full relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
              onClick={() => {
                setIsModalVisible(false);
              }}
            >
              <AiOutlineCloseCircle />
            </button>

            <h3 className="font-bold text-lg text-center text-gray-800 mb-6">
              Pay with Transfer
            </h3>

            <div className="mb-4">
              <p className="text-sm">
                Please transfer the total amount of{" "}
                <span className="font-bold">{formatPrice(totalPrice)}</span> to
                the following bank account:
              </p>
              <p className="text-md font-bold">
                Account Name: Agu Brothers Electronics
              </p>
              <p className="text-md font-bold">Account Number: 1895049684</p>
              <p className="text-md font-bold">Bank: Access Bank PLC</p>
              <p className="text-md font-bold flex items-center">
                Phone Number: +2349099234242
                <Link
                  href="https://wa.me/2349099234242" // Replace with your WhatsApp number
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact us on WhatsApp"
                >
                  <FaWhatsapp size={30} color="green" />
                </Link>
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm">
                After completing the transfer, please send a screenshot of your
                successful transaction to the Whatsapp phone number above.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                className="btn btn-primary w-full hover:bg-blue-600 transition duration-300 ease-in-out px-8 py-2 text-white rounded-md shadow-lg"
                onClick={() => {
                  setIsModalVisible(false);
                  toast.success(
                    "Please wait a few minutes. You will receive an email confirming your order.",
                    { duration: 5000 }
                  );
                }}
              >
                I have completed the transfer
              </button>
            </div>
            <div className="mt-4 text-center"></div>
            <p className="text-xs ">
              After payment, please come back to this page and note that
              &quot;Not Paid&quot; has changed to &quot;Paid&quot; and the
              &quot;Paid At&quot; field will be updated.
            </p>
          </div>
        </div>
      )}
    {/* Cash on Delivery Modal */}
    {isCashModalVisible && (
        <div className="modal modal-open w-full flex items-center justify-center transition-all ease-in-out duration-500">
          <div className="modal-box w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition-colors"
              onClick={() => setIsCashModalVisible(false)}
            >
              <AiOutlineCloseCircle />
            </button>
            <h3 className="font-bold text-lg text-center text-gray-800 mb-6">
              Cash on Delivery Instructions
            </h3>
            <div className="mb-4">
              <p className="text-sm">
                Cash on Delivery is available only to customers in the local area of our office. Please ensure you meet the eligibility criteria, visit us at:
              </p>
              <p className="text-md font-bold">
                Address: Agu Brothers Electronics, 33 Ogui Road, Enugu State, Nigeria
              </p>
              <p className="text-md font-bold">Contact: +2349099234242</p>
            </div>
            <div className="mb-4">
              <p className="text-sm">
                If you live outside this area, kindly choose another payment method or contact us on WhatsApp for further assistance.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                className="btn btn-primary w-full hover:bg-blue-600 transition duration-300 ease-in-out px-8 py-2 text-white rounded-md shadow-lg"
                onClick={() => {
                  setIsCashModalVisible(false);
                  toast.success(
                    'Cash on Delivery instructions acknowledged.',
                    { duration: 5000 }
                  );
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl py-4"> Order Payment</h1>
        <div className="grid md:grid-cols-4 md:gap-5 my-4">
          <div className="md:col-span-3">
            <div className="card bg-base-300">
              <div className="card-body">
                <h2 className="card-title">Shipping Address</h2>
                <p>{shippingAddress.fullName}</p>
                <p>{shippingAddress.email}</p>
                <p>{shippingAddress.phone}</p>
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
                  <>
                    <div className="text-success">Paid at {paidAt}</div>
                  </>
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
                {paymentResult && (
                  <div className="flex justify-between">
                    <span>Debited Amount</span>
                    <span>{formatPrice(paymentResult?.debitedAmount)}</span>
                  </div>
                )}

                {!isPaid && paymentMethod === "Transfer" && (
                  <div>
                    <ul>
                      <li>
                        <button
                          className="btn btn-primary w-full hover:bg-blue-600 transition duration-300 ease-in-out px-8 py-2 text-white rounded-md shadow-lg"
                          onClick={() => setIsModalVisible(true)}
                        >
                          Pay with Transfer
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
                {!isPaid && paymentMethod === 'Cash On Delivery' && (
                  <button
                    className="btn btn-primary w-full hover:bg-blue-600 transition duration-300 ease-in-out px-8 py-2 text-white rounded-md shadow-lg"
                    onClick={() => setIsCashModalVisible(true)}
                  >
                    Cash on Delivery Instructions
                  </button>
                )}
                {!isPaid && paymentMethod === "Moniepoint" && (
                  <div>
                    <ul>
                      <li>
                        {/* <MonnifyButton orderId={orderId} /> */}
                        <button
                          className="btn btn-primary w-full my-2"
                          onClick={() => monnifyPay()}
                        >
                          Pay with Monnify
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
                {isDelivered || isPaid && (
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
