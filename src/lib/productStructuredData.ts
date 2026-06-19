import { getSalePrice, hasDiscount } from '@/lib/productPricing'
import {
  MERCHANT_RETURN_POLICY,
  MERCHANT_SHIPPING_DETAILS,
} from '@/lib/merchantListingSchema'
import { BASE_URL, BUSINESS, truncateForMeta } from '@/lib/seo'
import { Product } from '@/lib/models/ProductModel'
import { Review } from '@/lib/models/ReviewModel'

function isPopulatedReview(review: unknown): review is Review {
  return (
    typeof review === 'object' &&
    review !== null &&
    'rating' in review &&
    'username' in review &&
    'comment' in review
  )
}

function toReviewJsonLd(review: Review) {
  return {
    '@type': 'Review',
    name: review.title,
    reviewBody: review.comment,
    ...(review.createdAt && {
      datePublished: new Date(review.createdAt).toISOString(),
    }),
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: review.username,
    },
  }
}

function averageReviewRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
}

export function buildProductReviewFields(product: Product, reviewsOverride?: Review[]) {
  const reviews = (reviewsOverride ?? product.reviews ?? []).filter(isPopulatedReview)
  if (reviews.length === 0) {
    return {}
  }

  const ratingValue = averageReviewRating(reviews)
  const reviewCount = reviews.length

  return {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Math.round(ratingValue * 10) / 10,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.map(toReviewJsonLd),
  }
}

function offerPriceValidUntil(): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  return date.toISOString().split('T')[0]
}

export function buildProductJsonLd(
  product: Product,
  imageUrl: string | null,
  reviewsOverride?: Review[]
) {
  const salePrice = getSalePrice(product)
  const productUrl = `${BASE_URL}/product/${product.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    description: truncateForMeta(product.description, 500),
    image: imageUrl ? [imageUrl] : [],
    sku: product.slug,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.cat,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'NGN',
      price: salePrice,
      priceValidUntil: offerPriceValidUntil(),
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
      seller: {
        '@type': 'Organization',
        name: BUSINESS.name,
        url: BASE_URL,
        sameAs: BUSINESS.sameAs,
      },
      shippingDetails: MERCHANT_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
    },
    ...buildProductReviewFields(product, reviewsOverride),
  }
}

export type ProductJsonLdValidation = {
  ok: boolean
  errors: string[]
  warnings: string[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateReviewEntry(review: unknown, index: number, errors: string[]) {
  if (!isRecord(review) || review['@type'] !== 'Review') {
    errors.push(`review[${index}] must be a Review object`)
    return
  }

  const rating = review.reviewRating
  if (!isRecord(rating) || rating['@type'] !== 'Rating') {
    errors.push(`review[${index}].reviewRating must be a Rating object`)
  } else if (typeof rating.ratingValue !== 'number') {
    errors.push(`review[${index}].reviewRating.ratingValue must be a number`)
  }

  const author = review.author
  if (!isRecord(author)) {
    errors.push(`review[${index}].author is required`)
  } else if (typeof author.name !== 'string' || !author.name.trim()) {
    errors.push(`review[${index}].author.name is required`)
  }

  if (typeof review.reviewBody !== 'string' || !review.reviewBody.trim()) {
    errors.push(`review[${index}].reviewBody is required`)
  }
}

function validateAggregateRating(aggregateRating: unknown, errors: string[]) {
  if (!isRecord(aggregateRating) || aggregateRating['@type'] !== 'AggregateRating') {
    errors.push('aggregateRating must be an AggregateRating object')
    return
  }

  for (const field of ['ratingValue', 'reviewCount', 'bestRating', 'worstRating'] as const) {
    if (typeof aggregateRating[field] !== 'number') {
      errors.push(`aggregateRating.${field} must be a number`)
    }
  }
}

/** Validates Product JSON-LD against Google Product snippet expectations. */
export function validateProductJsonLd(jsonLd: unknown): ProductJsonLdValidation {
  const errors: string[] = []
  const warnings: string[] = []

  if (!isRecord(jsonLd) || jsonLd['@type'] !== 'Product') {
    return { ok: false, errors: ['Root object must be a Product'], warnings }
  }

  if (typeof jsonLd.name !== 'string' || !jsonLd.name.trim()) {
    errors.push('name is required')
  }

  if (!isRecord(jsonLd.offers)) {
    errors.push('offers is required')
  }

  const hasAggregateRating = 'aggregateRating' in jsonLd
  const reviews = jsonLd.review
  const hasReview =
    Array.isArray(reviews) ? reviews.length > 0 : isRecord(reviews)

  if (hasAggregateRating) {
    validateAggregateRating(jsonLd.aggregateRating, errors)
  }

  if (hasReview) {
    const reviewList = Array.isArray(reviews) ? reviews : [reviews]
    reviewList.forEach((review, index) => validateReviewEntry(review, index, errors))
  }

  if (hasAggregateRating && !hasReview) {
    errors.push('aggregateRating requires at least one review entry')
  }

  if (hasReview && !hasAggregateRating) {
    errors.push('review requires aggregateRating')
  }

  if (!hasAggregateRating && !hasReview) {
    if (!isRecord(jsonLd.offers)) {
      errors.push('Product must include offers, review, or aggregateRating')
    } else {
      warnings.push(
        'No customer reviews yet — review and aggregateRating omitted (valid for merchant listings; add real reviews to enable star snippets)'
      )
    }
  }

  return { ok: errors.length === 0, errors, warnings }
}
