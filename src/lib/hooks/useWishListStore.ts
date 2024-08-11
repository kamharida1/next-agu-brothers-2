import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { Product } from '../models/ProductModel';

type Wishlist = {
  items: Product[];
};

const initialState: Wishlist = {
  items: [],
};

export const wishListStore = create<Wishlist>()(
  persist(() => initialState, {
    name: 'wishListStore',
  })
)

export default function useWishListService() { 
  const { items } = wishListStore();
  return {
    items,
    addItem: (item: Product) => {
      wishListStore.setState({ items: [...items, item] })
    },
    removeItem: (item: Product) => {
      wishListStore.setState({ items: items.filter((i) => i.slug !== item.slug) })
    },
    clear: () => { 
      wishListStore.setState({ items: [] })
    }
  };
}

