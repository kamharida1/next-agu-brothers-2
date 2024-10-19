import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import cryptoJS from "crypto-js";
import https from "https";

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
      "4ac2427b53b5bac53df667e5605d2a4234a994f68bc63479522567c6247627f0b8e0217b0d3378d49f216bcd4f3a46bf0056627358df61f929450e3c7d48bef1";
    const publicKey =
      process.env.REMITA_PUBLIC_KEY ||
      "U09MRHw0MDgxOTUzOHw2ZDU4NGRhMmJhNzVlOTRiYmYyZjBlMmM1YzUyNzYwZTM0YzRjNGI4ZTgyNzJjY2NjYTBkMDM0ZDUyYjZhZWI2ODJlZTZjMjU0MDNiODBlMzI4YWNmZGY2OWQ2YjhiYzM2N2RhMmI1YWEwYTlmMTFiYWI2OWQxNTc5N2YyZDk4NA==";

    // Encryption using SHA512
    const dataToHash = `${transactionId}${secretKey}`;

    const apiHash = cryptoJS.SHA512(dataToHash).toString();
    const url = `https://demo.remita.net/payment/v1/payment/query/${transactionId}`;
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
    if (data.responseCode === "34") {
      console.error("Api Hashing Error:", data.responseMsg);
    } else {
      console.log("Response Data:", data);
    }

    console.log("REMITA_SECRET:", process.env.REMITA_SECRET);
    console.log("REMITA_PUBLIC_KEY:", process.env.REMITA_PUBLIC_KEY);
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
