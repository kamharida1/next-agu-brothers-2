import { auth } from "@/lib/auth"
import dbConnect from "@/lib/dbConnect"
import ProductModel from "@/lib/models/ProductModel"


interface ProductsQuery {
  category?: string[];
  $or?: { [key: string]: any }[];
  [key: string]: any;
}

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  
  const { categories, sort, phrase, ...filters } = await req.json();
  let [sortField, sortOrder] = (sort || '_id-desc').split('-');
  
  const productsQuery: ProductsQuery = {};
  if (categories) {
    productsQuery.category = categories.split(',');
  }
  if (phrase) {
    productsQuery['$or'] = [
      { name: { $regex: phrase, $options: 'i' } },
      { description: { $regex: phrase, $options: 'i' } },
    ];
  }
  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach((filterName) => { 
      productsQuery['properties.' +filterName] = filters[filterName];
    });
  }
  const products = await ProductModel.find(
    productsQuery,
    null,
    {
      sort: {
        [sortField]: sortOrder === 'asc' ? -1 : 1,
      },
    }
  )
  return Response.json(products)
}) as any