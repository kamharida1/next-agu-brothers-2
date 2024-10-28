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

  const { reviewId, username, productId } = await req.json(); // Parse the JSON request

  await dbConnect();
  const review = await ReviewModel.findById(reviewId);

  if (!review) {
    return Response.json(
      { message: 'Review not found' },
      {
        status: 404,
      }
    );
  }

  // Check if the user is the owner of the review
  if (review.username !== username) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    );
  }

  await ReviewModel.findByIdAndDelete(reviewId);

  // Update the product's average rating and number of reviews
  const product = await ProductModel.findById(productId);
  if (product) {
    const reviews = await ReviewModel.find({ product: productId });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const newAverageRating = reviews.length ? totalRating / reviews.length : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      $set: { rating: newAverageRating },
      $inc: { numReviews: -1 },
    });
  }

  return Response.json({ message: 'Review deleted' });

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