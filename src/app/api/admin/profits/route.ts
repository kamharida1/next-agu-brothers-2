import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import ProfitModel from "@/lib/models/ProfitModel";

export const GET = auth(async (req: any) => { 
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  try {
    
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch all orders within the current day
      const orders = await OrderModel.find({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }).populate('items.product'); // Populate product details in order items

      let totalProfit = 0;

      // Calculate profit for each order
      for (const order of orders) {
        for (const item of order.items) {
          const product = await ProductModel.findById(item.product);
          if (product) {
            const profitPerItem = (item.price - product.costPrice) * item.qty;
            totalProfit += profitPerItem;
          }
        }
      }

      // Update daily profit in the database
      const today = new Date().setHours(0, 0, 0, 0); // Normalize date to midnight
      const dailyProfit = await ProfitModel.findOneAndUpdate(
        { date: today },
        { $inc: { totalProfit }, $setOnInsert: { date: today } },
        { new: true, upsert: true } // Create if doesn't exist
      );

      // Update cumulative profit
      let cumulativeProfit = dailyProfit.cumulativeProfit + totalProfit;
      dailyProfit.cumulativeProfit = cumulativeProfit;
      await dailyProfit.save();
      return Response.json({ totalProfit: dailyProfit.totalProfit, cumulativeProfit: dailyProfit.cumulativeProfit });
  } catch (error: any) {
    return Response.json({message: 'Error calculating daily profit',error: error.message})  }
}) as any