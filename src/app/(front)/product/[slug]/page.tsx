import productServices from '@/lib/services/productService'
import ProductDetails from './ProductDetails'
import RelatedProducts from '@/components/products/RelatedProducts'
import { getSalePrice, hasDiscount } from '@/lib/productPricing'
import {
  MERCHANT_RETURN_POLICY,
  MERCHANT_SHIPPING_DETAILS,
} from '@/lib/merchantListingSchema'
import { BASE_URL, ROBOTS_INDEX, ROBOTS_NOINDEX, truncateForMeta } from '@/lib/seo'
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

  const description = truncateForMeta(
    `${product.name} — ${product.brand} ${product.cat}. ${product.description}`
  )

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

export async function generateStaticParams() {
  const products = await productServices.getLatest()
  return products?.map((p) => ({ slug: p.slug })) ?? []
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await productServices.getBySlug(slug)
  if (!product) notFound()

  const [relatedProducts] = await Promise.all([
    productServices.getRelated(slug, product.cat, product.brand),
  ])

  const plainProduct = JSON.parse(JSON.stringify(product)) as Product
  const related = JSON.parse(JSON.stringify(relatedProducts)) as Product[]

  const imageUrl = product.images[0]
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_800,c_fill/${product.images[0]}`
    : null

  const salePrice = getSalePrice(product)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: truncateForMeta(product.description, 500),
    image: imageUrl ? [imageUrl] : [],
    sku: product.slug,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.cat,
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: 'NGN',
      price: salePrice,
      ...(hasDiscount(product) && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: salePrice,
          priceCurrency: 'NGN',
        },
      }),
      availability:
        product.countInStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Agu Brothers Electronics' },
      shippingDetails: MERCHANT_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
    },
    ...(product.numReviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.numReviews,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.cat,
        item: `${BASE_URL}/search?category=${encodeURIComponent(product.cat)}`,
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
      <ProductDetails product={plainProduct} />
      <RelatedProducts products={related} category={product.cat} />
    </>
  )
}
