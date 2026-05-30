import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const order = await OrderModel.findById(params.id);
  if (!order) {
    return Response.json({ message: "Order not found" }, { status: 404 });
  }

  try {
    const { reference } = await req.json();

    // Verify payment with Paystack
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return Response.json(
        { message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const paidAmount = verifyData.data.amount / 100; // Paystack amounts are in kobo
    const expectedAmount = order.totalPrice;

    // Allow small rounding tolerance
    if (Math.abs(paidAmount - expectedAmount) > 1) {
      return Response.json(
        { message: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: verifyData.data.reference,
      status: verifyData.data.status,
      update_time: new Date(),
      email_address: verifyData.data.customer.email,
    };

    // Decrease stock for each ordered item
    for (const item of order.items) {
      const product = await ProductModel.findById(item.product);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.qty);
        await product.save();
      }
    }

    const updatedOrder = await order.save();
    return Response.json(updatedOrder);
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}) as any;
