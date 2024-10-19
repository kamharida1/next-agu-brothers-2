import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import OrderModel from "@/lib/models/OrderModel"

// User can delete their order
export const DELETE = auth(async (req: any) => {
    if (!req.auth) {
      return Response.json(
        { message: 'unauthorized' },
        {
          status: 401,
        }
      )
    }
    const { user } = req.auth
    await dbConnect()
    const order = await OrderModel.findById(req.params.id)
    if (order.isPaid) {
        return Response.json(
            { message: 'Cannot delete a paid order' },
            {
                status: 400,
            }
        )
    }
    if (order && order.user.toString() === user._id.toString()) {
      await order.remove()
      return Response.json({ message: 'Order removed' })
    } else {
      return Response.json(
        { message: 'Order not found' },
        {
          status: 404,
        }
      )
    }
  }) as any