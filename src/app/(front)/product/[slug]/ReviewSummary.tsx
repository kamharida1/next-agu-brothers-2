'use client'

import { Review } from '@/lib/models/ReviewModel'
import { Rating } from '@/components/products/Rating'

function ratingCounts(reviews: Review[]): number[] {
  const counts = [0, 0, 0, 0, 0]
  for (const r of reviews) {
    const star = Math.round(r.rating)
    if (star >= 1 && star <= 5) counts[star - 1]++
  }
  return counts
}

export default function ReviewSummary({
  averageRating,
  totalReviews,
  reviews,
}: {
  averageRating: number
  totalReviews: number
  reviews: Review[]
}) {
  const counts = ratingCounts(reviews)
  const total = reviews.length || totalReviews
  const displayRating = total > 0 && reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : averageRating

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row lg:flex-col gap-4 sm:items-center lg:items-start">
        <div className="text-center lg:text-left shrink-0">
          <p className="text-4xl font-normal text-[#0F1111] leading-none">
            {displayRating.toFixed(1)}
          </p>
          <div className="mt-2 flex justify-center lg:justify-start">
            <Rating value={displayRating} caption="" />
          </div>
          <p className="text-xs text-[#565959] mt-2">
            {totalReviews} {totalReviews === 1 ? 'global rating' : 'global ratings'}
          </p>
        </div>

        {total > 0 && (
          <div className="flex-1 w-full space-y-1.5 min-w-0">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = counts[star - 1]
              const pct = total ? Math.round((count / total) * 100) : 0
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-[#007185] shrink-0">{star} star</span>
                  <div className="flex-1 h-2.5 bg-[#F0F2F2] rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-[#FF9900] rounded-sm transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[#565959] shrink-0">{pct}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
