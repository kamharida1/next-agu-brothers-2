'use client'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/models/ProductModel'

type SettingsProps = {
  products: Product[]
}

export default function Settings({ products }: SettingsProps) {
  const [factor, setFactor] = useState<string>('')
  const [countInStock, setCountInStock] = useState<string>('')
  const [selectedProduct, setSelectedProduct] = useState<string>(
    products[0]?._id || ''
  )
  const [mode, setMode] = useState<'factor' | 'countInStock'>('factor')
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Filtered products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const saveSettings = async () => {
    setLoading(true)
    try {
      let response
      if (mode === 'factor') {
        response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: 'factor', value: factor }),
        })
      } else if (mode === 'countInStock' && selectedProduct) {
        response = await fetch(`/api/products/updateStock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: selectedProduct, countInStock }),
        })
      }

      if (response?.ok) {
        alert('Update successful')
        setFactor('')
        setCountInStock('')
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="card w-96 bg-white shadow-lg p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Settings</h1>

        {/* Mode Toggle */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Select Mode</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as 'factor' | 'countInStock')
            }
          >
            <option value="factor">Update Price Factor</option>
            <option value="countInStock">Update Count In Stock</option>
          </select>
        </div>

        {/* Render input fields based on mode */}
        {mode === 'factor' ? (
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Factor</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={factor}
              onChange={(e) => setFactor(e.target.value)}
            />
          </div>
        ) : (
          <>
            {/* Search Box */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Search Product</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Type to search product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Product Dropdown */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Select Product</span>
              </label>
              <select
                className="select select-bordered w-full"
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

            {/* Count In Stock Input */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Count In Stock</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="form-control mt-6">
          <button
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            onClick={saveSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
