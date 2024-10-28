'use client'

import { useSession } from 'next-auth/react'
import { forwardRef, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaStar } from 'react-icons/fa'
import useSWRMutation from 'swr/mutation'
import { mutate } from 'swr'


type Inputs = {
  username: string
  title: string
  comment: string
  rating: number
  //product: string
}

const ReviewForm = forwardRef<HTMLFormElement, { slug: string }>((props, ref) => {
  const { slug } = props;
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      username: '',
      title: '',
      comment: '',
      rating: 0,
      //product: productId,
    },
  })
  useEffect(() => {
    if (session && session.user) {
      setValue('username', session.user.name!)
      //setValue('product', productId)
    }
  }, [session, setValue])

  const { trigger: createReview, isMutating } = useSWRMutation(
    `/api/products/${slug}/reviews`,
    async (url, { arg }: { arg: Inputs }) => {
      const res = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      // Revalidate product data to update the rating
      mutate(`/api/products/${slug}`)
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)

      toast.success('Review added successfully')
    }
  )

  const formSubmit: SubmitHandler<Inputs> = async (formData: any) => {
    const review: Inputs = {
      username: formData.username,
      title: formData.title,
      comment: formData.comment,
      rating: rating,
      // product: productId,
    }
    await createReview(review)
    reset({
      username: session?.user?.name || '',
      title: '',
      comment: '',
      rating: 0,
     // product: productId,
    })
    setRating(0)
  }
  return (
    <div className="md:col-span-2">
      <div className="card bg-base-300">
        <div className="card-body">
          <h2 className="card-title">Add a review</h2>
          <form onSubmit={handleSubmit(formSubmit)} ref={ref}>
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
                  {...register('rating', {
                    required: 'Rating is required',
                  })}
                />
              ))}
            </div>
            {errors.rating?.message && <div className="text-error">{errors.rating.message}</div>}
            
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
              {errors.comment?.message && (
                <div className="text-error">{errors.comment.message}</div>
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
})

ReviewForm.displayName = 'ReviewForm';

export default ReviewForm;
