import productServices from '@/lib/services/productService'
import ProductDetails from './ProductDetails'
import RelatedProducts from '@/components/products/RelatedProducts'
import { buildProductJsonLd } from '@/lib/productStructuredData'
import ReviewModel from '@/lib/models/ReviewModel'
import { Review } from '@/lib/models/ReviewModel'
import { BASE_URL, ROBOTS_INDEX, ROBOTS_NOINDEX, productMetaDescription } from '@/lib/seo'
import { categoryHref } from '@/lib/categorySlugs'
import { Product } from '@/lib/models/ProductModel'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await productServices.getBySlug(slug)

  if (!product) {
    return {
      title: 'Product not found | Agu Brothers',
      robots: ROBOTS_NOINDEX,
    }
  }

  const imageUrl = product.images[0]
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,h_630,c_fill/${product.images[0]}`
    : undefined

  const description = productMetaDescription(product)

  return {
    title: `${product.name} | Agu Brothers`,
    description,
    robots: ROBOTS_INDEX,
    alternates: { canonical: `${BASE_URL}/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      url: `${BASE_URL}/product/${product.slug}`,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: product.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await productServices.getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await productServices.getBySlug(slug)
  if (!product) notFound()

  const [relatedProducts, reviews] = await Promise.all([
    productServices.getRelated(slug, product.cat, product.brand),
    product._id
      ? (ReviewModel.find({ product: product._id }).lean() as Promise<Review[]>)
      : Promise.resolve([] as Review[]),
  ])

  const plainProduct = JSON.parse(JSON.stringify(product)) as Product
  const related = JSON.parse(JSON.stringify(relatedProducts)) as Product[]

  const imageUrl = product.images[0]
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_800,c_fill/${product.images[0]}`
    : null

  const productJsonLd = buildProductJsonLd(product, imageUrl, reviews)

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.cat,
        item: `${BASE_URL}${categoryHref(product.cat)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${BASE_URL}/product/${product.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetails product={plainProduct} initialReviews={reviews} />
      <RelatedProducts products={related} category={product.cat} />
    </>
  )
}
