'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { forwardRef, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiStar } from 'react-icons/fi'
import useSWRMutation from 'swr/mutation'
import { mutate } from 'swr'
import { authPathWithCallback } from '@/lib/authCallbackUrl'

type Inputs = {
  username: string
  title: string
  comment: string
  rating: number
}

function StarPicker({
  value,
  onChange,
  error,
}: {
  value: number
  onChange: (n: number) => void
  error?: string
}) {
  const [hover, setHover] = useState(0)
  const active = hover || value

  return (
    <div>
      <p className="text-sm font-medium text-[#0F1111] mb-2">Overall rating</p>
      <div className="flex gap-1" role="group" aria-label="Select star rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9900]"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <FiStar
              className={`w-8 h-8 transition-colors ${
                n <= active
                  ? 'text-[#FF9900] fill-[#FF9900]'
                  : 'text-[#D5D9D9]'
              }`}
            />
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-[#B12704] mt-1.5">{error}</p>}
    </div>
  )
}

const ReviewForm = forwardRef<HTMLFormElement, { slug: string }>((props, ref) => {
  const { slug } = props
  const { data: session, status } = useSession()
  const [rating, setRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      username: '',
      title: '',
      comment: '',
      rating: 0,
    },
  })

  useEffect(() => {
    if (session?.user?.name) {
      setValue('username', session.user.name)
    }
  }, [session, setValue])

  const { trigger: createReview, isMutating } = useSWRMutation(
    `/api/products/${slug}/reviews`,
    async (url: string, { arg }: { arg: Inputs }) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message)
        throw new Error(data.message)
      }
      await mutate(`/api/products/${slug}/reviews`)
      await mutate(`/api/products/${slug}`)
      toast.success('Thank you — your review was submitted')
      return data
    }
  )

  const formSubmit: SubmitHandler<Inputs> = async (formData) => {
    if (rating < 1) {
      toast.error('Please select a star rating')
      return
    }
    await createReview({
      username: formData.username,
      title: formData.title,
      comment: formData.comment,
      rating,
    })
    reset({
      username: session?.user?.name || '',
      title: '',
      comment: '',
      rating: 0,
    })
    setRating(0)
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-6">
        <span className="loading loading-spinner text-[#FF9900]" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="border border-[#D5D9D9] rounded-lg bg-[#F7F8F8] p-5 text-center">
        <p className="text-sm text-[#0F1111] mb-3">Sign in to share your experience with this product.</p>
        <Link
          href={authPathWithCallback('/signin', `/product/${slug}`)}
          className="btn-amazon inline-block px-6 py-2 rounded-md text-sm"
        >
          Sign in to write a review
        </Link>
      </div>
    )
  }

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(formSubmit)}
      className="border border-[#D5D9D9] rounded-lg p-4 sm:p-5 bg-white"
    >
      <h3 className="text-base font-bold text-[#0F1111] mb-4">Write a customer review</h3>

      <input type="hidden" {...register('username')} />

      <div className="mb-5">
        <StarPicker
          value={rating}
          onChange={(n) => {
            setRating(n)
            setValue('rating', n)
          }}
          error={rating < 1 && errors.rating?.message ? 'Rating is required' : undefined}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="review-title" className="block text-sm font-medium text-[#0F1111] mb-1.5">
          Review title
        </label>
        <input
          id="review-title"
          type="text"
          placeholder="What's most important to know?"
          {...register('title', { required: 'Please add a title' })}
          className="amazon-input"
        />
        {errors.title?.message && (
          <p className="text-xs text-[#B12704] mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-5">
        <label htmlFor="review-comment" className="block text-sm font-medium text-[#0F1111] mb-1.5">
          Your review
        </label>
        <textarea
          id="review-comment"
          rows={4}
          placeholder="Share details about quality, delivery, or how you use the product"
          {...register('comment', { required: 'Please write your review' })}
          className="amazon-input resize-y min-h-[100px]"
        />
        {errors.comment?.message && (
          <p className="text-xs text-[#B12704] mt-1">{errors.comment.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isMutating}
        className="btn-amazon w-full py-2.5 rounded-md text-sm flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {(isSubmitting || isMutating) && (
          <span className="loading loading-spinner loading-sm" />
        )}
        Submit review
      </button>
    </form>
  )
})

ReviewForm.displayName = 'ReviewForm'

export default ReviewForm
