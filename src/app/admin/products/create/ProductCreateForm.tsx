'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { Product } from '@/lib/models/ProductModel'
import { useRouter } from 'next/navigation'
import { Category } from '@/lib/models/CategoryModel'
import CldImage from '@/components/CldImage'
import { ReactSortable } from 'react-sortablejs'
import { FiUpload, FiX, FiZap, FiCheck } from 'react-icons/fi'

interface ProductFormProps {
  name: string
  category: string
  cat: string
  price: number
  costPrice: number
  brand: string
  countInStock: number
  description: string
  weight: number
  discountPercentage?: number
  notes?: string
  isFeatured?: boolean
}

export default function ProductCreateForm() {
  const [isFeatured, setIsFeatured] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState('')
  const [productImages, setProductImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiFeatures, setAiFeatures] = useState<string[]>([])
  const dropRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { data: categoriesData } = useSWR('/api/admin/categories')

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData)
  }, [categoriesData])

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<ProductFormProps>()

  // ── AI Generation ────────────────────────────────────────────
  const handleAIGenerate = async () => {
    const name = watch('name')
    if (!name?.trim()) {
      toast.error('Enter a product name first')
      return
    }

    setIsGenerating(true)
    const toastId = toast.loading('Claude AI is generating product details…')

    try {
      const res = await fetch('/api/admin/ai-generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: name, categories }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      // Fill form fields
      if (data.description) setValue('description', data.description)
      if (data.brand)       setValue('brand', data.brand)
      if (data.weight)      setValue('weight', data.weight)
      if (data.suggestedPrice && !watch('price')) setValue('price', data.suggestedPrice)
      if (data.keyFeatures) setAiFeatures(data.keyFeatures)

      // Match category
      if (data.cat && categories.length > 0) {
        const match = categories.find(
          (c: any) => c.name?.toLowerCase() === data.cat?.toLowerCase()
        )
        if (match) {
          setCategory((match as any)._id)
          setValue('category', (match as any)._id)
          setValue('cat', match.name)
        }
      }

      toast.success('Product details generated! Review and adjust as needed.', { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'AI generation failed', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  // ── Image Upload ─────────────────────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    setIsUploading(true)
    const toastId = toast.loading(`Uploading ${fileArray.length} image${fileArray.length > 1 ? 's' : ''}…`)

    try {
      const resSign = await fetch('/api/cloudinary/cloudinary-sign', { method: 'POST' })
      const { signature, timestamp } = await resSign.json()
      const uploadedUrls: string[] = []

      for (const file of fileArray) {
        const key = file.name
        setUploadProgress((p) => ({ ...p, [key]: 0 }))

        const formData = new FormData()
        formData.append('file', file)
        formData.append('signature', signature)
        formData.append('timestamp', timestamp)
        formData.append('folder', 'signed_upload_product_form')
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: 'POST', body: formData }
        )
        const { secure_url, public_id } = await res.json()
        // Store public_id for Cloudinary transformations, fall back to full URL
        uploadedUrls.push(public_id || secure_url)
        setUploadProgress((p) => ({ ...p, [key]: 100 }))
      }

      setProductImages((prev) => [...prev, ...uploadedUrls])
      toast.success(`${fileArray.length} image${fileArray.length > 1 ? 's' : ''} uploaded!`, { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'Upload failed', { id: toastId })
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files)
  }

  // ── Submit ────────────────────────────────────────────────────
  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    '/api/admin/products',
    async (url, { arg }) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)
      toast.success('Product created!')
      router.push('/admin/products')
    }
  )

  const formSubmit: SubmitHandler<ProductFormProps> = async (formData) => {
    if (productImages.length === 0) {
      toast.error('Upload at least one product image')
      return
    }
    const selectedCat = categories.find((c: any) => c._id === formData.category)
    await createProduct({
      ...formData,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      images: productImages,
      image: productImages[0],
      cat: selectedCat?.name || formData.cat || '',
      isFeatured,
    } as any)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setCategory(val)
    setValue('category', val)
    const cat = categories.find((c: any) => c._id === val)
    if (cat) setValue('cat', cat.name)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium text-[#0F1111]">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit(formSubmit)} className="space-y-5">

        {/* ── Product Name + AI Generate ── */}
        <div className="bg-white rounded-sm shadow-sm border border-[#D5D9D9] p-5">
          <h2 className="font-bold text-sm text-[#565959] uppercase tracking-wider mb-4">
            Product Name
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Samsung 55 inch 4K Smart TV UA55T5300"
              {...register('name', { required: 'Product name is required' })}
              className="amazon-input flex-1"
            />
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={isGenerating}
              className="btn-amazon px-4 py-2 rounded-md text-sm flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              {isGenerating ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <FiZap className="w-4 h-4" />
              )}
              {isGenerating ? 'Generating…' : 'Generate with AI'}
            </button>
          </div>
          {errors.name && <p className="text-[#CC0C39] text-xs mt-1">{errors.name.message}</p>}
          <p className="text-xs text-[#565959] mt-2">
            💡 Type the full product name and click <strong>Generate with AI</strong> — Claude will fill in the description, brand, category, and suggest a price automatically.
          </p>
        </div>

        {/* ── AI Key Features (shown after generation) ── */}
        {aiFeatures.length > 0 && (
          <div className="bg-[#F0FFF0] border border-[#007600] rounded-sm p-4">
            <p className="text-xs font-bold text-[#007600] uppercase tracking-wider mb-2 flex items-center gap-1">
              <FiZap className="w-3 h-3" /> AI-Generated Key Features
            </p>
            <ul className="space-y-1">
              {aiFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#0F1111]">
                  <FiCheck className="w-3.5 h-3.5 text-[#007600] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Images ── */}
        <div className="bg-white rounded-sm shadow-sm border border-[#D5D9D9] p-5">
          <h2 className="font-bold text-sm text-[#565959] uppercase tracking-wider mb-4">
            Product Images ({productImages.length}/10)
          </h2>

          {/* Drag and drop zone */}
          <div
            ref={dropRef}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-sm p-6 text-center mb-4 transition-colors ${
              isDragging ? 'border-[#FF9900] bg-[#FFFBF2]' : 'border-[#D5D9D9] hover:border-[#AAAAAA]'
            }`}
          >
            <FiUpload className="w-8 h-8 mx-auto text-[#565959] mb-2" />
            <p className="text-sm text-[#0F1111] font-medium">Drag & drop images here</p>
            <p className="text-xs text-[#565959] mt-1">or</p>
            <div className="flex gap-2 justify-center flex-wrap mt-2">
              {/* Phone gallery / file browser */}
              <label className="btn-amazon px-4 py-2 rounded-md text-sm cursor-pointer flex items-center gap-2">
                <FiUpload className="w-4 h-4" />
                Choose from Gallery
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={isUploading}
                />
              </label>
              {/* Camera (mobile only) */}
              <label className="btn-amazon-outline px-4 py-2 rounded-md text-sm cursor-pointer flex items-center gap-2">
                📷 Take Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={isUploading}
                />
              </label>
            </div>
            <p className="text-xs text-[#565959] mt-2">
              JPG, PNG, WEBP — up to 10 images. Drag to reorder after upload.
            </p>
          </div>

          {/* Upload progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-1 mb-3">
              {Object.entries(uploadProgress).map(([name, pct]) => (
                <div key={name} className="flex items-center gap-2 text-xs text-[#565959]">
                  <div className="flex-1 bg-[#D5D9D9] rounded-full h-1.5">
                    <div
                      className="bg-[#FF9900] h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="truncate max-w-[120px]">{name}</span>
                  {pct === 100 && <FiCheck className="w-3 h-3 text-[#007600]" />}
                </div>
              ))}
            </div>
          )}

          {/* Image previews — drag to reorder */}
          {productImages.length > 0 && (
            <ReactSortable
              list={productImages.map((id) => ({ id }))}
              setList={(newList) => setProductImages(newList.map((i) => i.id as string))}
              className="flex flex-wrap gap-2"
            >
              {productImages.map((src, idx) => (
                <div key={src} className="relative w-24 h-24 border border-[#D5D9D9] rounded-sm overflow-hidden cursor-grab bg-white">
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
                  <button
                    type="button"
                    onClick={() => setProductImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#CC0C39] text-white rounded-full flex items-center justify-center z-10 hover:bg-red-700"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </ReactSortable>
          )}
          {productImages.length > 1 && (
            <p className="text-xs text-[#565959] mt-2">Drag images to reorder. First image is the main photo.</p>
          )}
        </div>

        {/* ── Details ── */}
        <div className="bg-white rounded-sm shadow-sm border border-[#D5D9D9] p-5 space-y-4">
          <h2 className="font-bold text-sm text-[#565959] uppercase tracking-wider">Product Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Brand</label>
              <input {...register('brand', { required: 'Brand is required' })}
                className="amazon-input" placeholder="e.g. Samsung, LG, Nexus" />
              {errors.brand && <p className="text-[#CC0C39] text-xs mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Category</label>
              <select
                value={category}
                {...register('category', { required: 'Category is required' })}
                onChange={handleCategoryChange}
                className="amazon-input"
              >
                <option value="">Select category</option>
                {categories.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-[#CC0C39] text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="amazon-input resize-none"
              placeholder="Describe the product — features, specs, benefits…"
            />
            {errors.description && <p className="text-[#CC0C39] text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Selling Price (₦)</label>
              <input type="number" {...register('price', { required: 'Price is required', valueAsNumber: true })}
                className="amazon-input" placeholder="0" />
              {errors.price && <p className="text-[#CC0C39] text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Cost Price (₦)</label>
              <input type="number" {...register('costPrice', { required: 'Cost price is required', valueAsNumber: true })}
                className="amazon-input" placeholder="0" />
              {errors.costPrice && <p className="text-[#CC0C39] text-xs mt-1">{errors.costPrice.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Discount %</label>
              <input type="number" {...register('discountPercentage', { valueAsNumber: true })}
                className="amazon-input" placeholder="0" min="0" max="100" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Stock Count</label>
              <input type="number" {...register('countInStock', { required: 'Stock is required', valueAsNumber: true })}
                className="amazon-input" placeholder="0" />
              {errors.countInStock && <p className="text-[#CC0C39] text-xs mt-1">{errors.countInStock.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0F1111] mb-1">Weight (kg)</label>
              <input type="number" step="0.1" {...register('weight', { valueAsNumber: true })}
                className="amazon-input" placeholder="e.g. 12.5" />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#FF9900]" />
                <span className="text-sm font-medium text-[#0F1111]">Featured product</span>
              </label>
              <p className="text-xs text-[#565959] mt-1">Shows on homepage</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F1111] mb-1">Internal Notes (optional)</label>
            <input {...register('notes')} className="amazon-input"
              placeholder="e.g. Supplier name, warranty info, purchase date…" />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 pb-8">
          <button type="submit" disabled={isCreating || isUploading}
            className="btn-amazon px-8 py-3 rounded-md text-sm flex items-center gap-2">
            {isCreating && <span className="loading loading-spinner loading-xs" />}
            Create Product
          </button>
          <Link href="/admin/products" className="btn-amazon-outline px-8 py-3 rounded-md text-sm">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
