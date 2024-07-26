import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import ProductModel from "@/lib/models/ProductModel"
import ReviewModel from "@/lib/models/ReviewModel"

export const GET = auth(async (req: any) => {
  // if (!req.auth) {
  //   return Response.json(
  //     { message: 'unauthorized' },
  //     {
  //       status: 401,
  //     }
  //   )
  // }
  const { productId } = req.json
  await dbConnect()
  //Get all reviews for the product
  const reviews = await ProductModel.findById(productId, 'reviews').lean()
  return Response.json(reviews)
}) as any

//Post a review
export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  const {
    product,
    title,
    comment,
    username,
    rating,
  } = await req.json()

  await dbConnect()
  //Find the product
  const productToUpdate = await ProductModel.findById(product)
  if (!productToUpdate) {
    return Response.json(
      { message: 'Product not found' },
      {
        status: 404,
      }
    )
  }
  // Calculate the new average rating
  const oldTotalRating = productToUpdate.rating * productToUpdate.numReviews;
  const newTotalRating = oldTotalRating + rating; // `rating` is the rating of the new review
  const newAverageRating = newTotalRating / (productToUpdate.numReviews + 1);
  //Check if the user has already reviewed the product
  const existingReview = productToUpdate.reviews.find((r: any) => r.username === username)
  if (existingReview) {
    return Response.json(
      { message: 'You have already reviewed this product' },
      {
        status: 400,
      }
    )
  }

  //Add the review to the product and save it to reviews array
  const review = new ReviewModel({
    product,
    title,
    comment,
    username,
    rating,
  })
  await review.save()
  await ProductModel.findByIdAndUpdate(product, {
    $push: {
      reviews: review,
    },
    $inc: { numReviews: 1 },
    $set: { rating: newAverageRating },
  },
  { new: true }
  ).exec()
  return Response.json({ message: 'Review added' })
}) as any