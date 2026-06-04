'use client'

import useCartService from "@/lib/hooks/useCartStore";
import { OrderItem } from "@/lib/models/OrderModel";
import { useEffect, useState } from "react";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import toast from 'react-hot-toast';

export default function AddToCart({
  item,
  compact,
  variant = 'default',
}: {
  item: OrderItem
  compact?: boolean
  variant?: 'default' | 'amazon'
}) {
  const { items, increase, decrease } = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()

  useEffect(() => {
    setExistItem(items.find((x) => x.slug === item.slug))
  }, [item, items])

  const addToCartHandler = () => {
    increase(item)
    toast.success(`${item.name} added to cart!`, {
      icon: '🛒',
      duration: 2000,
    })
  }

  if (existItem) {
    return (
      <div className="flex items-center border border-base-300 rounded-xl overflow-hidden">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center hover:bg-base-200 transition-colors"
          onClick={() => decrease(existItem)}
        >
          <FiMinus className="w-4 h-4" />
        </button>
        <span className="flex-1 text-center font-semibold text-sm py-2">
          {existItem.qty}
        </span>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center hover:bg-base-200 transition-colors"
          onClick={() => increase(existItem)}
          disabled={existItem.qty >= item.countInStock}
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>
    )
  }

  const btnClass =
    variant === 'amazon'
      ? `btn-amazon gap-2 flex items-center justify-center ${compact ? 'py-2 text-sm' : 'w-full py-2.5 text-sm'} disabled:opacity-50 disabled:cursor-not-allowed`
      : `btn btn-primary gap-2 ${compact ? 'btn-sm' : 'w-full'}`

  return (
    <button
      onClick={addToCartHandler}
      type="button"
      className={btnClass}
      disabled={item.countInStock === 0}
    >
      <FiShoppingCart className="w-4 h-4" />
      {item.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
    </button>
  )
}
