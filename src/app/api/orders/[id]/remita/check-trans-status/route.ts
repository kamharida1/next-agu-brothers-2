import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import cryptoJS from "crypto-js";

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }
  await dbConnect();

  try {
    const { transactionId } = await req.json();
    if (!transactionId) {
      return Response.json(
        { message: "Invalid transaction ID" },
        {
          status: 400,
        }
      );
    }
    console.log("Transaction ID:", transactionId);
    const secretKey =
      process.env.REMITA_SECRET ||
      "35985afbbb3821ab58b408b87e73f4ce76449ae51a47d761912f7b7dc9c5481a265a39f49c92c2deaa0fc36fc248ff773847dc6f72616b8a52db711f65a0adb3";
    const publicKey =
      process.env.REMITA_PUBLIC_KEY ||
      "QUzAwMDA3NTE2OTZ8MTQ0NzY3MjE4ODV8NGE4MThhNjI0Mzc5NGYxYWQzMTdiYmQ3MjdhMTFjOTU3NWRmZjFkYzZjNjYzZGRjMzE2NDkyMGFmZDBhNTJkODVhNzA0Njk4NjI0YTljYTE0MzFhZDUyMDlkOTAzZjdlMmNjN2NkODFkMjA0MTRmYjBmYTZiNmJlOTM5ZTQ0NDQ=";
    // Encryption using SHA512
    const dataToHash = `${transactionId}${secretKey}`;

    const apiHash = cryptoJS.SHA512(dataToHash).toString();
    const url = `https://login.remita.net/payment/v1/payment/query/${transactionId}`;
    //make a get request to remita
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "TXN_HASH": apiHash,
        "publicKey": publicKey,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    // if (data.responseCode === "34") {
    //   console.error("Api Hashing Error:", data.responseMsg);
    // } else {
    //   console.log("Response Data:", data);
    // }
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json(
      { message: "error" },
      {
        status: 500,
      }
    );
  }
}) as any;
