import mongoose from 'mongoose'
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    cat: { type: String, required: true},
    category: { type: mongoose.Types.ObjectId, ref: 'Category'},
    images: [{ type: String, required: true }],
    image:{ type: String},
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    reviews: [{ type: mongoose.Types.ObjectId, ref: 'Review' }],
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    properties: { type: Object },
    sold: { type: Number, default: 0 },
    weight: { type: Number },
    banner: { type: String },
  },
  {
    timestamps: true,
  }
)

const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema)

export default ProductModel

export type Product = {
  _id?: string
  name: string
  slug: string
  image: string
  cat: string
  images: string[]
  banner?: string
  price: number
  brand: string
  description: string
  reviews: any
  category: string
  rating: number
  isFeatured: boolean
  numReviews: number
  countInStock: number
  weight: number
  sold: number
  properties: { name: string, value: string }
  createdAt: string
  updatedAt: string
}
