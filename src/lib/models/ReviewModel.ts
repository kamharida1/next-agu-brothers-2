import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true } 
);

const ReviewModel = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default ReviewModel;

export type Review = {
  _id?: string;
  title: string;
  product: string;
  username: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}
