import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import { fulfillOrderStock } from '@/lib/orderStock'

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
         if (order.isPaid) {
           return Response.json(order)
         }

         // COD reserves stock when the order is placed; other methods reserve on payment
         if (order.paymentMethod !== 'Cash On Delivery') {
           const stockError = await fulfillOrderStock(
             order.items.map((item: { product: string; qty: number; name: string }) => ({
               product: item.product.toString(),
               qty: item.qty,
               name: item.name,
             }))
           )
           if (stockError) {
             return Response.json({ message: stockError }, { status: 400 })
           }
         }

         order.isPaid = true
         order.paidAt = Date.now()
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