'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { FaStar } from 'react-icons/fa'
import useSWRMutation from "swr/mutation"


type Inputs = {
  username: string
  title: string
  comment: string
  rating: number
  product: string
}

export default function ReviewForm({ productId }: { productId: string }) { 
  const { data: session, } = useSession()
  const [rating, setRating] = useState(0)
  
  const { 
    register, 
    handleSubmit, 
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({
    defaultValues: {
      username:'',
      title: '',
      comment: '',
      rating: 0,
      product: '',
    }
  })
  useEffect(() => {
    if (session && session.user) {
      setValue('username', session.user.name!)  
      setValue('product', productId)
    }
  }, [session, setValue, productId])

  const { trigger: createReview, isMutating} = useSWRMutation('/api/products/reviews', 
    async (url, { arg }: {arg: Inputs}) => {
      const res = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)
      
      toast.success('Review added successfully')
    }
  )
  
  const formSubmit: SubmitHandler<Inputs> =
    async (formData: any) => {
      const review: Inputs = {
        username: formData.username,
        title: formData.title,
        comment: formData.comment,
        rating: rating,
        product: productId,
      }
      await createReview(review)
      reset({
        username: session?.user?.name || '',
        title: '',
        comment: '',
        rating: 0,
        product: productId,
      })
      setRating(0) 
    }
  return (
    <div className="md:col-span-2">
      <div className="card bg-base-300">
        <div className="card-body">
          <h2 className="card-title">Add a review</h2>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="flex my-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className="cursor-pointer w-8 h-8 mr-2"
                  color={i < rating ? 'gold' : 'gray'}
                  onClick={() => {
                    setRating(i + 1)
                    setValue('rating', rating) // Assuming 'rating' is the name of your form field
                  }}
                />
              ))}
            </div>
            <div className="my-2">
              <label className="label" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register('title', {
                  required: 'Title is required',
                })}
                className="input input-bordered w-full"
              />
              {errors.title?.message && (
                <div className="text-error">{errors.title.message}</div>
              )}
            </div>
            <div className="my-4">
              <label className="label" htmlFor="title">
                Comment
              </label>
              <textarea
                id="comment"
                {...register('comment', {
                  required: 'Comment is required',
                })}
                className="textarea textarea-bordered w-full "
              ></textarea>
              {errors.title?.message && (
                <div className="text-error">{errors.title.message}</div>
              )}
            </div>
            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                Submit review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}