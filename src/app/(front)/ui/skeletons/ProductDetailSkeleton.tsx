import React from 'react'

const ProductDetailSkeleton = () => {
  return (
    <>
      <div className="my-4">
        <div className="bg-gray-300 animate-pulse h-8 w-24 rounded-md"></div>
        <div className="bg-gray-300 animate-pulse h-6 w-32 mt-2 rounded-md"></div>
      </div>
      <div className="grid md:grid-cols-5 md:gap-6">
        <div className="md:col-span-2">
          <div className="bg-gray-300 animate-pulse h-[400px] rounded-md"></div>
        </div>
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="bg-gray-300 animate-pulse h-8 w-3/4 rounded-md"></div>
            <div className="bg-gray-300 animate-pulse h-6 w-1/2 rounded-md"></div>
            <div className="bg-gray-300 animate-pulse h-6 w-1/4 rounded-md"></div>
            <div className="divider"></div>
            <div>
              <div className="bg-gray-300 animate-pulse h-6 w-1/3 rounded-md"></div>
              <div className="bg-gray-300 animate-pulse h-24 w-full rounded-md mt-2"></div>
            </div>
            <div className="divider"></div>
            <div>
              <div className="bg-gray-300 animate-pulse h-6 w-1/3 rounded-md"></div>
              <div className="bg-gray-300 animate-pulse h-24 w-full rounded-md mt-2"></div>
            </div>
          </div>
        </div>
        <div>
          <div className="card bg-base-200 shadow-xl my-3 md:my-0">
            <div className="card-body">
              <div className="bg-gray-300 animate-pulse h-6 w-1/4 mb-2 rounded-md"></div>
              <div className="bg-gray-300 animate-pulse h-6 w-1/2 mb-2 rounded-md"></div>
              <div className="bg-gray-300 animate-pulse h-10 w-full rounded-md mt-4"></div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="card-title mt-6 text-2xl font-bold bg-gray-300 animate-pulse h-8 w-1/4 rounded-md"></h1>
      <div className="grid md:grid-cols-4 gap-6 my-6">
        <div className="bg-gray-300 animate-pulse h-24 w-full rounded-md"></div>
        <div className="md:col-span-2">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="bg-gray-300 animate-pulse h-6 w-1/4 rounded-md mb-4"></div>
              <ul className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <li
                    key={index}
                    className="p-4 bg-gray-300 animate-pulse h-24 rounded-lg"
                  ></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetailSkeleton
