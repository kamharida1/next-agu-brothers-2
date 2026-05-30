'use client'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiAlertCircle,
  FiStar, FiPackage, FiCheckCircle, FiXCircle
} from 'react-icons/fi'

export default function Products() {
  const { data: products, error, mutate } = useSWR('/api/admin/products')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const { trigger: deleteProduct } = useSWRMutation(
    '/api/admin/products',
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...')
      const res = await fetch(`${url}/${arg.productId}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        toast.success('Product deleted', { id: toastId })
        mutate()
      } else {
        toast.error(data.message, { id: toastId })
      }
    }
  )

  const handleDelete = (productId: string, productName: string) => {
    if (confirm(`Delete "${productName}"? This cannot be undone.`)) {
      deleteProduct({ productId })
    }
  }

  if (error) return (
    <div className="alert alert-error">
      <FiAlertCircle className="w-5 h-5" />
      <span>Failed to load products: {error.message}</span>
    </div>
  )

  if (!products) return (
    <div className="flex items-center justify-center py-16">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )

  const filteredProducts = debouncedSearchTerm
    ? products.filter((p: any) =>
        p.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : products

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-base-content/60">
              <FiPackage className="w-4 h-4" />
              <span className="text-xs font-medium">Total Products</span>
            </div>
            <p className="text-2xl font-bold mt-1">{products.length}</p>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-success">
              <FiCheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium">In Stock</span>
            </div>
            <p className="text-2xl font-bold mt-1">{products.filter((p: any) => p.countInStock > 0).length}</p>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 text-error">
              <FiXCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Out of Stock</span>
            </div>
            <p className="text-2xl font-bold mt-1">{products.filter((p: any) => p.countInStock === 0).length}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            className="input input-bordered w-full pl-9 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/admin/products/create" className="btn btn-primary gap-2 whitespace-nowrap">
          <FiPlus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="text-xs uppercase tracking-wider">Product</th>
                <th className="text-xs uppercase tracking-wider">Price</th>
                <th className="text-xs uppercase tracking-wider">Category</th>
                <th className="text-xs uppercase tracking-wider">Stock</th>
                <th className="text-xs uppercase tracking-wider">Featured</th>
                <th className="text-xs uppercase tracking-wider">Rating</th>
                <th className="text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-base-content/50">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: any) => (
                  <tr key={product._id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-base-200 overflow-hidden flex-shrink-0">
                          {product.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_40,h_40,c_fill/${product.images[0]}`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm max-w-[200px] truncate">{product.name}</p>
                          {product.brand && (
                            <p className="text-xs text-base-content/50">{product.brand}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-sm">{formatPrice(product.price)}</p>
                        {product.discountPercentage > 0 && (
                          <p className="text-xs text-success">{product.discountPercentage}% off</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm">{product?.category?.name || 'N/A'}</span>
                    </td>
                    <td>
                      <span className={`badge badge-sm ${product.countInStock > 0 ? 'badge-success' : 'badge-error'}`}>
                        {product.countInStock > 0 ? `${product.countInStock} left` : 'Out'}
                      </span>
                    </td>
                    <td>
                      {product.isFeatured ? (
                        <span className="badge badge-primary badge-sm">Featured</span>
                      ) : (
                        <span className="text-base-content/30 text-xs">—</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <FiStar className="w-3 h-3 text-warning" />
                        <span className="text-sm">{product.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="btn btn-ghost btn-xs gap-1"
                        >
                          <FiEdit2 className="w-3 h-3" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="btn btn-ghost btn-xs text-error gap-1"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredProducts.length > 0 && (
          <div className="px-4 py-3 border-t border-base-200 text-sm text-base-content/50">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>
    </div>
  )
}
