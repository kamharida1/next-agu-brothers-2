import { ImageResponse } from 'next/og'
import productServices from '@/lib/services/productService'
import { resolveCategoryFromSlug } from '@/lib/categorySlugs'
import { getCategoryLandingCopy } from '@/lib/data/categoryLandingCopy'

export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default async function Og({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const categories = await productServices.getCategories()
  const category = resolveCategoryFromSlug(slug, categories) ?? slug
  const copy = getCategoryLandingCopy(category)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#131921',
          padding: 64,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <p
          style={{
            color: '#FF9900',
            fontSize: 20,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2,
            margin: 0,
          }}
        >
          Shop by Department
        </p>
        <h1
          style={{
            color: '#FFFFFF',
            fontSize: 52,
            fontWeight: 700,
            margin: '16px 0',
            lineHeight: 1.2,
          }}
        >
          {category}
        </h1>
        <p
          style={{
            color: '#CCCCCC',
            fontSize: 22,
            margin: 0,
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          {copy.description.slice(0, 120)}…
        </p>
        <p style={{ color: '#AAAAAA', fontSize: 18, margin: '24px 0 0' }}>
          agubrothers.com
        </p>
      </div>
    ),
    { ...size }
  )
}
