'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Controller, ValidationRule, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { formatId } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Blog } from '@/lib/models/BlogModel'
import slugify from 'slugify'
import { CldImage, CldUploadWidget, CloudinaryUploadWidgetInfo } from 'next-cloudinary'
import Tiptap from '@/components/blog/Tiptap'

interface UploadedAssetData {
  public_id: string
  width: number
  height: number
  id: string
  secure_url: string
}

export default function BlogEditForm({ slug }: { slug: string }) {
  const { data: blog, error } = useSWR(`/api/admin/blog/${slug}`)
  const router = useRouter()
  const [result, setResult] = useState<UploadedAssetData | null>(blog?.image || null)

  function isCloudinaryUploadWidgetInfo(
    info: any
  ): info is CloudinaryUploadWidgetInfo {
    return (info as CloudinaryUploadWidgetInfo).secure_url !== undefined
  }

  const { trigger: updateBlog, isMutating: isUpdating } = useSWRMutation(
    `/api/admin/blog/${slug}`,
    async (url, { arg }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)

      toast.success('Blog updated successfully')
      router.push('/admin/blog')
    }
  )

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<Blog>()

  useEffect(() => {
    if (!blog) return
    setValue('title', blog.title)
    setValue('slug', blog.slug)
    setValue('content', blog.content)
    setValue('image', blog.image)
    
  }, [blog, setValue])

   const formSubmit = async (formData: any) => {
     const blogData: Blog = {
       ...formData,
       slug: slugify(formData.title),
     }
     await updateBlog(blogData as any)
   }

  if (error) return error.message
  if (!blog) return 'Loading...'

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof Blog
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => (
    <div className="md:flex mb-6">
      <label className="label md:w-1/5" htmlFor={id}>
        {name}
      </label>
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
        {errors[id]?.message && (
          <div className="text-error">{errors[id]?.message}</div>
        )}
      </div>
    </div>
  )
  return (
    <div>
      <h1 className="text-2xl py-4">Edit Blog</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name="Name" id="title" required />
          <FormInput name="Image" id="image" required />
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFile">
              Upload Image
            </label>
            <div className="md:w-4/5">
              <CldUploadWidget
                signatureEndpoint="/api/cloudinary/blog-image"
                onSuccess={(result) => {
                  if (
                    result?.info &&
                    isCloudinaryUploadWidgetInfo(result.info)
                  ) {
                    // Now TypeScript knows result.info is CloudinaryUploadWidgetInfo
                    setResult(result.info) // Assuming setResult can accept CloudinaryUploadWidgetInfo
                    setValue('image', result.info.secure_url) // Access secure_url safely
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    className="bg-indigo-500 rounded py-2 px-4 mb-4 text-white"
                    onClick={() => open()}
                  >
                    Upload an Image
                  </button>
                )}
              </CldUploadWidget>

              {result ? (
                <CldImage
                  src={result.secure_url} // Use result.secure_url instead of blog.image
                  width={100}
                  height={100}
                  alt="Uploaded Image"
                />
              ) : (
                blog.image && ( // If there's no new upload, use the existing blog image
                  <CldImage
                    src={blog.image}
                    width={100}
                    height={100}
                      alt="Current Image"
                      className='rounded w-40 h-40'
                  />
                )
              )}
            </div>
          </div>
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="slug">
              Content
            </label>
            <div className="md:w-4/5">
              <Controller
                name="content"
                control={control}
                defaultValue={blog.content}
                render={({ field }) => (
                  <Tiptap content={field.value} setContent={field.onChange} />
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-primary"
          >
            {isUpdating && <span className="loading loading-spinner"></span>}
            Update
          </button>
          <Link className="btn ml-4 " href="/admin/blog">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  )
}
