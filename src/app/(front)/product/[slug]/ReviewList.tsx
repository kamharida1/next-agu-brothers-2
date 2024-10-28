'use client'

import { Review } from "@/lib/models/ReviewModel";
import { formatDate } from "@/lib/utils";
import { FaStar } from "react-icons/fa";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews) return <div>Loading...</div>;
  
  return (
    <div className="p-4 md:p-0">
      <h2 className="text-2xl font-bold">Reviews</h2>
      <div className="mt-4">
        {reviews.map((review) => (
          <div key={review._id} className="border-b-2 border-b-gray-200 py-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-bold">{review.title}</h3>
                <p className="text-sm text-gray-500">{review.username}</p>
              </div>
              <div>
                <div className="flex">
                  <span className="text-sm text-gray-500">{review.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < review.rating ? 'gold' : 'gray'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDate(review?.createdAt)}
                </p>
              </div>
            </div>
            <p className="mt-4">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  )
 }