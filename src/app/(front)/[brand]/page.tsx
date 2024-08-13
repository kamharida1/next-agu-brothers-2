import CldImage from "@/components/CldImage"
import AddToCart from "@/components/products/AddToCart"
import { Product } from "@/lib/models/ProductModel"
import productServices from "@/lib/services/productService"
import { convertDocToObj, formatPrice } from "@/lib/utils"
import Link from "next/link"
import { FaRegHeart } from "react-icons/fa"

export default async function ProductsByBrand({
  params,
}: {
  params: { brand: string }
}) {
  const items = await productServices.getByBrand(params.brand)
  if (!items) {
    return <div>No Products Found</div>
  }
  return (
    <div className="w-full h-screen px-3 py-2">
      <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
        <ul className="dark:text-black">
          <li>
            <Link href={'/'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <FaRegHeart className="w-4 h-4 mr-2 stroke-current" />
            {params.brand}
          </li>
        </ul>
      </div>
      <div className="w-full h-5/6 py-5">
        <h1 className="text-2xl font-bold text-center">Products By Brand</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
          {items.length === 0 ? (
            <div className="text-center text-lg font-semibold">
              No Products here
            </div>
          ) : (
            items.map((item: Product) => (
              <div
                key={item._id}
                className="card card-compact w-80 h-auto bg-base-100 shadow-xl mb-6 transition-transform transform hover:scale-105"
              >
                <Link href={`/product/${item.slug}`}>
                  <figure className="relative overflow-hidden">
                    <CldImage
                      width={300}
                      height={300}
                      src={item?.images[0]}
                      alt={item?.name}
                      className="object-cover object-center w-full h-64 rounded-t-xl transition-transform transform hover:scale-110"
                    />
                  </figure>
                </Link>
                <div className="card-body p-6">
                  <Link href={`/product/${item?.slug}`}>
                    <h2 className="card-title font-medium hover:font-bold transition-colors">
                      {item?.name}
                    </h2>
                  </Link>
                  <div className="flex justify-between items-center overflow-hidden">
                    <span className="text-lg font-semibold">
                      {formatPrice(item?.price)}
                    </span>
                    <AddToCart
                      brand={item?.brand}
                      item={{
                        ...convertDocToObj(item),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}