 import { auth } from '@/lib/auth'
   import dbConnect from '@/lib/dbConnect'
   import OrderModel from '@/lib/models/OrderModel'

   export const PUT = auth(async (req: any, context: any) => {
  const params = await context.params
     if (!req.auth || !req.auth.user?.isAdmin) {
       return Response.json(
         { message: 'unauthorized' },
         {
           status: 401,
         }
       )
     }
     try {
       await dbConnect()

       const order = await OrderModel.findById(params.id)
       if (order) {
         if (!order.isPaid)
           return Response.json(
             { message: 'Order is not paid' },
             {
               status: 400,
             }
           )
         order.isDelivered = !order.isDelivered
         order.deliveredAt = Date.now()
         const updatedOrder = await order.save()
         return Response.json(updatedOrder)
       } else {
         return Response.json(
           { message: 'Order not found' },
           {
             status: 404,
           }
         )
       }
     } catch (err: any) {
       return Response.json(
         { message: err.message },
         {
           status: 500,
         }
       )
     }
   }) as any