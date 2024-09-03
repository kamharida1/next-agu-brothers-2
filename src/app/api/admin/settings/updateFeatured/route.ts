import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";

export const PUT = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'Unauthorized' },
      {
        status: 401,
      }
    );
  }

  try {
    await dbConnect();
    const { productId } = await req.json();

    // Find the current product to check its featured status
    const currentProduct = await ProductModel.findById(productId);
    if (!currentProduct) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    // Toggle the `isFeatured` status
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { isFeatured: !currentProduct.isFeatured }, // Toggle true/false
      { new: true }
    );

    return Response.json(updatedProduct);
  } catch (e: any) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}) as any;
