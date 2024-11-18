import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import ProductModel from '@/lib/models/ProductModel'

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json(
      { message: 'Unauthorized' },
      {
        status: 401,
      }
    )
  }

  await dbConnect()

  const order = await OrderModel.findById(params.id)
  if (order) {
    try {
      const {
        authorizedAmount,
        paidOn,
        paymentReference,
        status,
        transactionReference,
      } = await req.json()

      // Check if transactionId is missing or invalid
      if (!authorizedAmount) {
        return Response.json(
          { message: 'Invalid event data' },
          {
            status: 400,
          }
        )
      }

      // Process the order as paid
      order.isPaid = true
      order.totalPrice = authorizedAmount
      order.paidAt = Date.now()
      order.paymentResult = {
        id: paymentReference,
        status,
        email_address: req.auth.email,
        update_time: new Date().toISOString(),
      }
      for (let item of order.items) {
        const product = await ProductModel.findById(item.product)

        if (product) {
          product.countInStock -= item.qty // Decrease stock based on ordered quantity

          // Check to prevent negative stock count
          if (product.countInStock < 0) {
            product.countInStock = 0
          }

          await product.save() // Save the updated product
        }
      }
      const updatedOrder = await order.save()
      return Response.json(updatedOrder)
    } catch (err: any) {
      return Response.json(
        { message: err.message },
        {
          status: 500,
        }
      )
    }
  } else {
    return Response.json(
      { message: 'Order not found' },
      {
        status: 404,
      }
    )
  }
}) as any

// import { auth } from '@/lib/auth'
// import dbConnect from '@/lib/dbConnect'
// import ProductModel from '@/lib/models/ProductModel'
// import OrderModel from '@/lib/models/OrderModel'
// import { NextRequest } from 'next/server'

// export const POST = async (req: NextRequest) => {
//   const jsonData = await req.json()
//   console.log(jsonData)

//   await dbConnect()
//   const order = await OrderModel.findOne({
//     'shippingAddress.email': jsonData.eventData.customer.email,
//     totalPrice: jsonData.eventData.amountPaid,
//     createdAt: {
//       $gte: new Date(jsonData.eventData.paidOn).setSeconds(0) - 1000,
//       $lte: new Date(jsonData.eventData.paidOn).setSeconds(59) + 1000,
//     },
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

//       // Reduce the countInStock for each product in the order
//       for (const item of order.items) {
//         const product = await ProductModel.findById(item.product)
//         if (product) {
//           product.countInStock -= item.qty
//           await product.save()
//         }
//       }

//       const updatedOrder = await order.save()
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
