'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ValidationRule, useForm } from 'react-hook-form'
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

export default function BlogCreateForm() {
  const router = useRouter()
  const [result, setResult] = useState<UploadedAssetData | null>(null)
  const [content, setContent] = useState<string>('')

  function isCloudinaryUploadWidgetInfo(
    info: any
  ): info is CloudinaryUploadWidgetInfo {
    return (info as CloudinaryUploadWidgetInfo).secure_url !== undefined
  }

  const { trigger: createBlog, isMutating: isCreating } = useSWRMutation(
    `/api/admin/blog/`,
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

      toast.success('Blog created successfully')
      router.push('/admin/blog')
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Blog>()

  const formSubmit = async (formData: any) => {
    const blogData: Blog = {
      ...formData,
      slug: slugify(formData.title),
    }
    await createBlog(blogData as any)
  }

  useEffect(() => {
    setValue('content', content)
  }, [content, setValue])

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
      {id === 'content' ? (
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
      <h1 className="text-2xl py-4">Create Blog</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name="Title" id="title" required />
          <FormInput name="Image" id="image" required />
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFile">
              Upload Image
            </label>
            <div className="md:w-4/5">
              {/* <input
                type="file"
                className="file-input w-full max-w-md"
                id="imageFile"
                onChange={uploadHandler}
              /> */}
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
                  src={result.secure_url}
                  width={100}
                  height={100}
                  alt="Uploaded Image"
                />
              ) : null}
            </div>
          </div>
          {/* <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFile">
              Content
            </label>
            <div className="md:w-4/5">
              <div className="w-full max-w-lg">
                <Tiptap content={content} setContent={setContent}  />
              </div>
            </div>
          </div> */}

          <FormInput name="Content" id="content" required />

          <button
            type="submit"
            disabled={isCreating}
            className="btn btn-primary"
          >
            {isCreating && <span className="loading loading-spinner"></span>}
            Create
          </button>
          <Link className="btn ml-4 " href="/admin/blog">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  )
}
