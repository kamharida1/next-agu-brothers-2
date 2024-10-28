import productServices from "@/lib/services/productService"

export default async function Sitemap() { 
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const latestProducts = await productServices.getLatest()

  const postUrls =  latestProducts.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
  })) ?? []

  const categoryUrls = latestProducts.map((product) => ({
    url: `${baseUrl}/search?category=${product.cat}`,
    lastModified: new Date(),
  })) ?? []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...postUrls,
    ...categoryUrls,
  ]
}