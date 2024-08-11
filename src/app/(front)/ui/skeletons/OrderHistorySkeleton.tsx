export default function OrderHistorySkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="overflow-x-auto">
        <table className="table table-compact w-full table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <div className="bg-gray-300 rounded animate-pulse h-4 w-12"></div>
                </td>
                <td>
                  <div className="bg-gray-300 rounded animate-pulse h-4 w-20"></div>
                </td>
                <td>
                  <div className="bg-gray-300 rounded animate-pulse h-4 w-16"></div>
                </td>
                <td>
                  <div className="bg-gray-300 rounded animate-pulse h-4 w-20"></div>
                </td>
                <td>
                  <div className="bg-gray-300 rounded animate-pulse h-4 w-24"></div>
                </td>
                <td>
                  <div className="bg-gray-300 rounded animate-pulse h-8 w-24"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}