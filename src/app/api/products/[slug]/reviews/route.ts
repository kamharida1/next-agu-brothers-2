import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import ProductModel, { Product } from "@/lib/models/ProductModel"
import ReviewModel from "@/lib/models/ReviewModel"
import { useSession } from 'next-auth/react'


export const GET = auth(async (...request: any) => {
  const [req, { params }] = request

  await dbConnect()
  //Get all reviews for the product
  // find product by slug
  const product = await ProductModel.findOne({ slug: params.slug }) as Product
  if (!product) {
    return Response.json(
      { message: 'Product not found' },
      {
        status: 404,
      }
    )
  }
  const reviews = await ReviewModel.find({ product: product._id })
  
  return Response.json(reviews)
}) as any

//Post a review
export const POST = auth(async (...request: any) => {
  const [req, { params }] = request
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
  const productToUpdate = await ProductModel.findOne({ slug: params.slug })
  if (!productToUpdate) {
    return Response.json(
      { message: 'Product not found' },
      {
        status: 404,
      }
    )
  }
  // Check if the user has already reviewed the product
  const existingReview = await ReviewModel.findOne({ product: productToUpdate._id, username: username })
  if (existingReview) {
    return Response.json(
      { message: 'You have already reviewed this product' },
      {
        status: 400,
      }
    )
  }
  if (!productToUpdate || !title || !comment || !username || !rating) {
    return Response.json(
      { message: 'All fields are required. Did you miss the star rating?' },
      {
        status: 400,
      }
    )
  }
  // Calculate the new average rating
  const reviews = await ReviewModel.find({ product: productToUpdate._id })
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
  const newAverageRating = (totalRating + rating) / (reviews.length + 1)
  
  //Add the review to the product and save it to reviews array
  const review = new ReviewModel({
    product: productToUpdate._id,
    title,
    comment,
    username,
    rating,
  })
  await review.save()
  await ProductModel.findByIdAndUpdate(productToUpdate._id, {
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

export const DELETE = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const { reviewId } = await req.json(); // Parse the JSON request

  await dbConnect();

  // Find the product by ID
  const productToUpdate = await ProductModel.findOne({ slug: params.slug })
  if (!productToUpdate) {
    return Response.json(
      { message: 'Product not found' },
      {
        status: 404,
      }
    )
  }

  // Find the review by ID to check if it exists
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    return Response.json(
      { message: 'Review not found' },
      { status: 404 }
    );
  }
  const { data: session } = useSession()

  // Check if the user is the owner of the review
  if (review.username !== session?.user?.name) {
    return Response.json(
      { message: 'unauthorized' },
      { status: 401 }
    );
  }
  // Remove the review from the product
  await ProductModel.findByIdAndUpdate(
    productToUpdate._id,
    {
      $pull: { reviews: reviewId },
      $inc: { numReviews: -1 }
    },
    { new: true }
  );

  // Delete the review
  await ReviewModel.findByIdAndDelete(reviewId);

  // Recalculate the average rating after removing the review
  const totalRating = productToUpdate.reviews.reduce((acc: number, review: any) => {
    if (review._id.toString() !== reviewId) {
      return acc + review.rating;
    }
    return acc;
  }, 0);

  const newAverageRating = productToUpdate.numReviews > 0 ? totalRating / productToUpdate.numReviews : 0;

  // Update the product's rating
  productToUpdate.rating = newAverageRating;
  await productToUpdate.save();

  return Response.json({ message: 'Review deleted successfully' });
}) as any;


// User can only delete their own review
// export const DELETE = auth(async (...request: any) => {
//   const [req, { params }] = request
//   if (!req.auth) {
//     return Response.json(
//       { message: 'unauthorized' },
//       {
//         status: 401,
//       }
//     )
//   }
//   const { data: session } = useSession()
//   const { username } = await req.json()
//   await dbConnect()
//   const product = await ProductModel.findOne({ slug: params.slug })
//   if (!product) {
//     return Response.json(
//       { message: 'Product not found' },
//       {
//         status: 404,
//       }
//     )
//   }
//   const review = await ReviewModel.findOne({ product: product._id, username: username })
//   if (!review) {
//     return Response.json(
//       { message: 'Review not found' },
//       {
//         status: 404,
//       }
//     )
//   }

//   // Check if the user is an admin or the owner of the review
//   if (!session?.user.isAdmin && review.username !== username) {
//     return Response.json(
//       { message: 'unauthorized' },
//       {
//         status: 401,
//       }
//     )
//   }

//   await ReviewModel.findByIdAndDelete(review._id)
//   // const review = await ReviewModel.findOne({ product: product._id, username: username })
//   // if (!review) {
//   //   return Response.json(
//   //     { message: 'Review not found' },
//   //     {
//   //       status: 404,
//   //     }
//   //   )
//   // }
//   // await ReviewModel.findByIdAndDelete(review._id)
//   return Response.json({ message: 'Review deleted' })
// }) as any