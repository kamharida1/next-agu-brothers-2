import { OrderItem, ShippingAddress } from "../models/OrderModel";
import { create } from "zustand";
import { round2 } from "../utils";
import { persist } from "zustand/middleware";
import { shippingRates } from "../shipping";
import { useEffect } from "react";

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  paymentMethod: "PayPal",
  shippingAddress: {
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    email: "",
  },
};

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: "cartStore",
  })
);

export default function useCartService() {
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice, paymentMethod, shippingAddress } = cartStore();

  useEffect(() => {
    // Calculate the prices when the component mounts or when items or shippingAddress changes
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(items, shippingAddress);
    cartStore.setState({
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
  }, [items, shippingAddress]);

  return {
    items,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,

    increase: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug);

      if (exist) {
        if (exist.qty < item.countInStock) {
          const updatedCartItems = items.map((x) =>
            x.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : x
          );
          const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems, shippingAddress);
          cartStore.setState({
            items: updatedCartItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
          });
        } else {
          console.log("Cannot add more than the available stock.");
        }
      } else {
        if (item.countInStock > 0) {
          const updatedCartItems = [...items, { ...item, qty: 1 }];
          const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems, shippingAddress);
          cartStore.setState({
            items: updatedCartItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
          });
        } else {
          console.log("Item is out of stock.");
        }
      }
    },

    decrease: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug);
      if (!exist) return;

      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x) => x.slug !== item.slug)
          : items.map((x) => (x.slug === item.slug ? { ...exist, qty: exist.qty - 1 } : x));

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems, shippingAddress);
      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    },

    saveShippingAddress: (shippingAddress: ShippingAddress) => {
      cartStore.setState({ shippingAddress });
    },

    savePaymentMethod: (paymentMethod: string) => {
      cartStore.setState({ paymentMethod });
    },

    clear: () => {
      cartStore.setState({
        items: [],
      });
    },

    init: () => cartStore.setState(initialState),
  };
}

const calcPrice = (items: OrderItem[], shippingAddress: ShippingAddress) => {
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
