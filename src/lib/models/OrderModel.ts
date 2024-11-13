   import { count } from 'console'
import mongoose, { Types } from 'mongoose'
   const orderSchema = new mongoose.Schema(
     {
       user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
       },
       items: [
         {
           product: {
             type: mongoose.Schema.Types.ObjectId,
             ref: 'Product',
             required: true,
           },
           
           name: { type: String, required: true },
           images: [{ type: String, required: true }],
           slug: { type: String, required: true },
           qty: { type: Number, required: true },
           image: { type: String, required: true },
           price: { type: Number, required: true },
           weight: { type: Number, required: true },
           countInStock  : { type: Number, required: true },
         },
       ],
       shippingAddress: {
         fullName: { type: String, required: true },
         address: { type: String, required: true },
         city: { type: String, required: true },
         postalCode: { type: String, required: true },
         country: { type: String, required: true },
         email: { type: String, required: true },
         phone: { type: String, required: true },
         is_default: { type: Boolean, default: false }, 
       },
       paymentMethod: { type: String, required: true },
       paymentResult: {
         id: String,
         status: String,
         update_time: Date,
         email_address: String,
         cardType: String,
         debitedAmount: Number,
         paymentChannel: String,
       },
       itemsPrice: { type: Number, required: true },
       shippingPrice: { type: Number, required: true },
       taxPrice: { type: Number, required: true },
       totalPrice: { type: Number, required: true },
       isPaid: { type: Boolean, required: true, default: false },
       isDelivered: { type: Boolean, required: true, default: false },
       paidAt: { type: Date },
       deliveredAt: { type: Date },
     },
     {
       timestamps: true,
     }
   )

const OrderModel =
  mongoose.models.Order || mongoose.model('Order', orderSchema)
export default OrderModel

export type Order = {
  _id: string
  user?: { name: string }
  items: [OrderItem]
  shippingAddress: {
    fullName: string
    address: string
    city: string
    postalCode: string
    country: string
    email: string 
    phone: string
  }
  paymentMethod: string
  paymentResult?: {
    id: string;
    status: string;
    email_address: string;
    update_time: string;  
    rrr: string;
  }
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  isPaid: boolean
  isDelivered: boolean
  paidAt?: string
  deliveredAt?: string
  createdAt: string
}

export type OrderItem = {
  product: string
  name: string
  slug: string
  qty: number
  image: string
  images: string[]
  price: number
  weight: number
  countInStock: number
}

export type ShippingAddress = {
  fullName: string
  address: string
  city: string
  postalCode: string
  country: string
  email: string
  phone: string
  is_default?: boolean
}