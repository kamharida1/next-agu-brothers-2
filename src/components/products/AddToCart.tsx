'use client'

import useCartService from "@/lib/hooks/useCartStore";
import { OrderItem } from "@/lib/models/OrderModel";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddToCart({ item, brand }: { item: OrderItem;  brand?: string }) { 
  const router = useRouter()
  const { items, increase, decrease } = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()

  useEffect(() => { 
    setExistItem(items.find((x) => x.slug === item.slug))
  }, [item, items])
  
  const addToCartHandler = () => { 
    increase(item)
  }

  return (existItem && !brand ) ? (
    <div>
      <button className="btn" type="button" onClick={() => decrease(existItem)}>
        -
      </button>
      <span className="px-2">{existItem.qty}</span>
      <button className="btn" type="button" onClick={() => increase(existItem)}>
        +
      </button>
  </div>
  ) : (
      <button
        onClick={addToCartHandler}
        type="button"
        className={clsx('btn btn-primary', brand ? 'btn-small' : 'w-full')}
      >
        Add to Cart
      </button>
  )
} 