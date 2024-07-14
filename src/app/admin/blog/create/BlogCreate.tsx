'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { formatId } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Blog } from '@/lib/models/BlogModel'
import slugify from 'slugify'
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
} from 'next-cloudinary'
import Tiptap from '@/components/blog/Tiptap'

interface UploadedAssetData {
  public_id: string
  width: number
  height: number
  id: string
  secure_url: string
}

export default function BlogCreate() {
  const router = useRouter()
  const [result, setResult] = useState<UploadedAssetData | null>(null)
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [image, setImage] = useState<string>('')

  function isCloudinaryUploadWidgetInfo(
    info: any
  ): info is CloudinaryUploadWidgetInfo {
    return (info as CloudinaryUploadWidgetInfo).secure_url !== undefined
  }

  const {
    handleSubmit,
    control,
    reset
  } = useForm<Blog>({
    defaultValues: {
      title: '',
      image: '',
      content: '',
    }
  })

  const onSubmit = async (formData: Blog) => { 
    const blogData: Blog = {
      ...formData,
      image,
      slug: slugify(formData.title),
    }
    setLoading(true)
    const res = await fetch(`/api/admin/blog/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    })

    if (!res.ok) {
      const data = await res.json();
      toast.error(data.message);
      setLoading(false);
    } else {
      toast.success('Blog created successfully');
      router.push('/admin/blog');
      reset();
      setContent('');
      setImage('');
      setLoading(false);
    }
  }
  
  return (
    <div>
      <h1 className="text-2xl py-4">Create Blog</h1>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="title">
              Title
            </label>
            <div className="md:w-4/5">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input type="text" {...field} id="title" className="input" />
                )}
              />
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
                defaultValue={content}
                render={({ field }) => (
                  <Tiptap content={field.value} setContent={field.onChange} />
                )}
              />
            </div>
          </div>
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFile">
              Upload Image
            </label>
            <div className="md:w-4/5">
              <Controller
                name="image"
                control={control}
                defaultValue={image}
                render={({ field }) => (
                  <CldUploadWidget
                    signatureEndpoint="/api/cloudinary/blog-image"
                    onSuccess={(result) => {
                      if (
                        result?.info &&
                        isCloudinaryUploadWidgetInfo(result.info)
                      ) {
                        // Now TypeScript knows result.info is CloudinaryUploadWidgetInfo
                        setResult(result.info) // Assuming setResult can accept CloudinaryUploadWidgetInfo
                        setImage(result.info.secure_url) // Access secure_url safely
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
                )}
              />

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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading && <span className="loading loading-spinner"></span>}
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
