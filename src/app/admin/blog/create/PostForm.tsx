'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useFormState } from 'react-dom'
import toast from 'react-hot-toast'

// Define the shape of the form errors
interface FormErrors {
  title?: string[]
  content?: string[]
  image?: string[]
}

// Define the shape of the form state
interface FormState {
  errors: FormErrors
}

// Define the props that the PostForm component expects
interface PostFormProps {
  formAction: any // The action to perform when the form is submitted
  initialData: {
    // The initial data for the form fields
    title: string
    content: string
    image: string
  }
}

export default function PostForm({ formAction, initialData }: PostFormProps) {
  // Initialize the form state and action
  const [formState, action] = useFormState<FormState>(formAction, {
    errors: {},
  })
  const [productImage, setProductImage] = useState<string>(initialData.image)
  const [isUploading, setIsUploading] = useState(false)

  const uploadHandler = async (e: any) => {
    e.preventDefault()
    setIsUploading(true)
    const toastId = toast.loading('Uploading image...')
    try {
      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
      })
      const { signature, timestamp } = await resSign.json()
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('folder', 'blog_images')
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await res.json()
      setProductImage(data.secure_url)
      toast.success('Image uploaded successfully', { id: toastId })
      setIsUploading(false)
    } catch (error) {
      toast.error('Failed to upload image', { id: toastId })
      setIsUploading(false)
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">
        {initialData.title ? 'Update' : 'Create'} Post
      </h1>
      <form action={action}>
        <div className="w-96">
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={initialData.title}
              className="rounded p-2 w-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
            />
            {formState.errors.title && (
              <div className="text-red-500">
                {formState.errors.title?.join(', ')}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              defaultValue={initialData.content}
              className="rounded p-2 w-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
            ></textarea>
            {formState.errors.content && (
              <div className="text-red-500">
                {formState.errors.content?.join(', ')}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={uploadHandler}
              className="rounded p-2 w-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
            />
            {isUploading && <div className="text-green-500">Uploading...</div>}
            {productImage && (
              <Image
                src={productImage}
                alt="Product Image"
                width={200}
                height={200}
                className="w-32 h-32 object-cover mt-2"
              />
            )}
            {formState.errors.image && (
              <div className="text-red-500">
                {formState.errors.image?.join(', ')}
              </div>
            )}
          </div>
          {/* Hidden input field for product image URL */}
          <input type="hidden" name="productImage" value={productImage} />

          <div className="mb-4">
            <button type="submit" className="bg-white px-4 py-2 rounded mr-2">
              Save
            </button>
            <Link href="/" className="bg-transparent px-4 py-2 rounded">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}
