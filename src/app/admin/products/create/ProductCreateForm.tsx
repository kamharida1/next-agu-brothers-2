'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import { IoIosCloseCircle } from 'react-icons/io'
import Link from 'next/link'
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/models/ProductModel'
import { useRouter } from 'next/navigation'
import { Category } from '@/lib/models/CategoryModel'
import CldImage from '@/components/CldImage'
import { ReactSortable } from 'react-sortablejs'
import slugify from 'slugify'

interface Property {
  name: string
  value: string
}

interface ProductFormProps {
  name?: string
  slug?: string
  category?: string
  cat?: string
  images?: string[]
  price?: number
  costPrice?: number
  brand?: string
  rating?: number
  numReviews?: number
  countInStock?: number
  description?: string
  isFeatured?: boolean
  properties?: Property
  banner?: string
  weight?: number
  notes?: string
}

export default function ProductCreateForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState<string>('')
  const [productProperties, setProductProperties] = useState<any>({})
  const [productImages, setProductImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { data: categoriesData } = useSWR('/api/admin/categories')

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData)
    }
  }, [categoriesData])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ProductFormProps>()

  const uploadHandler = async (e: any) => {
    e.preventDefault()
    const toastId = toast.loading('Uploading image...')
    setIsUploading(true)
    const uploadedUrls: string[] = []
    try {
      const resSign = await fetch('/api/cloudinary/cloudinary-sign', {
        method: 'POST',
      })
      const { signature, timestamp } = await resSign.json()
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()

        formData.append('file', file)
        formData.append('signature', signature)
        formData.append('timestamp', timestamp)
        //formData.append('eager', 'c_pad,h_300,w_400|c_crop,h_200,w_260')
        formData.append('folder', 'signed_upload_product_form')
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )
        const { secure_url } = await res.json()
        uploadedUrls.push(secure_url)
        toast.success('Files uploaded successfully', {
          id: toastId,
        })
      }
      console.log('productImages', productImages)
      setValue('images', productImages)
      setIsUploading(false)
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      })
    }

    setProductImages((prev) => [...prev, ...uploadedUrls])
  }

  const handleDeleteProductImage = async (index: number) => {
    console.log('image index', index)

    const newProductImages = [...productImages]
    newProductImages.splice(index, 1)

    setProductImages([...newProductImages])
  }

  const handleCategoryChange = (e: any) => {
    const value = e.target.value
    setCategory(value)
    setValue('category', value) // Synchronize the value with React Hook Form
  }

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }) => {
      const res = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)

      toast.success('Product created successfully')
      router.push('/admin/products')
    }
  )

  function updateImagesOrder(productImages: any[]) {
    setProductImages(productImages)
  }

  function setProductProp(propName: string, value: string) {
    setProductProperties((prev: any) => {
      const newProductProps = { ...prev }
      newProductProps[propName] = value
      return newProductProps
    })
    setValue('properties', productProperties)
  }

  const propertiesToFill = []
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category)
    if (catInfo) {
      propertiesToFill.push(...catInfo.properties)
      while (catInfo.parent?._id) {
        const parentCat = categories.find(
          (cat) => cat._id === catInfo?.parent?._id
        )
        if (parentCat) {
          propertiesToFill.push(...parentCat.properties)
          catInfo = parentCat
        } else {
          break
        }
      }
    }
  }

  const formSubmit: SubmitHandler<ProductFormProps> = async (formData: any) => {
    const productData: Product = {
      ...formData,
      slug: formData.name.toLowerCase().replace(/ /g, '-'),
      // slug: slugify(formData.name),
      images: productImages,
      image: productImages[0],
      properties: productProperties,
    }
    await createProduct(productData as any)
  }

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof ProductFormProps
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => (
    <div className="md:flex mb-6">
      <label className="label md:w-1/5" htmlFor={id}>
        {name}
      </label>
      {id === 'description' || id === 'notes' ? (
        <div className="md:w-4/5">
          <textarea
            id={id}
            {...register(id, {
              required: required && `${name} is required`,
              pattern,
            })}
            className="textarea h-24 input input-bordered w-full max-w-md"
          />
          {errors[id]?.message && (
            <div className="text-error">{errors[id]?.message}</div>
          )}
        </div>
      ) : (
        <div className="md:w-4/5">
          <input
            type="text"
            id={id}
            {...register(id, {
              required: required && `${name} is required`,
              pattern,
            })}
            className="input input-bordered w-full max-w-md"
          />
        </div>
      )}
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl py-4">Create Product</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name="Name" id="name" required />
          {/* <FormInput name="Slug" id="slug" required /> */}
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="category">
              Category
            </label>
            <div className="md:w-4/5">
              <select
                value={watch('category')}
                id="category"
                className="select select-bordered w-full max-w-md"
                {...register('category', { required: 'Category is required' })}
                onChange={handleCategoryChange}
              >
                <option value="">Select a category</option>
                {categories.map((category: any) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category?.message && (
                <div className="text-error">{errors.category?.message}</div>
              )}
            </div>
          </div>
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="category">
              Properties would appear here
            </label>
            <div className="md:w-2/5 border px-3 py-4 border-gray-200 rounded-lg ">
              {propertiesToFill.length > 0 &&
                propertiesToFill.map((p) => (
                  <div key={p.name} className="md:w-5/5">
                    <label
                      className="label md:w-1/5"
                      htmlFor={`properties.${p.name}`}
                    >
                      {p.name[0].toUpperCase() + p.name.substring(1)}
                    </label>
                    <div className="flex md:w-4/5">
                      <select
                        className="select select-bordered w-full max-w-md"
                        value={productProperties[p.name]}
                        onChange={(ev) =>
                          setProductProp(p.name, ev.target.value)
                        }
                      >
                        {Array.isArray(p.values) &&
                          p.values.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="md:flex mb-6">
            <span className="label md:w-1/5">Upload Image</span>
            <div className="flex flex-wrap gap-1 md:w-4/5">
              <ReactSortable
                list={productImages}
                setList={updateImagesOrder}
                className="flex flex-wrap gap-1"
              >
                {!!productImages.length &&
                  productImages.map((link: any) => (
                    <div
                      key={link}
                      className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
                    >
                      <button
                        onClick={() => handleDeleteProductImage(link)}
                        className="absolute top-0 right-0 p-1 text-white rounded-full hover:bg-red-600 focus:outline-none w-6 h-6 flex items-center justify-center"
                      >
                        <IoIosCloseCircle />
                      </button>
                      <CldImage
                        src={link}
                        alt="product image"
                        width={400}
                        height={300}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  ))}
              </ReactSortable>
              {isUploading && (
                // <div className="h-24 flex items-center">
                //   <Spinner />
                // </div>
                <span className="loading loading-spinner"></span>
              )}
              <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <div>Add image</div>
                {/* <input type="file" onChange={uploadImages} className="hidden" /> */}
                <input
                  type="file"
                  name="files[]"
                  multiple
                  className="hidden"
                  id="imageFile"
                  onChange={uploadHandler}
                />
              </label>
            </div>
          </div>
          <FormInput name="Price" id="price" required />
          <FormInput name="Cost Price" id="costPrice" required />

          <FormInput name="Brand" id="brand" required />
          <FormInput name="Notes" id="notes" />
          <FormInput name="Description" id="description" required />
          <FormInput name="Count In Stock" id="countInStock" required />
          <FormInput name="Weight(kg)" id="weight" />

          <button
            type="submit"
            disabled={isCreating}
            className="btn btn-primary"
          >
            {isCreating && <span className="loading loading-spinner"></span>}
            Create
          </button>
          <Link className="btn ml-4 " href="/admin/products">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  )
}
