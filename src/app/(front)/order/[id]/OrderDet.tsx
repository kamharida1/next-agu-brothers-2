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
import { usePaystackPayment } from "react-paystack";

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

type Config = {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
};
export default function OrderDetails({ orderId }: { orderId: string }) {
  const [isModalVisible, setIsModalVisible] = useState(false); // Control modal visibility
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentResult, setPaymentResult] = useState<any | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [paidAt, setPaidAt] = useState("");
  const [narration, setNarration] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [statusLoading, setStatusLoading] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<any | null>(null);
  const [transError, setTransError] = useState<any | null>("");

  // Paystack payment
  const config: Config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: Number(amount),
    publicKey: "pk_test_e10dba7e643757aaf5a1280e8d4c4538fb6318a8",
  };

  const onSuccess = (reference: any) => {
    console.log(reference);
    onApprovePaystackOrder(reference);
  };
  const onClose = () => {
    console.log("closed");
  };

  const PaystackHookButton = () => {
    const initializePayment = usePaystackPayment(config);
    return (
      <div>
        <button
          className="btn btn-primary w-full hover:bg-blue-600 transition duration-300 ease-in-out px-8 py-2 text-white rounded-md shadow-lg"
          onClick={() => {
            initializePayment({ onSuccess, onClose });
          }}
        >
          Pay with Paystack
        </button>
      </div>
    );
  };

  const publicKey =
    "QUzAwMDA3NTE2OTZ8MTQ0NzY3MjE4ODV8NGE4MThhNjI0Mzc5NGYxYWQzMTdiYmQ3MjdhMTFjOTU3NWRmZjFkYzZjNjYzZGRjMzE2NDkyMGFmZDBhNTJkODVhNzA0Njk4NjI0YTljYTE0MzFhZDUyMDlkOTAzZjdlMmNjN2NkODFkMjA0MTRmYjBmYTZiNmJlOTM5ZTQ0NDQ=";

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

  useEffect(() => {
    if (data) {
      setEmail(data.shippingAddress.email);
      setFirstName(data.shippingAddress.fullName.split(" ")[0]);
      setLastName(data.shippingAddress.fullName.split(" ")[1]);
      setAmount(data.totalPrice);
      setPhoneNumber(data.shippingAddress.phoneNumber);
      setNarration(`Payment for order ${orderId}`);
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
      setIsPaid(true);
      setPaidAt(orderData.paidAt);
      setPaymentResult(orderData.paymentResult);
      setResponseData(orderData.paymentResult);
      sendMail(orderData);
      return orderData;
    } catch (error) {
      // Handle fetch or JSON parsing error
      console.error("Error processing order payment:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  }

  async function onApprovePaystackOrder(data: any) {
    try {
      const response = await fetch(
        `/api/orders/${orderId}/capture-paystack-order`,
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
      setIsPaid(true);
      setPaidAt(orderData.paidAt);
      setPaymentResult(orderData.paymentResult);
      setResponseData(orderData.paymentResult);
      sendMail(orderData);
      return orderData;
    } catch (error) {
      // Handle fetch or JSON parsing error
      console.error("Error processing order payment:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  }
  //const [firstName, lastName] = shippingAddress.fullName.trim().split(" ");

  // const makePayment = () => {
  //   if (typeof window.RmPaymentEngine === "undefined") {
  //     console.error("Payment engine script not loaded.");
  //     return;
  //   }

  //   const handler = window.RmPaymentEngine.init({
  //     key: "QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=", // Replace with actual public key
  //     customerId: shippingAddress.email, // Replace with customer id
  //     transactionId: Math.random(), // Replace with unique transaction id
  //     lastName,
  //     firstName,
  //     email: email,
  //     amount: totalPrice,
  //     narration: `Payment for order ${orderId}`,
  //     onSuccess: (response: any) => {
  //       console.log("callback Successful Response", response);
  //       onApproveRemitaOrder(response);
  //     },
  //     onError: (response: any) => {
  //       console.log("callback Error Response", response);
  //     },
  //     onClose: () => {
  //       console.log("Transaction closed by user");
  //     },
  //   });

  //   handler.openIframe();
  // };

  const makePayment = (e: any) => {
    e.preventDefault();

    if (typeof window.RmPaymentEngine === "undefined") {
      console.error("RmPaymentEngine is not loaded yet");
      return;
    }

    var paymentEngine = window.RmPaymentEngine.init({
      key: publicKey,
      customerId: email,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      amount: amount,
      narration: narration,
      transactionId: Math.floor(Math.random() * 100000000),
      onSuccess: function (response: any) {
        console.log("callback Successful Response", response);
        setTransactionId(response.transactionId);
        setIsModalVisible(false);
        checkTransStatus(response.transactionId);
      },
      onError: function (response: any) {
        console.log("callback Error Response", response);
        setIsModalVisible(false);
      },
      onClose: function () {
        console.log("Payment widget closed");
        setIsModalVisible(false);
      },
    });

    paymentEngine.showPaymentWidget();
  };

  const checkTransStatus = async (transactionId: string) => {
    try {
      setTransError(null);
      setResponseData(null);
      setStatusLoading(true);
      const response = await fetch(
        `/api/orders/${orderId}/remita/check-trans-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transactionId }),
        }
      );
      const data = await response.json();
      if (data) {
        //setResponseData(data);
        onApproveRemitaOrder(data);
      } else {
        setTransError("Failed to check Transaction status");
      }
    } catch (err: any) {
      setTransError("An error occured: " + err.message);
    } finally {
      setStatusLoading(false);
    }
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
              onClick={() => setIsModalVisible(false)}
            >
              <AiOutlineCloseCircle />
            </button>

            <h3 className="font-bold text-xl text-center text-gray-800 mb-6">
              Pay with Remita
            </h3>

            <form
              onSubmit={makePayment}
              id="payment-form"
              className="space-y-4 w-full mx-auto" // Center form and set max width
            >
              <div className="form-control mb-4 w-full">
                <label htmlFor="email" className="label text-center">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-gray-100 focus:ring focus:ring-blue-500 rounded-lg"
                  id="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  required
                />
              </div>
              {/*phoneNumber */}
              {/* <div className="form-control mb-4">
                <label htmlFor="phoneNumber" className="label text-center">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-gray-100 focus:ring focus:ring-blue-500 rounded-lg"
                  id="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  name="phoneNumber"
                />
              </div> */}

              <div className="form-control mb-4">
                <label htmlFor="firstName" className="label text-center">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-gray-100 focus:ring focus:ring-blue-500 rounded-lg"
                  id="firstName"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  name="firstName"
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label htmlFor="lastName" className="label text-center">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-gray-100 focus:ring focus:ring-blue-500 rounded-lg"
                  id="lastName"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  name="lastName"
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label htmlFor="amount" className="label text-center">
                  <span className="label-text">Amount</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full bg-gray-100 focus:ring focus:ring-blue-500 rounded-lg"
                  id="amount"
                  placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  name="amount"
                  required
                />
              </div>

              <div className="form-control mb-6">
                <label htmlFor="narration" className="label text-center">
                  <span className="label-text">Narration</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-gray-100 focus:ring focus:ring-blue-500 rounded-lg"
                  id="narration"
                  placeholder="Enter Narration"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  name="narration"
                  required
                />
              </div>

              <div className="modal-action flex justify-center">
                <button type="submit" className="btn btn-primary">
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://login.remita.net/payment/v1/remita-pay-inline.bundle.js"
        strategy="lazyOnload"
      />

      <div>
        <h1 className="text-2xl py-4"> Order {orderId}</h1>
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
                    <div className="card bg-base-100 mt-4">
                      <div className="card-body">
                        <h2 className="card-title">Payment Result</h2>
                        <div className="mb-2">
                          <strong>ID:</strong> {paymentResult?.id}
                        </div>
                        <div className="mb-2">
                          <strong>Status:</strong> {paymentResult?.status}
                        </div>
                        <div className="mb-2">
                          <strong>Update Time:</strong>{" "}
                          {paymentResult?.update_time}
                        </div>
                        <div className="mb-2">
                          <strong>Email Address:</strong>{" "}
                          {paymentResult?.email_address}
                        </div>
                        <div className="mb-2">
                          <strong>Card Type:</strong> {paymentResult?.cardType}
                        </div>
                        <div className="mb-2">
                          <strong>Debited Amount:</strong>{" "}
                          {formatPrice(paymentResult?.debitedAmount)}
                        </div>
                        <div className="mb-2">
                          <strong>Payment Channel:</strong>{" "}
                          {paymentResult?.paymentChannel}
                        </div>
                      </div>
                    </div>
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
                {!isPaid && paymentMethod === "Remita" && (
                  <div>
                    <ul>
                      <li>
                        <button
                          className="btn btn-primary w-full hover:bg-blue-600 transition duration-300 ease-in-out px-8 py-2 text-white rounded-md shadow-lg"
                          onClick={() => setIsModalVisible(true)}
                        >
                          Pay with Remita
                        </button>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Paystack payment */}
                {!isPaid && paymentMethod === "PayStack" && (
                  <div>
                    <ul>
                      <li>
                      <PaystackHookButton />
                      </li>
                    </ul>
                  </div>
                )}

                {paymentMethod === "Remita" 
                && paymentResult?.id && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">
                      Check Remita Status
                    </h3>
                    <input
                      type="text"
                      className="input input-bordered w-full my-2"
                      placeholder="Enter Transaction ID"
                      value={paymentResult.id || transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                    <button
                      className="btn btn-secondary w-full my-2"
                      onClick={() => {
                        if (paymentResult.id) {
                          checkTransStatus(paymentResult.id);
                        }
                      }}
                      disabled={statusLoading}
                    >
                      {statusLoading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Check Transaction Status"
                      )}
                    </button>
                    {responseData && (
                      <div className="bg-base-100 p-4 rounded-lg shadow-md">
                        <pre className="text-sm overflow-auto whitespace-pre-wrap break-words">
                          {JSON.stringify(responseData, null, 2)}
                        </pre>
                      </div>
                    )}
                    {transError && <p className="text-error">{transError}</p>}
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
