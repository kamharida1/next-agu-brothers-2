// import { auth } from "@/lib/auth";
// import dbConnect from "@/lib/dbConnect";
// import OrderModel from "@/lib/models/OrderModel";
// import { NextRequest } from "next/server";

// export const POST = async (req: NextRequest) => {
//   const jsonData = await req.json()
//   console.log(jsonData)

//   await dbConnect()
//   const order = await OrderModel.findOne({
//     'shippingAddress.email': jsonData.eventData.customer.email,
//     totalPrice: jsonData.eventData.amountPaid,
//     createdAt: { $gte: new Date(jsonData.eventData.paidOn).setSeconds(0) -1000 , $lte: new Date(jsonData.eventData.paidOn).setSeconds(59) +1000 }
//   })
//   if (order) {
//     try { 
//       order.isPaid = true
//       order.paidAt = Date.now()
//       order.paymentResult = {
//         id: jsonData.eventData.product.reference,
//         status: jsonData.eventData.paymentStatus,
//         email_address: jsonData.eventData.customer.email,
//       }
//       const updatedOrder = await order.save();
//       console.log('Order paid successfully: ', updatedOrder)
//       return Response.json(
//         { message: 'Order paid Successfully' },
//         { status: 200 }
//       )
//     } catch (err: any) { 
//       return Response.json({ message: err.message }, { status: 500 })
//     }
//   } else {
//     return Response.json({ message: 'Order not found' }, { status: 404 })
//   }
  
// }
import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import OrderModel from '@/lib/models/OrderModel'
import { NextRequest } from 'next/server'

export const POST = async (req: NextRequest) => {
  const jsonData = await req.json()
  console.log(jsonData)

  await dbConnect()
  const order = await OrderModel.findOne({
    'shippingAddress.email': jsonData.eventData.customer.email,
    totalPrice: jsonData.eventData.amountPaid,
    createdAt: {
      $gte: new Date(jsonData.eventData.paidOn).setSeconds(0) - 1000,
      $lte: new Date(jsonData.eventData.paidOn).setSeconds(59) + 1000,
    },
  })

  if (order) {
    try {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: jsonData.eventData.product.reference,
        status: jsonData.eventData.paymentStatus,
        email_address: jsonData.eventData.customer.email,
      }

      // Reduce the countInStock for each product in the order
      for (const item of order.items) {
        const product = await ProductModel.findById(item.product)
        if (product) {
          product.countInStock -= item.qty
          await product.save()
        }
      }

      const updatedOrder = await order.save()
      console.log('Order paid successfully: ', updatedOrder)
      return Response.json(
        { message: 'Order paid Successfully' },
        { status: 200 }
      )
    } catch (err: any) {
      return Response.json({ message: err.message }, { status: 500 })
    }
  } else {
    return Response.json({ message: 'Order not found' }, { status: 404 })
  }
}
