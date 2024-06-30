'use client'
   import { Product } from '@/lib/models/ProductModel'
   import { formatId } from '@/lib/utils'
   import Link from 'next/link'
   import { useRouter } from 'next/navigation'
   import toast from 'react-hot-toast'
   import useSWR from 'swr'
   import useSWRMutation from 'swr/mutation'

   export default function Products() {
     const { data: products, error } = useSWR(`/api/admin/products`)
     const router = useRouter()

     const { trigger: deleteProduct } = useSWRMutation(
       `/api/admin/products`,
       async (url, { arg }: { arg: { productId: string } }) => {
         const toastId = toast.loading('Deleting product...')
         const res = await fetch(`${url}/${arg.productId}`, {
           method: 'DELETE',
           headers: {
             'Content-Type': 'application/json',
           },
         })
         const data = await res.json()
         res.ok
           ? toast.success('Product deleted successfully', {
               id: toastId,
             })
           : toast.error(data.message, {
               id: toastId,
             })
       }
     )

     

     if (error) return 'An error has occurred.'
     if (!products) return 'Loading...'

     return (
       <div>
         <div className="flex justify-between items-center">
           <h1 className="py-4 text-2xl">Products</h1>
           <Link href="/admin/products/create" className="btn btn-primary">
             Create Product
          </Link>
         </div>

         <div className="overflow-x-auto">
           <table className="table table-zebra">
             <thead>
               <tr>
                 <th>id</th>
                 <th>name</th>
                 <th>price</th>
                 <th>category</th>
                 <th>count in stock</th>
                 <th>rating</th>
                 <th>actions</th>
               </tr>
             </thead>
             <tbody>
               {products.map((product: any) => (
                 <tr key={product._id}>
                  <td>{formatId(product._id ?? '')}</td>
                   <td>{product.name}</td>
                   <td>${product.price}</td>
                   <td>{product?.category?.name}</td>
                   <td>{product.countInStock}</td>
                   <td>{product.rating}</td>
                   <td>
                     <Link
                       href={`/admin/products/${product._id}`}
                       type="button"
                       className="btn btn-ghost btn-sm"
                     >
                       Edit
                     </Link>
                     &nbsp;
                    <button
                      onClick={() => deleteProduct({ productId: product?._id || '' })}
                      type="button"
                      className="btn btn-ghost btn-sm"
                    >
                      Delete
                    </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     )
   }