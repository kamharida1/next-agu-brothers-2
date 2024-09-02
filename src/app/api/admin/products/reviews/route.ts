import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ProductModel, { Product } from "@/lib/models/ProductModel";
import ReviewModel from "@/lib/models/ReviewModel";

export const DELETE = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  const { productId, reviewId } = await req.json(); // Parse the JSON request

  await dbConnect();

  // Find the product by ID
  const product = await ProductModel.findById(productId);
  if (!product) {
    return Response.json(
      { message: 'Product not found' },
      { status: 404 }
    );
  }

  // Find the review by ID to check if it exists
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    return Response.json(
      { message: 'Review not found' },
      { status: 404 }
    );
  }

  // Remove the review from the product
  await ProductModel.findByIdAndUpdate(
    productId,
    {
      $pull: { reviews: reviewId },
      $inc: { numReviews: -1 }
    },
    { new: true }
  );

  // Delete the review
  await ReviewModel.findByIdAndDelete(reviewId);

  // Recalculate the average rating after removing the review
  const totalRating = product.reviews.reduce((acc: number, review: any) => {
    if (review._id.toString() !== reviewId) {
      return acc + review.rating;
    }
    return acc;
  }, 0);

  const newAverageRating = product.numReviews > 0 ? totalRating / product.numReviews : 0;

  // Update the product's rating
  product.rating = newAverageRating;
  await product.save();

  return Response.json({ message: 'Review deleted successfully' });
}) as any;
