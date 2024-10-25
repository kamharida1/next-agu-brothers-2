const paymentUrl =
  process.env.HYDRODEN_PAY_URL ||
  "https://api.hydrogenpay.com/bepay/api/v1/merchant/initiate-payment";
const confirmUrl =
  process.env.HYDROGEN_PAY_CONFIRM ||
  "https://api.hydrogenpay.com/bepay/api/v1/Merchant/confirm-payment";
const { HYDROGEN_PAY_SECRET } = process.env;

export const hydrogenPay = {
  initPay: async function initPay(
    amount: number,
    email: string,
    customerName: string,
    callbackUrl?: string
) {
    const url = `${paymentUrl}`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${HYDROGEN_PAY_SECRET}`,
      },
      body: JSON.stringify({
        amount,
        email,
        customerName,
        callbackUrl: callbackUrl || "https://www.agubrothers.com",
      }),
    });
    return handleResponse(response);
  },
  confirmPayment: async function confirmPayment(transactionRef: string) {
    const url = `${confirmUrl}`;
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${HYDROGEN_PAY_SECRET}`,
      },
        body: JSON.stringify({
            transactionRef,
        }),
    });

    return handleResponse(response);
  },
};

async function handleResponse(response: any) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}
