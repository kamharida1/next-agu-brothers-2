import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
  /** Store category for shop links on auto-generated guides */
  category: { type: String },
  /** Product that triggered or last updated this guide */
  linkedProductSlug: { type: String },
},
{ timestamps: true }
)

const BlogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

export default BlogModel

export type Blog = { 
  _id: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  category?: string;
  linkedProductSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

