export default function PlaceOrderSkeleton() { 
  return (
    <div>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <div className="bg-gray-300 rounded h-6 w-3/4 animate-pulse mb-2"></div>
              <div className="bg-gray-300 rounded h-6 w-1/2 animate-pulse mb-2"></div>
              <div className="bg-gray-300 rounded h-6 w-3/4 animate-pulse mb-2"></div>
              <div className="bg-gray-300 rounded h-8 w-16 animate-pulse mb-2"></div>
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <div className="bg-gray-300 rounded h-6 w-3/4 animate-pulse mb-2"></div>
              <div className="bg-gray-300 rounded h-8 w-16 animate-pulse mb-2"></div>
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <tr key={index}>
                      <td>
                        <div className="flex items-center">
                          <div className="bg-gray-300 rounded w-12 h-12 animate-pulse"></div>
                          <div className="bg-gray-300 rounded h-6 w-24 animate-pulse ml-2"></div>
                        </div>
                      </td>
                      <td>
                        <div className="bg-gray-300 rounded h-6 w-8 animate-pulse"></div>
                      </td>
                      <td>
                        <div className="bg-gray-300 rounded h-6 w-12 animate-pulse"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-300 rounded h-8 w-16 animate-pulse mt-4"></div>
            </div>
          </div>
        </div>
        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <ul className="space-y-3">
                <li>
                  <div className=" flex justify-between">
                    <div className="bg-gray-300 rounded h-6 w-1/4 animate-pulse"></div>
                    <div className="bg-gray-300 rounded h-6 w-1/4 animate-pulse"></div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div className="bg-gray-300 rounded h-6 w-1/4 animate-pulse"></div>
                    <div className="bg-gray-300 rounded h-6 w-1/4 animate-pulse"></div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div className="bg-gray-300 rounded h-6 w-1/4 animate-pulse"></div>
                    <div className="bg-gray-300 rounded h-6 w-1/4 animate-pulse"></div>
                  </div>
                </li>
                <li>
                  <div className=" flex justify-between">
                    <div className="bg-gray-300 rounded h-6 w-1/4 animate-pulse"></div>
                    <div className="bg-gray-300 rounded h-6 w-1/4 animate-pulse"></div>
                  </div>
                </li>
                <li>
                  <div className="bg-gray-300 rounded h-10 w-full animate-pulse"></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}