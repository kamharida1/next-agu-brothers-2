export default function PaymentSkeleton() {
  return (
    <div>
      <div className="max-w-sm mx-auto card bg-base-300 my-4">
        <div className="card-body">
          <h1 className="card-title">Payment Method</h1>
          <div className="mb-4">
            <div className="bg-gray-300 rounded h-6 w-full animate-pulse mb-2"></div>
            <div className="bg-gray-300 rounded h-6 w-full animate-pulse mb-2"></div>
            <div className="bg-gray-300 rounded h-6 w-full animate-pulse mb-2"></div>
          </div>
          <div className="my-2">
            <div className="bg-gray-300 rounded h-10 w-full animate-pulse"></div>
          </div>
          <div className="my-2">
            <div className="bg-gray-300 rounded h-10 w-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}