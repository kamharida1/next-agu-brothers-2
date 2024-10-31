import productServices from "@/lib/services/productService";
import ProductDetails from "./ProductDetails";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const product = JSON.parse(
      JSON.stringify(productServices.getBySlug(params.slug))
    );
    if (!product) {
      return { title: "Product not found" };
    }
    return {
      title: product.name,
      description: product.description,
      alternates: {
        canonical: `/product/${product.slug}`,
      },
      category: product.cat,
      openGraph: {
        title: product.name,
        description: product.description,
        images: product.images.map((image: string) => ({
          url: image,
          alt: product.name,
        })),
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: product.images.map((image: string) => ({
          url: image,
          alt: product.name,
        })),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Product not found",
      description: "Product not found",
    };
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = JSON.parse(
    JSON.stringify(productServices.getBySlug(params.slug))
  );
  if (!product) {
    return <div>Product not found</div>;
  }
  return <ProductDetails product={product} />;
}
