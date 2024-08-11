import { OrderItem, ShippingAddress } from "../models/OrderModel"
import {create} from 'zustand'
import { round2 } from "../utils"
import { persist } from "zustand/middleware"
import { shippingRates } from "../shipping"

type Cart = {
  items: OrderItem[]
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  paymentMethod: string
  shippingAddress: ShippingAddress
}

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  paymentMethod: 'PayPal',
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    email: ''
  },
}

export const cartStore = create<Cart>()(
     persist(() => initialState, {
       name: 'cartStore',
     })
)

export default function useCartService() {
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice,paymentMethod, shippingAddress } = cartStore()
  return {
    items,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
    increase: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug)
      const updatedCartItems = exist
        ? items.map((x) =>
            x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x
          )
        : [...items, { ...item, qty: 1 }]
      const { itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      } = calcPrice(updatedCartItems, shippingAddress)
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      })
    },
    decrease: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug)
      if(!exist) return
      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x: OrderItem) => x.slug !== item.slug)
          : items.map((x) =>(item.slug ? { ...exist, qty: exist.qty - 1 } : x))
      const { itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      } = calcPrice(updatedCartItems, shippingAddress)
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      })
    },
    saveShippingAddress: (shippingAddress: ShippingAddress) => { 
      cartStore.setState({ shippingAddress })
    },
    savePaymentMethod: (paymentMethod: string) => {
      cartStore.setState({ paymentMethod })
    },
    clear: () => {
      cartStore.setState({
        items:[],
      })
    },
    init: () => cartStore.setState(initialState),
  }
}
const calcPrice = (items: OrderItem[], shippingAddress: ShippingAddress) => {
  // Calculate the total price of all items
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // Calculate the total weight of all items
  const totalWeight = items.reduce((acc, item) => acc + item.weight * item.qty, 0);

  // Calculate the total quantity of all items
  const totalQty = items.reduce((acc, item) => acc + item.qty, 0);

  // Calculate the average shipping weight
  const averageWeight = totalQty > 0 ? round2(totalWeight / totalQty) : 0;

  // Calculate the shipping price based on the shipping address city rates
  const cityRates = shippingRates[shippingAddress.city as keyof typeof shippingRates];
  const shippingPrice = cityRates ? round2(cityRates.baseRate + cityRates.perKg * totalWeight) : 0;

  // Calculate the tax price (5% of items price)
  const taxPrice = round2(Number(0.05 * itemsPrice));

  // Calculate the total price (items price + shipping price + tax price)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice,  };
};
