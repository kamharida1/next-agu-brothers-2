export default function ShippingSkeleton() { 
   return (
     <div className="max-w-sm mx-auto card bg-base-300 my-4">
       <div className="card-body">
         <h1 className="card-title">Shipping Address</h1>
         <div className="mb-2">
           <div className="bg-gray-300 rounded h-8 w-full animate-pulse"></div>
         </div>
         <div className="mb-2">
           <div className="bg-gray-300 rounded h-8 w-full animate-pulse"></div>
         </div>
         <div className="mb-2">
           <div className="bg-gray-300 rounded h-8 w-full animate-pulse"></div>
         </div>
         <div className="mb-2">
           <div className="bg-gray-300 rounded h-8 w-full animate-pulse"></div>
         </div>
         <div className="mb-2">
           <div className="bg-gray-300 rounded h-8 w-full animate-pulse"></div>
         </div>
         <div className="my-2">
           <div className="bg-gray-300 rounded h-10 w-full animate-pulse"></div>
         </div>
       </div>
     </div>
   )
}