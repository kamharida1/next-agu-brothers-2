'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Product } from '@/lib/models/ProductModel'
import { useRouter } from 'next/navigation'

type SettingsProps = {
  products: Product[]
}

export default function Settings({ products }: SettingsProps) {
  const brands = [...new Set(products.map((product) => product.brand))]

  const [factor, setFactor] = useState<string>('')
  const [featured, setFeatured] = useState<boolean>()
  const [selectedBrand, setSelectedBrand] = useState<string>(brands[0])
  const [selectedProduct, setSelectedProduct] = useState<string>(
    products[0]?._id || ''
  )
  const [mode, setMode] = useState<'factor' | 'featured'>('factor')
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const router = useRouter()

  // Update `featured` state based on the selected product's current status
  useEffect(() => {
    const selectedProductData = products.find(
      (product) => product._id === selectedProduct
    )
    if (selectedProductData) {
      setFeatured(selectedProductData.isFeatured)
    }
  }, [selectedProduct, products])

  // Filtered products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const saveSettings = async () => {
    setLoading(true)
    try {
      let response
      if (mode === 'factor') {
        response = await fetch('/api/admin/settings/updatePriceByFactor', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ brand: selectedBrand, factor }),
        })
      } else if (mode === 'featured' && selectedProduct) {
        response = await fetch(`/api/admin/settings/updateFeatured`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: selectedProduct, featured }),
        })
      }

      if (response?.ok) {
        toast.success('Updated successfully')
        router.push('/admin/products')
        setFactor('')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to save settings', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="admin-panel p-6 space-y-5">
        <p className="text-sm text-[#565959]">Bulk pricing and featured product tools</p>

        <div>
          <label className="block text-sm font-medium text-[#0F1111] mb-1.5">Action</label>
          <select
            className="admin-select w-full"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'factor' | 'featured')}
          >
            <option value="factor">Update price factor by brand</option>
            <option value="featured">Set featured product</option>
          </select>
        </div>

        {/* Render input fields based on mode */}
        {mode === 'factor' ? (
          <>
            {/* Select Brand */}
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1.5">Brand</label>
              <select
                className="admin-select w-full"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            {/* Factor Input */}
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1.5">Factor</label>
              <input
                type="number"
                className="amazon-input"
                value={factor}
                onChange={(e) => setFactor(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            {/* Search Box */}
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1.5">Search product</label>
              <input
                type="text"
                className="amazon-input"
                placeholder="Type to search product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Product Dropdown */}
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1.5">Product</label>
              <select
                className="admin-select w-full"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {filteredProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
                {filteredProducts.length === 0 && (
                  <option disabled>No products found</option>
                )}
              </select>
            </div>

            {/* Featured Input */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm border-[#D5D9D9]"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
              />
              <span className="text-sm text-[#0F1111]">Mark as featured product</span>
            </label>
          </>
        )}

        <button
          type="button"
          className={`btn-amazon w-full py-2.5 rounded-md text-sm ${loading ? 'opacity-60' : ''}`}
          onClick={saveSettings}
          disabled={loading}
        >
          {loading ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </div>
  )
}
