import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { hydrogenPay } from "@/lib/hydrogenPay";
import OrderModel from "@/lib/models/OrderModel";
import { paypal } from "@/lib/paypal";

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

  const order = await OrderModel.findById(params.id);
  if (order) {
    const { transactionRef } = await req.json();

    if (!transactionRef) {
      return Response.json(
        { message: "transactionRef is required" },
        {
          status: 400,
        }
      );
    }
    try {
      const captureData = await hydrogenPay.confirmPayment(transactionRef);
      return Response.json(captureData);
      
    } catch (err: any) {
      return Response.json(
        { message: err.message },
        {
          status: 500,
        }
      );
    }
  } else {
    return Response.json(
      { message: "Order not found" },
      {
        status: 404,
      }
    );
  }
}) as any;
