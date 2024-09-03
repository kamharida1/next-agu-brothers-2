import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = async (req: any) => {
  try {
    await dbConnect(); 
    const products = await ProductModel.find(); 
    return Response.json(products);
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 }); 
  }
}