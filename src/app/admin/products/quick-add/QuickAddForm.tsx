'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiZap, FiCheck, FiX, FiTrash2 } from 'react-icons/fi'
import CldImage from '@/components/CldImage'
import CategoryPicker from '@/components/admin/CategoryPicker'
import { Category } from '@/lib/models/CategoryModel'

const MIN_PRODUCT_IMAGES = 2

type ProductDraft = {
  name: string
  slug: string
  costPrice: number
  price: number
  brand: string
  description: string
  weight: number
  category: string
  cat: string
  countInStock: number
  images: string[]
  image: string
  keyFeatures: string[]
}

export default function QuickAddForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [price, setPrice] = useState('')
  const [countInStock, setCountInStock] = useState('0')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [draft, setDraft] = useState<ProductDraft | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const { data: categoriesData } = useSWR('/api/admin/categories')

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData)
  }, [categoriesData])

  const handleGenerate = async () => {
    if (!name.trim()) {
      toast.error('Enter a product name')
      return
    }
    const cost = Number(costPrice)
    const sell = Number(price)
    if (!cost || cost <= 0) {
      toast.error('Enter a valid cost price')
      return
    }
    if (!sell || sell <= 0) {
      toast.error('Enter a valid selling price')
      return
    }

    setIsGenerating(true)
    setDraft(null)
    const toastId = toast.loading('Searching for images and generating details…')

    try {
      const res = await fetch('/api/admin/ai-quick-create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          costPrice: cost,
          price: sell,
          countInStock: Number(countInStock) || 0,
        }),
      })
      const data = await res.json()

      if (data.status === 'rejected') {
        toast.error(data.reason, { id: toastId, duration: 6000 })
        return
      }

      if (!res.ok) throw new Error(data.message)

      setDraft(data.draft)
      toast.success('Product draft ready — review and create or discard.', { id: toastId })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Generation failed'
      toast.error(message, { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDiscard = () => {
    setDraft(null)
    toast('Draft discarded')
  }

  const handleCreate = async () => {
    if (!draft) return
    if (!draft.category) {
      toast.error('Select a category before creating')
      return
    }
    if (draft.images.length < MIN_PRODUCT_IMAGES) {
      toast.error(`At least ${MIN_PRODUCT_IMAGES} clear product images are required`)
      return
    }

    setIsCreating(true)
    const toastId = toast.loading('Creating product…')

    try {
      const res = await fetch('/api/admin/ai-quick-create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ create: true, draft }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success('Product created!', { id: toastId })
      router.push('/admin/products')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Create failed'
      toast.error(message, { id: toastId })
    } finally {
      setIsCreating(false)
    }
  }

  const updateDraft = (patch: Partial<ProductDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-[#0F1111]">Quick Add Product</h1>
        <p className="text-sm text-[#565959] mt-1">
          Enter the product name and your prices — AI fills category, description, brand, and
          finds at least 2 clear product images online. Fewer than 2? The listing is discarded.
        </p>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-[#D5D9D9] p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0F1111] mb-1">Product name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Samsung 55 inch 4K Smart TV UA55T5300"
            className="amazon-input"
            disabled={isGenerating}
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Cost price (₦)</label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="350000"
              className="amazon-input"
              disabled={isGenerating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Selling price (₦)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="450000"
              className="amazon-input"
              disabled={isGenerating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Stock</label>
            <input
              type="number"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              placeholder="0"
              className="amazon-input"
              disabled={isGenerating}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-amazon px-6 py-2.5 rounded-md text-sm flex items-center gap-2"
        >
          {isGenerating ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <FiZap className="w-4 h-4" />
          )}
          {isGenerating ? 'Working…' : 'Find images & fill details'}
        </button>
      </div>

      {draft && (
        <div className="mt-6 bg-white rounded-sm shadow-sm border border-[#007600] p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#007600] uppercase tracking-wider flex items-center gap-2">
              <FiCheck className="w-4 h-4" /> Draft ready for review
            </h2>
            <button
              type="button"
              onClick={handleDiscard}
              className="text-sm text-[#CC0C39] flex items-center gap-1 hover:underline"
            >
              <FiTrash2 className="w-3.5 h-3.5" /> Discard
            </button>
          </div>

          <p className="text-xs text-[#565959]">
            {draft.images.length} image{draft.images.length !== 1 ? 's' : ''} selected
            {draft.images.length < MIN_PRODUCT_IMAGES &&
              ` — need at least ${MIN_PRODUCT_IMAGES} to create`}
          </p>

          <div className="flex flex-wrap gap-2">
            {draft.images.map((src, idx) => (
              <div
                key={src}
                className="relative w-24 h-24 border border-[#D5D9D9] rounded-sm overflow-hidden bg-white"
              >
                {idx === 0 && (
                  <span className="absolute top-0 left-0 bg-[#FF9900] text-white text-[9px] font-bold px-1.5 py-0.5 z-10">
                    MAIN
                  </span>
                )}
                <CldImage
                  src={src}
                  alt={`Product image ${idx + 1}`}
                  width={96}
                  height={96}
                  className="object-contain w-full h-full p-1"
                />
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Brand</label>
              <input
                value={draft.brand}
                onChange={(e) => updateDraft({ brand: e.target.value })}
                className="amazon-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Category</label>
              <CategoryPicker
                value={draft.category}
                onChange={(categoryId, categoryName) =>
                  updateDraft({ category: categoryId, cat: categoryName })
                }
                onCategoryCreated={(created) =>
                  setCategories((prev) => {
                    const id = String(created._id)
                    if (prev.some((c) => String(c._id) === id)) return prev
                    return [...prev, created]
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => updateDraft({ description: e.target.value })}
              rows={4}
              className="amazon-input resize-none"
            />
          </div>

          {draft.keyFeatures?.length > 0 && (
            <ul className="space-y-1 text-sm text-[#0F1111]">
              {draft.keyFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <FiCheck className="w-3.5 h-3.5 text-[#007600] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              className="btn-amazon px-8 py-3 rounded-md text-sm flex items-center gap-2"
            >
              {isCreating && <span className="loading loading-spinner loading-xs" />}
              Create product
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="btn-amazon-outline px-8 py-3 rounded-md text-sm flex items-center gap-2"
            >
              <FiX className="w-4 h-4" /> Discard
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link href="/admin/products/create" className="text-sm text-[#007185] hover:underline">
          Prefer manual entry? Use the full product form →
        </Link>
      </div>
    </div>
  )
}
