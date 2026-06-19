'use client'

import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { Product } from '@/lib/models/ProductModel'
import { useRouter } from 'next/navigation'
import { Category } from '@/lib/models/CategoryModel'
import { ReactSortable } from 'react-sortablejs'
import slugify from 'slugify'
import {
  cloudinaryImageUrl,
  normalizeImageList,
  toCloudinaryPublicId,
} from '@/lib/cloudinaryImage'
import { FiUpload, FiX } from 'react-icons/fi'
import CategoryPicker from '@/components/admin/CategoryPicker'

interface ProductFormValues {
  name: string
  slug: string
  category: string
  cat: string
  price: number
  costPrice: number
  brand: string
  countInStock: number
  description: string
  isFeatured: boolean
  weight?: number
  notes?: string
  discountPercentage?: number
}

function categoryId(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null && '_id' in value) {
    return String((value as { _id: unknown })._id)
  }
  return String(value)
}

export default function ProductEditForm({ productId }: { productId: string }) {
  const router = useRouter()
  const hydratedRef = useRef(false)

  const {
    data: productData,
    error: productError,
    isLoading,
  } = useSWR(`/api/admin/products/${productId}`)

  const { data: categoriesData } = useSWR('/api/admin/categories')
  const { data: existingBrands } = useSWR<string[]>('/api/products/brands')

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryIdState, setCategoryIdState] = useState('')
  const [productProperties, setProductProperties] = useState<Record<string, string>>({})
  const [isFeatured, setIsFeatured] = useState(false)
  const [productImages, setProductImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>()

  useEffect(() => {
    if (categoriesData) setCategories(categoriesData)
  }, [categoriesData])

  // Hydrate form once per product — avoids SWR revalidation wiping user input
  useEffect(() => {
    if (!productData || hydratedRef.current) return
    hydratedRef.current = true

    const catId = categoryId(productData.category)

    reset({
      name: productData.name ?? '',
      slug: productData.slug ?? '',
      category: catId,
      cat: productData.cat ?? '',
      discountPercentage: productData.discountPercentage ?? 0,
      price: productData.price ?? 0,
      costPrice: productData.costPrice ?? 0,
      brand: productData.brand ?? '',
      description: productData.description ?? '',
      isFeatured: Boolean(productData.isFeatured),
      weight: productData.weight ?? 0,
      countInStock: productData.countInStock ?? 0,
      notes: productData.notes ?? '',
    })

    setCategoryIdState(catId)
    setIsFeatured(Boolean(productData.isFeatured))
    setProductProperties(productData.properties || {})
    const rawImages =
      Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : productData.image
          ? [productData.image]
          : []
    setProductImages(normalizeImageList(rawImages))
  }, [productData, reset])

  useEffect(() => {
    hydratedRef.current = false
  }, [productId])

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    if (!fileArray.length) return

    setIsUploading(true)
    const toastId = toast.loading(
      `Uploading ${fileArray.length} image${fileArray.length > 1 ? 's' : ''}…`
    )
    const uploadedIds: string[] = []

    try {
      const resSign = await fetch('/api/cloudinary/cloudinary-sign', { method: 'POST' })
      if (!resSign.ok) throw new Error('Could not get upload signature')
      const { signature, timestamp } = await resSign.json()

      for (const file of fileArray) {
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
        const data = await res.json()
        if (!res.ok) throw new Error(data.error?.message || 'Upload failed')

        const ref = data.public_id || toCloudinaryPublicId(data.secure_url)
        if (ref) uploadedIds.push(ref)
      }

      setProductImages((prev) => [...prev, ...uploadedIds])
      toast.success(`${uploadedIds.length} image(s) uploaded`, { id: toastId })
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }

  const handleCategoryPickerChange = (categoryId: string, categoryName: string) => {
    setCategoryIdState(categoryId)
    setValue('category', categoryId, { shouldValidate: true })
    if (categoryName) setValue('cat', categoryName)
  }

  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/products/${productId}`,
    async (url, { arg }: { arg: Record<string, unknown> }) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || 'Update failed')
        throw new Error(data.message)
      }
      toast.success('Product updated successfully')
      router.push('/admin/products')
      return data
    }
  )

  const setProductProp = (propName: string, value: string) => {
    setProductProperties((prev) => ({ ...prev, [propName]: value }))
  }

  const propertiesToFill: { name: string; values: string[] }[] = []
  if (categories.length > 0 && categoryIdState) {
    let catInfo = categories.find(({ _id }) => String(_id) === categoryIdState)
    if (catInfo) {
      propertiesToFill.push(...(catInfo.properties || []))
      while (catInfo?.parent?._id) {
        const parentCat = categories.find((cat) => String(cat._id) === String(catInfo?.parent?._id))
        if (parentCat) {
          propertiesToFill.push(...(parentCat.properties || []))
          catInfo = parentCat
        } else break
      }
    }
  }

  const formSubmit: SubmitHandler<ProductFormValues> = async (formData) => {
    if (!productImages.length) {
      toast.error('Add at least one product image')
      return
    }

    const payload = {
      ...formData,
      slug: slugify(formData.slug || formData.name, { lower: true, strict: true }),
      images: normalizeImageList(productImages),
      image: normalizeImageList(productImages)[0],
      properties: productProperties,
      isFeatured,
      price: Number(formData.price),
      costPrice: Number(formData.costPrice),
      countInStock: Number(formData.countInStock),
      weight: Number(formData.weight) || 0,
      discountPercentage: Number(formData.discountPercentage) || 0,
    }

    await updateProduct(payload)
  }

  const FormInput = ({
    id,
    name,
    required,
    type = 'text',
    datalistId,
  }: {
    id: keyof ProductFormValues
    name: string
    required?: boolean
    type?: 'text' | 'number'
    datalistId?: string
  }) => (
    <div className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-4 items-start mb-4">
      <label className="text-sm font-medium text-[#0F1111] pt-2" htmlFor={id}>
        {name}
      </label>
      {id === 'description' || id === 'notes' ? (
        <div>
          <textarea
            id={id}
            {...register(id, { required: required && `${name} is required` })}
            className="admin-textarea max-w-xl"
          />
          {errors[id]?.message && (
            <p className="text-xs text-[#B12704] mt-1">{errors[id]?.message}</p>
          )}
        </div>
      ) : (
        <div>
          <input
            type={type}
            id={id}
            step={type === 'number' ? 'any' : undefined}
            {...register(id, {
              required: required && `${name} is required`,
              valueAsNumber: type === 'number',
            })}
            list={datalistId}
            autoComplete={datalistId ? 'off' : undefined}
            className="amazon-input max-w-xl"
          />
          {errors[id]?.message && (
            <p className="text-xs text-[#B12704] mt-1">{errors[id]?.message}</p>
          )}
        </div>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    )
  }

  if (productError || !productData) {
    return (
      <div className="admin-panel p-4 text-sm text-[#B12704] bg-[#FFF4F4] flex flex-wrap items-center gap-3">
        <span>
          {productError
            ? 'Failed to load product. Check you are signed in as admin.'
            : 'Product not found.'}
        </span>
        <Link href="/admin/products" className="btn-amazon-outline px-4 py-1.5 rounded-md text-sm">
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-5">
      <form onSubmit={handleSubmit(formSubmit)} className="admin-panel p-5 sm:p-6 space-y-2">
        <FormInput name="Name" id="name" required />
        <FormInput name="Slug" id="slug" required />

        <div className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-4 items-start mb-4">
          <label className="text-sm font-medium text-[#0F1111] pt-2" htmlFor="category">
            Category
          </label>
          <div className="max-w-xl">
            <CategoryPicker
              id="category"
              value={categoryIdState}
              onChange={handleCategoryPickerChange}
              onCategoryCreated={(created) =>
                setCategories((prev) => {
                  const id = String(created._id)
                  if (prev.some((c) => String(c._id) === id)) return prev
                  return [...prev, created]
                })
              }
              selectClassName="admin-select w-full"
              error={errors.category?.message}
            />
            <input type="hidden" {...register('category', { required: 'Category is required' })} />
          </div>
        </div>

        {propertiesToFill.length > 0 && (
          <div className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-4 items-start mb-4">
            <label className="text-sm font-medium text-[#0F1111] pt-2">Properties</label>
            <div className="border border-[#D5D9D9] rounded-sm px-3 py-4 bg-[#F7F8F8] space-y-3 max-w-xl">
              {propertiesToFill.map((p) => (
                <div key={p.name}>
                  <label className="text-sm font-medium text-[#0F1111]" htmlFor={`prop-${p.name}`}>
                    {p.name[0].toUpperCase() + p.name.substring(1)}
                  </label>
                  <select
                    id={`prop-${p.name}`}
                    className="admin-select w-full"
                    value={productProperties[p.name] ?? ''}
                    onChange={(ev) => setProductProp(p.name, ev.target.value)}
                  >
                    <option value="">Select…</option>
                    {Array.isArray(p.values) &&
                      p.values.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-[140px_1fr] gap-2 sm:gap-4 items-start mb-4 border-t border-[#EAEDED] pt-6">
          <span className="text-sm font-medium text-[#0F1111] pt-2">Images</span>
          <div className="space-y-3">
            <p className="text-xs text-[#565959]">
              Drag to reorder. First image is the main product photo ({productImages.length}/10).
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors ${
                isDragging
                  ? 'border-[#FF9900] bg-[#FFFBF2]'
                  : 'border-[#D5D9D9] bg-[#F7F8F8] hover:border-[#AAAAAA]'
              }`}
            >
              <FiUpload className="w-7 h-7 mx-auto text-[#565959] mb-2" />
              <p className="text-sm text-[#0F1111] font-medium">Drag & drop to add images</p>
              <label className="btn-amazon inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-md text-sm cursor-pointer">
                <FiUpload className="w-4 h-4" />
                Choose files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={isUploading}
                />
              </label>
              {isUploading && (
                <p className="text-xs text-[#565959] mt-2 flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Uploading…
                </p>
              )}
            </div>

            {productImages.length > 0 && (
              <ReactSortable
                list={productImages.map((id) => ({ id }))}
                setList={(newList) =>
                  setProductImages(newList.map((item) => item.id as string))
                }
                className="flex flex-wrap gap-2"
                animation={150}
                delay={120}
                delayOnTouchOnly
                filter=".no-drag"
                preventOnFilter={false}
              >
                {productImages.map((src, idx) => (
                  <div
                    key={src}
                    className="relative w-28 h-28 border border-[#D5D9D9] rounded-sm overflow-hidden cursor-grab bg-white active:cursor-grabbing"
                  >
                    {idx === 0 && (
                      <span className="absolute top-0 left-0 bg-[#FF9900] text-[#0F1111] text-[9px] font-bold px-1.5 py-0.5 z-10">
                        MAIN
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cloudinaryImageUrl(src, { w: 224, h: 224 })}
                      alt={`Product image ${idx + 1}`}
                      className="object-contain w-full h-full p-1 pointer-events-none"
                      draggable={false}
                    />
                    <button
                      type="button"
                      className="no-drag absolute top-1 right-1 z-20 w-6 h-6 bg-[#CC0C39] text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow-sm"
                      aria-label={`Remove image ${idx + 1}`}
                      onClick={() =>
                        setProductImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </ReactSortable>
            )}
          </div>
        </div>

        <FormInput name="Price" id="price" required type="number" />
        <FormInput name="Cost Price" id="costPrice" required type="number" />
        <FormInput name="Weight (kg)" id="weight" type="number" />
        <FormInput name="Discount %" id="discountPercentage" type="number" />
        <FormInput name="Brand" id="brand" required datalistId="brand-suggestions-edit" />
        <datalist id="brand-suggestions-edit">
          {existingBrands?.map((b) => (
            <option key={b} value={b} />
          ))}
        </datalist>
        <FormInput name="Description" id="description" required />
        <FormInput name="Count In Stock" id="countInStock" required type="number" />
        <FormInput name="Notes" id="notes" />

        <div className="flex items-center gap-3 pt-4 border-t border-[#EAEDED]">
          <input
            type="checkbox"
            id="featured"
            className="checkbox checkbox-sm border-[#D5D9D9]"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <label htmlFor="featured" className="text-sm text-[#0F1111]">
            Featured product
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <button type="submit" disabled={isUpdating} className="btn-amazon px-8 py-2.5 rounded-md text-sm">
            {isUpdating && <span className="loading loading-spinner loading-sm" />}
            Save changes
          </button>
          <Link className="btn-amazon-outline px-8 py-2.5 rounded-md text-sm inline-flex items-center" href="/admin/products">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
