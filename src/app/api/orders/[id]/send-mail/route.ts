import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import { mg, payOrderEmailTemplate } from "@/lib/utils";


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
    const { orderDetails } = await req.json();

    const messageData = {
      from: "Agu Brothers <agubrothers@mg.yourdomain.com>",
      to: `${orderDetails.fullName} <${orderDetails.shippingAddress.email}>`,
      subject: `Order Confirmation - ${order._id}`,
    //   text: `Thank you for your purchase. Here are the details:\n\n
    //             Order Number: ${orderDetails.orderNumber}\n
    //             Order Date: ${orderDetails.createdAt}\n
    //             Order Total: ${orderDetails.totalPrice}\n
    //             Items: ${orderDetails.items
    //               .map((item: any) => `${item.name} (x${item.quantity})`)
    //               .join(", ")}

    //         `,
      html: payOrderEmailTemplate(orderDetails),
    };
    try {
        // send email
        const response = await mg.messages.create(`sandboxf039d48ba90f4eda89678aa376f41d86.mailgun.org`, messageData);
        return Response.json(response, { status: 200 });
    } catch (error) {
      return Response.json(
        { message: "error" },
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
