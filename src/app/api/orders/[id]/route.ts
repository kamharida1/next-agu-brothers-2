import dbConnect from '@/lib/dbConnect'
   import OrderModel from '@/lib/models/OrderModel'
   import { auth } from '@/lib/auth'

   export const GET = auth(async (req: any, context: any) => {
  const params = await context.params
     if (!req.auth) {
       return Response.json(
         { message: 'unauthorized' },
         {
           status: 401,
         }
       )
     }
     await dbConnect()
     const order = await OrderModel.findById(params.id)
     return Response.json(order)
   }) as any