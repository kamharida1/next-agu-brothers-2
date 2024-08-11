import React from 'react'

const PageSkeleton = () => {
  return (
    <>
      <div className="w-full carousel rounded-box mt-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="carousel-item relative w-full h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 w-full px-24 items-center">
              <div className="hero min-h-[400px] w-[3/4] flex items-center justify-center rounded-md px-4 bg-base-300 p-4">
                <div className="max-w-md">
                  <div className="mb-5 text-3xl font-bold bg-gray-300 animate-pulse h-8 w-3/4"></div>
                  <div className="mb-5 bg-gray-300 animate-pulse h-6 w-full"></div>
                  <div className="btn btn-primary bg-gray-300 animate-pulse h-10 w-1/2"></div>
                </div>
              </div>
              <div className="hero min-h-[400px] w-full rounded-md bg-cover bg-center bg-gray-300 animate-pulse"></div>
            </div>
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <div className="btn btn-circle btn-lg bg-gray-300 text-gray-800 border-none shadow-lg animate-pulse">
                ❮
              </div>
              <div className="btn btn-circle btn-lg bg-gray-300 text-gray-800 border-none shadow-lg animate-pulse">
                ❯
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4">
        <div className="h-8 w-24 bg-gray-300 animate-pulse rounded-md"></div>
      </div>
      <h2 className="text-2xl py-2 bg-gray-300 animate-pulse h-8 w-1/4"></h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-gray-300 animate-pulse h-64 w-full rounded-md"
          ></div>
        ))}
      </div>
    </>
  )
}

export default PageSkeleton
