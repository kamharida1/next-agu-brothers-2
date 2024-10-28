import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import ProductModel from '@/lib/models/ProductModel'

   export const PUT = auth(async (...request: any) => {
     const [req, { params }] = request
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
         order.isPaid = true
         order.paidAt = Date.now()
          //update stock
         const orderItems = order.items
          for (const item of orderItems) {
            const product = await ProductModel.findById(item.product)
            product.countInStock -= item.qty
            product.sold += item.qty
            await product.save()
          }
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