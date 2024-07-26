import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  content: { type: String, required: true },
},
{ timestamps: true }
)

const BlogModel = mongoose.models.Blog || mongoose.model('Blog', blogSchema)

export default BlogModel

export type Blog = { 
  title: string;
  slug: string;
  image: string;
  content: string;
}

