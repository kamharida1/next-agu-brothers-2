import productServices from "@/lib/services/productService"
import ProductDetails from "./ProductDetails"


export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const product = await productServices.getBySlug(params.slug)
  if (!product) {
    return { title: 'Product not found' }
  }
  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    category: product.category,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((image) => ({
        url: image,
        alt: product.name,
      })),
    },
  }
}

export default function ProductDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  return <ProductDetails params={{ slug: params.slug }} />
}
