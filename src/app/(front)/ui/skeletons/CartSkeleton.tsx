export default function CartSkeleton() {
   return (
     <>
       <h1 className="py-4 text-2xl">Shopping Cart</h1>
       <div className="grid md:grid-cols-4 md:gap-5">
         <div className="overflow-x-auto md:col-span-3">
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
                       <span className="px-2 font-medium text-md bg-gray-300 rounded w-24 h-4 animate-pulse ml-2"></span>
                     </div>
                   </td>
                   <td className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                     <button
                       type="button"
                       className="btn btn-sm sm:btn-md bg-gray-300 rounded w-8 h-8 animate-pulse"
                     >
                       -
                     </button>
                     <span className="px-2 bg-gray-300 rounded w-8 h-4 animate-pulse"></span>
                     <button
                       type="button"
                       className="btn btn-sm sm:btn-md bg-gray-300 rounded w-8 h-8 animate-pulse"
                     >
                       +
                     </button>
                   </td>
                   <td>
                     <span className="bg-gray-300 rounded w-16 h-4 animate-pulse"></span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         <div>
           <div className="card bg-base-300">
             <div className="card-body">
               <ul>
                 <li>
                   <div className="pb-3 text-xl bg-gray-300 rounded w-48 h-6 animate-pulse"></div>
                 </li>
                 <li>
                   <button className="btn btn-primary w-full bg-gray-300 rounded h-10 animate-pulse"></button>
                 </li>
               </ul>
             </div>
           </div>
         </div>
       </div>
     </>
   )
 }