import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";

export const DELETE = auth(async (...request: any) => {
  const [req, { params }] = request;

  // Check if the user is authenticated
  if (!req.auth) {
    return new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401 }
    );
  }

  const { user } = req.auth;

  try {
    // Connect to the database
    await dbConnect();

    // Find the order by ID
    const order = await OrderModel.findById(params.id);

    // If the order is not found, return 404
    if (!order) {
      return new Response(
        JSON.stringify({ message: "Order not found" }),
        { status: 404 }
      );
    }

    // Check if the user is an admin or the owner of the order
    if (order.user.toString() === user._id.toString()) {
      // Check if the order is paid
      if (order.isPaid) {
        return new Response(
          JSON.stringify({ message: "Cannot delete a paid order" }),
          { status: 400 }
        );
      }

      // Delete the order if it is not paid
      await order.deleteOne();
      return new Response(
        JSON.stringify({ message: "Order removed" }),
        { status: 200 }
      );
    } else {
      // If not authorized, return 403
      return new Response(
        JSON.stringify({ message: "Unauthorized to delete this order" }),
        { status: 403 }
      );
    }
  } catch (err: any) {
    // Handle server errors
    return new Response(
      JSON.stringify({ message: err.message }),
      { status: 500 }
    );
  }
}) as any;
