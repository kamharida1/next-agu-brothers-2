import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'
import OrderModel, { OrderItem, ShippingAddress } from '@/lib/models/OrderModel'
import { round2 } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { shippingRates } from "@/lib/shipping";


export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const { user } = req.auth
  try {
    const payload = await req.json()
    await dbConnect()
    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
      },
      'price'
    )
    const dbOrderItems = payload.items.map((x: { _id: string }) => ({
      ...x,
      product: x._id,
      price: dbProductPrices.find((x) => x._id === x._id).price,
      _id: undefined,
    }))
    
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems, payload.shippingAddress)
    
    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id,
    })

    const createdOrder = await newOrder.save()
    return Response.json(
      { message: 'Order has been created', order: createdOrder },
      {
        status: 201,
      }
    )
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any

const calcPrices = (items: OrderItem[], shippingAddress: ShippingAddress) => {
const itemsPrice = round2(items.reduce((acc, item) => acc + item.price * item.qty, 0));
const totalWeight = items.reduce((acc, item) => acc + item.weight * item.qty, 0);
const totalQty = items.reduce((acc, item) => acc + item.qty, 0);
const averageWeight = totalQty > 0 ? round2(totalWeight / totalQty) : 0;

const cityRates = shippingRates[shippingAddress.city as keyof typeof shippingRates];
const shippingPrice = cityRates ? round2(cityRates.baseRate + cityRates.perKg * totalWeight) : 0;

const taxPrice = round2(Number(0.006 * itemsPrice));
const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
