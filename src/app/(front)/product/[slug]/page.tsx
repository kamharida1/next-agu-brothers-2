import productServices from "@/lib/services/productService"
import ProductDetails from "./ProductDetails"

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  try{
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
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        images: product.images.map((image: string) => ({
          url: image,
          alt: product.name,
        })),
      },
    } 
    
  }catch(error){
    console.error(error)
    return { 
      title: 'Product not found',
      description: 'Product not found'
     }
  }
}
export async function generateStaticParams() {
  const products = await productServices.getLatest()
  if (!products) {
    return []
  }
  return products.map((product) => ({
     slug: product.slug ,
  }))
}


export default async function ProductDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  return <ProductDetails params={{ slug: params.slug }} />
}
