import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json(
      { message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  await dbConnect();

  const order = await OrderModel.findById(params.id);
  if (order) {
    try {
      const data  = await req.json();
      const responseData = data.responseData[0];

      if (
        data.responseCode === "00" &&
        responseData.paymentState === "SUCCESSFUL"
      ) {
        const {
          debitedAmount,
          email,
          amount,
          transactionId,
          cardType,
          paymentState,
          paymentChannel,
        } = responseData;

        // Process the order as paid
        order.isPaid = true;
        order.totalPrice = amount;
        order.paidAt = new Date(responseData.paymentDate);
        order.paymentResult = {
          id: transactionId,
          status: paymentState,
          update_time: Date.now(),
          email_address: email,
          cardType,
          debitedAmount,
          paymentChannel,
        };
      } else {
        return Response.json(
          { message: "Payment not successful" },
          {
            status: 400,
          }
        );
      }
      // Process the order as paid
      // order.isPaid = true;
      // order.totalPrice = amount;
      // order.paidAt = Date.now();
      // order.paymentResult = {
      //   id: transactionId,
      //   status: 'COMPLETED',
      //   email_address: req.auth.email,
      //   update_time: new Date().toISOString(),
      // };
      for (let item of order.items) {
        const product = await ProductModel.findById(item.product);

        if (product) {
          product.countInStock -= item.qty; // Decrease stock based on ordered quantity

          // Check to prevent negative stock count
          if (product.countInStock < 0) {
            product.countInStock = 0;
          }

          await product.save(); // Save the updated product
        }
      }
      const updatedOrder = await order.save();
      return Response.json(updatedOrder);
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
