import dbConnect from '@/lib/dbConnect'
import CategoryModel from '@/lib/models/CategoryModel';
import ProductModel from '@/lib/models/ProductModel'

export const GET = async (req: any) => {
  await dbConnect();

  try {
    const categories = await ProductModel.distinct('category');
    const populatedCategories = await CategoryModel.find({ _id: { $in: categories } }).select('name');
    const categoryNames = populatedCategories.map(category => category.name);
    return Response.json(categoryNames)
  } catch (error) {
    return Response.json({ error: "Failed to fetch categories" });
  }
}