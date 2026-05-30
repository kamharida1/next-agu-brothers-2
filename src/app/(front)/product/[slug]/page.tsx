import productServices from '@/lib/services/productService'
import ProductDetails from './ProductDetails'
import { Metadata } from 'next'

const BASE_URL = 'https://www.agubrothers.com'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const product = await productServices.getBySlug(params.slug)
    if (!product) return { title: 'Product not found' }

    const imageUrl = product.images[0]
      ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1200,h_630,c_fill/${product.images[0]}`
      : undefined

    return {
      title: `${product.name} | Agu Brothers`,
      description: product.description,
      alternates: { canonical: `${BASE_URL}/product/${product.slug}` },
      openGraph: {
        title: product.name,
        description: product.description,
        type: 'website',
        url: `${BASE_URL}/product/${product.slug}`,
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: product.name }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        images: imageUrl ? [imageUrl] : [],
      },
    }
  } catch {
    return { title: 'Product not found' }
  }
}

export async function generateStaticParams() {
  const products = await productServices.getLatest()
  return products?.map((p) => ({ slug: p.slug })) ?? []
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = await productServices.getBySlug(params.slug)
  if (!product) return <div>Product not found</div>

  const imageUrl = product.images[0]
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800,h_800,c_fill/${product.images[0]}`
    : null

  // ── JSON-LD: Product schema ──
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl ? [imageUrl] : [],
    sku: product.slug,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/product/${product.slug}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability: product.countInStock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Agu Brothers Electronics' },
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

  // ── JSON-LD: BreadcrumbList ──
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: product.cat, item: `${BASE_URL}/search?category=${encodeURIComponent(product.cat)}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${BASE_URL}/product/${product.slug}` },
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
      <ProductDetails product={product} />
    </>
  )
}
