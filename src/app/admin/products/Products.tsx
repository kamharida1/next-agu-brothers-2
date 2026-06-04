'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Price from '@/components/products/Price'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiStar,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi'
import {
  AdminAlert,
  AdminBadge,
  AdminBtnPrimary,
  AdminLinkAction,
  AdminLoading,
  AdminSearch,
  AdminStatCard,
  AdminStatGrid,
  AdminTable,
  AdminTableFoot,
  AdminToolbar,
} from '@/components/admin/AdminUI'
import { cloudinaryImageUrl } from '@/lib/cloudinaryImage'

export default function Products() {
  const router = useRouter()
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

  if (error) return <AdminAlert>Failed to load products: {error.message}</AdminAlert>
  if (!products) return <AdminLoading />

  const filteredProducts = debouncedSearchTerm
    ? products.filter(
        (p: { name?: string; category?: { name?: string } }) =>
          p.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          p.category?.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : products

  return (
    <div className="space-y-5">
      <AdminStatGrid>
        <AdminStatCard
          label="Total products"
          value={products.length}
          icon={<FiPackage className="w-4 h-4" />}
        />
        <AdminStatCard
          label="In stock"
          value={products.filter((p: { countInStock: number }) => p.countInStock > 0).length}
          icon={<FiCheckCircle className="w-4 h-4" />}
          accent="success"
        />
        <AdminStatCard
          label="Out of stock"
          value={products.filter((p: { countInStock: number }) => p.countInStock === 0).length}
          icon={<FiXCircle className="w-4 h-4" />}
          accent="danger"
        />
      </AdminStatGrid>

      <AdminToolbar>
        <div className="relative flex-1 flex items-center gap-2">
          <FiSearch className="w-4 h-4 text-[#565959] shrink-0" />
          <AdminSearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or category…"
          />
        </div>
        <AdminBtnPrimary href="/admin/products/create">
          <FiPlus className="w-4 h-4" />
          Add product
        </AdminBtnPrimary>
      </AdminToolbar>

      <AdminTable>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Featured</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-12 text-[#565959]">
                No products found
              </td>
            </tr>
          ) : (
            filteredProducts.map((product: {
              _id: string
              slug: string
              name: string
              brand?: string
              images?: string[]
              price: number
              discountPercentage?: number
              category?: { name?: string }
              countInStock: number
              isFeatured?: boolean
              rating?: number
            }) => {
              const editHref = `/admin/products/${product._id}`
              return (
              <tr
                key={product._id}
                className="cursor-pointer"
                onClick={() => router.push(editHref)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    router.push(editHref)
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`Edit ${product.name}`}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm border border-[#D5D9D9] overflow-hidden bg-white flex-shrink-0">
                      {product.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cloudinaryImageUrl(product.images[0], { w: 80, h: 80 })}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#0F1111] truncate max-w-[200px] hover:text-[#007185]">
                        {product.name}
                      </p>
                      {product.brand && (
                        <p className="text-xs text-[#565959]">{product.brand}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <Price amount={product.price} size="sm" />
                  {(product.discountPercentage ?? 0) > 0 && (
                    <p className="text-xs text-[#007600]">{product.discountPercentage}% off</p>
                  )}
                </td>
                <td>
                  <AdminBadge>{product?.category?.name || 'N/A'}</AdminBadge>
                </td>
                <td>
                  <AdminBadge variant={product.countInStock > 0 ? 'success' : 'error'}>
                    {product.countInStock > 0 ? `${product.countInStock} left` : 'Out'}
                  </AdminBadge>
                </td>
                <td>
                  {product.isFeatured ? (
                    <AdminBadge variant="featured">Featured</AdminBadge>
                  ) : (
                    <span className="text-[#565959]">—</span>
                  )}
                </td>
                <td>
                  <span className="inline-flex items-center gap-1 text-[#0F1111]">
                    <FiStar className="w-3.5 h-3.5 text-[#FF9900] fill-[#FF9900]" />
                    {product.rating?.toFixed(1) || '0.0'}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <AdminLinkAction href={editHref}>
                      <FiEdit2 className="w-3.5 h-3.5" /> Edit
                    </AdminLinkAction>
                    {product.slug && (
                      <a
                        href={`/product/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn-link inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiExternalLink className="w-3.5 h-3.5" /> View
                      </a>
                    )}
                    <AdminLinkAction
                      danger
                      onClick={() => handleDelete(product._id, product.name)}
                    >
                      <FiTrash2 className="w-3.5 h-3.5" /> Delete
                    </AdminLinkAction>
                  </div>
                </td>
              </tr>
            )})
          )}
        </tbody>
      </AdminTable>
      {filteredProducts.length > 0 && (
        <AdminTableFoot>
          Showing {filteredProducts.length} of {products.length} products
        </AdminTableFoot>
      )}
    </div>
  )
}
