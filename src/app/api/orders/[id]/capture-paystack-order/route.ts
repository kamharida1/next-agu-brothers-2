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
      const {
        message,
        reference,
        status,
        trans,
        trxref,
      }  = await req.json();

      if (
        message === "Approved"
      ) {
        // Process the order as paid
        order.isPaid = true;
        order.totalPrice = order.totalPrice;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: trxref,
          status,
          update_time: Date.now(),
          email_address: order.shippingAddress.email,
        };
      } else {
        return Response.json(
          { message: "Payment not successful" },
          {
            status: 400,
          }
        );
      }
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
